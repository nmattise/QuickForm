var fs = require('fs'),
    stl = require('stl'),
    poly2tri = require('poly2tri');

//Functions and Prototypes
//Distance formula
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}
//Midpoint Formula
function midpoint(pt1, pt2) {
    return midpt = [(pt1[0] + pt2[0]) / 2, (pt1[1] + pt2[1]) / 2];
}

//Create plane made of two triangles
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
//put verts into verts object for STL
function createFacet(verts) {
    return {
        verts: verts
    }
}
//Prototype to find side length of array of points
Array.prototype.findLengths = function () {
    var sideLengths = new Array;
    for (var i = 1; i < this.length; i++) {
        var d = distance(this[i - 1][0], this[i - 1][1], this[i][0], this[i][1]);
        sideLengths.push(d);
    }
    var d = distance(this[this.length - 1][0], this[this.length - 1][1], this[0][0], this[0][1]);
    sideLengths.push(d);
    return sideLengths;
}

//Single Building Ground File
function createGround(buildingFootprint, distanceRatio) {
    var contour = new Array,
        facets = new Array,
        groundShape,
        triangles,
        lengths,
        maxLength,
        innerBounds = new Array,
        boundDist,
        outerBounds = new Array,
        xBound,
        yBound,
        side1StartPt,
        side1_1 = new Array,
        side2MidPt,
        side4MidPt;

    //Create Ground of this building shape
    buildingFootprint.forEach(function (point) {
        contour.push(new poly2tri.Point(point[0], point[1]));
    });
    groundShape = new poly2tri.SweepContext(contour);
    groundShape.triangulate();
    var triangles = groundShape.getTriangles();
    triangles.forEach(function (tri) {
        var verts = [];
        tri.points_.reverse();
        tri.points_.forEach(function (points) {
            verts.push([points.x, points.y, 0]);
        });
        facets.push(createFacet(verts));
    });
    //console.log(facets);
    //Get Longest Building Side
    lengths = rectangle.findLengths();
    maxLength = Math.max.apply(null, lengths);
    console.log("Longest Side " + maxLength + " m");
    //Create Inner Bound Array
    innerBounds = [[buildingFootprint[0][0], buildingFootprint[0][1]], [buildingFootprint[0][0] + maxLength, buildingFootprint[0][1]], [buildingFootprint[0][0] + maxLength, buildingFootprint[0][1] + maxLength], [buildingFootprint[0][0], buildingFootprint[0][0] + maxLength]];
    console.log("Inner Bounds: " + innerBounds);
    //Create Outer Bound Array
    boundDist = distanceRatio * maxLength;
    //outerBounds = [[-boundDist, -boundDist], [boundDist, -boundDist], [boundDist, boundDist], [-boundDist, boundDist]];;
    //console.log("OuterBounds: " + outerBounds);
    //Section 1
    side1StartPt = innerBounds[0];
    while (x < innerBounds[1][0]) {

    }

    //Section 2
    //Section 3
    //Section 4
}

//Test of Building Shapes
//Rectangular Building Coords
var rectangle = [[-5, -5], [5, -5], [5, 5], [-5, 5]];
createGround(rectangle, 10);
