function crossProduct(a, b) {
    // Check lengths
    if (a.length != 3 || b.length != 3) {
        return;
    }

    return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];

}

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
    vector1 = [-Math.round(vector1[0] / length1), -Math.round(vector1[1] / length1), -Math.round(vector1[2] / length1)];
    vector2 = [-Math.round(vector2[0] / length2), -Math.round(vector2[1] / length2), -Math.round(vector2[2] / length2)];
    return [vector1, vector2];
}

var vert1 = [[5, 30, 0], [5, 30, 10], [5, 10, 10]];
var vert2 = [[5, 10, 0], [0, 10, 0], [0, 10, 10]];

console.log(createUnitVectors(vert1));
