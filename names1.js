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

//loop through groups of surfaces: start, roof, end ground
// start Surf: [0, 114]
// roof Surf: [90, 354]
// end Surf: [114, 378]
// start Ground Array : [378, 474, 534, 744, 954]
// End Ground Array : [474, 534, 744, 954, 1314]

//building1 : 3 floors
//building2 : 8 floorse

//Mitchell
// start Surf: [0, 294, 741, 1035]
// roof Surf: [198, 573, 939, 1269]
// end Surf: [294, 741, 1035, 1389]

// 3 floors 20 columns
// 3 floors 29 columns
// 3 floors 20 columns
// 3 floors 24 columns
// start Ground Array : [1389, 4845, 5277, 5583, 5889]
// End Ground Array : [4845, 5277, 5583, 5889, 6141]


//Get Wall and Roof and Ground Numbers
var walls = [];
for (var i = 2; i < 198; i += 22) {
    walls.push([])
    for (var x = 0; x < 20; x++) {
        walls[walls.length - 1].push(i + x);
    }
}
// console.log(walls);

var walls1 = [];
for (var i = 296; i < 573; i += 31) {
    walls1.push([])
    for (var x = 0; x < 29; x++) {
        walls1[walls1.length - 1].push(i + x);
    }
}
console.log(walls1);
var walls2 = [];
for (var i = 116; i < 354; i += 10) {
    walls2.push([])
    for (var x = 0; x < 20; x++) {
        walls2[walls2.length - 1].push(i + x);
    }
}
console.log(walls2);
var walls3 = [];
for (var i = 116; i < 354; i += 10) {
    walls3.push([])
    for (var x = 0; x < 24; x++) {
        walls3[walls3.length - 1].push(i + x);
    }
}
console.log(walls3);

var roof = [];
for (var i = 204; i <= 294; i += 6) {
    roof.push(i);
}
// console.log(roof);

var roof1 = [];
for (var i = 579; i <= 741; i += 6) {
    roof1.push(i);
}
// console.log(roof1);
var roof2 = [];
for (var i = 945; i <= 1035; i += 6) {
    roof2.push(i);
}
// console.log(roof2);
var roof3 = [];
for (var i = 1275; i <= 1389; i += 6) {
    roof3.push(i);
}
// console.log(roof3);

var innerGround = [];
for (var i = 1389; i < 4845; i += 6) {
    innerGround.push(i);
}
// console.log(innerGround);

var leftGround = [];
for (var i = 5277; i < 5583; i += 6) {
    leftGround.push(i);
}
// console.log(leftGround);

var topGround = [];
for (var i = 4845; i < 5277; i += 6) {
    topGround.push(i);
}
// console.log(topGround);

var rightGround = [];
for (var i = 5583; i < 5889; i += 6) {
    rightGround.push(i);
}
// console.log(rightGround);

var bottomGround = [];
for (var i = 5889; i <= 6141; i += 6) {
    bottomGround.push(i);
}
// console.log(bottomGround);

