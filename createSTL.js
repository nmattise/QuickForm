//Polygon Triangulation (for top/bottom)
//http://polyk.ivank.net/?p=documentation
//https://github.com/r3mi/poly2tri.js

var fs = require('fs'),
    stl = require('stl'),
    poly2tri = require('poly2tri');

//Test array of Points
//Rectangel
var rect = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10]
];
//L Shape
var lShape = [
    [0, 0],
    [10, 0],
    [10, 30],
    [5, 30],
    [5, 10],
    [0, 10]
];
//Cross Product Function to create Normal Vector
function crossProduct(a, b) {
    // Check lengths
    if (a.length != 3 || b.length != 3) {
        return;
    }

    return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];
}
//function to create Unit vectors from verticies
function createUnitVectors(verts) {
    var x1 = Number(verts[0][0]),
        y1 = Number(verts[0][1]),
        z1 = Number(verts[0][2]),
        x2 = Number(verts[1][0]),
        y2 = Number(verts[1][1]),
        z2 = Number(verts[1][2]),
        x3 = Number(verts[2][0]),
        y3 = Number(verts[2][1]),
        z3 = Number(verts[2][2]);
    var vector1 = [x2 - x1, y2 - y1, z2 - z1],
        vector2 = [x3 - x2, y3 - y2, z3 - z2];
    var length1 = Math.sqrt(Math.pow(vector1[0], 2) + Math.pow(vector1[1], 2) + Math.pow(vector1[2], 2)),
        length2 = Math.sqrt(Math.pow(vector2[0], 2) + Math.pow(vector2[1], 2) + Math.pow(vector2[2], 2));
    vector1 = [vector1[0] / length1, vector1[1] / length1, vector1[2] / length1];
    vector2 = [vector2[0] / length2, vector2[1] / length2, vector2[2] / length2];
    //console.log("v1: " + vector1 + "\nv2 : " + vector2);
    return [vector1, vector2];
}

function createFacet(verts) {
    //var vectors = createUnitVectors(verts);
    //var normal = crossProduct(vectors[0], vectors[1]);
    return {

        verts: verts
    }
}

function createPlane(p1, p2, h) {
    var tri1 = [[p1[0], p1[1], 0], [p2[0], p2[1], 0], [p2[0], p2[1], h]];
    var tri2 = [[p1[0], p1[1], 0], [p2[0], p2[1], h], [p1[0], p1[1], h]];
    var facets = [createFacet(tri1), createFacet(tri2)];
    return facets;
}


var facets = [];
for (var i = 1; i < lShape.length; i++) {
    var triangle = createPlane(lShape[i - 1], lShape[i], 10);
    //console.log(triangle);
    facets.push(triangle[0]);
    facets.push(triangle[1]);
}
var triangle = createPlane(lShape[lShape.length - 1], lShape[0], 10);
facets.push(triangle[0]);
facets.push(triangle[1]);


var contour = [];
lShape.forEach(function (point) {
    contour.push(new poly2tri.Point(point[0], point[1]));
});

var swctx = new poly2tri.SweepContext(contour);

swctx.triangulate();
var triangles = swctx.getTriangles();


bottomTriangles = triangles.reverse();
//Create Bottom Plane
bottomTriangles.forEach(function (tri) {
    var verts = [];
    tri.points_.forEach(function (points) {
        verts.push([points.x, points.y, 0]);
    });
    facets.push(createFacet(verts));
});

//Create Top Plane
triangles.forEach(function (tri) {
    var verts = [];
    tri.points_.forEach(function (points) {
        verts.push([points.x, points.y, 10]);
    });
    facets.push(createFacet(verts));
});
console.log(facets);

var stlObj = {
    description: 'modelTest',
    facets: facets
};
fs.writeFileSync('lshape.stl', stl.fromObject(stlObj));
