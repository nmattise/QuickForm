var fs = require('fs'),
    stl = require('stl');


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

function createWallMaterial(point1, point2, gridSize, height, floorHeight, floors, windowWallRatio, wallMaterial, windowMaterial) {
    var sideLength, deltaX, deltaY, gridLength, xIt, yIt, iterator, zIterator, pt1, pt2, i, z, zGrid, zIt, tri, tri1, tri2, facets, z0, z1, wH, w0, w1, w0Floor, w1Floor;
    //Window Dimensions
    wH = windowWallRatio * floorHeight;
    w0 = (floorHeight - wH) / 2;
    w1 = w0 + wH;
    //Create Facets
    facets = [];
    //Find the Length of the side, and the x and y iterations to creat the grid
    sideLength = distanceFormula(point1[0], point1[1], point2[0], point2[1]);
    gridLength = ((sideLength % gridSize) / (parseInt(sideLength / gridSize))) + gridSize;
    deltaX = point2[0] - point1[0];
    deltaY = point2[1] - point1[1];
    xIt = deltaX / parseInt(sideLength / gridSize);
    yIt = deltaY / parseInt(sideLength / gridSize);
    iterator = parseInt(sideLength / gridSize);
    //Infinity Check
    if (!isFinite(xIt)) xIt = 0;
    if (!isFinite(yIt)) yIt = 0;

    //Iterate Through Floors
    for (var t = 0; t < floors; t++) {
        //Floor Height
        z0 = t * floorHeight;
        z1 = z0 + floorHeight;
        //Window Height
        w0Floor = w0 + (t * floorHeight);
        w1Floor = w1 + (t * floorHeight);
        //Iterate Along wall
        for (i = 0; i < iterator; i++) {
            //Ground Points
            pt1 = [point1[0] + (xIt * i), point1[1] + (yIt * i)];
            pt2 = [point1[0] + (xIt * (i + 1)), point1[1] + (yIt * (i + 1))];
            //Create Plans for bottom wall, window, and top wall
            tri = createVertPlane(pt1, pt2, z0, w0Floor, wallMaterial);
            tri2 = createVertPlane(pt1, pt2, w0Floor, w1Floor, windowMaterial);
            tri1 = createVertPlane(pt1, pt2, w1Floor, z1, wallMaterial);
            //Push planes to facets
            facets.push(tri[0]);
            facets.push(tri[1]);
            facets.push(tri2[0]);
            facets.push(tri2[1]);
            facets.push(tri1[0]);
            facets.push(tri1[1]);
        };
    };
    return facets;
}

var facets = [];
createWallMaterial([-10, -10], [10, -10], 3, 20, 5, 4, .25, "brick", "glass").forEach(function(facet) {
    facets.push(facet)
});
createWallMaterial([10, -10], [10, 10], 3, 20, 5, 4, .25, "brick", "glass").forEach(function(facet) {
    facets.push(facet)
});
createWallMaterial([10, 10], [-10, 10], 3, 20, 5, 4, .25, "brick", "glass").forEach(function(facet) {
    facets.push(facet)
});
createWallMaterial([-10, 10], [-10, -10], 3, 20, 5, 4, .25, "brick", "glass").forEach(function(facet) {
    facets.push(facet)
});

var stlObj = {
    description: 'materialRectangle',
    facets: facets
};
fs.writeFileSync("stlFiles/materialRectangle.stl", stl.fromObject(stlObj));
