var fs = require('fs'),
    stl = require('stl'),
    poly2tri = require('poly2tri');

function createFacet(verts) {
    return {
        verts: verts
    }
}
var contour = [
     new poly2tri.Point(-100, -100),
     new poly2tri.Point(100, -100),
     new poly2tri.Point(100, 100),
     new poly2tri.Point(-100, 100)
 ];
var swctx = new poly2tri.SweepContext(contour);
var pt1 = new poly2tri.Point(-50, -50),
    pt2 = new poly2tri.Point(50, -50),
    pt3 = new poly2tri.Point(50, 50),
    pt4 = new poly2tri.Point(-50, 50);

swctx.addPoints([pt1, pt2, pt3, pt4]);
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
