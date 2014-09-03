function polygonArea(X, Y, numPoints) {
    area = 0; // Accumulates area in the loop
    j = numPoints - 1; // The last vertex is the 'previous' one to the first

    for (i = 0; i < numPoints; i++) {
        area = area + (X[j] + X[i]) * (Y[j] - Y[i]);
        j = i; //j is previous vertex to i
    }
    return area / 2;
}

var xPts = [4, 4, 8, 8, -4, -4];
var yPts = [6, -4, -4, -8, -8, 6];
var a = polygonArea(xPts, yPts, 6);
console.log(a);

var coords = [[4, 6], [4, -4], [8, -4], [8, -8], [-4, -8], [-4, 6]];
var coords1 = [[0, 0], [4, 0], [4, -4], [0, -4]];

function footprintArea(coords) {
    var numPoints = coords.length,
        area = 0,
        j = numPoints - 1;

    for (i = 0; i < numPoints; i++) {
        area += (coords[j][0] + coords[i][0]) * (coords[j][1] - coords[i][1]);
        j = i;
    }
    return area / 2;
}

console.log(footprintArea(coords))
console.log(footprintArea(coords1))
