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
#[0,10], [10,10], [0,0]
#[ -47.18, -30.68 ],[ -47.18, -8.37 ],[ 13.63, -7.91 ],[ 14.1, 38.01 ],[ 32.04, 38.01 ],[ 34.59, -29.05 ]
g = grids([ -29.26, 37.64 ], [ 29.26, 37.64 ], [ -29.26, -37.64 ], 10)
puts "grids : #{g.length}"
