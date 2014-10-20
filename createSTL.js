//Polygon Triangulation (for top/bottom)
//http://polyk.ivank.net/?p=documentation
//https://github.com/r3mi/poly2tri.js

var fs = require('fs'),
    stl = require('stl'),
    poly2tri = require('poly2tri');

//Export StlFile Creator
module.exports.createSTL = createSTL;

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
        facets.push(tri[0]);
        facets.push(tri[1]);
    }
    var tri = createPlane(points[points.length - 1], points[0], height);
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
    fs.writeFileSync("stlFiles/" + buildingName + '.stl', stl.fromObject(stlObj));
}

//Test Area
//Test array of Points
//Rectangel
var rect = [[-57.63177479381397, 62.96016824883858],
  [-28.37188994378985, 62.9600083820476],
  [-28.371754238274914, 100.60499570672297],
  [-57.631499135382725, 100.60515557322908]];
//L Shape
var lShape = [[0, 0], [21.944949511141402, 0.000030594552889937804], [21.944897028775227, 18.822524257521696], [14.629931351713136, 18.82250726077641], [14.629896363461066, 37.645000923258166], [0, 37.64498732582589]];
var hShape = [[0, 0], [7.3149884497747655, 0.000003399394766103404], [7.3149797027113985, 9.411250230301802], [21.944939105977053, 9.411277425151638], [21.944965347099927, 0.000030594552889159666], [29.259953796836786, 0.00005438960893111689], [29.259813844250164, 37.645041714505275], [21.94486038255435, 37.64501791921016], [21.944886623882624, 28.23377108819023], [7.314962208834206, 28.23374389349149], [7.3149534616820695, 37.644990724444746], [0, 37.644987325118564]];
var cross = [[0, 0], [-7.314961023575753, 0.0000033993947661713356], [-7.314978517729139, -18.8224902631869], [2.3050906615824566e-15, -18.822493662559282], [3.457635992330374e-15, -28.23374049348526], [14.629974527657067, -28.233726895841233], [14.629957033279384, -18.82248006504914], [21.94493554993564, -18.822463068123742], [21.944883067403357, 0.00003059455289311088], [14.6299220449461, 0.00001359757906174267], [14.629904550380955, 9.41126042968932], [0, 9.411246831633303]];

var uShape = [[0, 0], [29.259952418607927, 0.00005438960892903199], [29.259847454073828, 28.23379488376851], [21.94488558975945, 28.233771088323895], [21.94493807202891, 9.411277425859078], [7.314979358428483, 9.411250231009179], [7.31496186446415, 28.233743893513818], [0, 28.23374049419258]];

var tShape = [[0, 0], [7.314981943914533, 0.000003399394765457238], [7.314999437993286, -18.822490263191344], [21.944998310745657, -18.82246306814325], [21.944945828419684, 0.00003059455289155676], [29.259927772296304, 0.00005438960892586044], [29.25989278411707, 9.411301221293458], [0, 9.411246831633303]];

//Run Functions for Array
createSTL(rect, 20, "rect");
//createSTL(lShape, 20, "lShape");
//createSTL(hShape, 20, "hShape");
//createSTL(cross, 20, "cross");
//createSTL(tShape, 20, "tShape");
//createSTL(uShape, 20, "uShape");
