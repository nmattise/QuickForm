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
    theta = Math.atan(deltaX / deltaY);
    return theta
}

//STL Format Creation

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

function createHorPlaneUp(pt1, pt2, pt3, pt4, z) {
    var tri1 = [
            [pt1[0], pt1[1], z],
            [pt2[0], pt2[1], z],
            [pt3[0], pt3[1], z]
        ],
        tri2 = [
            [pt1[0], pt1[1], z],
            [pt3[0], pt3[1], z],
            [pt4[0], pt4[1], z]
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
            [pt1[0], pt1[1], z],
            [pt2[0], pt2[1], z],
            [pt3[0], pt3[1], z]
        ],
        tri2 = [
            [pt1[0], pt1[1], z],
            [pt3[0], pt3[1], z],
            [pt4[0], pt4[1], z]
        ],
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
    for (i = 0; i <= sideLength12 - 1; i++) {
        pt1 = [point1[0] + (xIt * i), point1[1] + (yIt * i)];
        pt2 = [point1[0] + (xIt * (i + 1)), point1[1] + (yIt * (i + 1))];


        for (z = 0; z <= sideLength14 - 1; z++) {
            var pt1_14 = [pt1[0] - (xIt14 * z), pt1[1] - (yIt14 * z)];
            var pt2_14 = [pt2[0] - (xIt14 * (z + 1)), pt2[1] - (yIt14 * z)];
            var pt3_14 = [pt2[0] - (xIt14 * (z + 1)), pt2[1] - (yIt14 * (z + 1))];
            var pt4_14 = [pt1[0] - (xIt14 * z), pt1[1] - (yIt14 * (z + 1))];

            triRoof = createHorPlaneUp(pt1_14, pt2_14, pt3_14, pt4_14, height);

            facets.push(triRoof[0]);
            facets.push(triRoof[1]);
            triFloor = createHorPlaneDn(pt1_14, pt2_14, pt3_14, pt4_14, 0);
            facets.push(triFloor[0]);
            facets.push(triFloor[1]);
        }
    }

    return facets;
}

