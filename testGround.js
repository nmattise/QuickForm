var fs = require('fs'),
    stl = require('stl'),
    poly2tri = require('poly2tri');

function createFacet(verts) {
    return {
        verts: verts
    }
}
var contour = [
     new poly2tri.Point(100, 100),
     new poly2tri.Point(100, 300),
     new poly2tri.Point(300, 300),
     new poly2tri.Point(300, 100)
 ];
var swctx = new poly2tri.SweepContext(contour);

var holes = [
     new poly2tri.Point(200, 200),
     new poly2tri.Point(200, 250),
     new poly2tri.Point(250, 250)
 ];
var point = new poly2tri.Point(150, 150);
swctx.addPoint(point);
var triangles = swctx.triangulate().getTriangles();
var facets = new Array;
triangles.forEach(function (tri) {
    var verts = [];
    tri.points_.reverse();
    tri.points_.forEach(function (points) {
        verts.push([points.x, points.y, 0]);
    });
    facets.push(createFacet(verts));
});

var stlObj = {
    description: "ground",
    facets: facets
};

var buildingSTL = stl.fromObject(stlObj);
fs.writeFileSync("stlFiles/ground2.stl", buildingSTL);
