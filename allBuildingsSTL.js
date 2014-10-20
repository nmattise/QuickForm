var fs = require('fs'),
    stl = require('stl'),
    poly2tri = require('poly2tri');

//module.exports.allBuidlingsSTL = allBuidlingsSTL;

function createFacet(verts) {
    return {
        verts: verts
    }
}

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



//Arrays and function calls to Test
var buildings = [[{
    "latitude": 38.989756623985606,
    "longitude": -76.94395228976502
    }, {
    "latitude": 38.989756623985606,
    "longitude": -76.94361374026046
    }, {
    "latitude": 38.99009517349017,
    "longitude": -76.94361374026046
    }, {
    "latitude": 38.99009517349017,
    "longitude": -76.94395228976502
    }], [{
    "latitude": 38.98934134657588,
    "longitude": -76.94284885633974
    }, {
    "latitude": 38.98934134657588,
    "longitude": -76.94267958158746
    }, {
    "latitude": 38.98951062132816,
    "longitude": -76.94267958158746
    }, {
    "latitude": 38.98951062132816,
    "longitude": -76.9423410320829
    }, {
    "latitude": 38.98934134657588,
    "longitude": -76.9423410320829
    }, {
    "latitude": 38.98934134657588,
    "longitude": -76.94217175733061
    }, {
    "latitude": 38.990018445585,
    "longitude": -76.94217175733061
    }, {
    "latitude": 38.990018445585,
    "longitude": -76.9423410320829
    }, {
    "latitude": 38.98984917083272,
    "longitude": -76.9423410320829
    }, {
    "latitude": 38.98984917083272,
    "longitude": -76.94267958158746
    }, {
    "latitude": 38.990018445585,
    "longitude": -76.94267958158746
    }, {
    "latitude": 38.990018445585,
    "longitude": -76.94284885633974
    }], [{
    "latitude": 38.989135971935845,
    "longitude": -76.94449260708934
    }, {
    "latitude": 38.989135971935845,
    "longitude": -76.94457724446549
    }, {
    "latitude": 38.988966697183564,
    "longitude": -76.94457724446549
    }, {
    "latitude": 38.988966697183564,
    "longitude": -76.94449260708934
    }, {
    "latitude": 38.98888205980742,
    "longitude": -76.94449260708934
    }, {
    "latitude": 38.98888205980742,
    "longitude": -76.94432333233708
    }, {
    "latitude": 38.988966697183564,
    "longitude": -76.94432333233708
    }, {
    "latitude": 38.988966697183564,
    "longitude": -76.94423869496093
    }, {
    "latitude": 38.989135971935845,
    "longitude": -76.94423869496093
    }, {
    "latitude": 38.989135971935845,
    "longitude": -76.94432333233708
    }, {
    "latitude": 38.989220609311985,
    "longitude": -76.94432333233708
    }, {
    "latitude": 38.989220609311985,
    "longitude": -76.94449260708934
    }], [{
    "latitude": 38.98833937505069,
    "longitude": -76.94285422075777
    }, {
    "latitude": 38.98833937505069,
    "longitude": -76.94268494600549
    }, {
    "latitude": 38.98800082554613,
    "longitude": -76.94268494600549
    }, {
    "latitude": 38.98800082554613,
    "longitude": -76.94234639650092
    }, {
    "latitude": 38.98833937505069,
    "longitude": -76.94234639650092
    }, {
    "latitude": 38.98833937505069,
    "longitude": -76.94217712174864
    }, {
    "latitude": 38.988508649802974,
    "longitude": -76.94217712174864
    }, {
    "latitude": 38.988508649802974,
    "longitude": -76.94285422075777
    }]];

//Average Lat and Long

var lat = 0,
    lng = 0,
    count = 0;

buildings.forEach(function (building) {

    building.forEach(function (point) {
        lat += point.latitude;
        lng += point.longitude;
        count++;
    });
});
console.log(lat);
console.log(lng);
console.log(count);

console.log(lat / count);
console.log(lng / count);
var centerLat = lat / count;
var centerLng = lng / count;
var buildingCoords = [];
buildings.forEach(function (building) {
    var coords = [];
    var origin = new latLon(centerLat, centerLng);
    for (var i = 0; i < building.length; i++) {
        var point = new latLon(building[i].latitude, building[i].longitude);
        coords.push(origin.coordinatesTo(point))
    };
    buildingCoords.push(coords);
});


//Create STL format

var buildingsSTL = '';

function createFacet(verts) {
    return {
        verts: verts
    }
}

function createPlane(p1, p2, h) {
    var tri1 = [[p1[0], p1[1], 0], [p2[0], p2[1], 0], [p2[0], p2[1], h]];
    var tri2 = [[p1[0], p1[1], 0], [p2[0], p2[1], h], [p1[0], p1[1], h]];
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
    buildingsSTL += '\n' + stl.fromObject(stlObj);
    //fs.writeFileSync("stlFiles/" + buildingName + '.stl', stl.fromObject(stlObj));
}

//createSTL(rect, 20, "rect");
createSTL(buildingCoords[0], 20, "coordTest");
buildingCoords.forEach(function (building) {
    createSTL(building, 25, "buildingTest");
});

fs.writeFileSync("stlFiles/multiBuildings.stl", buildingsSTL);
