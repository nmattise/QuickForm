function distanceFormula(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}
Array.prototype.findLengths = function() {
    var sideLengths = [];
    for (var i = 1; i < this.length; i++) {
        var d = distanceFormula(this[i - 1][0], this[i - 1][1], this[i][0], this[i][1]);
        sideLengths.push(Math.round(d * 100) / 100);
    }
    var d = distanceFormula(this[this.length - 1][0], this[this.length - 1][1], this[0][0], this[0][1]);
    sideLengths.push(d);
    return sideLengths;
}
var points = [
    [-75.69672579617637, 25.86343425578892],
    [-40.12558192625453, 35.136084034564334],
    [-45.457380020789756, 56.41149302926729],
    [-82.88303192919199, 45.28433312611336]
];
console.log(points);
console.log(points.findLengths())
var sides = points.findLengths();
var length = (sides[0] + sides[2]) / 2;
var width = (sides[1] + sides[3]) / 2;

var unadjPoints = [
    [points[0][0], points[0][1]],
    [points[0][0] + length, points[0][1]],
    [points[0][0] + length, points[0][1] + width],
    [points[0][0], points[0][1] + width],
]
console.log(unadjPoints);
var deltaX = points[1][0] - points[0][0],
    deltaY = points[1][1] - points[0][1];
var theta = Math.atan(deltaX / deltaY);

function rotatePoint(startPoint, point, theta) {
    var rotatedPoint, x1, y1;
    var x0 = startPoint[0],
        y0 = startPoint[1],
        x = point[0],
        y = point[1];
    x1 = x0 + (x - x0) * Math.cos(theta) + (y - y0) * Math.sin(theta);
    y1 = y0 - (x - x0) * Math.sin(theta) + (y - y0) * Math.cos(theta);
    rotatedPoint = [x1, y1];
    return rotatedPoint;
}
console.log("theta: "+ theta)
console.log(unadjPoints[0]);
console.log(rotatePoint(unadjPoints[0], unadjPoints[1], -theta))
console.log(rotatePoint(unadjPoints[0], unadjPoints[2], -theta))
console.log(rotatePoint(unadjPoints[0], unadjPoints[3], -theta))
