//Polygon Triangulation (for top/bottom)
//http://polyk.ivank.net/?p=documentation
//https://github.com/r3mi/poly2tri.js

var fs = require('fs'),
    stl = require('stl'),
    poly2tri = require('poly2tri');

//Export StlFile Creator
module.exports.createSTL = createSTL;

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
    fs.writeFileSync("stlFiles/" + buildingName + '.stl', stl.fromObject(stlObj));
}
