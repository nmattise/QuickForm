//Polygon Triangulation (for top/bottom)
//http://polyk.ivank.net/?p=documentation
//https://github.com/r3mi/poly2tri.js

var fs = require('fs'),
    stl = require('stl');

function createSolidFromLine(p1, p2, h, normal) {
    var x1 = p1[0],
        y1 = p1[1],
        z1 = 0,
        x2 = p2[0],
        y2 = p2[1],
        z2 = 0,
        x3 = p1[0],
        y3 = p1[1],
        z3 = h,
        x4 = p2[0],
        y4 = p2[1],
        z4 = h;

    var verts1 = [
        [x1, y1, z1],
        [x3, y3, z3],
        [x4, y4, z4]
    ];
    var verts2 = [
        [x1, y1, z1],
        [x2, y2, z2],
        [x4, y4, z4]
    ];
    var facets = [{
            normal: normal,
            verts: verts1
    },
        {
            normal: normal,
            verts: verts2
        }];
    return facets;
}
var normal = [0, 0, 0];

var f = new createSolidFromLine([0, 0], [5, 0], 5, normal);

console.log(f[0].verts);
console.log(f[1].verts);
