require 'openstudio'
require 'json'

class OSModel < OpenStudio::Model::Model

  def add_geometry(coords, gridSize, floors, floorHeight, wwr)
  	
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
        #Surfaces Count (excludes subsurfaces) before this height is added
        surface_count = self.getSurfaces.length
    		#Height Adjustment
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

            #Add Windows to z1 level to surfaces above the surface count
            if z == z1
                self.getSurfaces.each do |s|
                    next if not s.name.to_s.index('SUB') == nil #Ignore Subsurfaces
                    next if not s.name.to_s.split(" ")[1].to_i >= surface_count #Ignore surfaces before this current height
                    new_window = s.setWindowToWallRatio(wwrSub, 0.025, true)
                end
            end
    	end # End of heights Loop
    	

    end #End of Floors Loop

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

  def add_grid_roof(roofCoords, gridSize, height, shape)
    #Switch Case for Different Shapes
    case shape
    when "rect"
      #Surface count before addition
      surfaces = self.getSurfaces.length
      construct_grid_roof(roofCoords[0], roofCoords[1], roofCoords[2], gridSize,height, self)
      
    when "l"
      #Surface count before addition
      surfaces = self.getSurfaces.length
      construct_grid_roof(roofCoords[0][0], roofCoords[0][1], roofCoords[0][2], gridSize,height, self)
      #Surface count before addition
      surfaces1 = self.getSurfaces.length
      construct_grid_roof(roofCoords[1][0], roofCoords[1][1], roofCoords[1][2], gridSize,height, self)
    when "t"
      #Surface count before addition
      surfaces = self.getSurfaces.length
      construct_grid_roof(roofCoords[0][0], roofCoords[0][1], roofCoords[0][2], gridSize,height, self)
      #Surface count before addition
      surfaces1 = self.getSurfaces.length
      construct_grid_roof(roofCoords[1][0], roofCoords[1][1], roofCoords[1][2], gridSize,height, self)
    when "u"
      #Surface count before addition
      surfaces = self.getSurfaces.length
      construct_grid_roof(roofCoords[0][0], roofCoords[0][1], roofCoords[0][2], gridSize,height, self)
      #Surface count before addition
      surfaces1 = self.getSurfaces.length
      construct_grid_roof(roofCoords[1][0], roofCoords[1][1], roofCoords[1][2], gridSize,height, self)
      #Surface count before addition
      surfaces2 = self.getSurfaces.length
      construct_grid_roof(roofCoords[2][0], roofCoords[2][1], roofCoords[2][2], gridSize,height, self)
    when "h"
      #Surface count before addition
      surfaces = self.getSurfaces.length
      construct_grid_roof(roofCoords[0][0], roofCoords[0][1], roofCoords[0][2], gridSize,height, self)
      #Surface count before addition
      surfaces1 = self.getSurfaces.length
      construct_grid_roof(roofCoords[1][0], roofCoords[1][1], roofCoords[1][2], gridSize,height, self)
      #Surface count before addition
      surfaces2 = self.getSurfaces.length
      construct_grid_roof(roofCoords[2][0], roofCoords[2][1], roofCoords[2][2], gridSize,height, self)
    when "cross" 
    #Surface count before addition
      surfaces = self.getSurfaces.length
      construct_grid_roof(roofCoords[0][0], roofCoords[0][1], roofCoords[0][2], gridSize,height, self)
      #Surface count before addition
      surfaces1 = self.getSurfaces.length
      construct_grid_roof(roofCoords[1][0], roofCoords[1][1], roofCoords[1][2], gridSize,height, self)
      #Surface count before addition
      surfaces2 = self.getSurfaces.length
      construct_grid_roof(roofCoords[2][0], roofCoords[2][1], roofCoords[2][2], gridSize,height, self) 
    else
      return false
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
      end
  
  end

  def add_ground(bounds, gridSize)
    #Surface count before addition
    surfaces = self.getSurfaces.length
    construct_grid_roof(bounds[0], bounds[1], bounds[3], gridSize,0.1, self)
    
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
      end

      #Set Ground as the Outside Boundary COndition
  end

  def remove_building_extras(startSurface, endSurface)

      self.getSurfaces.each do |s|
        next if not s.surfaceType == "Floor" || s.surfaceType == "RoofCeiling"
        next if not s.name.to_s.split(" ")[1].to_i.between?(startSurface, endSurface)
        s.remove
      end

      
        
    
  end

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

  def set_runperiod(day, month)
    #From https://github.com/buildsci/openstudio_scripts/blob/master/newMethods/newMethods.rb
    runPeriod = self.getRunPeriod
    runPeriod.setEndDayOfMonth(day)
    runPeriod.setEndMonth(month)
  end

  

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
    #\nOutput:Variable,*,Surface Outside Face Convection Heat Gain Rate,hourly; !- Zone Average [W]\nOutput:Variable,*,Surface Outside Face Convection Heat Gain Rate per Area,hourly; !- Zone Average [W/m2]\nOutput:Variable,*,Surface Outside Face Solar Radiation Heat Gain Rate,hourly; !- Zone Average [W]\nOutput:Variable,*,Surface Outside Face Solar Radiation Heat Gain Rate per Area,hourly; !- Zone Average [W/m2]\nOutput:Variable,*,Surface Outside Face Conduction Heat Loss Rate,hourly; !- Zone Average [W]\nOutput:Variable,*,Surface Outside Face Conduction Heat Transfer Rate per Area,hourly; !- Zone Average [W/m2]
	File.open("#{dir}#{name}.idf", 'a') {|f| f.write("Output:Variable,*,Surface Outside Face Temperature,hourly; !- Zone Average [C]") }
  end

  def set_solarDist()
    simControl = self.getSimulationControl
    simControl.setSolarDistribution("FullExteriorWithReflections")
  end

