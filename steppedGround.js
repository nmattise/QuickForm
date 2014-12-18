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

function createFacet(verts) {
    return {
        verts: verts
    }
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
var rectangle = [[-10, -10], [10, -10], [10, 10], [-10, 10]];

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

largerGrid.push(rectangle);
var pts1m = new Array,
    pts5m = new Array,
    pts10m = new Array;

for (var i = -20; i <= 20; i++) {
    pts1m.push(i);
}
for (var i = -50; i <= 50; i += 5) {
    pts5m.push(i);
}
for (var i = -100; i <= 100; i += 10) {
    pts10m.push(i);
}

console.log(pts1m);
console.log(pts5m);
console.log(pts10m);

var x = -100,
    i = 1;
while (x <= -50) {
    var pt1 = [x, pts10m[i - 1]],
        pt2 = [x + 10, pts10m[i - 1]],
        pt3 = [x + 10, pts10m[i]],
        pt4 = [x, pts10m[i]];
    largerGrid.push([pt1, pt2, pt3, pt4])
    x += 10;
    i++;
}
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
fs.writeFileSync("stlFiles/groundRadial.stl", groundSTLAll);
