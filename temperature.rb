require 'openstudio'
require 'json'

class OSModel < OpenStudio::Model::Model

  def add_geometry(coords, gridSize, floors, floorHeight, wwr)
  	
  	floor = 0
  	winH = floorHeight * wwr
  	wallH = (floorHeight - winH) / 2
  	bldgH = floors * floorHeight
  	wwrSub = (((winH - 0.05)* (gridSize - 0.05)) / (winH * gridSize)) - 0.01
  	puts winH
  	puts gridSize
  	puts wwrSub
  	num_surfaces = 0
    previous_num_surfaces = 0
    #Loop through Floors
    for floor in (0..floors -1)
    	z0 = floor *  floorHeight
    	z1 = z0 + wallH
    	z2 = z1 + winH
    	heights = [z0, z1, z2]
    	heights.each do |z|
    		if z == z0 || z ==z2
    			height = wallH
    		else
    			height = winH
    		end
    		osPoints = Array.new
    		#Create a new story within the building
    		story = OpenStudio::Model::BuildingStory.new(self)
    		story.setNominalFloortoFloorHeight(height)
    		story.setName("Story #{floor+1}")
    		#Loop Trough Sides
    		#loop through 3 iterations of sides

    		for i in (1..coords.length-1)
    		 points = createWallGrid(coords[i -1], coords[i], gridSize)
    		 points.pop
    		 points.each do |point|
    		 	osPoints.push(OpenStudio::Point3d.new(point[0], point[1], z))
    		 end
    		end
    		points = createWallGrid(coords[coords.length-1], coords[0], gridSize)
    		points.pop
    		points.each do |point|
	    		osPoints.push(OpenStudio::Point3d.new(point[0], point[1], z))
    		end
    	
    	
	    	# Identity matrix for setting space origins
	    	m = OpenStudio::Matrix.new(4,4,0)
	    	m[0,0] = 1
    		m[1,1] = 1
	    	m[2,2] = 1
    		m[3,3] = 1
    		# Minimal zones
    		core_polygon = OpenStudio::Point3dVector.new
    		osPoints.each do |point|
	    		core_polygon << point
	    	end
			core_space = OpenStudio::Model::Space::fromFloorPrint(core_polygon, height, self)
			core_space = core_space.get
    		m[0,3] = osPoints[0].x
    		m[1,3] = osPoints[0].y
    		m[2,3] = osPoints[0].z
    		core_space.changeTransformation(OpenStudio::Transformation.new(m))
	    	core_space.setBuildingStory(story)
    		core_space.setName("#{floor} Core Space")

    		#Set vertical story position
    		story.setNominalZCoordinate(z)

            #Remove Extra Roof and Floors, add windows on Z1
            case z
            when z0
                puts 'z0'
                puts num_surfaces
                self.getSurfaces.each do |s|
                    next if not s.name.to_s.split(" ")[1].to_i >= num_surfaces + 1
                    id = s.name.to_s.split(" ")[1].to_i
                    s.setName("#{floor}:#{id}:0")
                    puts s.name
                end
            when z1
                puts 'z1'
                puts num_surfaces
                #remove roof/ceiling
                self.getSurfaces.each do |s|
                    next if not s.name.to_s.split(" ")[1].to_i == num_surfaces || s.name.to_s.split(" ")[1].to_i == (num_surfaces + 1)
                    puts s.name
                    puts s.surfaceType
                    s.remove
                end
                #add windows
                self.getSurfaces.each do |s|
                    next if not s.name.to_s.split(" ")[1].to_i >= num_surfaces + 2
                    new_window = s.setWindowToWallRatio(wwrSub, 0.025, true)
                end

            when z2
                puts 'z2'
                puts num_surfaces
                #remove roof/ceiling
                self.getSurfaces.each do |s|
                    next if not s.name.to_s.split(" ")[1].to_i == previous_num_surfaces || s.name.to_s.split(" ")[1].to_i == num_surfaces + 2
                    puts s.name
                    puts s.surfaceType
                    s.remove
                end
            end
    		previous_num_surfaces = num_surfaces
    		num_surfaces = self.getSurfaces.length
    	end
    	

    end

    #Put all of the spaces in the model into a vector
    spaces = OpenStudio::Model::SpaceVector.new
    self.getSpaces.each { |space| spaces << space }

    #Match surfaces for each space in the vector
    OpenStudio::Model.matchSurfaces(spaces) # Match surfaces and sub-surfaces within spaces
    
    #Apply a thermal zone to each space in the model if that space has no thermal zone already
    self.getSpaces.each do |space|
      if space.thermalZone.empty?
        new_thermal_zone = OpenStudio::Model::ThermalZone.new(self)
        space.setThermalZone(new_thermal_zone)
      end
    end # end space loop
  end # end add_geometry method  


  def add_windows(wwr, offset, application_type)
  	#input checking
    if not wwr or not offset or not application_type
      return false
    end

    if wwr <= 0 or wwr >= 1
      return false
    end

    if offset <= 0
      return false
    end

    heightOffsetFromFloor = nil
    if application_type == "Above Floor"
      heightOffsetFromFloor = true
    else
      heightOffsetFromFloor = false
    end

    self.getSurfaces.each do |s|
    	next if not s.outsideBoundaryCondition == "Outdoors"
    	new_window = s.setWindowToWallRatio(wwr, offset, heightOffsetFromFloor)
    end

  end # end add_windows method 

  def add_constructions(construction_library_path, degree_to_north)
	  
  
    #input error checking
    if not construction_library_path
      return false
    end
    #make sure the file exists on the filesystem; if it does, open it
    construction_library_path = OpenStudio::Path.new(construction_library_path)
    if OpenStudio::exists(construction_library_path)
      construction_library = OpenStudio::IdfFile::load(construction_library_path, "OpenStudio".to_IddFileType).get
    else
      puts "#{construction_library_path} couldn't be found"
    end

    #add the objects in the construction library to the model
    self.addObjects(construction_library.objects)
    
    #apply the newly-added construction set to the model
    building = self.getBuilding
    default_construction_set = OpenStudio::Model::getDefaultConstructionSets(self)[0]
    building.setDefaultConstructionSet(default_construction_set)
	building.setNorthAxis(degree_to_north)
  
  end #end Constructions

  def save_openstudio_osm(dir, name)
  
    save_path = OpenStudio::Path.new("#{dir}/#{name}")
    self.save(save_path,true)
    
  end
  
  def translate_to_energyplus_and_save_idf(dir,name)
  
    #make a forward translator and convert openstudio model to energyplus
    forward_translator = OpenStudio::EnergyPlus::ForwardTranslator.new()
    workspace = forward_translator.translateModel(self)
    idf_save_path = OpenStudio::Path.new("#{dir}/#{name}")
    workspace.save(idf_save_path,true)
  
  end

  def add_temperature_variable(dir, name)
  	# Open a file and read from it
	File.open("#{dir}#{name}.idf", 'a') {|f| f.write("Output:Variable,*,Surface Outside Face Temperature,hourly; !- Zone Average [C]") }
  end
