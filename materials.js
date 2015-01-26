//Polygon Triangulation (for top/bottom)
//http://polyk.ivank.net/?p=documentation
//https://github.com/r3mi/poly2tri.js

var fs = require('fs'),
    stl = require('../stl/stl.js'),
    poly2tri = require('poly2tri');


function createVertPlane(pt1, pt2, z1, z2) {
    var tri1 = [
            [pt1[0], pt1[1], z1],
            [pt2[0], pt2[1], z1],
            [pt2[0], pt2[1], z2]
        ],
        tri2 = [
            [pt1[0], pt1[1], z1],
            [pt2[0], pt2[1], z2],
            [pt1[0], pt1[1], z2]
        ],
        facets = [];
    facets = [{
        verts: tri1
    }, {
        verts: tri2
    }];
    return facets;

}

function distanceFormula(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

function material(point1, point2, height, floorHeight, floors, windowWallRatio, gridSize, buildingName) {
    var windowH = windowWallRatio * floorHeight;
    var sillBottom = (floorHeight - windowH) / 2;
    var sillTop = sillBottom + windowH;
    console.log(windowH);
    //console.log(sillBottom);
    //console.log(sillTop);
    var sideLength, deltaX, deltaY, gridLength, xIt, yIt, iterator, zIterator, pt1, pt2, i, z, zGrid, zIt, tri, tri1, tri2, facets, z1, z2;
    facets = [];
    sideLength = distanceFormula(point1[0], point1[1], point2[0], point2[1]);
    gridLength = ((sideLength % gridSize) / (parseInt(sideLength / gridSize))) + gridSize;
    deltaX = point2[0] - point1[0];
    deltaY = point2[1] - point1[1];
    xIt = deltaX / parseInt(sideLength / gridSize);
    yIt = deltaY / parseInt(sideLength / gridSize);
    //Infinity Check
    if (!isFinite(xIt)) xIt = 0;
    if (!isFinite(yIt)) yIt = 0;
    iterator = parseInt(sideLength / gridSize);

    for (var t = 0; t < floors; t++) {
        var floor = t * floorHeight;
        var floorTop = floor + floorHeight;
        var sillBottom1 = sillBottom + (t * floorHeight);
        var sillTop1 = sillTop + (t * floorHeight);
        console.log(floor);
        console.log(floorTop);
    	console.log(sillBottom1);
    	console.log(sillTop1);
        for (i = 0; i < iterator; i++) {
            pt1 = [point1[0] + (xIt * i), point1[1] + (yIt * i)];
            pt2 = [point1[0] + (xIt * (i + 1)), point1[1] + (yIt * (i + 1))];

            tri = createVertPlane(pt1, pt2, floor, sillBottom1);
            tri1 = createVertPlane(pt1, pt2, sillBottom1, sillTop1);
            tri2 = createVertPlane(pt1, pt2, sillTop1, floorTop);
            facets.push(tri[0]);
            facets.push(tri[1]);
            facets.push(tri1[0]);
            facets.push(tri1[1]);
            facets.push(tri2[0]);
            facets.push(tri2[1]);
        }

    };
  
    var stlObj = {
        description: buildingName,
        facets: facets
    };
    fs.writeFileSync("stlFiles/materialRectangle.stl", stl.fromObject(stlObj));

}

function createCustomWallGrid(point1, point2, gridSize, height) {
    var sideLength, deltaX, deltaY, gridLength, xIt, yIt, iterator, zIterator, pt1, pt2, i, z, zGrid, zIt, tri, facets, z1, z2;
    facets = [];
    sideLength = distanceFormula(point1[0], point1[1], point2[0], point2[1]);
    gridLength = ((sideLength % gridSize) / (parseInt(sideLength / gridSize))) + gridSize;
    deltaX = point2[0] - point1[0];
    deltaY = point2[1] - point1[1];
    xIt = deltaX / parseInt(sideLength / gridSize);
    yIt = deltaY / parseInt(sideLength / gridSize);
    //Infinity Check
    if (!isFinite(xIt)) xIt = 0;
    if (!isFinite(yIt)) yIt = 0;
    iterator = parseInt(sideLength / gridSize);
    zGrid = gridLength = ((height % gridSize) / (parseInt(height / gridSize))) + gridSize;
    zIt = height / parseInt(height / gridSize);
    zIterator = parseInt(height / gridSize);
    for (i = 0; i < iterator; i++) {
        pt1 = [point1[0] + (xIt * i), point1[1] + (yIt * i)];
        pt2 = [point1[0] + (xIt * (i + 1)), point1[1] + (yIt * (i + 1))];
        for (z = 0; z < zIterator; z++) {
            z1 = zIt * z;
            z2 = zIt * (z + 1);
            tri = createVertPlane(pt1, pt2, z1, z2);
            facets.push(tri[0]);
            facets.push(tri[1]);
        }
    }
    return facets;
}
material([-10, -10], [10, -10], 20, 5, 4, .25, 3, "materialRectangle");
