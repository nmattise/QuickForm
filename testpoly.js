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

var point = new poly2tri.Point(150, 150);
swctx.addPoint(point);

swctx.triangulate();
var triangles = swctx.getTriangles();
var facets = new Array;
triangles.forEach(function (t) {
    var verts = [];
    t.getPoints().forEach(function (p) {
        verts.push([p.x, p.y, 0]);
    });
    facets.push(createFacet(verts));
});
var stlObj = {
    description: "ground",
    facets: facets
};
var buildingSTL = stl.fromObject(stlObj);
fs.writeFileSync("stlFiles/polyGround.stl", buildingSTL);
