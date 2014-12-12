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
    var sideLengths = [];
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
console.log(maxLength);

//Create Outer Bound Array
var boundDist = 10 * maxLength;
var groundBounds = [[-boundDist, -boundDist], [boundDist, -boundDist], [boundDist, boundDist], [-boundDist, boundDist]];
console.log(groundBounds);

//Create Grid for Ground STL

//Create Facets
var facets = createPlane(groundBounds);

console.log(facets);
var stlObj = {
    description: "ground",
    facets: facets
};
var groundSTL = stl.fromObject(stlObj);

//Write STL File
fs.writeFileSync("stlFiles/ground.stl", groundSTL);
