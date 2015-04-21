var buildSTL = require('./buildSTL.js').buildSTL;
var fs = require('fs');
var buildingsM = JSON.parse(fs.readFileSync('buidlingCaseStudy.json'));
var buildings = [{
    "polygon": {
        "path": [{
            "latitude": 38.98844442529447,
            "longitude": -76.9439722409123
        }, {
            "latitude": 38.98844442529447,
            "longitude": -76.94329514190318
        }, {
            "latitude": 38.98776732628534,
            "longitude": -76.94329514190318
        }, {
            "latitude": 38.98776732628534,
            "longitude": -76.9439722409123
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
    "name": "Rectangle",
    "numFloors": 3,
    "flrToFlrHeight": 3.33,
    "shape": "rect",
    "footprintArea": 4406.05473168683,
    "height": 9.99,
    "totalArea": 13218.16,
    "bldgFootprint": "rect",
    "windowWallRatio": 0.25
}, {
    "polygon": {
        "path": [{
            "latitude": 38.98677551942541,
            "longitude": -76.94407192480764
        }, {
            "latitude": 38.98697612370795,
            "longitude": -76.94407192642666
        }, {
            "latitude": 38.98698029484979,
            "longitude": -76.94336815287261
        }, {
            "latitude": 38.987393324346925,
            "longitude": -76.94336278892655
        }, {
            "latitude": 38.98739332479589,
            "longitude": -76.94315522323046
        }, {
            "latitude": 38.9867901121675,
            "longitude": -76.94312572088813
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
    "name": "LShape",
    "numFloors": 8,
    "flrToFlrHeight": 3.33,
    "shape": "l",
    "footprintArea": 2647.8601668192987,
    "height": 26.64,
    "totalArea": 13239.300834096493,
    "bldgFootprint": "l",
    "windowWallRatio": 0.25
}, {
    "polygon": {
        "path": [{
            "latitude": 38.98729944886876,
            "longitude": -76.94234950445829
        }, {
            "latitude": 38.98729944886876,
            "longitude": -76.94167240544917
        }, {
            "latitude": 38.98713017411648,
            "longitude": -76.94167240544917
        }, {
            "latitude": 38.98713017411648,
            "longitude": -76.94184168020145
        }, {
            "latitude": 38.98679162461192,
            "longitude": -76.94184168020145
        }, {
            "latitude": 38.98679162461192,
            "longitude": -76.94218022970601
        }, {
            "latitude": 38.98713017411648,
            "longitude": -76.94218022970601
        }, {
            "latitude": 38.98713017411648,
            "longitude": -76.94234950445829
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
    "name": "TSHape",
    "numFloors": 3,
    "flrToFlrHeight": 4,
    "shape": "t",
    "footprintArea": 2203.060839783086,
    "height": 12,
    "totalArea": 6609.182519349259,
    "bldgFootprint": "t",
    "windowWallRatio": 0.25
}, {
    "polygon": {
        "path": [{
            "latitude": 38.98541315700741,
            "longitude": -76.94221599735104
        }, {
            "latitude": 38.98514999969611,
            "longitude": -76.94221600085788
        }, {
            "latitude": 38.98515000176413,
            "longitude": -76.94265154127434
        }, {
            "latitude": 38.98462368462453,
            "longitude": -76.94265154127434
        }, {
            "latitude": 38.9846236850735,
            "longitude": -76.94221600409595
        }, {
            "latitude": 38.984360527762206,
            "longitude": -76.94221600382716
        }, {
            "latitude": 38.98436052272823,
            "longitude": -76.94308707494609
        }, {
            "latitude": 38.98541316204141,
            "longitude": -76.9430870814222
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
    "id": 7,
    "name": "UShape",
    "numFloors": 3,
    "flrToFlrHeight": 4,
    "shape": "u",
    "footprintArea": 6609.373590190762,
    "height": 12,
    "totalArea": 19828.120770572285,
    "bldgFootprint": "u",
    "windowWallRatio": 0.33
}, {
    "polygon": {
        "path": [{
            "latitude": 38.98694485184972,
            "longitude": -76.94438978789528
        }, {
            "latitude": 38.98687906415492,
            "longitude": -76.94438978821567
        }, {
            "latitude": 38.98687906438538,
            "longitude": -76.94449867597945
        }, {
            "latitude": 38.98674748883845,
            "longitude": -76.94449867618188
        }, {
            "latitude": 38.986747488765324,
            "longitude": -76.94438978862054
        }, {
            "latitude": 38.98668170107051,
            "longitude": -76.94438978870492
        }, {
            "latitude": 38.98668170044124,
            "longitude": -76.94482533854539
        }, {
            "latitude": 38.98674748845068,
            "longitude": -76.94482533886578
        }, {
            "latitude": 38.98674748868115,
            "longitude": -76.94471645130444
        }, {
            "latitude": 38.9868790645427,
            "longitude": -76.94471645150688
        }, {
            "latitude": 38.98687906446955,
            "longitude": -76.94482533927055
        }, {
            "latitude": 38.98694485247899,
            "longitude": -76.94482533935502
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
    "name": "HShape",
    "numFloors": 6,
    "flrToFlrHeight": 12,
    "shape": "h",
    "footprintArea": 826.1503480473832,
    "height": 72,
    "totalArea": 4956.9020882843,
    "bldgFootprint": "h",
    "windowWallRatio": 0.25
}, {
    "polygon": {
        "path": [{
            "latitude": 38.988688809716685,
            "longitude": -76.94262488685303
        }, {
            "latitude": 38.9886888097167,
            "longitude": -76.94296343311912
        }, {
            "latitude": 38.988858084468966,
            "longitude": -76.94296343392865
        }, {
            "latitude": 38.98885808373525,
            "longitude": -76.94313270787134
        }, {
            "latitude": 38.98919663323984,
            "longitude": -76.94313271110991
        }, {
            "latitude": 38.9891966339735,
            "longitude": -76.94296343554794
        }, {
            "latitude": 38.98962233849727,
            "longitude": -76.94296075255883
        }, {
            "latitude": 38.98961608319589,
            "longitude": -76.94262488090789
        }, {
            "latitude": 38.9891966339735,
            "longitude": -76.9426248844241
        }, {
            "latitude": 38.98919663323978,
            "longitude": -76.94245560886225
        }, {
            "latitude": 38.98885808373523,
            "longitude": -76.94245561210082
        }, {
            "latitude": 38.98885808446896,
            "longitude": -76.94262488604339
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
    "name": "Cross",
    "numFloors": 4,
    "flrToFlrHeight": 12,
    "shape": "cross",
    "footprintArea": 4123.234620408998,
    "height": 48,
    "totalArea": 16492.938481635993,
    "bldgFootprint": "cross",
    "windowWallRatio": 0.25
}, {
    "polygon": {
        "path": [{
            "latitude": 38.988318756289054,
            "longitude": -76.94154104719227
        }, {
            "latitude": 38.9880556106174,
            "longitude": -76.94154104800191
        }, {
            "latitude": 38.98792403652299,
            "longitude": -76.94197660541943
        }, {
            "latitude": 38.98845033038346,
            "longitude": -76.94197660703861
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
    "name": "Trap",
    "numFloors": 3,
    "flrToFlrHeight": 10,
    "shape": "trap",
    "footprintArea": 1652.2681530978637,
    "height": 30,
    "totalArea": 4956.804459293591,
    "bldgFootprint": "trap",
    "windowWallRatio": 0.25
}, {
    "polygon": {
        "path": [{
            "latitude": 38.98663734478725,
            "longitude": -76.94064512263473
        }, {
            "latitude": 38.98731444379635,
            "longitude": -76.94132222164393
        }, {
            "latitude": 38.98731444379632,
            "longitude": -76.94064511615811
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
    "name": "Triangle",
    "numFloors": 8,
    "flrToFlrHeight": 10,
    "shape": "triangle",
    "footprintArea": 2203.073070324189,
    "height": 80,
    "totalArea": 17624.58456259351,
    "bldgFootprint": "triangle",
    "windowWallRatio": 0.25
}];

buildSTL([buildings[0]], Math.PI / 4)


//buildSTL([buildings[0]], Math.PI / 4);
//buildSTL([buildings[0],buildings[1],buildings[2],buildings[4]], Math.PI/4);
