var fs = require('fs'),
    stl = require('stl'),
    poly2tri = require('poly2tri');
//put verts into verts object for STL
function createFacet(verts) {
    return {
        verts: verts
    }
}
var outerBounds = [
    [-100, -100],
    [100, -100],
    [100, 100],
    [-100, 100]
];
var innerBound = [
    [-10, -10],
    [-10, 10],
    [10, 10],
    [10, -10]
];
var contour = new Array;
outerBounds.forEach(function (point) {
    contour.push(new poly2tri.Point(point[0], point[1]));
});

var ftprint = new poly2tri.SweepContext(contour);

//array stuff
var innerFullArray = new Array;
var x = -10;
var xArr = new Array;
while (x <= 10) {
    xArr.push(x);
    x++;
}
var twelveArray = new Array,
    fifteenArray = new Array,
    twentyfiveArray = new Array,
    seventyFiveArray = new Array;
for (var i = -12; i <= 12; i += 2) {
    twelveArray.push(i);
}
for (var i = -15; i <= 15; i += 5) {
    fifteenArray.push(i);
}
for (var i = -25; i <= 25; i += 5) {
    twentyfiveArray.push(i);
}
for (var i = -75; i <= 75; i += 15) {
    seventyFiveArray.push(i);
}

console.log(twelveArray);
console.log(fifteenArray);
console.log(twentyfiveArray);
console.log(seventyFiveArray);
var radiusArray = new Array;

for (var i = 0; i < twelveArray.length; i++) {
    radiusArray.push(new poly2tri.Point(twelveArray[i], -12));
    radiusArray.push(new poly2tri.Point(twelveArray[i], 12));
    radiusArray.push(new poly2tri.Point(-12, twelveArray[i]));
    radiusArray.push(new poly2tri.Point(12, twelveArray[i]));

}
for (var i = 0; i < fifteenArray.length; i++) {
    radiusArray.push(new poly2tri.Point(fifteenArray[i], -15));
    radiusArray.push(new poly2tri.Point(fifteenArray[i], 15));
    radiusArray.push(new poly2tri.Point(-15, fifteenArray[i]));
    radiusArray.push(new poly2tri.Point(15, fifteenArray[i]));

}
for (var i = 0; i < twentyfiveArray.length; i++) {
    radiusArray.push(new poly2tri.Point(twentyfiveArray[i], -25));
    radiusArray.push(new poly2tri.Point(twentyfiveArray[i], 25));
    radiusArray.push(new poly2tri.Point(-25, twentyfiveArray[i]));
    radiusArray.push(new poly2tri.Point(25, twentyfiveArray[i]));
}
/*for (var i = 0; i < seventyFiveArray.length; i++) {
    radiusArray.push(new poly2tri.Point(seventyFiveArray[i], -75));
    radiusArray.push(new poly2tri.Point(seventyFiveArray[i], 75));
    radiusArray.push(new poly2tri.Point(-75, seventyFiveArray[i]));
    radiusArray.push(new poly2tri.Point(75, seventyFiveArray[i]));
}*/

console.log(radiusArray);
var radArray = [12, 15, 25, 50, 75];
var negRadArray = [-12, -15, -25, -50, -75];
for (var j = 0; j < radArray.length; j++) {
    for (var i = 0; i < xArr.length; i++) {
        innerFullArray.push(new poly2tri.Point(xArr[i], negRadArray[j]));
        innerFullArray.push(new poly2tri.Point(xArr[i], radArray[j]));
        innerFullArray.push(new poly2tri.Point(negRadArray[j], xArr[i]));
        innerFullArray.push(new poly2tri.Point(radArray[j], xArr[i]));
    }
}


for (var i = 0; i < radArray.length; i++) {
    for (var j = 0; j < radArray.length; j++) {
        innerFullArray.push(new poly2tri.Point(radArray[j], radArray[i]));
    }
}
for (var i = 0; i < radArray.length; i++) {
    for (var j = 0; j < radArray.length; j++) {
        innerFullArray.push(new poly2tri.Point(negRadArray[j], radArray[i]));
    }
}
for (var i = 0; i < radArray.length; i++) {
    for (var j = 0; j < radArray.length; j++) {
        innerFullArray.push(new poly2tri.Point(radArray[j], negRadArray[i]));
    }
}
for (var i = 0; i < radArray.length; i++) {
    for (var j = 0; j < radArray.length; j++) {
        innerFullArray.push(new poly2tri.Point(negRadArray[j], negRadArray[i]));
    }
}


ftprint.addPoints(innerFullArray);

ftprint.triangulate();
var triangles = ftprint.getTriangles();
var facets = new Array;
triangles.forEach(function (tri) {
    var verts = [];
    tri.points_.forEach(function (points) {
        verts.push([points.x, points.y, 0]);
    });
    facets.push(createFacet(verts));
});

var stlObj = {
    description: "ground",
    facets: facets
};

var buildingSTL = stl.fromObject(stlObj);
fs.writeFileSync("stlFiles/ground3.stl", buildingSTL);

var ftptTwo = new poly2tri.SweepContext(contour);

ftptTwo.addPoints(radiusArray);

ftptTwo.triangulate();
var trianglesTwo = ftptTwo.getTriangles();
var facetsTwo = new Array;
trianglesTwo.forEach(function (tri) {
    var verts = [];
    tri.points_.forEach(function (points) {
        verts.push([points.x, points.y, 0]);
    });
    facetsTwo.push(createFacet(verts));
});

var stlObjTwo = {
    description: "ground",
    facets: facetsTwo
};

var buildingSTTwo = stl.fromObject(stlObjTwo);
fs.writeFileSync("stlFiles/ground4.stl", buildingSTTwo);
