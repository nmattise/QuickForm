var fs = require('fs'),
    csv = require('fast-csv');

// Varried JSON
// start Surf: [0, 852, 996, 1173]
// roof Surf: [720, 960, 1065, 2013]
// end Surf: [852, 996, 1173, 2169]
// start Ground Array : [2169, 3177, 3429, 3861, 4293]
// End Ground Array : [3177, 3429, 3861, 4293, 4977]

// Saber JSON
// start Surf: [0, 624, 708]
// roof Surf: [528, 684, 780]
// end Surf: [624, 708, 816]
// start Ground Array : [816, 1200, 1320, 1590, 1860]
// End Ground Array : [1200, 1320, 1590, 1860, 2280]

var start = [0, 852, 996, 1173],
    roof = [720, 960, 1065, 2013],
    end = [852, 996, 1173, 2169];
var startGround = [2169, 3177, 3429, 3861, 4293],
    endGround = [3177, 3429, 3861, 4293, 4977];

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
