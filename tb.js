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

function createWallGrid(point1, point2, height) {
    var sideLength, deltaX, deltaY, gridLength, xIt, yIt, iterator, pt1, pt2, i, z, zGrid, zIt, tri, facets, z1, z2;
    facets = [];
    sideLength = distanceFormula(point2[0], point2[1], point1[0], point1[1]);
    deltaX = point2[0] - point1[0];
    deltaY = point2[1] - point1[1];
    gridLength = sideLength / parseInt(sideLength);
    xIt = deltaX / parseInt(sideLength);
    yIt = deltaY / parseInt(sideLength);
    iterator = parseInt(sideLength);
    zGrid = Math.abs(parseInt(height));
    zIt = height / zGrid;
    for (i = 0; i < sideLength - 1; i++) {
        pt1 = [point1[0] + (xIt * i), point1[1] + (yIt * i)];
        pt2 = [point1[0] + (xIt * (i + 1)), point1[1] + (yIt * (i + 1))];
        for (z = 0; z < zGrid; z++) {
            z1 = zIt * z;
            z2 = zIt * (z + 1);
            tri = createVertPlane(pt1, pt2, z1, z2);
            facets.push(tri[0]);
            facets.push(tri[1]);
        }
    }
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

array = [[0, -10],
    [10, 0],
    [0, 10],
    [-10, 0]];
height = 10;



createWallGrid(array[0], array[1], height).forEach(function (facet) {
    facets.push(facet);
});
(createWallGrid(array[1], array[2], height)).forEach(function (facet) {
    facets.push(facet);
});
(createWallGrid(array[2], array[3], height)).forEach(function (facet) {
    facets.push(facet);
});
(createWallGrid(array[3], array[0], height)).forEach(function (facet) {
    facets.push(facet);
});
var stlObj1 = {
    description: "testBuilding1",
    facets: facets
};
fs.writeFileSync("stlFiles/testBuildings1.stl", stl.fromObject(stlObj1));
