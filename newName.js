var fs = require('fs');
var csv = require('fast-csv');
var sqlite3 = require('sqlite3').verbose();
var async = require('async');
var _ = require('lodash');

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
    buildingStream = fs.createWriteStream("buildings_numbers.csv"),
    groundStream = fs.createWriteStream("ground_numbers.csv");

buildingStream.on("finish", function() {
    console.log("DONE!");
});
groundStream.on("finish", function() {
    console.log("DONE!");
});
// Surface Numbers from temperature.rb
//Numbers for Mitchell Neighborhood
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
};
var ground = function(start, end, rows, material) {
    this.start = start;
    this.end = end;
    this.rows = rows;
    this.material = material;
    this.patches = [];
    this.patchNames = [];
};
var buildings = {
    "Mitchell": new building(0, 198, 294, 3, 'brick', 'glass', 'asphalt'),
    "Armory": new building(294, 573, 741, 3, 'brick', 'glass', 'asphalt'),
    "Lee": new building(741, 939, 1035, 3, 'brick', 'glass', 'asphalt'),
    "Administration": new building(1035, 1269, 1389, 3, 'brick', 'glass', 'asphalt')
};

var grounds = {
    inner: new ground(1389, 4845, 24, 'asphalt'),
    top: new ground(4845, 5277, 9, 'grass'),
    left: new ground(5277, 5583, 17, 'grass'),
    right: new ground(5583, 5889, 17, 'grass'),
    bottom: new ground(5889, 6141, 3, 'grass'),
};
//Patchs and patchNames
var patches = [],
    patchNames = [];

//Generate Walls for Buildings
for (var bldg in buildings) {
    // console.log(bldg);
    //Walls
    var floor = 0;
    var subFloor = 0;
    for (var i = 2 + buildings[bldg].start; i < buildings[bldg].roofStart; i += buildings[bldg].columns + 2) {
        //floor
        for (var x = 0; x < buildings[bldg].columns; x++) {
            buildings[bldg].patches.push(i + x);
            if (subFloor == 1) {
                buildings[bldg].patchNames.push(bldg + ':' + buildings[bldg].windowSurface + ':' + floor + ':' + subFloor + ':' + x);
                patchNames[i + x] = bldg + ':' + buildings[bldg].windowSurface + ':' + floor + ':' + subFloor + ':' + x;
            } else {
                buildings[bldg].patchNames.push(bldg + ':' + buildings[bldg].wallSurface + ':' + floor + ':' + subFloor + ':' + x);
                patchNames[i + x] = bldg + ':' + buildings[bldg].wallSurface + ':' + floor + ':' + subFloor + ':' + x;
            }
        }
        subFloor++;
        if (subFloor == 3) {
            subFloor = 0;
            floor++;
        }
    }
    //Roof
    var rc = 0;
    for (var i = buildings[bldg].roofStart + 6; i <= buildings[bldg].end; i += 6) {
        buildings[bldg].patches.push(i);
        patchNames[i] = bldg + ':' + buildings[bldg].roofSurface + ':0:0:' + rc;
        buildings[bldg].patchNames.push(bldg + ':' + buildings[bldg].roofSurface + ':0:0:' + rc);
        rc++;
    }
}
// console.log(buildings);

//Ground
for (var section in grounds) {
    var row = 0,
        column = 0,
        count = 0;
    for (var i = grounds[section].start + 6; i <= grounds[section].end; i += 6) {
        grounds[section].patches.push(i);
        row = parseInt(count / grounds[section].rows);
        grounds[section].patchNames.push('Mitchell' + ':' + grounds[section].material + ':ground:' + section + ':' + row + ':' + column);
        patchNames[i] = 'Mitchell' + ':' + grounds[section].material + ':ground:' + section + ':' + row + ':' + column;
        count++;
        if (parseInt(count / grounds[section].rows) != row) {
            column = 0;
        } else {
            column++;
        }

    }
}
// console.log(grounds);
for (var bldg in buildings) {
    console.log(bldg, buildings[bldg].patches.length);
}
for (var section in grounds) {
    console.log(section, grounds[section].patches.length);
}
// console.log(grounds.inner.patches.length);
// console.log(patchNames);
// console.log(patchNames);
fs.writeFileSync('mitchell.json', JSON.stringify([buildings, grounds], null, 4));

var count = 8760;
var dayStart = 1;
var dayEnd = 48;
var surfaces = 6372;
csvStream.pipe(buildingStream);
csvStream1.pipe(groundStream);
db.serialize(function() {
    async.whilst(function() {
        return dayStart < 8759; //Number of days to pull data for
    }, function(callback) {
        //Query for a day
        db.all("SELECT KeyValue, Value,TimeIndex FROM ReportVariableWithTime Where TimeIndex BETWEEN " + dayStart + " and " + dayEnd, function(err, rows) {
            //Collapse Sub Surfaces into Containing Surface and Clean undefined columns
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].KeyValue.indexOf('SUB') >= 0) {
                    rows[i].KeyValue = rows[i - 1].KeyValue;
                    delete rows[i - 1];
                } else {
                    rows[i].KeyValue = Number(rows[i].KeyValue.split('SURFACE ')[1])
                }
            }
            rows.clean(undefined);
            rows = _.sortByAll(rows, ['TimeIndex', 'KeyValue']);
            //Get and organize Time Values
            var hours = _.uniq(_.pluck(_.sortBy(rows, 'TimeIndex'), 'TimeIndex'));
            console.log('hours', hours);
            var split = new Array(hours.length);
            var buildingObj = {};
            var groundObj = {};
            //Write To File
            var iterator = rows.length / hours.length;
            var j = 0;
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].KeyValue > 1389) {
                    if (patchNames[rows[i].KeyValue]) {
                        groundObj[patchNames[rows[i].KeyValue]] = rows[i].Value;
                    };

                } else {
                    if (patchNames[rows[i].KeyValue]) {
                        // console.log(rows[i].KeyValue, patchNames[rows[i].KeyValue]);
                        buildingObj[patchNames[rows[i].KeyValue]] = rows[i].Value;
                    }
                }
                j++;
                if (j == iterator) {
                    j = 0;
                    csvStream1.write(groundObj);
                    csvStream.write(buildingObj);
                    var buildingObj = {};
                    var groundObj = {};
                }
            };
            dayStart += 48;
            dayEnd += 48;
            callback();
        })
    }, function(err) {
        csvStream.end();
    });
});
