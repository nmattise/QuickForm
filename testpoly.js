var fs = require('fs'),
    stl = require('stl'),
    poly2tri = require('poly2tri');


function createFacet(verts) {
    return {
        verts: verts
    }
}

function createGround(bldgFootprint, distanceRatio, callback) {
    var contour = new Array,
        facets = new Array,
        groundShape,
        point = new Array,
        triangles,
        verts = new Array,
        stlObj = new Object,
        buildingSTL;
    for (var i = 0; i < bldgFootprint.length; i++) {
        contour.push(new poly2tri.Point(bldgFootprint[i][0] * distanceRatio, bldgFootprint[i][1] * distanceRatio));
    }
    groundShape = new poly2tri.SweepContext(contour);

    //Section2
    for (var i = 0; i < bldgFootprint.length; i++) {
        if (bldgFootprint[i][1] < 0) {
            point[1] = bldgFootprint[i][1] - 5;
        } else {
            point[1] = bldgFootprint[i][1] + 5;
        }
        if (bldgFootprint[i][0] < 0) {
            point[0] = bldgFootprint[i][0] - 5;
        } else {
            point[0] = bldgFootprint[i][0] + 5;
        }
        groundShape.addPoint(new poly2tri.Point(point[0], point[1]));
    }
    for (var i = 0; i < bldgFootprint.length; i++) {
        if (bldgFootprint[i][1] < 0) {
            point[1] = bldgFootprint[i][1] - 15;
        } else {
            point[1] = bldgFootprint[i][1] + 15;
        }
        if (bldgFootprint[i][0] < 0) {
            point[0] = bldgFootprint[i][0] - 15;
        } else {
            point[0] = bldgFootprint[i][0] + 15;
        }
        groundShape.addPoint(new poly2tri.Point(point[0], point[1]));
    }

    groundShape.triangulate();
    triangles = groundShape.getTriangles();
    triangles.forEach(function (t) {
        verts = [];
        t.getPoints().forEach(function (p) {
            verts.push([p.x, p.y, 0]);
        });
        facets.push(createFacet(verts));
    });
    stlObj = {
        description: "ground",
        facets: facets
    };
    buildingSTL = stl.fromObject(stlObj);
    callback(buildingSTL);
}

var rectangle = [[-5, -5], [5, -5], [5, 5], [-5, 5]];
createGround(rectangle, 15, function (buildingSTL) {
    fs.writeFileSync("stlFiles/polyGround.stl", buildingSTL);
})
