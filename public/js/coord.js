//LatLon Stuff
Number.prototype.toRadians = function () {
    return this * Math.PI / 180;
};
Number.prototype.toDegrees = function () {
    return this * 180 / Math.PI;
};

//Prototype to find side length of array of points
Array.prototype.findLengths = function () {
    var sideLengths = new Array;
    for (var i = 1; i < this.length; i++) {
        var d = distanceFormula(this[i - 1][0], this[i - 1][1], this[i][0], this[i][1]);
        sideLengths.push(d);
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

function getArea(latLngPath) {
    //initiallize Variables
    var origin,
        point,
        avgLat = new Number,
        avgLng = new Number,
        count = new Number,
        coords = new Array,
        sides = new Number,
        j = new Number,
        area = new Number,
        x = new Array,
        y = new Array;
    avgLat = 0;
    avgLng = 0;
    count = 0;
    //Find Origin Point, average of Lat and Lng
    latLngPath.forEach(function (pt) {
        avgLat += pt.latitude;
        avgLng += pt.longitude;
        count++;
    });
    avgLat = avgLat / count;
    avgLng = avgLng / count;
    origin = new latLon(avgLat, avgLng);
    //Create Cartesian Coordinates in SI Units
    latLngPath.forEach(function (pt) {
        point = new latLon(pt.latitude, pt.longitude);
        coords.push(origin.coordinatesTo(point));
    });
    //Find area of polygon
    sides = coords.length;
    coords.forEach(function (pt) {
        x.push(pt[0]);
        y.push(pt[1]);
    });
    area = polygonArea(x, y, sides);
    //Convert Area to Ft2
    area = area * 10.7639104;
    if (area < 0) {
        return -area;
    } else {
        return area;
    }
}
/*var coords = [{
    "latitude": 38.99037412172071,
    "longitude": -76.94790746667422
}, {
    "latitude": 38.990325651232695,
    "longitude": -76.94782498874702
}, {
    "latitude": 38.99068005833606,
    "longitude": -76.94749239482917
}, {
    "latitude": 38.99072800739611,
    "longitude": -76.94757755496539
}];

console.log(getArea(coords));*/