end

def count_surfaces(model)
    count = 0
    puts "surfaces Length #{model.getSurfaces.length}"
    model.getSurfaces.each do |s|
        next if not s.name.to_s.index('SUB') == nil
        count += 1
    end
    puts "count : #{count}"
    return count
end


def distanceFormula(x1,y1,x2,y2)
	return Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1)*(y2-y1)))
end

def findRotation(pt1, pt2)
  deltaX = pt2[0] - pt1[0]
  deltaY = pt2[1] - pt1[1]
  theta = Math.atan2(deltaY, deltaX)
  return theta
end


#Do Grid for One Length
def get_num_patches(coords, gridSize)
    numb_patches = 0 
    orgGridSize = gridSize
    
    for pt in (1..coords.length-1)
        gridSize = orgGridSize
        sideLength = distanceFormula(coords[pt-1][0],coords[pt-1][1],coords[pt][0],coords[pt][1])
        gridLength = ((sideLength % gridSize) / ((sideLength / gridSize).to_i)) + gridSize
        #Number of Grid Checks
        if (gridSize * 2) > sideLength
            gridLength = sideLength / 2
            gridSize = gridLength
        end
        iterator = (sideLength / gridSize).to_i
        numb_patches += iterator
    end
    gridSize = orgGridSize
    sideLength = distanceFormula(coords[coords.length-1][0],coords[coords.length-1][1],coords[0][0],coords[0][1])
    #Number of Grid Checks
    if (gridSize * 2) > sideLength
        gridLength = sideLength / 2
        gridSize = gridLength
    end
    iterator = (sideLength / gridSize).to_i
    numb_patches +=iterator  
    return numb_patches
end

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


