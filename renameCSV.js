var fs = require('fs');
var csv = require('csv');


var csvData = fs.readFileSync('./Output/Rectangle_.csv', 'utf8');

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

csv.parse(csvData, function(err, data) {
    if (err) throw err;
    //Create Organized Data Array
    var organizedData = new Array(data.length);
    for (var i = 0; i < organizedData.length; i++) {
        organizedData[i] = [];
    };
    //Delete Surfaces containing subsurfaces and rename subsurfac
    for (var i = 0; i <= data[0].length - 1; i++) {
        if (data[0][i].indexOf('SUB') >= 0) {
            data[0][i] = data[0][i - 1];
            data.forEach(function(row) {
                delete row[i - 1];
            });
        };
    };

    //Organize Data
    for (var j = 1; j < data[0].length; j++) {
        if (data[0][j]) {
            var id = data[0][j].split(' ')[1].split(':')[0];
            for (var v = 0; v < data.length; v++) {
                organizedData[v][id] = data[v][j];
            }
        };
    };
    //Remove Undefined Columns
    for (var j = 0; j < organizedData.length; j++) {
        organizedData[j].clean(undefined);
    }
    //Rename Columns based upon location
    for (var j = 0; j < organizedData[0].length; j++) {
        organizedData[0][j] = j + 1;
    }

    console.log(organizedData[0]);
    csv.stringify(organizedData, function(err, output) {
        fs.writeFileSync('./Output/Rectangle_new.csv', output);
    });

});
