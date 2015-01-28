var buildSTL = require('./buildSTL.js').buildSTL;

var rect = {
        "polygon": {
            "path": [{
                "latitude": 38.98762347367878,
                "longitude": -76.94352699421583
            }, {
                "latitude": 38.98762347367878,
                "longitude": -76.9428498952067
            }, {
                "latitude": 38.988300572687905,
                "longitude": -76.9428498952067
            }, {
                "latitude": 38.988300572687905,
                "longitude": -76.94352699421583
            }],
            "fill": {
                "color": "#777",
                "opacity": 0.6
            },
            "stroke": {
                "color": "#777",
                "weight": 1
            },
            "id": 0
        },
        "id": 0,
        "name": "Rect",
        "numFloors": 4,
        "flrToFlrHeight": 4,
        "shape": "rect",
        "footprintArea": 4406.063685894671,
        "height": 16,
        "totalArea": 17624.254743578684,
        "bldgFootprint": "rect"
    },
    l = {
        "polygon": {
            "path": [{
                "latitude": 38.987745431004775,
                "longitude": -76.94249210873537
            }, {
                "latitude": 38.98735070646844,
                "longitude": -76.94249210583459
            }, {
                "latitude": 38.9873507085366,
                "longitude": -76.94205655187773
            }, {
                "latitude": 38.98748228275276,
                "longitude": -76.94205655234967
            }, {
                "latitude": 38.98748228257245,
                "longitude": -76.94162099758316
            }, {
                "latitude": 38.987745429746205,
                "longitude": -76.94162099596397
            }],
            "fill": {
                "color": "#777",
                "opacity": 0.6
            },
            "stroke": {
                "color": "#777",
                "weight": 1
            },
            "id": 1
        },
        "id": 1,
        "name": "L",
        "numFloors": 4,
        "flrToFlrHeight": 4,
        "shape": "l",
        "footprintArea": 2753.804068991814,
        "height": 16,
        "totalArea": 11015.216275967256,
        "bldgFootprint": "l"
    },
    t = {
        "polygon": {
            "path": [{
                "latitude": 38.9875242081253,
                "longitude": -76.94402202054626
            }, {
                "latitude": 38.987524208858986,
                "longitude": -76.94419129529848
            }, {
                "latitude": 38.987862758363526,
                "longitude": -76.9441912936793
            }, {
                "latitude": 38.98786275836354,
                "longitude": -76.94452984642231
            }, {
                "latitude": 38.987524208858986,
                "longitude": -76.94452984480313
            }, {
                "latitude": 38.9875242081253,
                "longitude": -76.94469911955535
            }, {
                "latitude": 38.98735493337302,
                "longitude": -76.94469911793617
            }, {
                "latitude": 38.98735493337302,
                "longitude": -76.94402202216544
            }],
            "fill": {
                "color": "#777",
                "opacity": 0.6
            },
            "stroke": {
                "color": "#777",
                "weight": 1
            },
            "id": 2
        },
        "id": 2,
        "name": "T",
        "numFloors": 2,
        "flrToFlrHeight": 4,
        "shape": "t",
        "footprintArea": 2203.048576627731,
        "height": 8,
        "totalArea": 4406.097153255462,
        "bldgFootprint": "t"
    },
    u = {
        "polygon": {
            "path": [{
                "latitude": 38.98844946447333,
                "longitude": -76.94248629711805
            }, {
                "latitude": 38.98844946447333,
                "longitude": -76.94180919810893
            }, {
                "latitude": 38.98895728873017,
                "longitude": -76.94180919810893
            }, {
                "latitude": 38.98895728873017,
                "longitude": -76.94197847286121
            }, {
                "latitude": 38.98861873922561,
                "longitude": -76.94197847286121
            }, {
                "latitude": 38.98861873922561,
                "longitude": -76.94231702236577
            }, {
                "latitude": 38.98895728873017,
                "longitude": -76.94231702236577
            }, {
                "latitude": 38.98895728873017,
                "longitude": -76.94248629711805
            }],
            "fill": {
                "color": "#777",
                "opacity": 0.6
            },
            "stroke": {
                "color": "#777",
                "weight": 1
            },
            "id": 3
        },
        "id": 3,
        "name": "U",
        "numFloors": 8,
        "flrToFlrHeight": 4,
        "shape": "u",
        "footprintArea": 2203.0082964787157,
        "height": 32,
        "totalArea": 17624.066371829726,
        "bldgFootprint": "u"
    },
    h = {
        "polygon": {
            "path": [{
                "latitude": 38.98647264230159,
                "longitude": -76.9435404052609
            }, {
                "latitude": 38.98647264230159,
                "longitude": -76.94337113050862
            }, {
                "latitude": 38.98664191705387,
                "longitude": -76.94337113050862
            }, {
                "latitude": 38.98664191705387,
                "longitude": -76.94303258100406
            }, {
                "latitude": 38.98647264230159,
                "longitude": -76.94303258100406
            }, {
                "latitude": 38.98647264230159,
                "longitude": -76.94286330625178
            }, {
                "latitude": 38.987149741310716,
                "longitude": -76.94286330625178
            }, {
                "latitude": 38.987149741310716,
                "longitude": -76.94303258100406
            }, {
                "latitude": 38.986980466558435,
                "longitude": -76.94303258100406
            }, {
                "latitude": 38.986980466558435,
                "longitude": -76.94337113050862
            }, {
                "latitude": 38.987149741310716,
                "longitude": -76.94337113050862
            }, {
                "latitude": 38.987149741310716,
                "longitude": -76.9435404052609
            }],
            "fill": {
                "color": "#777",
                "opacity": 0.6
            },
            "stroke": {
                "color": "#777",
                "weight": 1
            },
            "id": 4
        },
        "id": 4,
        "name": "H",
        "numFloors": 2,
        "flrToFlrHeight": 4,
        "shape": "h",
        "footprintArea": 3304.601489787419,
        "height": 8,
        "totalArea": 6609.202979574838,
        "bldgFootprint": "h"
    },
    cross = {
        "polygon": {
            "path": [{
                "latitude": 38.988850558045115,
                "longitude": -76.94477929024144
            }, {
                "latitude": 38.988850558045115,
                "longitude": -76.94494856499372
            }, {
                "latitude": 38.98851200854055,
                "longitude": -76.94494856499372
            }, {
                "latitude": 38.98851200854055,
                "longitude": -76.94477929024144
            }, {
                "latitude": 38.98834273378827,
                "longitude": -76.94477929024144
            }, {
                "latitude": 38.98834273378827,
                "longitude": -76.94444074073688
            }, {
                "latitude": 38.98851200854055,
                "longitude": -76.94444074073688
            }, {
                "latitude": 38.98851200854055,
                "longitude": -76.9442714659846
            }, {
                "latitude": 38.988850558045115,
                "longitude": -76.9442714659846
            }, {
                "latitude": 38.988850558045115,
                "longitude": -76.94444074073688
            }, {
                "latitude": 38.989019832797396,
                "longitude": -76.94444074073688
            }, {
                "latitude": 38.989019832797396,
                "longitude": -76.94477929024144
            }],
            "fill": {
                "color": "#777",
                "opacity": 0.6
            },
            "stroke": {
                "color": "#777",
                "weight": 1
            },
            "id": 5
        },
        "id": 5,
        "name": "Cross",
        "numFloors": 5,
        "flrToFlrHeight": 4,
        "shape": "cross",
        "footprintArea": 3304.514185915169,
        "height": 20,
        "totalArea": 16522.570929575846,
        "bldgFootprint": "cross"
    },
    trap = {
        "polygon": {
            "path": [{
                "latitude": 38.98798246702466,
                "longitude": -76.94132758282362
            }, {
                "latitude": 38.98798246702466,
                "longitude": -76.9406504838145
            }, {
                "latitude": 38.98832101652922,
                "longitude": -76.94081975856678
            }, {
                "latitude": 38.98832101652922,
                "longitude": -76.94115830807134
            }],
            "fill": {
                "color": "#777",
                "opacity": 0.6
            },
            "stroke": {
                "color": "#777",
                "weight": 1
            },
            "id": 6
        },
        "id": 6,
        "name": "Trap",
        "numFloors": 8,
        "flrToFlrHeight": 3,
        "shape": "trap",
        "footprintArea": 1652.2689805168263,
        "height": 24,
        "totalArea": 13218.15184413461,
        "bldgFootprint": "trap"
    },
    triangle = {
        "polygon": {
            "path": [{
                "latitude": 38.98867004683864,
                "longitude": -76.94398028753935
            }, {
                "latitude": 38.98867004683864,
                "longitude": -76.94330318853022
            }, {
                "latitude": 38.989347145847766,
                "longitude": -76.94398028753935
            }],
            "fill": {
                "color": "#777",
                "opacity": 0.6
            },
            "stroke": {
                "color": "#777",
                "weight": 1
            },
            "id": 7
        },
        "id": 7,
        "name": "Triangle",
        "numFloors": 3,
        "flrToFlrHeight": 3,
        "shape": "triangle",
        "footprintArea": 2203.009807047633,
        "height": 9,
        "totalArea": 6609.029421142899,
        "bldgFootprint": "triangle"
    };


buildSTL([rect, l, t])
