//Polygon Triangulation (for top/bottom)
//http://polyk.ivank.net/?p=documentation
//https://github.com/r3mi/poly2tri.js

var fs = require('fs'),
    stl = require('stl'),
    poly2tri = require('poly2tri');

//Test array of Points
//Rectangel
var rect = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10]
];
//L Shape
var lShape = [
    [0, 0],
    [10, 0],
    [10, 30],
    [5, 30],
    [5, 10],
    [0, 10]
];
var hShape = [[7.314938702695629, 0.0000033993947656681205], [7.314947449825986, -9.411243432251544], [21.944842347285306, -9.411216237123552], [21.94481610586253, 0.000030594552890114854], [29.259754808520253, 0.000054389962591562513], [29.259894761833728, -37.644932935316284], [21.944921070928867, -37.644956730807436], [21.944894830046042, -28.233709899638363], [7.3149649441024716, -28.233737094794478], [7.314973691023224, -37.64498392575607], [4.610181323164913e-15, -37.644987325118564]];

function createFacet(verts) {
    return {
        verts: verts
    }
}

function createPlane(p1, p2, h) {
    var tri1 = [[p1[0], p1[1], 0], [p2[0], p2[1], 0], [p2[0], p2[1], h]];
    var tri2 = [[p1[0], p1[1], 0], [p2[0], p2[1], h], [p1[0], p1[1], h]];
    var facets = [{
        verts: tri1
    }, {
        verts: tri2
    }];
    return facets;
}

function createSTL(points, height, buildingName) {
    //Add facets
    var facets = [];

    //Walls
    for (var i = 1; i < points.length; i++) {
        var tri = createPlane(points[i - 1], points[i], height);
        //console.log(triangle);
        facets.push(tri[0]);
        facets.push(tri[1]);
    }
    var tri = createPlane(lShape[lShape.length - 1], lShape[0], height);
    facets.push(tri[0]);
    facets.push(tri[1]);

    //Top and Bottom
    var contour = [];
    points.forEach(function (point) {
        contour.push(new poly2tri.Point(point[0], point[1]));
    });
    var swctx = new poly2tri.SweepContext(contour);
    swctx.triangulate();
    var triangles = swctx.getTriangles();
    //Create Bottom Plane
    triangles.forEach(function (tri) {
        var verts = [];
        tri.points_.reverse();
        tri.points_.forEach(function (points) {
            verts.push([points.x, points.y, 0]);
        });
        facets.push(createFacet(verts));
    });

    //Create Top Plane
    triangles.forEach(function (tri) {
        var verts = [];
        tri.points_.reverse();
        tri.points_.forEach(function (points) {
            verts.push([points.x, points.y, height]);
        });
        facets.push(createFacet(verts));
    });

    var stlObj = {
        description: buildingName,
        facets: facets
    };
    fs.writeFileSync(buildingName + '.stl', stl.fromObject(stlObj));
}


createSTL(lShape, 20, "lShape");
createSTL(hShape, 20, "hShape");
