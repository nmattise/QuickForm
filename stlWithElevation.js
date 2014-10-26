var fs = require('fs'),
    stl = require('stl'),
    poly2tri = require('poly2tri'),
    request = require('request'),
    async = require('async'),
    stats = require('statsjs');



//Lat/Long and Coordinate Stuff
Number.prototype.toRadians = function () {
    return this * Math.PI / 180;
};
Number.prototype.toDegrees = function () {
    return this * 180 / Math.PI;
};

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

function createFacet(verts) {
    return {
        verts: verts
    }
}


function createPlane(p1, p2, h) {
    var tri1 = [[p1[0], p1[1], p1[2]], [p2[0], p2[1], p2[2]], [p2[0], p2[1], h + p2[2]]];
    var tri2 = [[p1[0], p1[1], p1[2]], [p2[0], p2[1], h + p2[2]], [p1[0], p1[1], h + p1[2]]];
    var facets = [{
        verts: tri1
    }, {
        verts: tri2
    }];
    return facets;
}

function createSTL(points, height, buildingName) {
    //Add facets
    console.log(points);
    var facets = [];

    //Walls
    for (var i = 1; i < points.length; i++) {
        var tri = createPlane(points[i - 1], points[i], height);
        facets.push(tri[0]);
        facets.push(tri[1]);
    }
    var tri = createPlane(points[points.length - 1], points[0], height);
    facets.push(tri[0]);
    facets.push(tri[1]);

    //Top and Bottom
    var contour = [];
    points.forEach(function (point) {
        contour.push(new poly2tri.Point(point[0], point[1]));
    });
    var swctx = new poly2tri.SweepContext(contour);
    swctx.triangulate();
    var triangles = swctx.getTriangles();
    //Create Bottom Plane
    triangles.forEach(function (tri) {
        var verts = [];
        tri.points_.reverse();
        tri.points_.forEach(function (points) {
            verts.push([points.x, points.y, 0]);
        });
        facets.push(createFacet(verts));
    });

    //Create Top Plane
    triangles.forEach(function (tri) {
        var verts = [];
        tri.points_.reverse();
        tri.points_.forEach(function (points) {
            verts.push([points.x, points.y, height]);
        });
        facets.push(createFacet(verts));
    });
    var stlObj = {
        description: buildingName,
        facets: facets
    };
    var buildingSTL = stl.fromObject(stlObj);
    return buildingSTL;
    fs.writeFileSync("stlFiles/" + buildingName + '.stl', buildingSTL);
}

//Get Elevation
function getElevation(points, callback) {
    var apiKey = 'AIzaSyB6sl1lQQORM2xga_Hs2X--d7wuFosl_eM';
    var baseURL = 'https://maps.googleapis.com/maps/api/elevation/json?locations=';
    var allPointsURL = baseURL + '';
    points.forEach(function (point) {
        allPointsURL += point.latitude + ',' + point.longitude + '|';
    })
    var allPointsURLFinal = allPointsURL.substr(0, allPointsURL.length - 2) + '&key=' + apiKey;
    request(allPointsURLFinal, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var points = JSON.parse(body).results;
            var elevations = [];
            for (var i = 0; i < points.length; i++) {
                elevations.push(points[i].elevation);
            };
            callback(elevations);
        };

    });

}


var latlng = [{
    "latitude": 38.989468517547934,
    "longitude": -76.94274961460619
}, {
    "latitude": 38.989468517547934,
    "longitude": -76.94207251559706
}, {
    "latitude": 38.99014561655706,
    "longitude": -76.94207251559706
}, {
    "latitude": 38.99014561655706,
    "longitude": -76.94274961460619
}];

getElevation(latlng, function (elevations) {
    console.log(elevations);
    var nums = stats(elevations);
    var minElevation = nums.min();
    for (var i = 0; i < elevations.length; i++) {
        elevations[i] = elevations[i] - minElevation;
    }
    console.log(elevations);
    var origin = new latLon(latlng[0].latitude, latlng[0].longitude);
    var coords = [];
    latlng.forEach(function (point) {
        coords.push(origin.coordinatesTo(point));
    });
    for (var i = 0; i < coords.length; i++) {
        coords[i].push(elevations[i]);
    };
    createSTL(coords, 15, "testElevation");
});
