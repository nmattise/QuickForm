var fs = require('fs'),
    csv = require('fast-csv');

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

var walls = {
    wallsFloor0Z0: [2, 8, 22, 20, 24, 14, 12, 10, 4, 5, 9, 13, 3, 17, 15, 16, 25, 19, 7, 18, 23, 6, 21, 11],
    wallsFloor0Z1: [31, 30, 49, 44, 28, 41, 34, 38, 42, 45, 43, 50, 29, 46, 36, 35, 51, 47, 37, 32, 48, 33, 40, 39],
    wallsFloor0Z2: [62, 59, 65, 60, 55, 56, 77, 68, 63, 57, 71, 67, 64, 72, 69, 66, 61, 75, 70, 73, 76, 58, 54, 74],
    wallsFloor1Z0: [89, 87, 102, 86, 81, 93, 84, 100, 91, 96, 88, 99, 82, 80, 103, 101, 85, 94, 95, 83, 97, 98, 92, 90],
    wallsFloor1Z1: [116, 113, 120, 114, 112, 117, 123, 129, 111, 124, 110, 107, 115, 125, 122, 106, 126, 109, 108, 121, 127, 119, 118, 128],
    wallsFloor1Z2: [153, 133, 150, 151, 139, 136, 155, 146, 134, 135, 141, 143, 144, 142, 138, 140, 137, 152, 154, 147, 132, 149, 148, 145],
    wallsFloor2Z0: [159, 158, 176, 181, 174, 160, 167, 172, 166, 163, 177, 170, 165, 169, 178, 179, 180, 175, 173, 162, 171, 161, 164, 168],
    wallsFloor2Z1: [188, 193, 187, 194, 204, 186, 189, 206, 202, 185, 203, 184, 200, 198, 205, 191, 207, 190, 199, 196, 195, 201, 197, 192],
    wallsFloor2Z2: [216, 218, 233, 217, 228, 226, 219, 232, 223, 225, 229, 211, 212, 220, 222, 231, 230, 213, 227, 215, 210, 221, 224, 214]
};

var roof = {
    roofSegment1: [414, 438, 336, 378, 270, 246, 420, 348, 444, 354, 294, 252, 312, 318, 408, 426, 372, 282, 324, 306, 432, 342, 264, 396, 366, 384, 330, 258, 276, 360, 402, 390, 288, 300, 240]
};

var ground = {
    innerGround: [684, 450, 660, 708, 516, 678, 546, 600, 798, 588, 564, 636, 726, 480, 486, 648, 462, 816, 822, 738, 642, 468, 828, 552, 780, 576, 510, 654, 804, 606, 786, 744, 630, 624, 750, 492, 612, 768, 594, 504, 540, 792, 498, 474, 690, 582, 558, 714, 702, 720, 672, 810, 618, 456, 522, 732, 762, 534, 528, 666, 756, 696, 570, 774],
    topGround: [858, 876, 846, 870, 828, 834, 840, 864, 852],
    leftGround: [876, 924, 906, 930, 888, 900, 912, 894, 936, 918, 882],
    rightGround: [954, 996, 990, 942, 984, 972, 960, 948, 978, 936, 966],
    bottomGround: [1014, 1074, 1008, 1062, 996, 1032, 1020, 1002, 1056, 1068, 1080, 1044, 1038, 1050, 1026]
};