end

def distanceFormula(x1,y1,x2,y2)
	return Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1)*(y2-y1)))
end

#Coords to test buildings (Rectangle)
coords = [[0,0],[0,50],[100,50],[100,0]]

#Do Grid for One Length

def createWallGrid(point1, point2, gridSize)
	sideLength = distanceFormula(point1[0],point1[1],point2[0],point2[1])
	gridLength = ((sideLength % gridSize) / ((sideLength / gridSize).to_i)) + gridSize
	#Number of Grid Checks
    if (gridSize * 2) > sideLength
    	gridLength = sideLength / 2
    	gridSize = gridLength
    end
	#Deltas and Iterators
	deltaX = point2[0] - point1[0]
    deltaY = point2[1] - point1[1]
    xIt = deltaX / (sideLength / gridSize).to_i
    yIt = deltaY / (sideLength / gridSize).to_i
    iterator = (sideLength / gridSize).to_i
    #Infinity Check
    #Zero Check

    points = Array.new
    #Loop Wall
    for i in (0..iterator)
    	points[i] = [point1[0] + (xIt * i), point1[1] + (yIt * i)]
    end
    return points
end

def createFullGrid(point1, point2, point3, point4, gridSize)
	gridSize1 = gridSize
	gridSize2 = gridSize
	#Side 1
	sideLength1 = distanceFormula(point1[0],point1[1],point2[0],point2[1])
	gridLength1 = ((sideLength1 % gridSize) / ((sideLength1 / gridSize).to_i)) + gridSize
	#Number of Grid Checks
    if (gridSize * 2) > sideLength1
    	gridLength1 = sideLength1 / 2
    	gridSize1 = gridLength1
    end
    deltaX1 = point2[0] - point1[0]
    deltaY1 = point2[1] - point1[1]
    xIt1 = deltaX1 / (sideLength1 / gridSize1).to_i
    yIt1 = deltaY1 / (sideLength1 / gridSize1).to_i
    iterator1 = (sideLength1 / gridSize1).to_i
    puts sideLength1
    puts gridSize1
    puts gridSize1
    #Side 2
	sideLength2 = distanceFormula(point1[0],point1[1],point4[0],point4[1])
	gridLength2 = ((sideLength2 % gridSize) / ((sideLength2 / gridSize).to_i)) + gridSize
	#Number of Grid Checks
    if (gridSize * 2) > sideLength2
    	gridLength2 = sideLength2 / 2
    	gridSize2 = gridLength2
    end
    deltaX2 = point4[0] - point1[0]
    deltaY2 = point4[1] - point1[1]
    xIt2 = deltaX2 / (sideLength2 / gridSize2).to_i
    yIt2 = deltaY2 / (sideLength2 / gridSize2).to_i
    iterator2 = (sideLength2 / gridSize2).to_i
    puts sideLength2
    puts gridSize2
    puts gridSize2
end



building = JSON.parse(ARGV[0])


#initialize and make OSModel

model = OSModel.new

model.add_geometry(building['coords'], building['gridSize'], building['floors'], building['floorHeight'], building['wwr'])
#model.add_windows(0.33,1 ,"Above Floor")
model.add_constructions('./ASHRAE_90.1-2004_Construction.osm', 0)
model.save_openstudio_osm('./', building['fileName'])
model.translate_to_energyplus_and_save_idf('./', building['fileName'])
model.add_temperature_variable('./', building['fileName'])

