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

function findRotation(pt1, pt2) {
    var deltaX, deltaY, theta;
    deltaX = pt2[0] - pt1[0];
    deltaY = pt2[1] - pt1[1];
    theta = Math.atan(deltaX / deltaY);
    return theta
}

var points = [
    [-75.69672579617637, 25.86343425578892],
    [-40.12558192625453, 35.136084034564334],
    [-45.457380020789756, 56.41149302926729],
    [-82.88303192919199, 45.28433312611336]
];
console.log(points);
//Find Lengths of Rectangle
var lengths = points.findLengths();
console.log("lengths: " + lengths);
var avergeLengths = [(lengths[0] + lengths[2]) / 2, (lengths[1] + lengths[3]) / 2];
console.log("average Lengths: " + avergeLengths);
//Find rsotation
var theta = findRotation(points[0], points[1]);
console.log("theta: " + theta);
//Make Orthognal Rectangle
var orthRect = [
    [points[0][0], points[0][1]],
    [points[0][0] + avergeLengths[0], points[0][1]],
    [points[0][0] + avergeLengths[0], points[0][1] + avergeLengths[1]],
    [points[0][0], points[0][1] + avergeLengths[1]]
];
console.log(orthRect);
//Rotate the Orthognal sRectangle
var rotatedRect = [];
orthRect.forEach(function(point) {
    var rotatedPoint = rotatePoint(orthRect[0], point, theta - (Math.PI / 2));
    rotatedRect.push(rotatedPoint);
});
console.log(rotatedRect);
console.log(rotatedRect.findLengths());