var building = {
    walls: {
        wallsFloor0Z0: {
            surfaces: walls.wallsFloor0Z0.sort(function(a, b) {
                return a - b
            }),
            names: []
        },
        wallsFloor0Z1: {
            surfaces: walls.wallsFloor0Z1.sort(function(a, b) {
                return a - b
            }),
            names: []
        },
        wallsFloor0Z2: {
            surfaces: walls.wallsFloor0Z2.sort(function(a, b) {
                return a - b
            }),
            names: []
        },
        wallsFloor1Z0: {
            surfaces: walls.wallsFloor1Z0.sort(function(a, b) {
                return a - b
            }),
            names: []
        },
        wallsFloor1Z1: {
            surfaces: walls.wallsFloor1Z1.sort(function(a, b) {
                return a - b
            }),
            names: []
        },
        wallsFloor1Z2: {
            surfaces: walls.wallsFloor1Z2.sort(function(a, b) {
                return a - b
            }),
            names: []
        },
        wallsFloor2Z0: {
            surfaces: walls.wallsFloor2Z0.sort(function(a, b) {
                return a - b
            }),
            names: []
        },
        wallsFloor2Z1: {
            surfaces: walls.wallsFloor2Z1.sort(function(a, b) {
                return a - b
            }),
            names: []
        },
        wallsFloor2Z2: {
            surfaces: walls.wallsFloor2Z2.sort(function(a, b) {
                return a - b
            }),
            names: []
        }

    },
    roof: {
        roofSegment1: {
            surfaces: roof.roofSegment1.sort(function(a, b) {
                return a - b
            }),
            names: []
        }
    },
    ground: {
        innerGround: {
            surfaces: ground.innerGround.sort(function(a, b) {
                return a - b
            }),
            names: []
        },
        leftGround: {
            surfaces: ground.leftGround.sort(function(a, b) {
                return a - b
            }),
            names: []
        },
        topGround: {
            surfaces: ground.topGround.sort(function(a, b) {
                return a - b
            }),
            names: []
        },
        rightGround: {
            surfaces: ground.rightGround.sort(function(a, b) {
                return a - b
            }),
            names: []
        },
        bottomGround: {
            surfaces: ground.bottomGround.sort(function(a, b) {
                return a - b
            }),
            names: []
        }
    }
};
//Roof Names
var column = -1,
    row = 0;
for (var i = 0; i < building.roof.roofSegment1.surfaces.length; i++) {
    if (parseInt(i / 5) != row) {
        column = 0;
    } else {
        column++;
    }
    row = parseInt(i / 5);
    building.roof.roofSegment1.names[i] = "Rectangle:asphalt:roof:0:" + row + ":" + column
}
//Ground Names
var column = -1,
    row = 0;
for (var i = 0; i < building.ground.innerGround.surfaces.length; i++) {
    if (parseInt(i / 8) != row) {
        column = 0;
    } else {
        column++;
    }
    row = parseInt(i / 8);
    building.ground.innerGround.names[i] = "Rectangle_:grass:ground:inner:" + row + ":" + column
}
var column = -1,
    row = 0;
for (var i = 0; i < building.ground.leftGround.surfaces.length; i++) {
    if (parseInt(i / 5) != row) {
        column = 0;
    } else {
        column++;
    }
    row = parseInt(i / 5);
    building.ground.leftGround.names[i] = "Rectangle_:grass:ground:left:" + row + ":" + column
}
var column = -1,
    row = 0;
for (var i = 0; i < building.ground.topGround.surfaces.length; i++) {
    if (parseInt(i / 2) != row) {
        column = 0;
    } else {
        column++;
    }
    row = parseInt(i / 2);
    building.ground.topGround.names[i] = "Rectangle_:grass:ground:top:" + row + ":" + column
}
var column = -1,
    row = 0;
for (var i = 0; i < building.ground.rightGround.surfaces.length; i++) {
    if (parseInt(i / 5) != row) {
        column = 0;
    } else {
        column++;
    }
    row = parseInt(i / 5);
    building.ground.rightGround.names[i] = "Rectangle_:grass:ground:right:" + row + ":" + column
}
var column = -1,
    row = 0;
for (var i = 0; i < building.ground.bottomGround.surfaces.length; i++) {
    if (parseInt(i / 2) != row) {
        column = 0;
    } else {
        column++;
    }
    row = parseInt(i / 2);
    building.ground.bottomGround.names[i] = "Rectangle_:grass:ground:bottom:" + row + ":" + column
}

