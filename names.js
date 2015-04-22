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
    wallsFloor0Z0: [19, 24, 14, 16, 25, 6, 22, 4, 20, 3, 23, 8, 18, 15, 2, 5, 21, 10, 11, 9, 17, 13, 12, 7],
    wallsFloor0Z1: [33, 35, 50, 41, 51, 46, 45, 44, 40, 38, 30, 34, 29, 37, 36, 48, 39, 31, 42, 28, 43, 32, 47, 49],
    wallsFloor0Z2: [77, 60, 76, 71, 54, 68, 66, 69, 55, 59, 57, 75, 70, 58, 73, 65, 62, 61, 72, 67, 63, 64, 74, 56],
    wallsFloor1Z0: [84, 100, 101, 88, 89, 92, 97, 95, 93, 94, 98, 82, 81, 83, 99, 80, 91, 96, 103, 86, 90, 87, 102, 85],
    wallsFloor1Z1: [126, 121, 108, 112, 111, 129, 114, 107, 125, 123, 122, 128, 117, 119, 116, 127, 118, 110, 115, 113, 120, 106, 124, 109],
    wallsFloor1Z2: [142, 132, 146, 147, 137, 134, 151, 154, 152, 140, 143, 145, 133, 153, 148, 136, 150, 135, 149, 155, 139, 141, 144, 138],
    wallsFloor2Z0: [179, 176, 159, 158, 162, 165, 175, 177, 171, 166, 173, 172, 169, 163, 174, 164, 181, 167, 170, 180, 168, 160, 161, 178],
    wallsFloor2Z1: [201, 199, 200, 196, 186, 185, 204, 198, 194, 187, 203, 191, 192, 205, 190, 207, 188, 202, 184, 206, 189, 195, 193, 197],
    wallsFloor2Z2: [219, 222, 212, 227, 226, 217, 210, 223, 213, 216, 232, 230, 220, 218, 231, 221, 215, 214, 229, 224, 228, 225, 233, 211]
};

var roof = {
    roofSegment1: [408, 360, 276, 354, 294, 336, 264, 288, 366, 300, 396, 390, 348, 306, 270, 246, 438, 252, 426, 372, 420, 402, 258, 240, 342, 444, 324, 414, 432, 378, 312, 282, 384, 330, 318]
};

var ground = {
    innerGround: [576, 672, 516, 618, 486, 600, 708, 702, 768, 642, 612, 480, 774, 696, 714, 594, 756, 450, 690, 510, 654, 624, 792, 528, 606, 468, 750, 636, 660, 462, 498, 666, 630, 780, 726, 762, 456, 558, 684, 720, 822, 474, 738, 588, 810, 786, 582, 678, 732, 522, 744, 798, 540, 534, 804, 492, 564, 570, 552, 504, 828, 546, 816, 648],
    topGround:[858, 876, 852, 870, 834, 864, 846, 840],
    topGround: [900, 912, 930, 936, 888, 918, 882, 894, 924, 906],
    leftGround: [954, 960, 942, 996, 984, 966, 990, 972, 948, 978],
    rightGround: [954, 996, 990, 942, 984, 972, 960, 948, 978, 936, 966],
    bottomGround: [1032, 1050, 1044, 1068, 1056, 1002, 1074, 1014, 1020, 1038, 1008, 1026, 1062, 1080]
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