def all_the_grids(pt0, pt1, pt3, gridSize)
  all_grids = Array.new()
  #Side 1
  l0 = distanceFormula(pt0[0], pt0[1], pt1[0], pt1[1]);
  gridLength0 = ((l0 % gridSize) / ((l0 / gridSize).to_i)) + gridSize
  #Make sure of a min of 2 patches
  gridSize0 = gridSize
  if (gridSize * 2) > l0
      gridLength0 = l0/2
      gridSize0 = gridLength0
  end
  deltaX0 = pt1[0] - pt0[0]
  deltaY0 = pt1[1] - pt0[1]
  xIt0 = deltaX0 / (l0/gridSize0).to_i
  yIt0 = deltaY0 / (l0/gridSize0).to_i
  iterator0 = (l0/gridSize0).to_i
  #Side 4
  l3 = distanceFormula(pt0[0], pt0[1], pt3[0], pt3[1]);
  gridLength3 = ((l3 % gridSize) / ((l3 / gridSize).to_i)) + gridSize
  #Make sure of a min of 2 patches
  gridSize3 = gridSize
  if (gridSize * 2) > l3
      gridLength3 = l3/2
      gridSize3 = gridLength3
  end 
  deltaX3 = pt0[0] - pt3[0]
  deltaY3 = pt0[1] - pt3[1]
  xIt3 = deltaX0 / (l3/gridSize3).to_i
  yIt3 = deltaY0 / (l3/gridSize3).to_i
  iterator3 = (l3/gridSize3).to_i  

  #Rotations
  theta0 = findRotation(pt0, pt1)
  theta3 = findRotation(pt0, pt3)

  for j in (0..iterator3-1)
    point0 = [pt0[0] + (gridLength3 * j * Math.cos(theta3)), pt0[1] + (gridLength3 * j * Math.sin(theta3))];
    point3 = [pt0[0] + (gridLength3 * (j + 1) * Math.cos(theta3)), pt0[1] + (gridLength3 * (j + 1) * Math.sin(theta3))];
    for i in(0..iterator0-1)
      point0_1 = [point0[0] + (gridLength0 * i * Math.cos(theta0)), point0[1] + (gridLength0 * i * Math.sin(theta0))];
      point1 = [point0[0] + (gridLength0 * (i + 1) * Math.cos(theta0)), point0[1] + (gridLength0 * (i + 1) * Math.sin(theta0))];
      point2 = [point3[0] + (gridLength0 * (i + 1) * Math.cos(theta0)), point3[1] + (gridLength0 * (i + 1) * Math.sin(theta0))];
      point3_1 = [point3[0] + (gridLength0 * i * Math.cos(theta0)), point3[1] + (gridLength0 * i * Math.sin(theta0))];
      all_grids.push([point0_1, point1, point2,point3_1])
    end
  end
  return all_grids
end

def construct_grid_roof(pt1, pt2, pt3, gridSize, height, model)
  grid_points = all_the_grids(pt1, pt2, pt3, gridSize)
  #all_the_grids(coords[0], coords[1], coords[3], gridSize)
  #loop through grid points
  grid_points.each do |square|
    os_points  = Array.new
    #Loop through square to make footprint
    square.each do |sq|
      os_points.push(OpenStudio::Point3d.new(sq[0], sq[1], height-0.1))
    end
    # Identity matrix for setting space origins
    m = OpenStudio::Matrix.new(4,4,0)
    m[0,0] = 1
    m[1,1] = 1
    m[2,2] = 1
    m[3,3] = 1

    # Minimal zones
    core_polygon = OpenStudio::Point3dVector.new
    os_points.each do |point|
      core_polygon << point
    end
    core_space = OpenStudio::Model::Space::fromFloorPrint(core_polygon, 0.1, model)
    core_space = core_space.get
    m[0,3] = os_points[0].x
    m[1,3] = os_points[0].y
    m[2,3] = os_points[0].z
    core_space.changeTransformation(OpenStudio::Transformation.new(m))
    core_space.setName("Roof")
  end
end


=begin

coords = [ -55.05533398318459, 11.667261889578032 ],[ -39.40926006632459, 27.313335806438033 ],[ 4.418830129700869, -16.514754389587424 ],[ 36.62267209573454, 15.689087576446246 ],[ 49.55271547867645, 2.759044193504348 ],[ 1.7027995957827713, -45.090871689389324 ]
gridSize = 5
floors = 4
floorHeight =3
wwr = 0.33
fileName = 'test'
roofCoords = [ [ [ -55.05533398318459, 11.667261889578032 ],[ -39.40926006632459, 27.313335806438033 ],[ -11.227243787159125, -32.16082830644743 ] ],[ [ -11.227243787159125, -32.16082830644743 ],[ 36.62267209573454, 15.689087576446246 ],[ 1.7027995957827713, -45.090871689389324 ] ] ]

#initialize and make OSModel

model = OSModel.new

model.add_geometry(coords, gridSize, floors, floorHeight, wwr)
model.add_constructions('./ASHRAE_90.1-2004_Construction.osm', 0)
model.add_grid_roof(roofCoords,gridSize, 12,"l")
model.set_runperiod(31, 1);
model.set_solarDist();
model.save_openstudio_osm('./', fileName)
model.translate_to_energyplus_and_save_idf('./', fileName)
model.add_temperature_variable('./', fileName)
=end



