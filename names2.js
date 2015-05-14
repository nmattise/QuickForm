var fs = require('fs'),
    csv = require('fast-csv');

// start Surf: [0, 852, 996, 1173]
// roof Surf: [720, 960, 1065, 2013]
// end Surf: [852, 996, 1173, 2169]

var start = [0, 852, 996, 1173],
    roof = [720, 960, 1065, 2013],
    end = [852, 996, 1173, 2169];

var numBldg = 4;

var varriedBuildings = JSON.parse(fs.readFileSync('varried.json'));

var bldgs = varriedBuildings.buildings;

for (var b in bldgs) {
    console.log(bldgs[b].name)
}

bldgs[0].patches = {
    perFloor: 28,
    start: start[0],
    roof: roof[0],
    end: end[0]
}

bldgs[1].patches = {
    perFloor: 8,
    start: start[1],
    roof: roof[1],
    end: end[1]
}

bldgs[2].patches = {
    perFloor: 21,
    start: start[2],
    roof: roof[2],
    end: end[2]
}

bldgs[3].patches = {
    perFloor: 26,
    start: start[3],
    roof: roof[3],
    end: end[3]
}

//Walls
for (var i = bldgs.length - 1; i >= 0; i--) {
    bldgs[i].patches.walls = [];
    console.log(bldgs[i].patches);
    var patches = bldgs[i].patches;
    var floors = bldgs[i].floors;
    for (var j = (patches.start + 2); j < patches.roof; j += (patches.perFloor + 2)) {
        patches.walls.push([])
        for (var x = 0; x < patches.perFloor; x++) {
            patches.walls[patches.walls.length - 1].push(j + x);
        }
    }
};
