require 'openstudio'

class OSModel < OpenStudio::Model::Model

		def create_building(building)
			coords = building["coords"]
			gridSize = building["gridSize"]
			tran = building["translation"]
			rt = building["rotation"]
			name = building["name"]
			floors = building["floors"]
			floorHeight = building["floorHeight"]
			wwr = building["wwr"]
			floor = 0
			winH = floorHeight * wwr
  			wallH = (floorHeight - winH) / 2
  			bldgH = floors * floorHeight
  			wwrSub = (((winH - 0.05)* (gridSize - 0.05)) / (winH * gridSize)) - 0.01
  			num_surfaces = 0
    		previous_num_surfaces = 0
      		#Get Grid Points
      		gridPoints = sub_grids(coords[0], coords[1], coords[3], gridSize)
      		
      		#Floor Loop
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

    				#loop through grid points
      				gridPoints.each do |square|
        				os_points  = Array.new
        				#Loop through square to make footprint
        				square.each do |sq|
          				os_points.push(OpenStudio::Point3d.new(sq[0], sq[1], z))
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
        			core_space = OpenStudio::Model::Space::fromFloorPrint(core_polygon, height, self)
        			core_space = core_space.get
        			m[0,3] = os_points[0].x
        			m[1,3] = os_points[0].y
        			m[2,3] = os_points[0].z
        			core_space.changeTransformation(OpenStudio::Transformation.new(m))
  			
        			core_space.setName(name)
        			# Get spaces 

					# Define the transformation
					t=core_space.transformation
			
					# Define the rotation from the point origin, z- direction, and 90 degrees
					rotation = OpenStudio::createRotation(OpenStudio::Point3d.new(0,0,0), OpenStudio::Vector3d.new(0,0,1), OpenStudio::degToRad(rt))
			
					# Define the translation from from (0,0,0) to (0,-40,0)
					translation = OpenStudio::createTranslation(OpenStudio::Vector3d.new(tran[0], tran[1], tran[2]))
			
					# Transformation is a multiplier operator 
					t = rotation * translation * t	
			
					# Set the transformatin for the space
					core_space.setTransformation(t)	
    			end #end heights loop
    		end # End Floor Lops
      		
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
	end


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
        core_space = OpenStudio::Model::Space::fromFloorPrint(core_polygon, 0.1, self)
        core_space = core_space.get
        m[0,3] = os_points[0].x
        m[1,3] = os_points[0].y
        m[2,3] = os_points[0].z
        core_space.changeTransformation(OpenStudio::Transformation.new(m))
  
        core_space.setName("Ground")
        # Get spaces 

			# Define the transformation
			t=core_space.transformation
	
			# Define the rotation from the point origin, z- direction, and 90 degrees
			rotation = OpenStudio::createRotation(OpenStudio::Point3d.new(0,0,0), OpenStudio::Vector3d.new(0,0,1), OpenStudio::degToRad(0))
	
			# Define the translation from from (0,0,0) to (0,-40,0)
			translation = OpenStudio::createTranslation(OpenStudio::Vector3d.new(coords[0][0], coords[0][1], 0))
	
			# Transformation is a multiplier operator 
			t = rotation * translation * t	
	
			# Set the transformatin for the space
			core_space.setTransformation(t)	
        
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

  	def remove_interiors()

  		self.getSurfaces.each do |s|
        	next if not s.surfaceType == "Wall" 
        	next if not s.sunExposure == "NoSun" || s.windExposure == "NoWind"
        	s.remove
  		end



  		self.getSurfaces.each do |s|
  			next if not s.surfaceType == "RoofCeiling" || s.surfaceType == "Floor" 
  			next if not s.sunExposure == "NoSun" || s.windExposure == "NoWind"
        	s.remove
  		end
  	end



	def set_runperiod(day, month)
    	#From https://github.com/buildsci/openstudio_scripts/blob/master/newMethods/newMethods.rb
    	runPeriod = self.getRunPeriod
    	runPeriod.setEndDayOfMonth(day)
    	runPeriod.setEndMonth(month)
  	end
  	def set_solarDist()

    	simControl = self.getSimulationControl
    	simControl.setSolarDistribution("FullExteriorWithReflections")
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
building1 = {
	"coords" =>[[10,-10],[20,-10],[20,-20],[10,-20]],
	"name" => "building1",
	"gridSize"  => 5,
	"translation" => [10,-10,0],
	"rotation" => 0,
	"floors" => 4,
	"floorHeight" => 3.5,
	"wwr" => 0.25
}
building2 = {
	"coords" =>[[10,20],[30,20],[30,10],[10,10]],
	"name" => "building2",
	"gridSize"  => 5,
	"translation" => [10,20,0],
	"rotation" => 0,
	"floors" => 4,
	"floorHeight" => 3.5,
	"wwr" => 0.25
}
building3 = {
	"coords" =>[[-20,10],[-10,10],[-10,-20],[-20,-20]],
	"name" => "building3",
	"gridSize"  => 5,
	"translation" => [-20,10,0],
	"rotation" => 0,
	"floors" => 4,
	"floorHeight" => 3.5,
	"wwr" => 0.25
}


model = OSModel.new

model.create_building(building1)
model.create_building(building2)
model.create_building(building3)
model.create_ground([[-100,100], [100,100], [100,-100], [-100,-100]], 25)
model.remove_interiors()
model.add_constructions('./ASHRAE_90.1-2004_Construction.osm', 0)
model.set_solarDist()
model.save_openstudio_osm('./', 'multi')
model.translate_to_energyplus_and_save_idf('./', 'multi')
model.add_temperature_variable('./', 'multi')
