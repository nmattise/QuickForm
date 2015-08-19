var fs = require('fs');
var csv = require('fast-csv');
var sqlite3 = require('sqlite3').verbose();
var async = require('async');

var db = new sqlite3.Database('../Desktop/Output/Mitchell.sql');
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

var csvStream = csv.createWriteStream({
    headers: true
  }),
  csvStream1 = csv.createWriteStream({
    headers: true
  }),
  buildingStream = fs.createWriteStream("buildings.csv"),
  groundStream = fs.createWriteStream("ground.csv");

buildingStream.on("finish", function() {
  console.log("DONE!");
});
groundStream.on("finish", function() {
  console.log("DONE!");
});

// Surface Numbers from temperature.rb
//Mitchell
var startSurf = [0, 294, 741, 1035];
var roofSurf = [198, 573, 939, 1269];
var endSurf = [294, 741, 1035, 1389];
var building = function(start, roof, end, floors, wallSurface, windowSurface, roofSurface) {
  this.start = start;
  this.roofStart = roof;
  this.end = end;
  this.floors = floors;
  this.columns = ((roof - start) / (3 * floors)) - 2;
  this.wallSurface = wallSurface;
  this.roofSurface = roofSurface;
  this.windowSurface = windowSurface;
  this.patches = [];
  this.patchNames = [];
}
var ground = function(start, end, rows) {
  this.start = start;
  this.end = end;
  this.rows = rows;
  this.patches = [];
  this.patchNames = [];
}
var buildings = {
  "Mitchell": new building(0, 198, 294, 3, 'brick', 'glass', 'asphalt'),
  "Armory": new building(294, 573, 741, 3, 'brick', 'glass', 'asphalt'),
  "Lee": new building(741, 939, 1035, 3, 'brick', 'glass', 'asphalt'),
  "Administration": new building(1035, 1269, 1389, 3, 'brick', 'glass', 'asphalt')
}
console.log(buildings);
var grounds = {
  inner: new ground(1389, 4845, 24),
  top: new ground(4845, 5277, 9),
  left: new ground(5277, 5583, 17),
  right: new ground(5583, 5889, 17),
  bottom: new ground(5889, 6141, 3),
};

//Generate Walls for Buildings
for (var bldg in buildings) {
  if (buildings.hasOwnProperty(bldg)) {
    // console.log(bldg);
    for (var i = 2 + buildings[bldg].start; i < buildings[bldg].roofStart; i++) {
      buildings[bldg][i]
    }
  }
}

//Generate Wall and Roof and Ground Numbers
var walls = [];
for (var i = 2; i < 198; i += 22) {
  walls.push([])
  for (var x = 0; x < 20; x++) {
    walls[walls.length - 1].push(i + x);
  }
}

//Wall1
var subFloor = -1;
var floor = 0;
for (var wall in building1.walls) {
  subFloor++;
  for (var i = 0; i < building1.walls[wall].surfaces.length; i++) {
    if (wall.indexOf('Z1') >= 0) {
      building1.walls[wall].names.push("Mitchell:glass:" + floor + ":" + subFloor + ":" + i);
    } else {
      building1.walls[wall].names.push("Mitchell:brick:" + floor + ":" + subFloor + ":" + i);
    };

  };
  if (subFloor == 2) {
    subFloor = -1;
    floor++;
  };
};
// console.log(walls);

var walls1 = [];
for (var i = 296; i < 573; i += 31) {
  walls1.push([])
  for (var x = 0; x < 29; x++) {
    walls1[walls1.length - 1].push(i + x);
  }
}
// console.log(walls1);
var walls2 = [];
for (var i = 116; i < 354; i += 10) {
  walls2.push([])
  for (var x = 0; x < 20; x++) {
    walls2[walls2.length - 1].push(i + x);
  }
}
// console.log(walls2);
var walls3 = [];
for (var i = 116; i < 354; i += 10) {
  walls3.push([])
  for (var x = 0; x < 24; x++) {
    walls3[walls3.length - 1].push(i + x);
  }
}
// console.log(walls3);

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
var buildingPatchNames = [];
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
  buildingPatchNames[building1.roof.roofSegment1.surfaces[i]] = "Mitchell:asphalt:roof:0:" + row + ":" + column;
  building1.roof.roofSegment1.names[i] = "Mitchell:asphalt:roof:0:" + row + ":" + column
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
  building2.roof.roofSegment1.names[i] = "Armory:asphalt:roof:0:" + row + ":" + column
  buildingPatchNames[building2.roof.roofSegment1.surfaces[i]] = "Armory:asphalt:roof:0:" + row + ":" + column

}

