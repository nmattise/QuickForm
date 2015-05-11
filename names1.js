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

//Get Wall and Roof and Ground Numbers
var walls = [];
for (var i = 2; i < 90; i += 10) {
    walls.push([])
    for (var x = 0; x < 8; x++) {
        walls[walls.length - 1].push(i + x);
    }
}
// console.log(walls);

var walls1 = [];
for (var i = 116; i < 354; i += 10) {
    walls1.push([])
    for (var x = 0; x < 8; x++) {
        walls1[walls1.length - 1].push(i + x);
    }
}
// console.log(walls1);

var roof1 = [];
for (var i = 96; i <= 114; i += 6) {
    roof1.push(i);
}
// console.log(roof1);

var roof2 = [];
for (var i = 360; i <= 378; i += 6) {
    roof2.push(i);
}
// console.log(roof2);

var innerGround = [];
for (var i = 384; i < 480; i += 6) {
    innerGround.push(i);
}
// console.log(innerGround);

var leftGround = [];
for (var i = 540; i < 750; i += 6) {
    leftGround.push(i);
}
// console.log(leftGround);

var topGround = [];
for (var i = 480; i < 540; i += 6) {
    topGround.push(i);
}
// console.log(topGround);

var rightGround = [];
for (var i = 750; i < 960; i += 6) {
    rightGround.push(i);
}
// console.log(rightGround);

var bottomGround = [];
for (var i = 960; i <= 1314; i += 6) {
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
        },
        wallsFloor4Z0: {
            surfaces: walls1[0],
            names: []
        },
        wallsFloor4Z1: {
            surfaces: walls1[1],
            names: []
        },
        wallsFloor4Z2: {
            surfaces: walls1[2],
            names: []
        },
        wallsFloor5Z0: {
            surfaces: walls1[3],
            names: []
        },
        wallsFloor5Z1: {
            surfaces: walls1[4],
            names: []
        },
        wallsFloor5Z2: {
            surfaces: walls1[5],
            names: []
        },
        wallsFloor6Z0: {
            surfaces: walls1[6],
            names: []
        },
        wallsFloor6Z1: {
            surfaces: walls1[7],
            names: []
        },
        wallsFloor6Z2: {
            surfaces: walls1[8],
            names: []
        },
        wallsFloor7Z0: {
            surfaces: walls1[0],
            names: []
        },
        wallsFloor7Z1: {
            surfaces: walls1[1],
            names: []
        },
        wallsFloor7Z2: {
            surfaces: walls1[2],
            names: []
        },
        wallsFloor8Z0: {
            surfaces: walls1[3],
            names: []
        },
        wallsFloor8Z1: {
            surfaces: walls1[4],
            names: []
        },
        wallsFloor8Z2: {
            surfaces: walls1[5],
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
    ground.innerGround.names[i] = "rectangle1_rectangle2_:grass:ground:inner:" + row + ":" + column
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
    ground.leftGround.names[i] = "rectangle1_rectangle2_:grass:ground:left:" + row + ":" + column
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
    ground.topGround.names[i] = "rectangle1_rectangle2_:grass:ground:top:" + row + ":" + column
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
    ground.rightGround.names[i] = "rectangle1_rectangle2_:grass:ground:right:" + row + ":" + column
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
    ground.bottomGround.names[i] = "rectangle1_rectangle2_:grass:ground:bottom:" + row + ":" + column
}
//console.log(ground)


//create csv read and write streams
var stream = fs.createReadStream("Output/rectangle1_rectangle2_.csv"),
    groundStream = fs.createWriteStream('groundOut.csv'),
    buildingStream = fs.createWriteStream('buildingOut.csv');
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
    console.log(arr[0][1])
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
            });
        };
    };
    for (var j = 0; j < groundArray.length; j++) {
        groundArray[j].clean(undefined);
    };
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
    console.log(buildingArray[0])
    console.log(buildingArray[0].length)
    csv.write(buildingArray).pipe(buildingStream);
})