//Put Numbers into Object
var building1 = {
    walls: {
        wallsFloor0Z0: {
            surfaces: walls[0],
            names: []
        },
        wallsFloor0Z1: {
            surfaces: walls[1],
            names: []
        },
        wallsFloor0Z2: {
            surfaces: walls[2],
            names: []
        },
        wallsFloor1Z0: {
            surfaces: walls[3],
            names: []
        },
        wallsFloor1Z1: {
            surfaces: walls[4],
            names: []
        },
        wallsFloor1Z2: {
            surfaces: walls[5],
            names: []
        },
        wallsFloor2Z0: {
            surfaces: walls[6],
            names: []
        },
        wallsFloor2Z1: {
            surfaces: walls[7],
            names: []
        },
        wallsFloor2Z2: {
            surfaces: walls[8],
            names: []
        }
    },
    roof: {
        roofSegment1: {
            surfaces: roof1,
            names: []
        }
    }
};
var building2 = {
    walls: {
        wallsFloor0Z0: {
            surfaces: walls1[0],
            names: []
        },
        wallsFloor0Z1: {
            surfaces: walls1[1],
            names: []
        },
        wallsFloor0Z2: {
            surfaces: walls1[2],
            names: []
        },
        wallsFloor1Z0: {
            surfaces: walls1[3],
            names: []
        },
        wallsFloor1Z1: {
            surfaces: walls1[4],
            names: []
        },
        wallsFloor1Z2: {
            surfaces: walls1[5],
            names: []
        },
        wallsFloor3Z0: {
            surfaces: walls1[6],
            names: []
        },
        wallsFloor3Z1: {
            surfaces: walls1[7],
            names: []
        },
        wallsFloor3Z2: {
            surfaces: walls1[8],
            names: []
        }

    },
    roof: {
        roofSegment1: {
            surfaces: roof2,
            names: []
        }
    }
};
var building3 = {
    walls: {
        wallsFloor0Z0: {
            surfaces: walls2[0],
            names: []
        },
        wallsFloor0Z1: {
            surfaces: walls2[1],
            names: []
        },
        wallsFloor0Z2: {
            surfaces: walls2[2],
            names: []
        },
        wallsFloor1Z0: {
            surfaces: walls2[3],
            names: []
        },
        wallsFloor1Z1: {
            surfaces: walls2[4],
            names: []
        },
        wallsFloor1Z2: {
            surfaces: walls2[5],
            names: []
        },
        wallsFloor3Z0: {
            surfaces: walls2[6],
            names: []
        },
        wallsFloor3Z1: {
            surfaces: walls2[7],
            names: []
        },
        wallsFloor3Z2: {
            surfaces: walls2[8],
            names: []
        }

    },
    roof: {
        roofSegment1: {
            surfaces: roof2,
            names: []
        }
    }
};
var building4 = {
    walls: {
        wallsFloor0Z0: {
            surfaces: walls3[0],
            names: []
        },
        wallsFloor0Z1: {
            surfaces: walls3[1],
            names: []
        },
        wallsFloor0Z2: {
            surfaces: walls3[2],
            names: []
        },
        wallsFloor1Z0: {
            surfaces: walls3[3],
            names: []
        },
        wallsFloor1Z1: {
            surfaces: walls3[4],
            names: []
        },
        wallsFloor1Z2: {
            surfaces: walls3[5],
            names: []
        },
        wallsFloor3Z0: {
            surfaces: walls3[6],
            names: []
        },
        wallsFloor3Z1: {
            surfaces: walls3[7],
            names: []
        },
        wallsFloor3Z2: {
            surfaces: walls3[8],
            names: []
        }

    },
    roof: {
        roofSegment1: {
            surfaces: roof2,
            names: []
        },
        roofSegment1: {
            surfaces: roof2,
            names: []
        }
    }
};
var ground = {
    innerGround: {
        surfaces: innerGround,
        names: []
    },
    leftGround: {
        surfaces: leftGround,
        names: []
    },
    topGround: {
        surfaces: topGround,
        names: []
    },
    rightGround: {
        surfaces: rightGround,
        names: []
    },
    bottomGround: {
        surfaces: bottomGround,
        names: []
    }
};

//Generate Names for Numbered Surfaces

//Roof1
var column = -1,
    row = 0;
for (var i = 0; i < building1.roof.roofSegment1.surfaces.length; i++) {
    if (parseInt(i / 2) != row) {
        column = 0;
    } else {
        column++;
    }
    row = parseInt(i / 2);
    building1.roof.roofSegment1.names[i] = "rectangle1:asphalt:roof:0:" + row + ":" + column
}

//console.log(building1.roof);
//Roof2
var column = -1,
    row = 0;
for (var i = 0; i < building2.roof.roofSegment1.surfaces.length; i++) {
    if (parseInt(i / 2) != row) {
        column = 0;
    } else {
        column++;
    }
    row = parseInt(i / 2);
    building2.roof.roofSegment1.names[i] = "rectangle2:asphalt:roof:0:" + row + ":" + column
}

//console.log(building2.roof);

//Wall1
var subFloor = -1;
var floor = 0;
for (var wall in building1.walls) {
    subFloor++;
    for (var i = 0; i < building1.walls[wall].surfaces.length; i++) {
        building1.walls[wall].names.push("rectangle1:brick:" + floor + ":" + subFloor + ":" + i);
    };
    if (subFloor == 2) {
        subFloor = -1;
        floor++;
    };
};
//console.log(building1.walls);

//Wall2
var subFloor = -1;
var floor = 0;
for (var wall in building2.walls) {
    subFloor++;
    for (var i = 0; i < building2.walls[wall].surfaces.length; i++) {
        building2.walls[wall].names.push("rectangle1:brick:" + floor + ":" + subFloor + ":" + i);
    };
    if (subFloor == 2) {
        subFloor = -1;
        floor++;
    };
};
//console.log(building2.walls);

//Ground
var column = -1,
    row = 0;
for (var i = 0; i < ground.innerGround.surfaces.length; i++) {
    if (parseInt(i / 8) != row) {
        column = 0;
    } else {
        column++;
    }
    row = parseInt(i / 8);
    ground.innerGround.names[i] = "Mitchell:asphalt:ground:inner:" + row + ":" + column
}
var column = -1,
    row = 0;
for (var i = 0; i < ground.leftGround.surfaces.length; i++) {
    if (parseInt(i / 5) != row) {
        column = 0;
    } else {
        column++;
    }
    row = parseInt(i / 5);
    ground.leftGround.names[i] = "Mitchell:grass:ground:left:" + row + ":" + column
}
var column = -1,
    row = 0;
