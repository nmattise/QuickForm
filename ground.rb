require 'openstudio'

class OSModel < OpenStudio::Model::Model

	def create_ground(coords, gridSize)

      #Get Grid Points
      gridPoints = sub_grids(coords[0], coords[1], coords[3], gridSize)
      #loop through grid points
      gridPoints.each do |square|
        os_points  = Array.new
        #Loop through square to make footprint
        square.each do |sq|
          os_points.push(OpenStudio::Point3d.new(sq[0], sq[1], 0))
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
        core_space = OpenStudio::Model::Space::fromFloorPrint(core_polygon, 1, self)
        core_space = core_space.get
        m[0,3] = os_points[0].x
        m[1,3] = os_points[0].y
        m[2,3] = os_points[0].z
        core_space.changeTransformation(OpenStudio::Transformation.new(m))
  
        core_space.setName("Ground")
        
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

  	

    def make_grid_building(coords, gridSize)

      os_points  = Array.new
        #Loop through coords to make footprint
      coords.each do |coord|
        os_points.push(OpenStudio::Point3d.new(coord[0], coord[1], 0))
      end
      puts os_points
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
    core_space = OpenStudio::Model::Space::fromFloorPrint(core_polygon, 1, self)
    core_space = core_space.get
      m[0,3] = os_points[0].x
      m[1,3] = os_points[0].y
      m[2,3] = os_points[0].z
      core_space.changeTransformation(OpenStudio::Transformation.new(m))
  
      core_space.setName("Ground")
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
    end


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
		File.open("#{dir}#{name}.idf", 'a') {|f| f.write("Output:Variable,*,Surface Outside Face Temperature,hourly; !- Zone Average [C]") }
  	end
end

def distanceFormula(x1,y1,x2,y2)
	return Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1)*(y2-y1)))
end
def sub_grids(pt0, pt1, pt3, gridSize)
      #final array
      grids = Array.new()
      #Length Side 0
      l0 = distanceFormula(pt0[0], pt0[1], pt1[0], pt1[1])
      gridLength0 = ((l0 % gridSize) / ((l0 / gridSize).to_i)) + gridSize
      deltaX0 = pt1[0] - pt0[0]
      deltaY0 = pt1[1] - pt0[1]
      xIt0 = deltaX0 / (l0 / gridLength0)
      yIt0 = deltaY0 / (l0 / gridLength0)
      iterator0 = (l0 / gridLength0).to_i
      puts l0
      puts gridLength0
      puts "deltax : #{deltaX0}"
      puts "deltay : #{deltaY0}"
      puts "xit: #{xIt0}"
      puts "yit: #{yIt0}"
      puts "iterator0: #{iterator0}"
      #Infinity Check
      #Zero Check
      #Length Side 3
      l3 = distanceFormula(pt0[0], pt0[1], pt3[0], pt3[1])
      gridLength3 = ((l3 % gridSize) / ((l3 / gridSize).to_i)) + gridSize
      deltaX3 = pt3[0] - pt0[0]
      deltaY3 = pt3[1] - pt0[1]
      xIt3 = deltaX3 / (l3 / gridLength3)
      yIt3 = deltaY3 / (l3 / gridLength3)
      iterator3 = (l3 / gridLength3).to_i
      puts "deltax : #{deltaX3}"
      puts "deltay : #{deltaY3}"
      puts "xit: #{xIt3}"
      puts "yit: #{yIt3}"
      puts "iterator3 : #{iterator3}"
      for i in (0..iterator0-1)
        x = 0 + xIt0 * i
        y = 0 + yIt0 * i
        for j in (0..iterator3-1)
          point4 = [x + (xIt3 * j) , y + (yIt3 * j)]
          point1 = [point4[0] + xIt3 , point4[1] + yIt3 ]
          point2 = [point1[0] + xIt0 , point1[1] + yIt0 ]
          point3 = [point4[0] + xIt0, point4[1] + yIt0 ]
          grids.push([point4,  point3,point2, point1])
        end
      end
      return grids
    end
    def grids(pt0, pt1, pt3, gridSize)
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

def distanceFormula(x1,y1,x2,y2)
  return Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1)*(y2-y1)))
end

def findRotation(pt1, pt2)
  deltaX = pt2[0] - pt1[0]
  deltaY = pt2[1] - pt1[1]
  theta = Math.atan2(deltaY, deltaX)
  return theta
end

coords = [[0,0], [0,50],[50,50],[50,0]]
model = OSModel.new
puts grids(coords[0], coords[1], coords[3], 5)
model.create_ground(coords, 10)
model.add_constructions('./ASHRAE_90.1-2004_Construction.osm', 0)
model.save_openstudio_osm('./', 'ground')
model.translate_to_energyplus_and_save_idf('./', 'ground')
model.add_temperature_variable('./', 'ground')


