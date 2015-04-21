var stl = require('stl'),
    fs = require('fs');

var coords = [
    [5.925554826343262, 47.30544366138003],
    [47.305443661380025, 5.925554826343273],
    [-5.925554826343259, -47.30544366138004],
    [-47.305443661380025, -5.9255548263432765]
];

function distanceFormula(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

function findRotation(pt1, pt2) {
    var deltaX, deltaY, theta;
    deltaX = pt2[0] - pt1[0];
    deltaY = pt2[1] - pt1[1];
    theta = Math.atan2(deltaY, deltaX);
    return theta
}

function createRectangularGrid(pt0, pt1, pt3, gridSize) {
    var l0, gridLength0, gridSize0, deltaX0, deltaY0, iterator0, xIt0, yIt0, theta0, l3, gridLength3, gridSize3, deltaX3, deltaY3, iterator3, xIt3, yIt3, theta3, allGrids = [];
    //Side1
    l0 = distanceFormula(pt0[0], pt0[1], pt1[0], pt1[1]);
    gridLength0 = ((l0 % gridSize) / parseInt(l0 / gridSize)) + gridSize;
    gridSize0 = gridSize;
    //Number of Grid Checks, min 2
    if ((gridSize * 2) > l0) {
        gridLength0 = l0 / 2;
        gridSize0 = gridLength0;
    };
    deltaX0 = pt1[0] - pt0[0];
    deltaY0 = pt1[1] - pt0[1];
    iterator0 = parseInt(l0 / gridSize0);
    xIt0 = deltaX0 / iterator0;
    yIt0 = deltaY0 / iterator0;

    //Side 4
    l3 = distanceFormula(pt0[0], pt0[1], pt3[0], pt3[1]);
    gridLength3 = ((l3 % gridSize) / parseInt(l3 / gridSize)) + gridSize;
    gridSize3 = gridSize;
    //Number of Grid Checks, min 2
    if ((gridSize * 2) > l3) {
        gridLength3 = l3 / 2;
        gridSize3 = gridLength3;
    };
    deltaX3 = pt0[0] - pt3[0];
    deltaY3 = pt0[1] - pt3[1];
    iterator3 = parseInt(l3 / gridSize3);
    xIt3 = deltaX3 / iterator3;
    yIt3 = deltaY3 / iterator3;

    //Rotations
    theta0 = findRotation(pt0, pt1)
    theta3 = findRotation(pt0, pt3)

    //Loop3
    for (var i = 0; i < iterator3; i++) {
        var point0 = [pt0[0] + (gridLength3 * j * Math.cos(theta3)), pt0[1] + (gridLength3 * j * Math.sin(theta3))];
        var point3 = [pt0[0] + (gridLength3 * (j + 1) * Math.cos(theta3)), pt0[1] + (gridLength3 * (j + 1) * Math.sin(theta3))];
        //Loop0
        for (var j = 0; j < iterator0; j++) {
            point0_1 = [point0[0] + (gridLength0 * i * Math.cos(theta0)), point0[1] + (gridLength0 * i * Math.sin(theta0))];
            point1 = [point0[0] + (gridLength0 * (i + 1) * Math.cos(theta0)), point0[1] + (gridLength0 * (i + 1) * Math.sin(theta0))];
            point2 = [point3[0] + (gridLength0 * (i + 1) * Math.cos(theta0)), point3[1] + (gridLength0 * (i + 1) * Math.sin(theta0))];
            point3_1 = [point3[0] + (gridLength0 * i * Math.cos(theta0)), point3[1] + (gridLength0 * i * Math.sin(theta0))];
        }
    }

}

function createWallGrid(point1, point2, gridSize) {
    var sideLength, gridLength, deltaX, deltaY, xIt, yIt, iterator, points = [];
    sideLength = distanceFormula(point1[0], point1[1], point2[0], point2[1]);
    gridLength = ((sideLength % gridSize) / parseInt(sideLength / gridSize)) + gridSize;

    //Number of Grid Checks, min 2
    if ((gridSize * 2) > sideLength) {
        gridLength = sideLength / 2;
        gridSize = gridLength;
    };
    //Deltas and Iterators
    deltaX = point2[0] - point1[0];
    deltaY = point2[1] - point1[1];
    iterator = parseInt(sideLength / gridSize);
    xIt = deltaX / iterator;
    yIt = deltaY / iterator;

    //Loop and create grid
    for (i = 0; i <= iterator; i++) {
        points[i] = [point1[0] + (xIt * i), point1[1] + (yIt * i)];
    };
    return points
}

function createVertPlane(pt1, pt2, z1, z2) {
    var tri1, tri2, facets;
    tri1 = [
        [pt1[0], pt1[1], z1],
        [pt2[0], pt2[1], z2],
        [pt2[0], pt2[1], z1]

    ];
    tri2 = [
        [pt1[0], pt1[1], z1],
        [pt1[0], pt1[1], z2],
        [pt2[0], pt2[1], z2]
    ];
    facets = [{
        verts: tri1
    }, {
        verts: tri2
    }];
    return facets;
}

function createHorPlaneUp(pt1, pt2, pt3, pt4, z) {
    var tri1 = [
            [pt1[0], pt1[1], z],
            [pt3[0], pt3[1], z],
            [pt2[0], pt2[1], z]
        ],
        tri2 = [
            [pt1[0], pt1[1], z],
            [pt4[0], pt4[1], z],
            [pt3[0], pt3[1], z]
        ],
        facets = [{
            verts: tri1
        }, {
            verts: tri2
        }];
    return facets;
}

function createWallGeometry(name, coords, gridSize, floors, floorHeight, height, wwr, wallMaterial, windowMaterial) {
    var winH, wallH, z0, z1, z2, heights,
        points = [],
        facets = [],
        stlString = '';
    winH = floorHeight * wwr;
    wallH = (floorHeight - winH) / 2;

    //Loop Floors
    for (var floor = 0; floor < floors; floor++) {
        //Define z Heights
        z0 = floorHeight * floor;
        z1 = z0 + wallH;
        z2 = z1 + winH;
        z3 = z2 + wallH;
        heights = [z0, z1, z2, z3];
        //Loop Different Sections of Floor (Wall --> Window --> Wall)
        for (var z = 1; z < heights.length; z++) {
            //Floor Surface Count
            var count = 0;
            //Material Set
            var material = 'brick';
            if (heights[z] == z2) material = 'glass';
            //Loop through coords
            for (var c = 1; c < coords.length; c++) {
                var points = createWallGrid(coords[c - 1], coords[c], gridSize);
                for (var pt = 1; pt < points.length; pt++) {
                    createVertPlane(points[pt - 1], points[pt], heights[z - 1], heights[z]).forEach(function(facet) {
                        //Description BuildingName:FacetMaterial:Floor#:ZNumber:FloorPatchCount
                        var stlObj = {
                            description: name + ':' + material + ':' + floor + ':' + (z - 1) + ':' + Math.floor(count / 2),
                            facets: facet
                        };
                        stlString += stl.fromObject(stlObj) + "\n";
                        count++;
                    });

                };
            };
            var points = createWallGrid(coords[coords.length - 1], coords[0], gridSize);
            for (var pt = 1; pt < points.length; pt++) {
                createVertPlane(points[pt - 1], points[pt], heights[z - 1], heights[z]).forEach(function(facet) {
                    var stlObj = {
                        description: name + ':' + material + ':' + floor + ':' + (z - 1) + ':' + Math.floor(count / 2),
                        facets: facet
                    };
                    stlString += stl.fromObject(stlObj) + "\n";
                    count++;
                });
            };
        };
    }
    return stlString;
}

function createRoofGeometry(buildingName, pt0, pt1, pt3, gridSize, height, roofSegmentNum, roofMaterial) {
    var l0, l3, gridLength0, deltaX0, deltaY0, xIt0, yIt0, iterator0, deltaX3, deltaY3, xIt3, yIt3, iterator3, gridLength3, theta0, theta3, triFloor, triRoof, facets = [];
    var stlString = '';
    //Lengths of Square
    l0 = distanceFormula(pt0[0], pt0[1], pt1[0], pt1[1]);
    l3 = distanceFormula(pt0[0], pt0[1], pt3[0], pt3[1]);
    //GridLength & Iterators for Side 0
    gridLength0 = ((l0 % gridSize) / (parseInt(l0 / gridSize))) + gridSize;
    if ((gridSize * 2) > l0) {
        gridLength0 = l0 / 2;
        gridSize = gridLength0;
    }
    deltaX0 = pt1[0] - pt0[0];
    deltaY0 = pt1[1] - pt0[1];
    iterator0 = parseInt(l0 / gridSize);
    xIt0 = deltaX0 / iterator0;
    yIt0 = deltaY0 / iterator0;

    //Infinity Check
    if (!isFinite(xIt0)) xIt0 = 0;
    if (!isFinite(yIt0)) yIt0 = 0;
    if (!isFinite(gridLength0)) gridLength0 = l0;
    //0 Check
    if (xIt0 == 0 && yIt0 == 0) {
        xIt0 = deltaX0;
        yIt0 = deltaY0;
        iterator0 = 1;
    };
    //GridLength & Iterators for Side 3
    gridLength3 = ((l3 % gridSize) / (parseInt(l3 / gridSize))) + gridSize;
    if ((gridSize * 2) > l3) {
        gridLength3 = l3 / 2;
        gridSize = gridLength3;
    }
    deltaX3 = pt0[0] - pt3[0];
    deltaY3 = pt0[1] - pt3[1];
    iterator3 = parseInt(l3 / gridSize);
    xIt3 = deltaX3 / iterator3;
    yIt3 = deltaY3 / iterator3;


    //Rotation
    theta0 = findRotation(pt0, pt1);
    theta3 = findRotation(pt0, pt3);
    //Loop Along side 3
    for (var j = 0; j < iterator3; j++) {
        var point0, point3;
        point0 = [pt0[0] + (gridLength3 * j * Math.cos(theta3)), pt0[1] + (gridLength3 * j * Math.sin(theta3))];
        point3 = [pt0[0] + (gridLength3 * (j + 1) * Math.cos(theta3)), pt0[1] + (gridLength3 * (j + 1) * Math.sin(theta3))];
        //Loop Along side 0
        for (var i = 0; i < iterator0; i++) {
            var point0_1, point3_1, point1, point2;
            point0_1 = [point0[0] + (gridLength0 * i * Math.cos(theta0)), point0[1] + (gridLength0 * i * Math.sin(theta0))];
            point1 = [point0[0] + (gridLength0 * (i + 1) * Math.cos(theta0)), point0[1] + (gridLength0 * (i + 1) * Math.sin(theta0))];
            point2 = [point3[0] + (gridLength0 * (i + 1) * Math.cos(theta0)), point3[1] + (gridLength0 * (i + 1) * Math.sin(theta0))];
            point3_1 = [point3[0] + (gridLength0 * i * Math.cos(theta0)), point3[1] + (gridLength0 * i * Math.sin(theta0))];
            //Roof
            triRoof = createHorPlaneUp(point0_1, point1, point2, point3_1, height);
            var stlObj = {
                description: buildingName + ':' + roofMaterial + ':' + 'roof' + ':' + roofSegmentNum + ':' + i + ':' + j,
                facets: triRoof[0]
            };
            stlString += stl.fromObject(stlObj) + "\n";
            var stlObj = {
                description: buildingName + ':' + roofMaterial + ':' + 'roof' + ':' + roofSegmentNum + ':' + i + ':' + j,
                facets: triRoof[1]
            };
            stlString += stl.fromObject(stlObj) + "\n";
        }
    }
    return stlString;
}


var stlString = createWallGeometry("Rectangle", coords, 10, 3, 3.33, 9.99, 0.25, "glass", "brick");
stlString += createRoofGeometry("Rectangle", coords[0], coords[1], coords[3], 5, 16, 0, 'asphalt')
fs.writeFileSync('Rectangle.stl', stlString)