//console.log(building2.roof);

//Wall1
var subFloor = -1;
var floor = 0;
for (var wall in building1.walls) {
  subFloor++;
  for (var i = 0; i < building1.walls[wall].surfaces.length; i++) {
    if (wall.indexOf('Z1') >= 0) {
      building1.walls[wall].names.push("Mitchell:glass:" + floor + ":" + subFloor + ":" + i);
    } else {
      building1.walls[wall].names.push("Mitchell:brick:" + floor + ":" + subFloor + ":" + i);
    };

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
    building2.walls[wall].names.push("Armory:brick:" + floor + ":" + subFloor + ":" + i);
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
  if (parseInt(i / 24) != row) {
    column = 0;
  } else {
    column++;
  }
  row = parseInt(i / 24);
  ground.innerGround.names[i] = "Mitchell:asphalt:ground:inner:" + row + ":" + column
}
var column = -1,
  row = 0;
for (var i = 0; i < ground.leftGround.surfaces.length; i++) {
  if (parseInt(i / 3) != row) {
    column = 0;
  } else {
    column++;
  }
  row = parseInt(i / 3);
  ground.leftGround.names[i] = "Mitchell:grass:ground:left:" + row + ":" + column
}
var column = -1,
  row = 0;
for (var i = 0; i < ground.topGround.surfaces.length; i++) {
  if (parseInt(i / 9) != row) {
    column = 0;
  } else {
    column++;
  }
  row = parseInt(i / 9);
  ground.topGround.names[i] = "Mitchell:grass:ground:top:" + row + ":" + column
}
var column = -1,
  row = 0;
for (var i = 0; i < ground.rightGround.surfaces.length; i++) {
  if (parseInt(i / 3) != row) {
    column = 0;
  } else {
    column++;
  }
  row = parseInt(i / 3);
  ground.rightGround.names[i] = "Mitchell:grass:ground:right:" + row + ":" + column
}
var column = -1,
  row = 0;
for (var i = 0; i < ground.bottomGround.surfaces.length; i++) {
  if (parseInt(i / 3) != row) {
    column = 0;
  } else {
    column++;
  }
  row = parseInt(i / 3);
  ground.bottomGround.names[i] = "Mitchell:grass:ground:bottom:" + row + ":" + column
}
console.log(buildingPatchNames.length)
fs.writeFileSync("mitchelBuildings.json", JSON.stringify([building1, building2, building3, building4], null, 4))
fs.writeFileSync("mitchellGround.json", JSON.stringify(ground, null, 4))

// console.log(building1)
// console.log(ground)
// console.log(ground.innerGround.surfaces.length)
// console.log(ground.innerGround.names.length)


var count = 1;
csvStream.pipe(buildingStream);
csvStream1.pipe(groundStream);
db.serialize(function() {
  async.whilst(function() {
    return count < 49
  }, function(callback) {
    console.log(count);
    db.all("SELECT KeyValue, Value FROM ReportVariableWithTime Where TimeIndex IS '" + count + "'", function(err, rows) {
      //Make Sub Surfaces the main surface
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].KeyValue.indexOf('SUB') >= 0) {
          rows[i].KeyValue = rows[i - 1].KeyValue;
          delete rows[i - 1];
        };

      };
      //Remove
      rows.clean(undefined);
      var buildingObj = {};
      var groundObj = {};
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].KeyValue.split(" ")[1] > 1389) {
          groundObj[rows[i].KeyValue] = rows[i].Value;
        } else {
          buildingObj[rows[i].KeyValue] = rows[i].Value;
        };


      };
      csvStream1.write(groundObj);
      csvStream.write(buildingObj);
      count++
      callback();
    });

  }, function(err) {
    csvStream.end();
  })
})
