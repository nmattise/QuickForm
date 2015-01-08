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

function createHorPlaneUp(pt1, pt2, pt3, pt4, z) {
    var tri1 = [[pt1[0], pt1[1], z], [pt2[0], pt2[1], z], [pt3[0], pt3[1], z]],
        tri2 = [[pt1[0], pt1[1], z], [pt3[0], pt3[1], z], [pt4[0], pt4[1], z]],
        facets = [{
            verts: tri1
    }, {
            verts: tri2
    }];
    return facets;
}

function createHorPlaneDn(pt1, pt2, pt3, pt4, z) {
    var tri1 = [[pt1[0], pt1[1], z], [pt2[0], pt2[1], z], [pt3[0], pt3[1], z]],
        tri2 = [[pt1[0], pt1[1], z], [pt3[0], pt3[1], z], [pt4[0], pt4[1], z]],
        facets = [{
            verts: tri1.reverse()
    }, {
            verts: tri2.reverse()
    }];
    return facets;
}

function createRectRoofFloor(point1, point2, point4, height) {
    //point 1 is 0 in rect arry of length 4, others follow path #
    var sideLength12, sideLength14, deltaX, deltaY, deltaX14, deltaY14, xIt14, yIt14, xIt, yIt, iterator, pt1, pt2, pt3, pt4, i, z, triRoof, triFloor, facets, gridLength, gridLength14;

    facets = [];
    sideLength12 = distanceFormula(point1[0], point1[1], point2[0], point2[1]);
    sideLength14 = distanceFormula(point1[0], point1[1], point4[0], point4[1]);
    deltaX = point2[0] - point1[0];
    deltaY = point2[1] - point1[1];
    gridLength = sideLength12 / parseInt(sideLength12);
    xIt = deltaX / parseInt(sideLength12);
    yIt = deltaY / parseInt(sideLength12);
    deltaX14 = point1[0] - point4[0];
    deltaY14 = point1[1] - point4[1];
    xIt14 = deltaX14 / parseInt(sideLength14);
    yIt14 = deltaY14 / parseInt(sideLength14);
    gridLength14 = sideLength14 / parseInt(sideLength14);
    console.log(sideLength14);
    console.log(gridLength14);
    console.log(xIt14);
    console.log(yIt14);
    for (i = 0; i < sideLength12 - 1; i++) {
        pt1 = [point1[0] + (xIt * i), point1[1] + (yIt * i)];
        pt2 = [point1[0] + (xIt * (i + 1)), point1[1] + (yIt * (i + 1))];
        pt3 = [point1[0] + (xIt * (i + 1)), point1[1] + (yIt * (i + 1))];
        pt4 = [point1[0] + (xIt * i), point1[1] + (yIt * i)];
        for (z = 0; z < sideLength14 - 1; z++) {
            var pt1_2 = [],
                pt2_2 = [],
                pt3_2 = [],
                pt4_2 = [];
            pt1_2[0] = pt1[0] - (xIt * z);
            pt1_2[1] = pt1[1] - (yIt14 * z);
            pt2_2[0] = pt2[0] - (xIt * z);
            pt2_2[1] = pt2[1] - (yIt14 * z);
            pt3_2[0] = pt2[0] - (xIt * (z + 1));
            pt3_2[1] = pt2[1] - (yIt14 * (z + 1));
            pt4_2[0] = pt1[0] - (xIt * (z + 1));
            pt4_2[1] = pt1[1] - (yIt14 * (z + 1));
            console.log("pt1: " + pt1_2 + "  ,  pt2: " + pt2_2);
            triFloor = createHorPlaneDn(pt1_2, pt2_2, pt3_2, pt4_2, 0);
            facets.push(triFloor[0]);
            facets.push(triFloor[1]);
            triRoof = createHorPlaneUp(pt1_2, pt2_2, pt3_2, pt4_2, height);
            facets.push(triRoof[0]);
            facets.push(triRoof[1]);
        }
    }
    return facets;
}

function createWallGrid(point1, point2, height) {
    var sideLength, deltaX, deltaY, gridLength, xIt, yIt, iterator, pt1, pt2, i, z, zGrid, zIt, tri, facets, z1, z2;
    facets = [];
    sideLength = distanceFormula(point1[0], point1[1], point2[0], point2[1]);
    deltaX = point2[0] - point1[0];
    deltaY = point2[1] - point1[1];
    gridLength = sideLength / parseInt(sideLength);
    xIt = deltaX / parseInt(sideLength);
    yIt = deltaY / parseInt(sideLength);
    iterator = parseInt(sideLength);
    zGrid = Math.abs(parseInt(height));
    zIt = height / zGrid;
    for (i = 0; i < sideLength; i++) {
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

array = [[-10, -10],
    [10, -10],
    [10, 10],
    [-10, 10]];
height = 10;

createRectRoofFloor(array[0], array[1], array[3], height).forEach(function (facet) {
    facets.push(facet);
});

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
