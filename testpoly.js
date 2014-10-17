var poly2tri = require('poly2tri');

var contour = [
    new poly2tri.Point(0, 0),
    new poly2tri.Point(10, 0),
    new poly2tri.Point(10, 10),
    new poly2tri.Point(0, 10)
];
console.log(contour);
var swctx = new poly2tri.SweepContext(contour);

swctx.triangulate();
var triangles = swctx.getTriangles();

triangles.forEach(function (t) {
    t.getPoints().forEach(function (p) {
        console.log(p.x, p.y);
    });
});

function crossProduct(a, b) {
    // Check lengths
    if (a.length != 3 || b.length != 3) {
        return;
    }

    return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];

}

console.log(crossProduct([0,1,1], [0, 0,1]))