for (var i = 0; i < ground.topGround.surfaces.length; i++) {
    if (parseInt(i / 2) != row) {
        column = 0;
    } else {
        column++;
    }
    row = parseInt(i / 2);
    ground.topGround.names[i] = "Mitchell:grass:ground:top:" + row + ":" + column
}
var column = -1,
    row = 0;
for (var i = 0; i < ground.rightGround.surfaces.length; i++) {
    if (parseInt(i / 5) != row) {
        column = 0;
    } else {
        column++;
    }
    row = parseInt(i / 5);
    ground.rightGround.names[i] = "Mitchell:grass:ground:right:" + row + ":" + column
}
var column = -1,
    row = 0;
for (var i = 0; i < ground.bottomGround.surfaces.length; i++) {
    if (parseInt(i / 2) != row) {
        column = 0;
    } else {
        column++;
    }
    row = parseInt(i / 2);
    ground.bottomGround.names[i] = "Mitchell:grass:ground:bottom:" + row + ":" + column
}
//console.log(ground)


//create csv read and write streams
var stream = fs.createReadStream("../virtualPulse/server/cfd/Output/Mitchell.csv"),
    groundStream = fs.createWriteStream('mitchellGroundOut.csv'),
    buildingStream = fs.createWriteStream('mitchellBuildingsOut.csv');
var arr = [];

//Start parsingcsv
csv.fromStream(stream).transform(function(data) {
    var dataArray = [];
    data.forEach(function(d) {
        if (!isNaN(d)) d = Number(d)
        dataArray.push(d)
    });
    return dataArray
}).on("data", function(data) {
    arr.push(data)
}).on("end", function() {
    console.log("done");
    //data = null;
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
    console.log(arr[0].length)
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
        if (arr[0][i] >= 378) {
            for (var j = 0; j < arr.length; j++) {
                groundArray[j][arr[0][i]] = arr[j][i]
            }
        }
    };
    //console.log(groundArray)
    //Rename Ground
    for (var segment in ground) {
        console.log(segment);
        for (var i = 0; i < ground[segment].surfaces.length; i++) {
            if (groundArray[0].indexOf(ground[segment].surfaces[i]) >= 0) {
                groundArray[0][groundArray[0].indexOf(ground[segment].surfaces[i])] = ground[segment].names[i]
            }
        }

    };
    //Remove all non renamed columns
    for (var i = 1; i <= groundArray[0].length - 1; i++) {
        if (isNaN(groundArray[0][i]) == false) {
            groundArray.forEach(function(row) {
                delete row[i];
            });p
        };
    };
    for (var j = 0; j < groundArray.length; j++) {
        groundArray[j].clean(undefined);
    };
    console.log("Ground array patches: " + groundArray[0].length)
    csv.write(groundArray).pipe(groundStream);
    groundArray = null;
    //make building array
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
    };
    //Rename Walls
    for (var wall in building1.walls) {
        console.log(wall);
        for (var i = 0; i < building1.walls[wall].surfaces.length; i++) {
            if (buildingArray[0].indexOf(building1.walls[wall].surfaces[i]) >= 0) {
                buildingArray[0][buildingArray[0].indexOf(building1.walls[wall].surfaces[i])] = building1.walls[wall].names[i]
            }
        }
    }

    //Rename Roof
    for (var segment in building1.roof) {
        console.log(segment);
        for (var i = 0; i < building1.roof[segment].surfaces.length; i++) {
            if (buildingArray[0].indexOf(building1.roof[segment].surfaces[i]) >= 0) {
                buildingArray[0][buildingArray[0].indexOf(building1.roof[segment].surfaces[i])] = building1.roof[segment].names[i]
            }
        }
    }
    //Rename Walls
    for (var wall in building2.walls) {
        console.log(wall);
        for (var i = 0; i < building2.walls[wall].surfaces.length; i++) {
            if (buildingArray[0].indexOf(building2.walls[wall].surfaces[i]) >= 0) {
                buildingArray[0][buildingArray[0].indexOf(building2.walls[wall].surfaces[i])] = building2.walls[wall].names[i]
            }
        }
    }

    //Rename Roof
    for (var segment in building2.roof) {
        console.log(segment);
        for (var i = 0; i < building2.roof[segment].surfaces.length; i++) {
            if (buildingArray[0].indexOf(building2.roof[segment].surfaces[i]) >= 0) {
                buildingArray[0][buildingArray[0].indexOf(building2.roof[segment].surfaces[i])] = building2.roof[segment].names[i]
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
    console.log("building array patches: " + buildingArray[0].length)
    csv.write(buildingArray).pipe(buildingStream);
})
