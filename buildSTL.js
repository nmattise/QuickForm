'use strict';
//Dependencies
var fs = require('fs'),
    stl = require('stl');
//Export Function
module.exports.buildSTL = buildSTL;

//Average Function
function average(pt1, pt2) {
        return (pt1 + pt2) / 2;
    }
    //Latitude and Longitude to Cartesian
Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
};
Number.prototype.toDegrees = function() {
    return this * 180 / Math.PI;
};

//Prototype to find side length of array of points
Array.prototype.findLengths = function() {
    var sideLengths = [];
    for (var i = 1; i < this.length; i++) {
        var d = distanceFormula(this[i - 1][0], this[i - 1][1], this[i][0], this[i][1]);
        sideLengths.push(Math.round(d * 100) / 100);
    }
    var d = distanceFormula(this[this.length - 1][0], this[this.length - 1][1], this[0][0], this[0][1]);
    sideLengths.push(d);
    return sideLengths;
}

function distanceFormula(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

function polygonArea(X, Y, numPoints) {
    area = 0; // Accumulates area in the loop
    j = numPoints - 1; // The last vertex is the 'previous' one to the first

    for (i = 0; i < numPoints; i++) {
        area = area + (X[j] + X[i]) * (Y[j] - Y[i]);
        j = i; //j is previous vertex to i
    }
    return area / 2;
}

//Create Lat/Lng object
function latLon(lat, lng) {
        this.latitude = Number(lat);
        this.longitude = Number(lng);
    }
    //Latitude and Longitude to X,Y Coord
latLon.prototype.coordinatesTo = function(point) {
    var radius = 6371;
    var phi1 = this.latitude.toRadians(),
        lambda1 = this.longitude.toRadians(),
        phi2 = point.latitude.toRadians(),
        lambda2 = point.longitude.toRadians();
    var deltaPhi = phi2 - phi1,
        deltaLambda = lambda2 - lambda1;

    var a = Math.pow(Math.sin(deltaPhi / 2), 2) + Math.cos(phi1) * Math.cos(phi2) * Math.pow(Math.sin(deltaLambda / 2), 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = radius * c * 1000;

    var x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda),
        y = Math.sin(deltaLambda) * Math.cos(phi2);
    var theta = Math.atan2(y, x);
    var X = d * Math.sin(theta),
        Y = d * Math.cos(theta);
    return [X, Y];
}

//Coordinates from Basic Lat/lng point to Lat/Lng
latLon.prototype.destinationPoint = function(X, Y) {
    var radius = 6371;
    var brng = Math.atan(X / Y),
        dist = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
    var theta = Number(brng).toRadians();
    var delta = Number(dist) / radius; // angular distance in radians

    var phi1 = this.latitude.toRadians();
    var lambda1 = this.longitude.toRadians();

    var phi2 = Math.asin(Math.sin(phi1) * Math.cos(delta) +
        Math.cos(phi1) * Math.sin(delta) * Math.cos(theta));
    var lambda2 = lambda1 + Math.atan2(Math.sin(theta) * Math.sin(delta) * Math.cos(phi1),
        Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2));
    lambda2 = (lambda2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI; // normalise to -180..+180º

    return new latLon(phi2.toDegrees(), lambda2.toDegrees());
}

//Adjust Rectangle
function rotatePoint(startPoint, point, theta) {
    var rotatedPoint, x1, y1;
    var x0 = startPoint[0],
        y0 = startPoint[1],
        x = point[0],
        y = point[1];
    x1 = x0 + (x - x0) * Math.cos(theta) + (y - y0) * Math.sin(theta);
    y1 = y0 - (x - x0) * Math.sin(theta) + (y - y0) * Math.cos(theta);
    rotatedPoint = [x1, y1];
    return rotatedPoint;
}

function findRotation(pt1, pt2) {
    var deltaX, deltaY, theta;
    deltaX = pt2[0] - pt1[0];
    deltaY = pt2[1] - pt1[1];
    theta = Math.atan2(deltaY, deltaX);
    return theta
}

//STL Format Creation

function createVertPlane(pt1, pt2, z1, z2, material) {
    var tri1, tri2, facets;
    tri1 = [
        [pt1[0], pt1[1], z1],
        [pt2[0], pt2[1], z2],
        [pt2[0], pt2[1], z1]

    ];
    tri2 = [
        [pt1[0], pt1[1], z1],
        [pt1[0], pt1[1], z2],
        [pt2[0], pt2[1], z2]
    ];
    facets = [{
        verts: tri1,
        material: material
    }, {
        verts: tri2,
        material: material
    }];
    return facets;
}

function createHorPlaneUp(pt1, pt2, pt3, pt4, z) {
    var tri1 = [
            [pt1[0], pt1[1], z],
            [pt3[0], pt3[1], z],
            [pt2[0], pt2[1], z]
        ],
        tri2 = [
            [pt1[0], pt1[1], z],
            [pt4[0], pt4[1], z],
            [pt3[0], pt3[1], z]
        ],
        facets = [{
            verts: tri1
        }, {
            verts: tri2
        }];
    return facets;
}

function createHorPlaneDn(pt1, pt2, pt3, pt4, z) {
    var tri1 = [
            [pt2[0], pt2[1], z],
            [pt3[0], pt3[1], z],
            [pt1[0], pt1[1], z]
        ],
        tri2 = [
            [pt3[0], pt3[1], z],
            [pt4[0], pt4[1], z],
            [pt1[0], pt1[1], z]
        ],
        facets = [{
            verts: tri1
        }, {
            verts: tri2
        }];
    return facets;
}

function createRotateRoof(point1, point2, point4, gridSize, height) {
    var sideLength12, sideLength14, deltaX, deltaY, deltaX14, deltaY14, xIt14, yIt14, xIt, yIt, iterator12, iterator14, pt1, pt2, pt3, pt4, i, z, triRoof, triFloor, facets, gridLength, gridLength14, pt1_1;
    facets = [];
    sideLength12 = distanceFormula(point1[0], point1[1], point2[0], point2[1]);
    sideLength14 = distanceFormula(point1[0], point1[1], point4[0], point4[1]);
    deltaX = point2[0] - point1[0];
    deltaY = point2[1] - point1[1];
    gridLength = ((sideLength12 % gridSize) / (parseInt(sideLength12 / gridSize))) + gridSize;
    xIt = deltaX / parseInt(sideLength12 / gridSize);
    yIt = deltaY / parseInt(sideLength12 / gridSize);
    //Infinity Check
    if (!isFinite(xIt)) xIt = 0;
    if (!isFinite(yIt)) yIt = 0;
    iterator12 = parseInt(sideLength12 / gridSize);
    deltaX14 = point1[0] - point4[0];
    deltaY14 = point1[1] - point4[1];
    xIt14 = deltaX14 / parseInt(sideLength14 / gridSize);
    yIt14 = deltaY14 / parseInt(sideLength14 / gridSize);
    //Infinity Check
    if (!isFinite(xIt14)) xIt14 = 0;
    if (!isFinite(yIt14)) yIt14 = 0;
    iterator14 = parseInt(sideLength14 / gridSize);
    gridLength14 = ((sideLength14 % gridSize) / (parseInt(sideLength14 / gridSize))) + gridSize;
    //Rotation
    var theta = findRotation(point1, point2);
    for (var j = 0; j < iterator14; j++) {
        pt1 = [point1[0] - (xIt14 * j), point1[1] - (yIt14 * j)];
        for (i = 0; i < iterator12; i++) {
            pt1_1 = [pt1[0] + (xIt * i), pt1[1] + (yIt * i)];
            pt2 = [pt1_1[0] + gridLength, pt1_1[1]];
            pt3 = [pt2[0], pt2[1] + gridLength14];
            pt4 = [pt1_1[0], pt1_1[1] + gridLength14];
            //Points
            var pt1_14 = rotatePoint(pt1_1, pt1_1, theta);
            var pt2_14 = rotatePoint(pt1_1, pt2, theta);
            var pt3_14 = rotatePoint(pt1_1, pt3, theta);
            var pt4_14 = rotatePoint(pt1_1, pt4, theta);
            //Roof
            triRoof = createHorPlaneUp(pt1_14, pt2_14, pt3_14, pt4_14, height);
            facets.push(triRoof[0]);
            facets.push(triRoof[1]);
            //Floor
            triFloor = createHorPlaneDn(pt1_14, pt2_14, pt3_14, pt4_14, 0);
            facets.push(triFloor[0]);
            facets.push(triFloor[1]);
        }
    }
    return facets;
}

function createRoofFloor(pt0, pt1, pt3, gridSize, height, roofMaterial) {
    var l0, l3, gridLength0, deltaX0, deltaY0, xIt0, yIt0, iterator0, deltaX3, deltaY3, xIt3, yIt3, iterator3, gridLength3, theta0, theta3, triFloor, triRoof, facets = [];
    //Lengths of Square
    l0 = distanceFormula(pt0[0], pt0[1], pt1[0], pt1[1]);
    l3 = distanceFormula(pt0[0], pt0[1], pt3[0], pt3[1]);
    //GridLength & Iterators for Side 0
    gridLength0 = ((l0 % gridSize) / (parseInt(l0 / gridSize))) + gridSize;
    deltaX0 = pt1[0] - pt0[0];
    deltaY0 = pt1[1] - pt0[1];
    xIt0 = deltaX0 / parseInt(l0 / gridSize);
    yIt0 = deltaY0 / parseInt(l0 / gridSize);
    iterator0 = parseInt(l0 / gridSize);
    //Infinity Check
    if (!isFinite(xIt0)) xIt0 = 0;
    if (!isFinite(yIt0)) yIt0 = 0;
    //GridLength & Iterators for Side 3
    deltaX3 = pt0[0] - pt3[0];
    deltaY3 = pt0[1] - pt3[1];
    xIt3 = deltaX3 / parseInt(l3 / gridSize);
    yIt3 = deltaY3 / parseInt(l3 / gridSize);
    iterator3 = parseInt(l3 / gridSize);
    gridLength3 = ((l3 % gridSize) / (parseInt(l3 / gridSize))) + gridSize;
    //Infinity Check
    if (!isFinite(xIt3)) xIt3 = 0;
    if (!isFinite(yIt3)) yIt3 = 0;
    //Rotation
    theta0 = findRotation(pt0, pt1);
    theta3 = findRotation(pt0, pt3);
    //Loop Along side 3
    for (var j = 0; j < iterator3; j++) {
        var point0, point3;
        point0 = [pt0[0] + (gridLength3 * j * Math.cos(theta3)), pt0[1] + (gridLength3 * j * Math.sin(theta3))];
        point3 = [pt0[0] + (gridLength3 * (j + 1) * Math.cos(theta3)), pt0[1] + (gridLength3 * (j + 1) * Math.sin(theta3))];
        //Loop Along side 0
        for (var i = 0; i < iterator0; i++) {
            var point0_1, point3_1, point1, point2;
            point0_1 = [point0[0] + (gridLength0 * i * Math.cos(theta0)), point0[1] + (gridLength0 * i * Math.sin(theta0))];
            point1 = [point0[0] + (gridLength0 * (i + 1) * Math.cos(theta0)), point0[1] + (gridLength0 * (i + 1) * Math.sin(theta0))];
            point2 = [point3[0] + (gridLength0 * (i + 1) * Math.cos(theta0)), point3[1] + (gridLength0 * (i + 1) * Math.sin(theta0))];
            point3_1 = [point3[0] + (gridLength0 * i * Math.cos(theta0)), point3[1] + (gridLength0 * i * Math.sin(theta0))];
            //Roof
            triRoof = createHorPlaneUp(point0_1, point1, point2, point3_1, height);
            facets.push(triRoof[0]);
            facets.push(triRoof[1]);
            //Floor
            triFloor = createHorPlaneDn(point0_1, point1, point2, point3_1, 0);
            facets.push(triFloor[0]);
            facets.push(triFloor[1]);
        }
    }
    return facets;
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

function createWallMaterial(point1, point2, gridSize, height, floorHeight, floors, windowWallRatio, wallMaterial, windowMaterial) {
    var sideLength, deltaX, deltaY, gridLength, xIt, yIt, iterator, zIterator, pt1, pt2, i, z, zGrid, zIt, tri, tri1, tri2, facets, z0, z1, wH, w0, w1, w0Floor, w1Floor;
    //Window Dimensions
    wH = windowWallRatio * floorHeight;
    w0 = (floorHeight - wH) / 2;
    w1 = w0 + wH;
    //Create Facets
    facets = [];
    //Find the Length of the side, and the x and y iterations to creat the grid
    sideLength = distanceFormula(point1[0], point1[1], point2[0], point2[1]);
    gridLength = ((sideLength % gridSize) / (parseInt(sideLength / gridSize))) + gridSize;
    deltaX = point2[0] - point1[0];
    deltaY = point2[1] - point1[1];
    xIt = deltaX / parseInt(sideLength / gridSize);
    yIt = deltaY / parseInt(sideLength / gridSize);
    iterator = parseInt(sideLength / gridSize);
    //Infinity Check
    if (!isFinite(xIt)) xIt = 0;
    if (!isFinite(yIt)) yIt = 0;

    //Iterate Through Floors
    for (var t = 0; t < floors; t++) {
        //Floor Height
        z0 = t * floorHeight;
        z1 = z0 + floorHeight;
        //Window Height
        w0Floor = w0 + (t * floorHeight);
        w1Floor = w1 + (t * floorHeight);
        //Iterate Along wall
        for (i = 0; i < iterator; i++) {
            //Ground Points
            pt1 = [point1[0] + (xIt * i), point1[1] + (yIt * i)];
            pt2 = [point1[0] + (xIt * (i + 1)), point1[1] + (yIt * (i + 1))];
            //Create Plans for bottom wall, window, and top wall
            tri = createVertPlane(pt1, pt2, z0, w0Floor, wallMaterial);
            tri2 = createVertPlane(pt1, pt2, w0Floor, w1Floor, windowMaterial);
            tri1 = createVertPlane(pt1, pt2, w1Floor, z1, wallMaterial);
            //Push planes to facets
            facets.push(tri[0]);
            facets.push(tri[1]);
            facets.push(tri2[0]);
            facets.push(tri2[1]);
            facets.push(tri1[0]);
            facets.push(tri1[1]);
        };
    };
    return facets;
}

function minMaxPoints(buildingPoints) {
    var minX, minY, maxX, maxY,
        xPts = [],
        yPts = [];
    buildingPoints.forEach(function(pt) {
        xPts.push(pt[0]);
        yPts.push(pt[1]);
    });
    minX = Math.min.apply(null, xPts);
    maxX = Math.max.apply(null, xPts);
    minY = Math.min.apply(null, yPts);
    maxY = Math.max.apply(null, yPts);
    return [minX, maxX, minY, maxY];
}

function createGroundGrid(xMin, xMax, yMin, yMax, step) {
    var xpt, ypt, pt1, pt2, pt3, pt4, tri, facets = [];
    for (xpt = xMin; xpt < xMax; xpt += step) {
        for (ypt = yMin; ypt < yMax; ypt += step) {
            pt1 = [xpt, ypt];
            pt2 = [xpt + step, ypt];
            pt3 = [xpt + step, ypt + step];
            pt4 = [xpt, ypt + step];
            tri = createHorPlaneUp(pt1, pt2, pt3, pt4, 0);
            facets.push(tri[0]);
            facets.push(tri[1]);
        }
    }
    return facets;
}


function createGround(innerBounds) {
    var boundDistances = [],
        gridSizes = [],
        smallGridBound = [],
        mediumGridBound = [],
        largeGridBound = [],
        groundSTL = '',
        innerStart,
        smallStart,
        mediumStart,
        largeStart,
        xpt,
        ypt,
        pt1,
        pt2,
        pt3,
        pt4,
        tri,
        facets = [];
    boundDistances = [2, 5, 10];
    gridSizes = [5, 10, 20];
    var i = 0;
    innerBounds.forEach(function(point) {
        point[0] = 10 * Math.round(point[0] / 10);
        point[1] = 10 * Math.round(point[1] / 10);
        smallGridBound.push([point[0] * boundDistances[0], point[1] * boundDistances[0]]);
        mediumGridBound.push([point[0] * boundDistances[1], point[1] * boundDistances[1]]);
        largeGridBound.push([point[0] * boundDistances[2], point[1] * boundDistances[2]]);
        i++;
    });
    //Inner Grid
    createGroundGrid(innerBounds[0][0], innerBounds[1][0], innerBounds[0][1], innerBounds[2][1], 1).forEach(function(facet) {
        facets.push(facet);
    });

    //Small Grid
    createGroundGrid(smallGridBound[0][0], innerBounds[0][0], smallGridBound[0][1], smallGridBound[2][1], gridSizes[0]).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(innerBounds[1][0], smallGridBound[1][0], smallGridBound[0][1], smallGridBound[2][1], gridSizes[0]).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(innerBounds[0][0], innerBounds[1][0], smallGridBound[0][1], innerBounds[1][1], gridSizes[0]).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(innerBounds[3][0], innerBounds[2][0], innerBounds[3][1], smallGridBound[2][1], gridSizes[0]).forEach(function(facet) {
        facets.push(facet);
    });

    //Medium Grid
    createGroundGrid(mediumGridBound[0][0], smallGridBound[0][0], mediumGridBound[0][1], mediumGridBound[2][1], gridSizes[1]).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(smallGridBound[1][0], mediumGridBound[1][0], mediumGridBound[0][1], mediumGridBound[2][1], gridSizes[1]).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(smallGridBound[0][0], smallGridBound[1][0], mediumGridBound[0][1], smallGridBound[1][1], gridSizes[1]).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(smallGridBound[3][0], smallGridBound[2][0], smallGridBound[3][1], mediumGridBound[2][1], gridSizes[1]).forEach(function(facet) {
        facets.push(facet);
    });
    //Medium Grid
    createGroundGrid(largeGridBound[0][0], mediumGridBound[0][0], largeGridBound[0][1], largeGridBound[2][1], gridSizes[2]).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(mediumGridBound[1][0], largeGridBound[1][0], largeGridBound[0][1], largeGridBound[2][1], gridSizes[2]).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(mediumGridBound[0][0], mediumGridBound[1][0], largeGridBound[0][1], mediumGridBound[1][1], gridSizes[2]).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(mediumGridBound[3][0], mediumGridBound[2][0], mediumGridBound[3][1], largeGridBound[2][1], gridSizes[2]).forEach(function(facet) {
        facets.push(facet);
    });
    return facets;
}

function orthPoints(pt1, pt2, l) {
    var dx, dy, dist, point;
    dist = distanceFormula(pt1[0], pt1[1], pt2[0], pt2[1]);
    dx = (pt2[0] - pt1[0]) / 2;
    dx = (pt2[1] - pt1[1]) / 2;
    point = [l * dx, l * dy];
    return point;
}

//Final Function
function buildSTL(buildings) {
    //Initialize Variables
    var lat = 0,
        lng = 0,
        pathCount = 0,
        centerLat = 0,
        centerLng = 0,
        origin = 0,
        allBldgSTL = '',
        minXPts = [],
        maxXPts = [],
        minYPts = [],
        maxYPts = [],
        minX,
        maxX,
        minY,
        maxY,
        innerBounds = [],
        groundFacets = [],
        groundSTL,
        fileName = '';

    //Set Grid Size
    var gridSize = 5;
    //Find Center of Latitude and Longitude Points
    for (var i = 0; i < buildings.length; i++) {
        for (var j = 0; j < buildings[i].polygon.path.length; j++) {
            lat += buildings[i].polygon.path[j].latitude;
            lng += buildings[i].polygon.path[j].longitude;
            pathCount++;
        }
    }
    centerLat = lat / pathCount;
    centerLng = lng / pathCount;
    //Make Center Latitude and Longitude the Origin Point for LatLng
    origin = new latLon(centerLat, centerLng);
    //Go through Each Building

    for (var i = 0; i < buildings.length; i++) {
        var bldg = buildings[i];
        //Initialize Variables
        var points = [],
            averageSideLengths = [],
            adjustedPoints = [],
            adjustedLatLng = [],
            lengths = [],
            length,
            width,
            theta,
            facets = [],
            minMaxPts = [];
        //Add Building Name to File Name
        fileName += bldg.name + "_";
        //Set Grid Size
        //Get Cartesian Points from LatLng
        for (var j = 0; j < bldg.polygon.path.length; j++) {
            points.push(origin.coordinatesTo(new latLon(bldg.polygon.path[j].latitude, bldg.polygon.path[j].longitude)));
        }
        //Average and Adjust the Rectangle
        lengths = points.findLengths();
        //Find Rotation of the BUilding Shape
        theta = findRotation(points[0], points[1]);
        console.log("theta: " + theta);
        console.log(bldg.id);
        switch (bldg.bldgFootprint) {
            case 'rect':
                var l0 = (lengths[0] + lengths[2]) / 2,
                    l1 = (lengths[1] + lengths[3]) / 2,
                    pt0 = [points[0][0], points[0][1]],
                    pt1 = [pt0[0] + (l0 * Math.cos(theta)), pt0[1] + l0 * Math.sin(theta)],
                    pt2 = [pt1[0] + l1 * Math.cos(theta - Math.PI / 2), pt1[1] + l1 * Math.sin(theta - Math.PI / 2)],
                    pt3 = [pt2[0] + l0 * -Math.cos(theta), pt2[1] + l0 * -Math.sin(theta)];

                var orthRect = [pt0, pt1, pt2, pt3];
                bldg.adjustedPoints = orthRect;

                //Create Grids for STL Creation
                //Walls
                for (var j = 1; j < orthRect.length; j++) {
                    createWallMaterial(orthRect[j - 1], orthRect[j], gridSize, bldg.height, bldg.flrToFlrHeight, bldg.numFloors, ".33", "brick", "glass").forEach(function(facet) {
                        facets.push(facet);
                    });
                }
                createWallMaterial(orthRect[3], orthRect[0], gridSize, bldg.height, bldg.flrToFlrHeight, bldg.numFloors, ".33", "brick", "glass").forEach(function(facet) {
                    facets.push(facet);
                });

                //Roof and Floor
                createRoofFloor(orthRect[0], orthRect[1], orthRect[3], gridSize, bldg.height).forEach(function(facet) {
                    facets.push(facet);
                });
                break;
            case 'l':
                console.log(lengths);
                //Average 1 & 3+5
                var l4 = (lengths[4] + (lengths[0] + lengths[2])) / 2,
                    l0 = l4 * (lengths[0] / (lengths[0] + lengths[2])),
                    l2 = l4 * (lengths[2] / (lengths[0] + lengths[2]));
                //Average 6 & 2+4
                var l5 = (lengths[5] + (lengths[1] + lengths[3])) / 2;
                var l3 = l5 * (lengths[3] / (lengths[1] + lengths[3])),
                    l1 = l5 * (lengths[1] / (lengths[1] + lengths[3]));

                var pt0 = [points[0][0], points[0][1]],
                    pt1 = [pt0[0] + (l0 * Math.cos(theta)), pt0[1] + l0 * Math.sin(theta)],
                    pt2 = [pt1[0] + l1 * Math.cos(theta - Math.PI / 2), pt1[1] + l1 * Math.sin(theta - Math.PI / 2)],
                    pt3 = [pt2[0] + (l2 * Math.cos(theta)), pt2[1] + l2 * Math.sin(theta)],
                    pt4 = [pt3[0] + l3 * Math.cos(theta - Math.PI / 2), pt3[1] + l3 * Math.sin(theta - Math.PI / 2)],
                    pt5 = [pt4[0] + l4 * -Math.cos(theta), pt4[1] + l4 * -Math.sin(theta)];

                var orthL = [pt0, pt1, pt2, pt3, pt4, pt5];
                bldg.adjustedPoints = orthL;

                //Add Walls
                for (var j = 1; j < orthL.length; j++) {
                    createWallMaterial(orthL[j - 1], orthL[j], gridSize, bldg.height, bldg.flrToFlrHeight, bldg.numFloors, ".33", "brick", "galss").forEach(function(facet) {
                        facets.push(facet)
                    })
                };
                createWallMaterial(orthL[5], orthL[0], gridSize, bldg.height, bldg.flrToFlrHeight, bldg.numFloors, ".33", "brick", "glass").forEach(function(facet) {
                    facets.push(facet)
                });

                //Roof and Floor
                var dx = (orthL[5][0] - orthL[0][0]) / l5,
                    dy = (orthL[5][1] - orthL[0][1]) / l5,
                    pt7 = [(dx * l1) + orthL[0][0], (dy * l1) + orthL[0][1]];
                createRoofFloor(orthL[0], orthL[1], pt7, gridSize, bldg.height).forEach(function(facet) {
                    facets.push(facet);
                });
                createRoofFloor(pt7, orthL[3], orthL[5], gridSize, bldg.height).forEach(function(facet) {
                    facets.push(facet);
                });


                break;
            case "t":
                var l0 = (lengths[0] + (lengths[2] + lengths[4] + lengths[6])) / 2,
                    l1 = (lengths[1] + lengths[1]) / 2,
                    l2 = l0 * (lengths[2] / (lengths[2] + lengths[4] + lengths[6])),
                    l3 = (lengths[3] + lengths[5]) / 2,
                    l4 = l0 * (lengths[4] / (lengths[2] + lengths[4] + lengths[6])),
                    l5 = l3,
                    l6 = l0 * (lengths[6] / (lengths[2] + lengths[4] + lengths[6])),
                    l7 = l1;

                var pt0 = [points[0][0], points[0][1]],
                    pt1 = [pt0[0] + (l0 * Math.cos(theta)), pt0[1] + l0 * Math.sin(theta)],
                    pt2 = [pt1[0] + l1 * Math.cos(theta - Math.PI / 2), pt1[1] + l1 * Math.sin(theta - Math.PI / 2)],
                    pt3 = [pt2[0] + l2 * -Math.cos(theta), pt2[1] + l2 * -Math.sin(theta)],
                    pt4 = [pt3[0] + l3 * Math.cos(theta - Math.PI / 2), pt3[1] + l3 * Math.sin(theta - Math.PI / 2)],
                    pt5 = [pt4[0] + l4 * -Math.cos(theta), pt4[1] + l4 * -Math.sin(theta)],
                    pt6 = [pt5[0] + l5 * -Math.cos(theta - Math.PI / 2), pt5[1] + l5 * -Math.sin(theta - Math.PI / 2)],
                    pt7 = [pt6[0] + l6 * -Math.cos(theta), pt6[1] + l6 * -Math.sin(theta)];

                var orthT = [pt0, pt1, pt2, pt3, pt4, pt5, pt6, pt7];
                bldg.adjustedPoints = orthT;
                //Add Walls
                for (var j = 1; j < orthT.length; j++) {
                    createWallMaterial(orthT[j - 1], orthT[j], gridSize, bldg.height, bldg.flrToFlrHeight, bldg.numFloors, ".33", "brick", "galss").forEach(function(facet) {
                        facets.push(facet)
                    })
                };
                createWallMaterial(orthT[7], orthT[0], gridSize, bldg.height, bldg.flrToFlrHeight, bldg.numFloors, ".33", "brick", "glass").forEach(function(facet) {
                    facets.push(facet)
                });
                //Roof
                createRoofFloor(orthT[0], orthT[1], orthT[7], gridSize, bldg.height).forEach(function(facet) {
                    facets.push(facet);
                });
                createRoofFloor(orthT[6], orthT[3], orthT[5], gridSize, bldg.height).forEach(function(facet) {
                    facets.push(facet);
                });

                break;
            case "u":
                var l0, l1, l2, l3, l4, l5, l6, l7, lu, orthU, pt0, pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt6_3, pt6_2;
                l6 = ((lengths[0] + lengths[2] + lengths[4]) + lengths[6]) / 2;
                l0 = l6 * (lengths[0] / (lengths[0] + lengths[2] + lengths[4]));
                l2 = l6 * (lengths[2] / (lengths[0] + lengths[2] + lengths[4]));
                l4 = l6 * (lengths[4] / (lengths[0] + lengths[2] + lengths[4]));
                lu = ((lengths[7] - lengths[1]) + (lengths[5] - lengths[3])) / 2;
                l1 = lengths[1];
                l3 = lengths[3];
                l5 = l3 + lu;
                l7 = l1 + lu;
                console.log(lu);
                console.log(points);

                pt0 = [points[0][0], points[0][1]];
                pt1 = [pt0[0] + (l0 * Math.cos(theta)), pt0[1] + l0 * Math.sin(theta)];
                pt2 = [pt1[0] + l1 * Math.cos(theta - Math.PI / 2), pt1[1] + l1 * Math.sin(theta - Math.PI / 2)];
                pt3 = [pt2[0] + (l2 * Math.cos(theta)), pt2[1] + l2 * Math.sin(theta)];
                pt4 = [pt3[0] + l3 * -Math.cos(theta - Math.PI / 2), pt3[1] + l3 * -Math.sin(theta - Math.PI / 2)];
                pt5 = [pt4[0] + (l4 * Math.cos(theta)), pt4[1] + l4 * Math.sin(theta)];
                pt6 = [pt5[0] + l5 * Math.cos(theta - Math.PI / 2), pt5[1] + l5 * Math.sin(theta - Math.PI / 2)];
                pt6_3 = [pt6[0] + (l4) * -Math.cos(theta), pt6[1] + (l4) * -Math.sin(theta)];
                pt6_2 = [pt6[0] + (l4 + l2) * -Math.cos(theta), pt6[1] + (l4 + l2) * -Math.sin(theta)];
                pt7 = [pt6[0] + l6 * -Math.cos(theta), pt6[1] + l6 * -Math.sin(theta)];

                orthU = [pt0, pt1, pt2, pt3, pt4, pt5, pt6, pt7];
                bldg.adjustedPoints = orthU;
                //Add Walls
                for (var j = 1; j < orthU.length; j++) {
                    createWallMaterial(orthU[j - 1], orthU[j], gridSize, bldg.height, bldg.flrToFlrHeight, bldg.numFloors, ".33", "brick", "galss").forEach(function(facet) {
                        facets.push(facet)
                    });
                };
                createWallMaterial(orthU[7], orthU[0], gridSize, bldg.height, bldg.flrToFlrHeight, bldg.numFloors, ".33", "brick", "glass").forEach(function(facet) {
                    facets.push(facet)
                });

                //Roof
                createRoofFloor(orthU[0], orthU[1], orthU[7], gridSize, bldg.height).forEach(function(facet) {
                    facets.push(facet);
                });
                createRoofFloor(orthU[2], orthU[3], pt6_2, gridSize, bldg.height).forEach(function(facet) {
                    facets.push(facet);
                });
                createRoofFloor(orthU[4], orthU[5], pt6_3, gridSize, bldg.height).forEach(function(facet) {
                    facets.push(facet);
                });

                break;
            case "h":
                var l0, l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, lH, orthH, pt0, pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9, pt10, pt11;

                l0 = (lengths[0] + lengths[10]) / 2;
                l10 = l0;
                l4 = (lengths[4] + lengths[6]) / 2;
                l6 = l4;
                l2 = (lengths[2] + lengths[8]) / 2;
                l8 = l2;
                lH = ((lengths[11] - lengths[1] - lengths[9]) + (lengths[5] - lengths[3] - lengths[7])) / 2;
                l1 = lengths[1];
                l3 = lengths[3];
                l7 = lengths[7];
                l9 = lengths[9];
                l5 = lH + l3 + l7;
                l11 = l1 + lH + l9;

                pt0 = [points[0][0], points[0][1]];
                pt1 = [pt0[0] + (l0 * Math.cos(theta)), pt0[1] + l0 * Math.sin(theta)];
                pt2 = [pt1[0] + l1 * Math.cos(theta - Math.PI / 2), pt1[1] + l1 * Math.sin(theta - Math.PI / 2)];
                pt3 = [pt2[0] + (l2 * Math.cos(theta)), pt2[1] + l2 * Math.sin(theta)];
                pt4 = [pt3[0] + l3 * -Math.cos(theta - Math.PI / 2), pt3[1] + l3 * -Math.sin(theta - Math.PI / 2)];
                pt5 = [pt4[0] + (l4 * Math.cos(theta)), pt4[1] + l4 * Math.sin(theta)];
                pt6 = [pt5[0] + l5 * Math.cos(theta - Math.PI / 2), pt5[1] + l5 * Math.sin(theta - Math.PI / 2)];
                pt7 = [pt6[0] + l6 * -Math.cos(theta), pt6[1] + l6 * -Math.sin(theta)];
                pt8 = [pt7[0] + l7 * -Math.cos(theta - Math.PI / 2), pt7[1] + l7 * -Math.sin(theta - Math.PI / 2)];
                pt9 = [pt8[0] + l8 * -Math.cos(theta), pt8[1] + l8 * -Math.sin(theta)];
                pt10 = [pt9[0] + l9 * Math.cos(theta - Math.PI / 2), pt9[1] + l9 * Math.sin(theta - Math.PI / 2)];
                pt11 = [pt10[0] + l10 * -Math.cos(theta), pt10[1] + l10 * -Math.sin(theta)];

                orthH = [pt0, pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9, pt10, pt11];
                bldg.adjustedPoints = orthH;
                //Add Walls
                for (var j = 1; j < orthH.length; j++) {
                    createWallMaterial(orthH[j - 1], orthH[j], gridSize, bldg.height, bldg.flrToFlrHeight, bldg.numFloors, ".33", "brick", "galss").forEach(function(facet) {
                        facets.push(facet)
                    });
                };
                createWallMaterial(orthH[11], orthH[0], gridSize, bldg.height, bldg.flrToFlrHeight, bldg.numFloors, ".33", "brick", "glass").forEach(function(facet) {
                    facets.push(facet)
                });

                //Roof & Floor
                createRoofFloor(orthH[0], orthH[1], orthH[11], gridSize, bldg.height).forEach(function(facet) {
                    facets.push(facet);
                });
                createRoofFloor(orthH[2], orthH[3], orthH[9], gridSize, bldg.height).forEach(function(facet) {
                    facets.push(facet);
                });
                createRoofFloor(orthH[4], orthH[5], orthH[7], gridSize, bldg.height).forEach(function(facet) {
                    facets.push(facet);
                });

                break;
            case "cross":
                var l0, l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, orthCross, pt0, pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9, pt10, pt11;

                var topLength = lengths[10] + lengths[0] + lengths[2],
                    rightLength = lengths[1] + lengths[3] + lengths[5],
                    bottomLength = lengths[4] + lengths[6] + lengths[8],
                    leftLength = lengths[7] + lengths[9] + lengths[11];

                l0 = topLength * (lengths[0] / topLength);
                l1 = rightLength * (lengths[1] / topLength);
                l2 = topLength * (lengths[2] / topLength);
                l3 = rightLength * (lengths[3] / topLength);
                l4 = bottomLength * (lengths[4] / topLength);
                l5 = rightLength * (lengths[5] / topLength);
                l6 = bottomLength * (lengths[6] / topLength);
                l7 = leftLength * (lengths[7] / topLength);
                l8 = bottomLength * (lengths[8] / topLength);
                l9 = leftLength * (lengths[9] / topLength);
                l10 = topLength * (lengths[10] / topLength);
                l11 = leftLength * (lengths[11] / topLength);

                pt0 = [points[0][0], points[0][1]];
                pt1 = [pt0[0] + (l0 * Math.cos(theta)), pt0[1] + l0 * Math.sin(theta)];
                pt2 = [pt1[0] + l1 * Math.cos(theta - Math.PI / 2), pt1[1] + l1 * Math.sin(theta - Math.PI / 2)];
                pt3 = [pt2[0] + (l2 * Math.cos(theta)), pt2[1] + l2 * Math.sin(theta)];
                pt4 = [pt3[0] + l3 * Math.cos(theta - Math.PI / 2), pt3[1] + l3 * Math.sin(theta - Math.PI / 2)];
                pt5 = [pt4[0] + l4 * -Math.cos(theta), pt4[1] + l4 * -Math.sin(theta)];
                pt6 = [pt5[0] + l5 * Math.cos(theta - Math.PI / 2), pt5[1] + l5 * Math.sin(theta - Math.PI / 2)];
                pt7 = [pt6[0] + l6 * -Math.cos(theta), pt6[1] + l6 * -Math.sin(theta)];
                pt8 = [pt7[0] + l7 * -Math.cos(theta - Math.PI / 2), pt7[1] + l7 * -Math.sin(theta - Math.PI / 2)];
                pt9 = [pt8[0] + l8 * -Math.cos(theta), pt8[1] + l8 * -Math.sin(theta)];
                pt10 = [pt9[0] + l9 * -Math.cos(theta - Math.PI / 2), pt9[1] + l9 * -Math.sin(theta - Math.PI / 2)];
                pt11 = [pt10[0] + (l10 * Math.cos(theta)), pt10[1] + l10 * Math.sin(theta)];

                orthCross = [pt0, pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9, pt10, pt11];
                bldg.adjustedPoints = orthCross;
                //Add Walls
                for (var j = 1; j < orthCross.length; j++) {
                    createWallMaterial(orthCross[j - 1], orthCross[j], gridSize, bldg.height, bldg.flrToFlrHeight, bldg.numFloors, ".33", "brick", "galss").forEach(function(facet) {
                        facets.push(facet)
                    });
                };
                createWallMaterial(orthCross[11], orthCross[0], gridSize, bldg.height, bldg.flrToFlrHeight, bldg.numFloors, ".33", "brick", "glass").forEach(function(facet) {
                    facets.push(facet)
                });

                //Roof & Walls
                createRoofFloor(orthCross[10], orthCross[11], orthCross[9], gridSize, bldg.height).forEach(function(facet) {
                    facets.push(facet);
                });
                createRoofFloor(orthCross[0], orthCross[1], orthCross[7], gridSize, bldg.height).forEach(function(facet) {
                    facets.push(facet);
                });
                createRoofFloor(orthCross[2], orthCross[3], orthCross[4], gridSize, bldg.height).forEach(function(facet) {
                    facets.push(facet);
                });

                break;

                /*case "trap":
                    break;
                case "triangle":
                    break;*/
        }
        var stlObj = {
            description: bldg.name,
            facets: facets
        };
        allBldgSTL += stl.fromObject(stlObj) + "\n";

        //Ground Stats for This Building
        minMaxPts = minMaxPoints(bldg.adjustedPoints);
        minXPts.push(minMaxPts[0]);
        maxXPts.push(minMaxPts[1]);
        minYPts.push(minMaxPts[2]);
        maxYPts.push(minMaxPts[3]);
    }
    //Create Gound STL
    //Find Min and Max X&Y of building location points
    minX = Math.min.apply(null, minXPts);
    maxX = Math.max.apply(null, maxXPts);
    minY = Math.min.apply(null, minYPts);
    maxY = Math.max.apply(null, maxYPts);
    //Round these min and max points to next integer
    minX = parseInt(minX - 1);
    maxX = parseInt(maxX + 1);
    minY = parseInt(minY - 1);
    maxY = parseInt(maxY + 1);
    //Create innerBounds of the Ground STL
    innerBounds = [
        [minX, minY],
        [maxX, minY],
        [maxX, maxY],
        [minX, maxY]
    ];
    //Call CreateGound
    groundFacets = createGround(innerBounds);
    //Create GroundSTL
    groundSTL = {
        description: "groundSTL",
        facets: groundFacets
    };

    //Write Files
    //Write Ground STL File for All Buildings

    fs.writeFileSync("stlFiles/" + fileName + "Ground.stl", stl.fromObject(groundSTL));
    //Write All Buildings in One STL File
    fs.writeFileSync("stlFiles/" + fileName + ".stl", allBldgSTL);
}
