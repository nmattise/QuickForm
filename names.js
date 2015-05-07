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
    innerGround: [450, 456, 462, 468, 474, 480, 486, 492, 498, 504, 510, 516, 522, 528, 534, 540, 546, 552, 558, 564, 570, 576, 582, 588, 594, 600, 606, 612, 618, 624, 630, 636, 642, 648, 654, 660, 666, 672, 678, 684, 690, 696, 702, 708, 714, 720, 726, 732, 738, 744, 750, 756, 762, 768, 774, 780, 786, 792, 798, 804, 810, 816, 822, 828],
    topGround: [834, 840, 846, 852, 858, 864, 870, 876],
    leftGround: [882, 888, 894, 900, 906, 912, 918, 924, 930, 936, 942, 948],
    rightGround: [954, 960, 966, 972, 978, 984, 990, 996, 1002, 1008, 1014, 1020],
    bottomGround: [1026, 1032, 1038, 1044, 1050, 1056, 1062, 1068, 1074, 1080, 1086, 1092, 1098, 1104, 1110, 1116]
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
var stream = fs.createReadStream("/Users/nicholasmattise/QuickForm/Output/Rectangle_.csv");
var groundStream = fs.createWriteStream('groundOut.csv'),
    buildingStream = fs.createWriteStream('buildingOut.csv');
var arr = [];
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

        //Remove Covering surfaces and shift sub surfaces to their spot
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
        };
        //Spit into two arrays, then delete data
        var groundArray = new Array(arr.length);
        for (var i = 0; i < groundArray.length; i++) {
            groundArray[i] = new Array(arr[0].length)
        }
        for (var i = 0; i < arr[0].length; i++) {
            if (arr[0][i] >= 450) {
                for (var j = 0; j < arr.length; j++) {
                    groundArray[j][arr[0][i]] = arr[j][i]
                }
            }
        }

        //Rename Ground
        for (var segment in building.ground) {
            console.log(segment);
            for (var i = 0; i < building.ground[segment].surfaces.length; i++) {
                if (groundArray[0].indexOf(building.ground[segment].surfaces[i]) >= 0) {
                    groundArray[0][groundArray[0].indexOf(building.ground[segment].surfaces[i])] = building.ground[segment].names[i]
                }
            }

        };

        //Remove all non renamed columns
        for (var i = 1; i <= groundArray[0].length - 1; i++) {
            if (isNaN(groundArray[0][i]) == false) {
                groundArray.forEach(function(row) {
                    delete row[i];
                });
            };
        };
        console.log(groundArray[1][2])
        for (var j = 0; j < groundArray.length; j++) {
            groundArray[j].clean(undefined);
        };

        csv.write(groundArray).pipe(groundStream);


        var buildingArray = new Array(arr.length);
        for (var i = 0; i < buildingArray.length; i++) {
            buildingArray[i] = new Array(arr[0].length)
        }
        for (var i = 0; i < arr[0].length; i++) {
            if (arr[0][i] < 450) {
                for (var j = 0; j < arr.length; j++) {
                    buildingArray[j][arr[0][i]] = arr[j][i]
                }
            }
        }

        //Rename Walls
        for (var wall in building.walls) {
            console.log(wall);
            for (var i = 0; i < building.walls[wall].surfaces.length; i++) {
                if (buildingArray[0].indexOf(building.walls[wall].surfaces[i]) >= 0) {
                    buildingArray[0][buildingArray[0].indexOf(building.walls[wall].surfaces[i])] = building.walls[wall].names[i]
                }
            }

        }

        //Rename Roof
        for (var segment in building.roof) {
            console.log(segment);
            for (var i = 0; i < building.roof[segment].surfaces.length; i++) {
                if (buildingArray[0].indexOf(building.roof[segment].surfaces[i]) >= 0) {
                    buildingArray[0][buildingArray[0].indexOf(building.roof[segment].surfaces[i])] = building.roof[segment].names[i]
                }
            }

        }
        //Remove all non renamed columns
        for (var i = 1; i <= buildingArray[0].length - 1; i++) {
            if (isNaN(buildingArray[0][i]) == false) {
                buildingArray.forEach(function(row) {
                    delete row[i];
                });
            };
        };
        for (var j = 0; j < buildingArray.length; j++) {
            buildingArray[j].clean(undefined);
        };

        csv.write(buildingArray).pipe(buildingStream);
        //fs.writeFileSync('streamOut.json', JSON.stringify(arr, null, 4))
    });
