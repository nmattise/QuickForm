'use strict';
//Dependencies
var fs = require('fs'),
    stl = require('stl');

function distanceFormula(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

function createVertPlane(pt1, pt2, z1, z2) {
    var tri1 = [[pt1[0], pt1[1], z1], [pt2[0], pt2[1], z1], [pt2[0], pt2[1], z2]],
        tri2 = [[pt1[0], pt1[1], z1], [pt2[0], pt2[1], z2], [pt1[0], pt1[1], z2]],
        facets = [];
    facets = [{
        verts: tri1
    }, {
        verts: tri2
    }];
    return facets;

}

function createHorPlaneUp(pt1, pt2, z) {
    var tri1 = [[pt1[0], pt1[1], z], [pt2[0], pt1[1], z], [pt2[0], pt2[1], z]],
        tri2 = [[pt1[0], pt1[1], z], [pt2[0], pt2[1], z], [pt1[0], pt2[1], z]],
        facets = [{
            verts: tri1
    }, {
            verts: tri2
    }];
    return facets;
}

function createHorPlaneDn(pt1, pt2, z) {
    var tri1 = [[pt1[0], pt1[1], z], [pt2[0], pt1[1], z], [pt2[0], pt2[1], z]],
        tri2 = [[pt1[0], pt1[1], z], [pt2[0], pt2[1], z], [pt1[0], pt2[1], z]],
        facets = [{
            verts: tri1.reverse()
    }, {
            verts: tri2.reverse()
    }];
    return facets;
}

var array = [],
    height,
    xGrid,
    xIt,
    yGrid,
    yIt,
    zGrid,
    zIt,
    facets = [],
    facets1 = [],
    x1, x2;

array = [[0, -15],
    [10, 0],
    [0, 15],
    [10, 0]];
height = 10;

/*xGrid = Math.abs(parseInt(array[0][0] - array[1][0], 10));
xIt = (array[0][0] - array[1][0]) / xGrid;
console.log("xGrid: " + xGrid + "  X iteration: " + xIt);
yGrid = Math.abs(parseInt(array[0][1] - array[2][1], 10));
yIt = (array[0][1] - array[2][1]) / yGrid;
console.log("yGrid: " + yGrid + "  Y iteration: " + yIt);
zGrid = Math.abs(parseInt(height));
zIt = height / zGrid;
console.log("zGrid: " + zGrid + "  Z iteration: " + zIt);

//South Side
for (var x = 0; x < xGrid; x++) {
    var x1 = array[0][0] - xIt * x;
    var x2 = array[0][0] - xIt * (x + 1);
    //console.log(array[0][0] - xIt * x)
    for (var z = 0; z < zGrid; z++) {
        //console.log(zIt * z);
        var z1 = zIt * z;
        var z2 = zIt * (z + 1);
        var pt1 = [x1, array[0][1]],
            pt2 = [x2, array[0][1]];
        var tri = createVertPlane(pt1, pt2, z1, z2);
        facets.push(tri[0]);
        facets.push(tri[1]);
    }
}
//North Side
for (var x = 0; x < xGrid; x++) {
    var x1 = array[2][0] + xIt * x;
    var x2 = array[2][0] + xIt * (x + 1);
    //console.log(array[0][0] - xIt * x)
    for (var z = 0; z < zGrid; z++) {
        //console.log(zIt * z);
        var z1 = zIt * z;
        var z2 = zIt * (z + 1);
        var pt1 = [x1, array[2][1]],
            pt2 = [x2, array[2][1]];
        var tri = createVertPlane(pt1, pt2, z1, z2);
        facets.push(tri[0]);
        facets.push(tri[1]);
    }
}

//East Side
for (var y = 0; y < yGrid; y++) {
    var y1 = array[1][1] - yIt * y;
    var y2 = array[1][1] - yIt * (y + 1);
    //console.log(array[0][0] - xIt * x)
    for (var z = 0; z < zGrid; z++) {
        //console.log(zIt * z);
        var z1 = zIt * z;
        var z2 = zIt * (z + 1);
        var pt1 = [array[1][0], y1],
            pt2 = [array[1][0], y2];
        var tri = createVertPlane(pt1, pt2, z1, z2);
        facets.push(tri[0]);
        facets.push(tri[1]);
    }
}
//West Side
for (var y = 0; y < yGrid; y++) {
    var y1 = array[3][1] + yIt * y;
    var y2 = array[3][1] + yIt * (y + 1);
    //console.log(array[0][0] - xIt * x)
    for (var z = 0; z < zGrid; z++) {
        //console.log(zIt * z);
        var z1 = zIt * z;
        var z2 = zIt * (z + 1);
        var pt1 = [array[3][0], y1],
            pt2 = [array[3][0], y2];
        var tri = createVertPlane(pt1, pt2, z1, z2);
        facets.push(tri[0]);
        facets.push(tri[1]);
    }
}
//Roof & Floor
for (var x = 0; x < xGrid; x++) {
    var x1 = array[0][0] - xIt * x;
    var x2 = array[0][0] - xIt * (x + 1);
    //console.log(array[0][0] - xIt * x)
    for (var y = 0; y < yGrid; y++) {
        //console.log(zIt * z);
        var y1 = array[0][1] - yIt * y;
        var y2 = array[0][1] - yIt * (y + 1);
        var pt1 = [x1, y1],
            pt2 = [x2, y2];
        //Floor
        var tri = createHorPlaneDn(pt1, pt2, 0);
        facets.push(tri[0]);
        facets.push(tri[1]);
        //Roof
        var tri = createHorPlaneUp(pt1, pt2, height);
        facets.push(tri[0]);
        facets.push(tri[1]);
    }
}

var stlObj = {
    description: "testBuilding",
    facets: facets
};
fs.writeFileSync("stlFiles/testBuildings.stl", stl.fromObject(stlObj));*/


//Loop that is a function of x,y,z
/*for (var i = 1; i < array.length; i++) {
    var tri = createVertPlane(array[i - 1], array[i], 0, height);
    facets.push(tri[0]);
    facets.push(tri[1]);
}
var tri = createVertPlane(array[array.length - 1], array[0], 0, height);
facets1.push(tri[0]);
facets1.push(tri[1]);*/

//Side 1
//Get grid# and grid iterators in x,y,z
var sideLength = distanceFormula(array[0][0], array[0][1], array[1][0], array[1][1]);
var deltaX = array[1][0] - array[0][0];
var deltaY = array[1][1] - array[0][1];

var gridLength = sideLength / parseInt(sideLength);
var xIt = deltaX / parseInt(sideLength);
var yIt = deltaY / parseInt(sideLength);
var iterator = parseInt(sideLength);
console.log("sidelength: " + sideLength);
console.log("deltax: " + deltaX);
console.log("deltay: " + deltaY);
console.log("gridLength: " + gridLength);
console.log("xIterator: " + xIt);
console.log("yIterator: " + yIt);
console.log("Iterator: " + iterator);

for (var i = 0; i < sideLength - 1; i++) {
    var pt1 = [array[0][0] + (xIt * i), array[0][1] + (yIt * i)];
    var pt2 = [array[0][0] + (xIt * (i + 1)), array[0][1] + (yIt * (i + 1))];
    console.log("pt1: " + pt1 + "  pt2: " + pt2);
    var tri = createVertPlane(pt1, pt2, 0, height);
    facets.push(tri[0]);
    facets.push(tri[1]);
}
//Loop Through Sides
for (var i = 1; i < array.length; i++) {
    var sideLength = distanceFormula(array[i - 1][0], array[i - 1][1], array[i][0], array[i][1]),
        deltaX = array[i][0] - array[i - 1][0],
        deltaY = array[i][1] - array[i - 1][1],
        gridLength = sideLength / parseInt(sideLength),
        xIt = deltaX / parseInt(sideLength),
        yIt = deltaY / parseInt(sideLength),
        iterator = parseInt(sideLength);
    var zGrid = Math.abs(parseInt(height));
    var zIt = height / zGrid;
    console.log("zGrid: " + zGrid + "  Z iteration: " + zIt);
    for (var j = 0; j < sideLength - 1;j++) {
        var pt1 = [array[i - 1][0] + (xIt * j), array[i - 1][1] + (yIt * j)];
        var pt2 = [array[i - 1][0] + (xIt * (j + 1)), array[i - 1][1] + (yIt * (j + 1))];
        console.log("pt1: " + pt1 + "  pt2: " + pt2);
        for (var z = 0; z < zGrid; z++) {
            var z1 = zIt * z;
            var z2 = zIt * (z + 1);
            var tri = createVertPlane(pt1, pt2, z1, z2);
            facets.push(tri[0]);
            facets.push(tri[1]);
        }

    }
}



var stlObj1 = {
    description: "testBuilding1",
    facets: facets
};
fs.writeFileSync("stlFiles/testBuildings1.stl", stl.fromObject(stlObj1));
