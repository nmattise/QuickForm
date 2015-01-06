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
Number.prototype.toRadians = function () {
    return this * Math.PI / 180;
};
Number.prototype.toDegrees = function () {
    return this * 180 / Math.PI;
};

//Prototype to find side length of array of points
Array.prototype.findLengths = function () {
    var sideLengths = new Array();
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
latLon.prototype.coordinatesTo = function (point) {
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
latLon.prototype.destinationPoint = function (X, Y) {
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
//STL Format Creation
function createPlane(p1, p2, z, z1) {
    var tri1 = [[p1[0], p1[1], z], [p2[0], p2[1], z], [p2[0], p2[1], z1]];
    var tri2 = [[p1[0], p1[1], z], [p2[0], p2[1], z1], [p1[0], p1[1], z1]];
    var facets = [{
        verts: tri1
    }, {
        verts: tri2
    }];
    return facets;
}

//Final Function
function buildSTL(buildings) {
    //Initialize Variables
    var lat = new Number,
        lng = new Number,
        pathCount = new Number,
        centerLat = new Number,
        centerLng = new Number,
        origin,
        allBldgSTL = new String();

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
            var points = new Array(),
                sideLengths,
                averageSideLengths = new Array(),
                adjustedPoints = new Array(),
                adjustedLatLng = new Array(),
                sideLengths = new Array();
            console.log("___\n" + buildings[i].id);
            //console.log(buildings[i].polygon.path)
            //Get Cartesian Points from LatLng
            for (var j = 0; j < buildings[i].polygon.path.length; j++) {
                points.push(origin.coordinatesTo(new latLon(buildings[i].polygon.path[j].latitude, buildings[i].polygon.path[j].longitude)));
            }
            //console.log(points);
            //Average Cartesian Points
            adjustedPoints[0] = [Math.round(average(points[0][0], points[3][0]) * 100) / 100, Math.round(average(points[0][1], points[1][1]) * 100) / 100];
            adjustedPoints[1] = [Math.round(average(points[1][0], points[2][0]) * 100) / 100, Math.round(average(points[0][1], points[1][1]) * 100) / 100];
            adjustedPoints[2] = [Math.round(average(points[1][0], points[2][0]) * 100) / 100, Math.round(average(points[2][1], points[3][1]) * 100) / 100];
            adjustedPoints[3] = [Math.round(average(points[0][0], points[3][0]) * 100) / 100, Math.round(average(points[2][1], points[3][1]) * 100) / 100];
            console.log(adjustedPoints);
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
            sideLengths = adjustedPoints.findLengths();
            console.log("Side Lengths: " + sideLengths);
            console.log("Heights: " + buildings[i].height);
            var facets = new Array();
            //Walls
            for (var k = 1; k < adjustedPoints.length; k++) {
                for (var z = 0; z < buildings[i].height; z++) {
                    var z1 = z + 1;
                    var tri1 = createPlane(adjustedPoints[adjustedPoints.length - 1], adjustedPoints[0], z, z1);
                    facets.push(tri1[0]);
                    facets.push(tri1[1]);
                    var tri = createPlane(adjustedPoints[k - 1], adjustedPoints[k], z, z1);
                    facets.push(tri[0]);
                    facets.push(tri[1]);
                }
            };
            //Roof & Floor
            var x = adjustedPoints[0][0],
                y = adjustedPoints[0][1],
                xGrid = Math.abs(adjustedPoints[0][0] - adjustedPoints[1][0]),
                yGrid = Math.abs(adjustedPoints[0][1] - adjustedPoints[2][1]),
                xIncrement = parseInt(xGrid) / xGrid,
                yIncrement = parseInt(yGrid) / yGrid;
            console.log("xGrid: " + xGrid + "  X Inc: " + xIncrement);
            console.log("yGrid: " + yGrid + "  Y Inc: " + yIncrement);
            for (var xCount = 0; xCount < xGrid; xCount++) {
                for (var yCount = 0; yCount < yGrid; yCount++) {
                    var pt1 = [x - (xIncrement * xCount), y - (yIncrement * yCount)],
                        pt2 = [x - (xIncrement * (xCount + 1)), y - (xIncrement * (yCount + 1))];
                    //Roof
                    var tri = createPlane(pt1, pt2, buildings[i].height, buildings[i].height);
                    facets.push(tri1[0]);
                    facets.push(tri1[1]);
                    //Floor
                    var tri = createPlane(pt1, pt2, 0, 0);
                    facets.push(tri1[0]);
                    facets.push(tri1[1]);
                }
            }


            var stlObj = {
                description: "testBuilding",
                facets: facets
            };
            allBldgSTL += stl.fromObject(stlObj) + "\n";

            break;
        }
    }
    fs.writeFileSync("stlFiles/testBuildings.stl", allBldgSTL);
}


//Test Function
var buildings = [{
    "polygon": {
        "path": [{
            "latitude": 38.987935558628486,
            "longitude": -76.9436526576814
        }, {
            "latitude": 38.987935558628486,
            "longitude": -76.94331410817684
        }, {
            "latitude": 38.98827410813305,
            "longitude": -76.94331410817684
        }, {
            "latitude": 38.98827410813305,
            "longitude": -76.9436526576814
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
    "name": "Building 1",
    "numFloors": 12,
    "flrToFlrHeight": 12,
    "shape": "rect",
    "footprintArea": 11856.594762716291,
    "height": 144,
    "totalArea": 142279.1371525955,
    "bldgFootprint": "rect"
}, {
    "polygon": {
        "path": [{
            "latitude": 38.98855040367168,
            "longitude": -76.94325219795581
        }, {
            "latitude": 38.98855874289189,
            "longitude": -76.94229496687177
        }, {
            "latitude": 38.98936672310219,
            "longitude": -76.94233251779798
        }, {
            "latitude": 38.989329197031886,
            "longitude": -76.9432682912099
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
    "name": "Building 2",
    "numFloors": 2,
    "flrToFlrHeight": 12,
    "shape": "rect",
    "footprintArea": 77745.02804467834,
    "height": 24,
    "totalArea": 155490.0560893567,
    "bldgFootprint": "rect"
}, {
    "polygon": {
        "path": [{
            "latitude": 38.987823616356174,
            "longitude": -76.94191699825464
        }, {
            "latitude": 38.987823616356174,
            "longitude": -76.94123989924552
        }, {
            "latitude": 38.9885007153653,
            "longitude": -76.94123989924552
        }, {
            "latitude": 38.9885007153653,
            "longitude": -76.94191699825464
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
    "name": "Building 3",
    "numFloors": 5,
    "flrToFlrHeight": 12,
    "shape": "rect",
    "footprintArea": 47426.34063397059,
    "height": 60,
    "totalArea": 237131.70316985296,
    "bldgFootprint": "rect"
}, {
    "polygon": {
        "path": [{
            "latitude": 38.98672490947635,
            "longitude": -76.94228446088968
        }, {
            "latitude": 38.98672490947635,
            "longitude": -76.94160736188056
        }, {
            "latitude": 38.987402008485475,
            "longitude": -76.94160736188056
        }, {
            "latitude": 38.987402008485475,
            "longitude": -76.94228446088968
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
    "name": "Building 4",
    "numFloors": 15,
    "flrToFlrHeight": 12,
    "shape": "rect",
    "footprintArea": 47427.076771830434,
    "height": 180,
    "totalArea": 711406.1515774565,
    "bldgFootprint": "rect"
}];

buildSTL(buildings);
