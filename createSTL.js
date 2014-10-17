//Polygon Triangulation (for top/bottom)
//http://polyk.ivank.net/?p=documentation
//https://github.com/r3mi/poly2tri.js

var fs = require('fs'),
    stl = require('stl'),
    poly2tri = require('poly2tri');

//Test array of Points
//Rectangel
var rect = [[117.03794335411723, 0.0008702443527342479], [117.04018262923651, -150.5790790485325], [1.8440725292746273e-14, -150.57994930118156]];
//L Shape
var lShape = [[29.260022236090915, 0.000054389608930479266], [29.2601621880931, -37.644932935079744], [43.89024328247792, -37.64486494763048], [43.89045320879839, -75.28985227350465], [9.220362646416448e-15, -75.28997465094444]];
var hShape = [[7.314938702695629, 0.0000033993947656681205], [7.314947449825986, -9.411243432251544], [21.944842347285306, -9.411216237123552], [21.94481610586253, 0.000030594552890114854], [29.259754808520253, 0.000054389962591562513], [29.259894761833728, -37.644932935316284], [21.944921070928867, -37.644956730807436], [21.944894830046042, -28.233709899638363], [7.3149649441024716, -28.233737094794478], [7.314973691023224, -37.64498392575607], [4.610181323164913e-15, -37.644987325118564]];
var cross = [[29.259693017648782, 0.00005438996259031648], [29.25976299471009, -18.822439273321795], [43.889644491655325, -18.822371285269757], [43.88985442251353, -56.4673586101724], [29.25990294875028, -56.467426598090576], [29.25997292513898, -75.28992026070432], [9.220362646416448e-15, -75.28997465094444], [6.915271984833991e-15, -56.46748098838516], [-14.629951474982395, -56.46746739080317], [-14.629881497990521, -18.82248006573344], [2.3050906616690786e-15, -18.822493663266606]];

var uShape = [[14.629851248369631, 0.000013597579062043672], [14.629921225474554, -37.64497372755522], [43.88976367835188, -37.644864947128525], [43.889553747105765, 0.00012237785790664583], [58.519404995172074, 0.00021756020402277296], [58.51982485692092, -56.46726342679208], [6.915271984747369e-15, -56.467480987677845]];

var tShape = [[58.5198827912823, 0.00021755914303653266], [58.520022743449495, -18.822210685906306], [43.89001705756737, -18.82230586817016], [43.89022698500009, -56.467162356074674], [14.630075662095015, -56.467271136288474], [14.63000568643885, -18.822414648154894], [2.305082650337937e-15, -18.8224282457834]];

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


createSTL(rect, 20, "rect");
createSTL(lShape, 20, "lShape");
createSTL(hShape, 20, "hShape");
createSTL(cross, 20, "cross");
createSTL(tShape, 20, "tShape");
createSTL(uShape, 20, "uShape");