//wall Names
for (var i = 0; i < building.walls.wallsFloor0Z0.surfaces.length; i++) {
    building.walls.wallsFloor0Z0.names[i] = "Rectangle:brick:0:0:" + i
}
for (var i = 0; i < building.walls.wallsFloor0Z1.surfaces.length; i++) {
    building.walls.wallsFloor0Z1.names[i] = "Rectangle:glass:0:1:" + i
}
for (var i = 0; i < building.walls.wallsFloor0Z2.surfaces.length; i++) {
    building.walls.wallsFloor0Z2.names[i] = "Rectangle:brick:0:2:" + i
}
for (var i = 0; i < building.walls.wallsFloor1Z0.surfaces.length; i++) {
    building.walls.wallsFloor1Z0.names[i] = "Rectangle:brick:1:0:" + i
}
for (var i = 0; i < building.walls.wallsFloor1Z1.surfaces.length; i++) {
    building.walls.wallsFloor1Z1.names[i] = "Rectangle:glass:1:1:" + i
}
for (var i = 0; i < building.walls.wallsFloor1Z2.surfaces.length; i++) {
    building.walls.wallsFloor1Z2.names[i] = "Rectangle:brick:1:2:" + i
}
for (var i = 0; i < building.walls.wallsFloor2Z0.surfaces.length; i++) {
    building.walls.wallsFloor2Z0.names[i] = "Rectangle:brick:2:0:" + i
}
for (var i = 0; i < building.walls.wallsFloor2Z1.surfaces.length; i++) {
    building.walls.wallsFloor2Z1.names[i] = "Rectangle:glass:2:1:" + i
}
for (var i = 0; i < building.walls.wallsFloor2Z2.surfaces.length; i++) {
    building.walls.wallsFloor2Z2.names[i] = "Rectangle:brick:2:2:" + i
}




//var file = fs.readFileSync('/Users/nicholasmattise/Desktop/Output/Rectangle_.csv', 'utf8')

//var stream = fs.createReadStream("/Users/nicholasmattise/Desktop/Output/Rectangle_.csv");
var csv = require("fast-csv");
//var stream = fs.createReadStream("testRect.csv");
var stream = fs.createReadStream("/Users/nicholasmattise/Desktop/QuickForm/Output/Rectangle_.csv");
var csvStream = csv.createWriteStream(), //{headers: true}
    wstream = fs.createWriteStream('streamOut.csv');
var arr = [];
csvStream.pipe(wstream);
csv
    .fromStream(stream) //, {headers : true}
    .transform(function(data) {
        var dataArray = [];
        data.forEach(function(d) {
            if (!isNaN(d)) d = Number(d)
            dataArray.push(d)
        });
        return dataArray
    })
    .on("data", function(data) {
        //console.log(data)
        //if (arr.length == 0) arr.push(data);
        arr.push(data)
    })
    .on("end", function() {
        console.log("done");
        //console.log(arr)
        for (var i = 0; i <= arr[0].length - 1; i++) {
            if (arr[0][i].indexOf('SUB') >= 0) {
                arr[0][i] = arr[0][i - 1];
                arr.forEach(function(row) {
                    delete row[i - 1];
                });
            };
        };
        //Remove Undefined Columns
        for (var j = 0; j < arr.length; j++) {
            arr[j].clean(undefined);
        };

        //Reduce column Names to Surface #
        for (var i = 0; i <= arr[0].length - 1; i++) {
            var sNum = arr[0][i].split(":")[0].split(" ")[1]
            arr[0][i] = Number(sNum)
        }

        //Rename Walls

        for (var wall in building.walls) {
            console.log(wall);
            for (var i = 0; i < building.walls[wall].surfaces.length; i++) {
                if (arr[0].indexOf(building.walls[wall].surfaces[i]) >= 0) {
                    arr[0][arr[0].indexOf(building.walls[wall].surfaces[i])] = building.walls[wall].names[i]
                }
            }

        }

        //Rename Roof
        for (var segment in building.roof) {
            console.log(segment);
            for (var i = 0; i < building.roof[segment].surfaces.length; i++) {
                if (arr[0].indexOf(building.roof[segment].surfaces[i]) >= 0) {
                    arr[0][arr[0].indexOf(building.roof[segment].surfaces[i])] = building.roof[segment].names[i]
                }
            }

        }
        //Rename Ground
        for (var segment in building.ground) {
            console.log(segment);
            for (var i = 0; i < building.ground[segment].surfaces.length; i++) {
                if (arr[0].indexOf(building.ground[segment].surfaces[i]) >= 0) {
                    arr[0][arr[0].indexOf(building.ground[segment].surfaces[i])] = building.ground[segment].names[i]
                }
            }

        }

        //Remove all non renamed columns
        for (var i = 1; i <= arr[0].length - 1; i++) {
            if (isNaN(arr[0][i]) == false) {
                arr.forEach(function(row) {
                    delete row[i];
                });
            };
        };
        for (var j = 0; j < arr.length; j++) {
            arr[j].clean(undefined);
        };


        //console.log(arr)
        csv.write(arr).pipe(wstream);
        //fs.writeFileSync('streamOut.json', JSON.stringify(arr, null, 4))
    });


//Shift Subsurfaces to Surfaces
