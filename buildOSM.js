'use strict';
//Export
module.exports.buildOSM = buildOSM;

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

function buildOSM(buildings) {
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

                //OSM Geometries
                var length, width, degToNorth;

                length = distanceFormula(adjustedPoints[0][0], adjustedPoints[0][1], adjustedPoints[1][0], adjustedPoints[1][1]);
                width = distanceFormula(adjustedPoints[0][0], adjustedPoints[0][1], adjustedPoints[3][0], adjustedPoints[3][1]);
                degToNorth = findRotation(adjustedPoints[0], adjustedPoints[3]).toDegrees();
                console.log("length: " + length);
                console.log("width: " + width);
                console.log("Deg To North: " + degToNorth);
                break;
        }
    }
}