function createRotateRoof(point1, point2, point4, height) {
    var sideLength12, sideLength14, deltaX, deltaY, deltaX14, deltaY14, xIt14, yIt14, xIt, yIt, iterator, pt1, pt2, pt3, pt4, i, z, triRoof, triFloor, facets, gridLength, gridLength14, pt1_1;
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
    //Rotation
    var theta = findRotation(point1, point2) - Math.PI / 2;
    for (var j = 0; j <= sideLength14 - 1; j++) {
        pt1 = [point1[0] - (xIt14 * j), point1[1] - (yIt14 * j)];
        for (i = 0; i <= sideLength12 - 1; i++) {
            pt1_1 = [pt1[0] + (xIt * i), pt1[1] + (yIt * i)];
            pt2 = [pt1_1[0] + gridLength, pt1_1[1]];
            pt3 = [pt2[0], pt2[1] + gridLength14];
            pt4 = [pt1_1[0], pt1_1[1] + gridLength14];
            var pt1_14 = rotatePoint(pt1_1, pt1_1, theta);
            var pt2_14 = rotatePoint(pt1_1, pt2, theta);
            var pt3_14 = rotatePoint(pt1_1, pt3, theta);
            var pt4_14 = rotatePoint(pt1_1, pt4, theta);
            triRoof = createHorPlaneUp(pt1_14, pt2_14, pt3_14, pt4_14, height);
            facets.push(triRoof[0]);
            facets.push(triRoof[1]);
            triFloor = createHorPlaneDn(pt1_14, pt2_14, pt3_14, pt4_14, 0);
            facets.push(triFloor[0]);
            facets.push(triFloor[1]);
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
    console.log("xIt: " + xIt);
    console.log("yIt: " + yIt);
    console.log("gridLength: " + gridLength);
    for (i = 0; i <= sideLength - 1; i++) {
        pt1 = [point1[0] + (xIt * i), point1[1] + (yIt * i)];
        pt2 = [point1[0] + (xIt * (i + 1)), point1[1] + (yIt * (i + 1))];
        //console.log("pt1: " + pt1 + "  ,  pt2: " + pt2)
        for (z = 0; z <= zGrid - 1; z++) {
            z1 = zIt * z;
            z2 = zIt * (z + 1);
            tri = createVertPlane(pt1, pt2, z1, z2);
            facets.push(tri[0]);
            facets.push(tri[1]);
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
    //Negative Check
    /*if (deltaX < 0) xIt = -xIt;
    if (deltaY < 0) yIt = -yIt;*/
    console.log("deltaX: " + deltaX);
    console.log("deltaY: " + deltaY);
    console.log("xIT: " + xIt);
    console.log("yIT: " + yIt);
    iterator = parseInt(sideLength / gridLength);
    console.log("gridLength: " + gridLength);
    console.log("sideLength: " + sideLength);
    console.log("iterator: " + iterator);
    zGrid = gridLength = ((height % gridSize) / (parseInt(height / gridSize))) + gridSize;
    zIt = height / parseInt(height / gridSize);
    zIterator = parseInt(height / zGrid);
    console.log("zGrid: " + zGrid);
    console.log("zIt: " + zIt + "\n--");
    for (i = 0; i <= iterator; i++) {
        pt1 = [point1[0] + (xIt * i), point1[1] + (yIt * i)];
        pt2 = [point1[0] + (xIt * (i + 1)), point1[1] + (yIt * (i + 1))];
        for (z = 0; z <= zIterator; z++) {
            z1 = zIt * z;
            z2 = zIt * (z + 1);
            tri = createVertPlane(pt1, pt2, z1, z2);
            facets.push(tri[0]);
            facets.push(tri[1]);
        }
    }
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
    var smallGridBound = [],
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
    smallGridBound = [
        [innerBounds[0][0] * 2, innerBounds[0][1] * 2],
        [innerBounds[1][0] * 2, innerBounds[1][1] * 2],
        [innerBounds[2][0] * 2, innerBounds[2][1] * 2],
        [innerBounds[3][0] * 2, innerBounds[3][1] * 2]
    ];
    mediumGridBound = [
        [innerBounds[0][0] * 5, innerBounds[0][1] * 5],
        [innerBounds[1][0] * 5, innerBounds[1][1] * 5],
        [innerBounds[2][0] * 5, innerBounds[2][1] * 5],
        [innerBounds[3][0] * 5, innerBounds[3][1] * 5]
    ];
    largeGridBound = [
        [innerBounds[0][0] * 10, innerBounds[0][1] * 10],
        [innerBounds[1][0] * 10, innerBounds[1][1] * 10],
        [innerBounds[2][0] * 10, innerBounds[2][1] * 10],
        [innerBounds[3][0] * 10, innerBounds[3][1] * 10]
    ];
    //Inner Grid
    createGroundGrid(innerBounds[0][0], innerBounds[1][0], innerBounds[0][1], innerBounds[2][1], 1).forEach(function(facet) {
        facets.push(facet);
    });

    //Small Grid
    createGroundGrid(smallGridBound[0][0], innerBounds[0][0], smallGridBound[0][1], smallGridBound[2][1], 2).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(innerBounds[1][0], smallGridBound[1][0], smallGridBound[0][1], smallGridBound[2][1], 2).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(innerBounds[0][0], innerBounds[1][0], smallGridBound[0][1], innerBounds[1][1], 2).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(innerBounds[3][0], innerBounds[2][0], innerBounds[3][1], smallGridBound[2][1], 2).forEach(function(facet) {
        facets.push(facet);
    });

    //Medium Grid
    createGroundGrid(mediumGridBound[0][0], smallGridBound[0][0], mediumGridBound[0][1], mediumGridBound[2][1], 5).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(smallGridBound[1][0], mediumGridBound[1][0], mediumGridBound[0][1], mediumGridBound[2][1], 5).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(smallGridBound[0][0], smallGridBound[1][0], mediumGridBound[0][1], smallGridBound[1][1], 5).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(smallGridBound[3][0], smallGridBound[2][0], smallGridBound[3][1], mediumGridBound[2][1], 5).forEach(function(facet) {
        facets.push(facet);
    });
    //Medium Grid
    createGroundGrid(largeGridBound[0][0], mediumGridBound[0][0], largeGridBound[0][1], largeGridBound[2][1], 10).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(mediumGridBound[1][0], largeGridBound[1][0], largeGridBound[0][1], largeGridBound[2][1], 10).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(mediumGridBound[0][0], mediumGridBound[1][0], largeGridBound[0][1], mediumGridBound[1][1], 10).forEach(function(facet) {
        facets.push(facet);
    });
    createGroundGrid(mediumGridBound[3][0], mediumGridBound[2][0], mediumGridBound[3][1], largeGridBound[2][1], 10).forEach(function(facet) {
        facets.push(facet);
    });
    return facets;
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
        groundSTL;

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
    //console.log("Center Lat " + centerLat);
    //console.log("Center Lng " + centerLng);

    //Make Center Latitude and Longitude the Origin Point for LatLng
    origin = new latLon(centerLat, centerLng);
    //Go through Each Building

    for (var i = 0; i < buildings.length; i++) {
        switch (buildings[i].bldgFootprint) {
            case 'rect':
                //Initialize Variables
                var points = [],
                    sideLengths,
                    averageSideLengths = [],
                    adjustedPoints = [],
                    adjustedLatLng = [],
                    sideLengths = [],
                    length,
                    width,
                    facets = [],
                    minMaxPts = [];
                console.log("___\n" + buildings[i].id);
                //console.log(buildings[i].polygon.path)
                //Get Cartesian Points from LatLng
                for (var j = 0; j < buildings[i].polygon.path.length; j++) {
                    points.push(origin.coordinatesTo(new latLon(buildings[i].polygon.path[j].latitude, buildings[i].polygon.path[j].longitude)));
                }
                //Average and Adjust the Rectangle
                var lengths = points.findLengths();
                var avergeLengths = [(lengths[0] + lengths[2]) / 2, (lengths[1] + lengths[3]) / 2];
                var theta = findRotation(points[0], points[1]);
                var orthRect = [
                    [points[0][0], points[0][1]],
                    [points[0][0] + avergeLengths[0], points[0][1]],
                    [points[0][0] + avergeLengths[0], points[0][1] + avergeLengths[1]],
                    [points[0][0], points[0][1] + avergeLengths[1]]
                ];
                var rotatedRect = [];
                orthRect.forEach(function(point) {
                    var rotatedPoint = rotatePoint(orthRect[0], point, theta - (Math.PI / 2));
                    rotatedRect.push(rotatedPoint);
                });
                adjustedPoints = rotatedRect;
                //console.log(adjustedPoints.findLengths());
                //Convert Adjusted Points Back to a Lat Lng Format for Future Display
                for (var j = 0; j < adjustedPoints.length; j++) {
                    adjustedLatLng.push(origin.destinationPoint(adjustedPoints[j][0], adjustedPoints[j][1]));
                }
                //console.log(adjustedLatLng);
                //Save Adjusted Cartesian Points and LatLng to Building Object
                buildings[i].polygon.adjustedPath = adjustedLatLng;
                buildings[i].adjustedPoints = adjustedPoints;

                //Create Grids for STL Creation
                //Walls
                createCustomWallGrid(buildings[i].adjustedPoints[0], buildings[i].adjustedPoints[1], 5, buildings[i].height).forEach(function(facet) {
                    facets.push(facet);
                });
                createCustomWallGrid(buildings[i].adjustedPoints[1], buildings[i].adjustedPoints[2], 5, buildings[i].height).forEach(function(facet) {
                    facets.push(facet);
                });
                createCustomWallGrid(buildings[i].adjustedPoints[2], buildings[i].adjustedPoints[3], 5, buildings[i].height).forEach(function(facet) {
                    facets.push(facet);
                });
                createCustomWallGrid(buildings[i].adjustedPoints[3], buildings[i].adjustedPoints[0], 5, buildings[i].height).forEach(function(facet) {
                    facets.push(facet);
                });
                createRotateRoof(buildings[i].adjustedPoints[0], buildings[i].adjustedPoints[1], buildings[i].adjustedPoints[3], buildings[i].height).forEach(function(facet) {
                    facets.push(facet);
                });
                var stlObj = {
                    description: buildings[i].name,
                    facets: facets
                };
                allBldgSTL += stl.fromObject(stlObj) + "/n";

                //Ground Stats for This Building
                minMaxPts = minMaxPoints(buildings[i].adjustedPoints);
                minXPts.push(minMaxPts[0]);
                maxXPts.push(minMaxPts[1]);
                minYPts.push(minMaxPts[2]);
                maxYPts.push(minMaxPts[3]);
                break;
        }
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
    console.log(innerBounds);
    //Call CreateGound
    groundFacets = createGround(innerBounds);

    groundSTL = {
        description: "groundSTL",
        facets: groundFacets
    };

    //Write Files
    //Write Ground STL File for All Buildings
    fs.writeFileSync("stlFiles/BuildingsGround5m.stl", stl.fromObject(groundSTL));
    //Write All Buildings in One STL File
    fs.writeFileSync("stlFiles/Buildings5m.stl", allBldgSTL);
}


//Test Function
var buildings = [{
    "polygon": {
        "path": [{
            "latitude": 38.9866387897692,
            "longitude": -76.94477113884061
        }, {
            "latitude": 38.9866387897692,
            "longitude": -76.94443258933605
        }, {
            "latitude": 38.986977339273764,
            "longitude": -76.94443258933605
        }, {
            "latitude": 38.986977339273764,
            "longitude": -76.94477113884061
        }],
        "fill": {
            "color": "#777",
            "opacity": 0.6
        },
        "stroke": {
            "color": "#777",
            "weight": 1
        },
        "id": 0
    },
    "id": 0,
    "name": "Test Building 1",
    "numFloors": 4,
    "flrToFlrHeight": 12,
    "shape": "rect",
    "footprintArea": 11856.811971680438,
    "height": 48,
    "totalArea": 47427.24788672175,
    "bldgFootprint": "rect",
    "selected": true
}, {
    "polygon": {
        "path": [{
            "latitude": 38.986570630484536,
            "longitude": -76.94418882929025
        }, {
            "latitude": 38.986570630484536,
            "longitude": -76.94351173028113
        }, {
            "latitude": 38.98724772949366,
            "longitude": -76.94351173028113
        }, {
            "latitude": 38.98724772949366,
            "longitude": -76.94418882929025
        }],
        "fill": {
            "color": "#777",
            "opacity": 0.6
        },
        "stroke": {
            "color": "#777",
            "weight": 1
        },
        "id": 1
    },
    "id": 1,
    "name": "Test Building 2",
    "numFloors": 8,
    "flrToFlrHeight": 12,
    "shape": "rect",
    "footprintArea": 47427.180138518495,
    "height": 96,
    "totalArea": 379417.44110814796,
    "bldgFootprint": "rect",
    "selected": true
}, {
    "polygon": {
        "path": [{
            "latitude": 38.98722110277909,
            "longitude": -76.94504445396598
        }, {
            "latitude": 38.987233611843905,
            "longitude": -76.94437003716581
        }, {
            "latitude": 38.98737490695935,
            "longitude": -76.94438344821089
        }, {
            "latitude": 38.98737699179913,
            "longitude": -76.94503908954795
        }],
        "fill": {
            "color": "#777",
            "opacity": 0.6
        },
        "stroke": {
            "color": "#777",
            "weight": 1
        },
        "id": 2
    },
    "id": 2,
    "name": "Test Building 3",
    "numFloors": 3,
    "flrToFlrHeight": 12,
    "shape": "rect",
    "footprintArea": 10224.659943385841,
    "height": 36,
    "totalArea": 30673.97983015752,
    "bldgFootprint": "rect",
    "selected": true
}, {
    "polygon": {
        "path": [{
            "latitude": 38.9876818486848,
            "longitude": -76.94384282432733
        }, {
            "latitude": 38.9876818486848,
            "longitude": -76.94316572531821
        }, {
            "latitude": 38.988358947693925,
            "longitude": -76.94316572531821
        }, {
            "latitude": 38.988358947693925,
            "longitude": -76.94384282432733
        }],
        "fill": {
            "color": "#777",
            "opacity": 0.6
        },
        "stroke": {
            "color": "#777",
            "weight": 1
        },
        "id": 3
    },
    "id": 3,
    "name": "Test Building 4",
    "numFloors": 2,
    "flrToFlrHeight": 12,
    "shape": "rect",
    "footprintArea": 47426.43562028688,
    "height": 24,
    "totalArea": 94852.87124057376,
    "bldgFootprint": "rect",
    "selected": true
}, {
    "polygon": {
        "path": [{
            "latitude": 38.98758386275805,
            "longitude": -76.94521879755195
        }, {
            "latitude": 38.9876672560546,
            "longitude": -76.94480723723524
        }, {
            "latitude": 38.98785859014375,
            "longitude": -76.94486892804258
        }, {
            "latitude": 38.987758518446604,
            "longitude": -76.9453019460314
        }],
        "fill": {
            "color": "#777",
            "opacity": 0.6
        },
        "stroke": {
            "color": "#777",
            "weight": 1
        },
        "id": 4
    },
    "id": 4,
    "name": "Test Building 5",
    "numFloors": 6,
    "flrToFlrHeight": 12,
    "shape": "rect",
    "footprintArea": 8681.274081783167,
    "height": 72,
    "totalArea": 52087.64449069901,
    "bldgFootprint": "rect",
    "selected": true
}];

buildSTL(buildings);
