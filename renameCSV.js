var fs = require('fs');
var csv = require('csv');


var csvData = fs.readFileSync('./Output/LShape.csv', 'utf8');


csv.parse(csvData, function(err, data) {
    var organizedData = new Array(data.length);
    for (var i = 0; i < organizedData.length; i++) {
        organizedData[i] = [];
    };
    if (err) throw err;
    for (var i = 0; i <= data[0].length - 1; i++) {
        if (data[0][i].indexOf('SUB') >= 0) {
            data[0][i] = data[0][i - 1];
            data.forEach(function(row) {
                delete row[i - 1];
            });
        };
    };
    for (var j = 1; j < data[0].length; j++) {
        if (data[0][j]) {
            var id = data[0][j].split(' ')[1].split(':')[0];
            for (var v = 0; v < data.length; v++) {
                organizedData[v][id] = data[v][j];
            }
        };
    };
    console.log(organizedData[0]);
    csv.stringify(organizedData, function(err, output) {
        fs.writeFileSync('./Output/LShape_new.csv', output);
    })
});
