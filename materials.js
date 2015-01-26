//Polygon Triangulation (for top/bottom)
//http://polyk.ivank.net/?p=documentation
//https://github.com/r3mi/poly2tri.js

var fs = require('fs'),
    stl = require('stl'),
    poly2tri = require('poly2tri');


function createVertPlane(pt1, pt2, z1, z2, material) {
    var tri1 = [
            [pt1[0], pt1[1], z1],
            [pt2[0], pt2[1], z1],
            [pt2[0], pt2[1], z2]
        ],
        tri2 = [
            [pt1[0], pt1[1], z1],
            [pt2[0], pt2[1], z2],
            [pt1[0], pt1[1], z2]
        ],
        facets = [];
    facets = [{
        verts: tri1,
        material: material
    }, {
        verts: tri2,
        material: material
    }];
    return facets;

}

function distanceFormula(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

function material(point1, point2, height, floorHeight, floors, windowWallRatio, gridSize, buildingName) {
    var windowH = windowWallRatio * floorHeight;
    var sillBottom = (floorHeight - windowH) / 2;
    var sillTop = sillBottom + windowH;
    console.log(windowH);
    //console.log(sillBottom);
    //console.log(sillTop);
    var sideLength, deltaX, deltaY, gridLength, xIt, yIt, iterator, zIterator, pt1, pt2, i, z, zGrid, zIt, tri, tri1, tri2, facets, z1, z2;
    facets = [];
    sideLength = distanceFormula(point1[0], point1[1], point2[0], point2[1]);
    gridLength = ((sideLength % gridSize) / (parseInt(sideLength / gridSize))) + gridSize;
    deltaX = point2[0] - point1[0];
    deltaY = point2[1] - point1[1];
    xIt = deltaX / parseInt(sideLength / gridSize);
    yIt = deltaY / parseInt(sideLength / gridSize);
    //Infinity Check
    if (!isFinite(xIt)) xIt = 0;
    if (!isFinite(yIt)) yIt = 0;
    iterator = parseInt(sideLength / gridSize);

    for (var t = 0; t < floors; t++) {
        var z0 = t * floorHeight,
            z1 = z0 + floorHeight,
            w0 = sillBottom + (t * floorHeight),
            w1 = sillTop + (t * floorHeight);

        if (gridSize > 1.5 * (w1 - w0)) {
            var wHeight = w1 - w0;
            var wGrid = ((wHeight % gridSize) / (parseInt(wHeight / gridSize))) + gridSize;
            var wIt = wHeight / parseInt(wHeight / gridSize);
            var wIterator = parseInt(wHeight / gridSize);
            for (i = 0; i < iterator; i++) {
                pt1 = [point1[0] + (xIt * i), point1[1] + (yIt * i)];
                pt2 = [point1[0] + (xIt * (i + 1)), point1[1] + (yIt * (i + 1))];
                for (var l = 0; l < wIterator; l++) {
                    win0 = w0 + (wIt * l);
                    win1 = w0 + (wIt * (l + 1));
                    tri1 = createVertPlane(pt1, pt2, win0, win1, "glass");
                    facets.push(tri1[0]);
                    facets.push(tri1[1]);
                }

            }
        } else {
            for (i = 0; i < iterator; i++) {
                pt1 = [point1[0] + (xIt * i), point1[1] + (yIt * i)];
                pt2 = [point1[0] + (xIt * (i + 1)), point1[1] + (yIt * (i + 1))];
                tri1 = createVertPlane(pt1, pt2, w0, w1, "glass");
                facets.push(tri1[0]);
                facets.push(tri1[1]);
            }
        }
        if (gridSize > 1.5 * (z1 - z0)) {
            var zHeight = w1 - w0;
            var zGrid = ((zHeight % gridSize) / (parseInt(zHeight / gridSize))) + gridSize;
            var zIt = zHeight / parseInt(zHeight / gridSize);
            var zIterator = parseInt(zHeight / gridSize);
            for (i = 0; i < iterator; i++) {
                pt1 = [point1[0] + (xIt * i), point1[1] + (yIt * i)];
                pt2 = [point1[0] + (xIt * (i + 1)), point1[1] + (yIt * (i + 1))];
                for (var l = 0; l < wIterator; l++) {
                    wall0 = z0 + (zIt * l);
                    wall1 = z0 + (zIt * (l + 1));
                    wall2 = w1 + (zIt * l);
                    wall3 = w1 + (zIt * (l + 1));
                    tri = createVertPlane(pt1, pt2, wall0, wall1, "brick");
                    tri2 = createVertPlane(pt1, pt2, wall2, wall3, "brick");
                    facets.push(tri[0]);
                    facets.push(tri[1]);
                    facets.push(tri2[0]);
                    facets.push(tri2[1]);
                }

            }
        } else {
            for (i = 0; i < iterator; i++) {
                pt1 = [point1[0] + (xIt * i), point1[1] + (yIt * i)];
                pt2 = [point1[0] + (xIt * (i + 1)), point1[1] + (yIt * (i + 1))];
                tri = createVertPlane(pt1, pt2, z0, w0, "brick");
                tri2 = createVertPlane(pt1, pt2, w1, z1, "brick");
                facets.push(tri[0]);
                facets.push(tri[1]);
                facets.push(tri2[0]);
                facets.push(tri2[1]);
            }
        }


    };
    return facets;
}

var facets = [];
material([-10, -10], [10, -10], 20, 3.25, 4, .4, 3, "materialRectangle").forEach(function(facet) {
    facets.push(facet)
});
material([10, -10], [10, 10], 20, 3.25, 4, .4, 3, "materialRectangle").forEach(function(facet) {
    facets.push(facet)
});
material([10, 10], [-10, 10], 20, 3.25, 4, .4, 3, "materialRectangle").forEach(function(facet) {
    facets.push(facet)
});
material([-10, 10], [-10, -10], 20, 3.25, 4, .4, 3, "materialRectangle").forEach(function(facet) {
    facets.push(facet)
});

var stlObj = {
    description: 'materialRectangle',
    facets: facets
};
fs.writeFileSync("stlFiles/materialRectangle.stl", stl.fromObject(stlObj));
