var fs = require('fs'),
    stl = require('stl'),
    poly2tri = require('poly2tri');

function distanceFormula(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

function createPlane(points) {
    var tri1 = [[points[0][0], points[0][1], 0], [points[1][0], points[1][1], 0], [points[2][0], points[2][1], 0]];
    var tri2 = [[points[0][0], points[0][1], 0], [points[2][0], points[2][1], 0], [points[3][0], points[3][1], 0]];
    var facets = [{
        verts: tri1
    }, {
        verts: tri2
    }];
    return facets;
}
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

//Regular Rectangular Building
var rectangle = [[-5, -5], [5, -5], [5, 5], [-5, 5]];

//Get Longest Building Side
var lengths = rectangle.findLengths();
var maxLength = Math.max.apply(null, lengths);
//console.log(maxLength);

//Create Outer Bound Array
var distanceRatio = 10;
var boundDist = distanceRatio * maxLength;
var groundBounds = [[-boundDist, -boundDist], [boundDist, -boundDist], [boundDist, boundDist], [-boundDist, boundDist]];
//console.log(groundBounds);

//Create Grid for Ground STL
var largerGrid = new Array;
var yCount = 1;
var startX = groundBounds[0][0],
    startY = groundBounds[0][1];
var xPts = new Array;
for (var x = 0; x <= 20; x++) {
    xPts.push(startX + x * distanceRatio)
}
var yPts = new Array;
for (var y = 0; y <= 20; y++) {
    yPts.push(startY + y * distanceRatio)
}
for (var y = 1; y < yPts.length; y++) {
    for (var i = 1; i < xPts.length; i++) {
        var pt1 = [xPts[i - 1], yPts[y - 1]],
            pt2 = [xPts[i], yPts[y - 1]],
            pt3 = [xPts[i], yPts[y]],
            pt4 = [xPts[i - 1], yPts[y]];
        largerGrid.push([pt1, pt2, pt3, pt4])
    }
}


//Create Facets
//var facets = createPlane(groundBounds);
//console.log(facets);
var groundSTLAll = '';
for (var i = 0; i < largerGrid.length; i++) {
    var facets = (createPlane(largerGrid[i]));
    var stlObj = {
        description: "ground",
        facets: facets
    };
    var groundSTL = stl.fromObject(stlObj);
    groundSTLAll += groundSTL;
}

//Write STL File
fs.writeFileSync("stlFiles/ground.stl", groundSTLAll);

//Using Poly2Tri
var rectangle = [[-5, -5], [5, -5], [5, 5], [-5, 5]];
//Get Longest Building Side
var lengths = rectangle.findLengths();
var maxLength = Math.max.apply(null, lengths);
//console.log(maxLength);

//Create Outer Bound Array
var distanceRatio = 10;
var boundDist = distanceRatio * maxLength;
var groundBounds = [[-boundDist, -boundDist], [boundDist, -boundDist], [boundDist, boundDist], [-boundDist, boundDist]];

var contour = new Array;
var facets3 = new Array;
groundBounds.forEach(function (bound) {
    contour.push(new poly2tri.Point(bound[0], bound[1]));
})

var swctx = new poly2tri.SweepContext(contour);
var triangles = swctx.getTriangles();
triangles.forEach(function (tri) {
    var verts = [];
    tri.points_.reverse();
    tri.points_.forEach(function (points) {
        verts.push([points.x, points.y, 0]);
    });
    facets3.push(createFacet(verts));
});
var stlObj = {
    description: "ground",
    facets: facets
};
var buildingSTL = stl.fromObject(stlObj);
fs.writeFileSync("stlFiles/ground2.stl", groundSTLAll);
