var fs = require('fs');

function streamT() {
        var readableStream = fs.createReadStream('./Rect_20m.txt');
        readableStream.setEncoding('utf8');
        var data = '';
        readableStream.on('data', function(chunk) {
            data += chunk;
        });

        readableStream.on('end', function() {
            var array = data.split('\n');
            console.log(array.length)
            if (!array[array.length - 1]) array.pop()
            console.log(array.length)
                //Number of Rectangles
            var rects = array.length / 8760; //8760 is # of hours in year
            console.log(rects);
            //Number of triangles
            var tris = rects * 2;
            console.log(tris);
            //Loop through and assign radiance values to triangles
            var rectCount = 0;
            var triCount = 0;
            var building = [];
            var a1 = [];
            array.forEach(function(r) {
                a1.push(Number(r))
            })
            console.log(a1)
        });

    }
    //streamT();

function buffT() {
    //Inspired From http://stackoverflow.com/questions/11874096/parse-large-json-file-in-nodejs
    var stream = fs.createReadStream('./Rect_20m.txt', {
        flags: 'r',
        encoding: 'utf-8'
    })
    var buf = '';
    var array = [
        []
    ];
    var hrCount = 0;
    var rectCount = 0;
    stream.on('data', function(d) {
        buf += d.toString(d)
        pump();
    })
    stream.on('end', function() {
        console.log(array.length);
        var day = [];
        var avg = 0;
        var count = 0;
        var average = [];
        var full = [];

        //Average
        array.forEach(function(f) {
            for (var i = 0; i < f.length; i++) {
                if (f[i] > 0) {
                    avg += f[i];
                    count++;
                }
            };
            average.push([avg / count]);
            average.push([avg / count]);
            avg = 0;
            count = 0;
        });
        fs.writeFile('./averageResults.json', JSON.stringify(average), function(err) {
            if (err) throw err
        });
        console.log(average.length);
        console.log(Math.max.apply(null, average));
        //Day & Full
        array.forEach(function(f) {
            day.push(f[3708]);
            day.push(f[3708]);
            full.push(f);
            full.push(f);
        });
        fs.writeFile('./dayResults.json', JSON.stringify(day), function(err) {
            if (err) throw err
        });
        fs.writeFile('./fullResults.json', JSON.stringify(full), function(err) {
            if (err) throw err
        });
        console.log(day.length);
        console.log(Math.max.apply(null, day));
    })

    function pump() {
        var pos;

        while ((pos = buf.indexOf('\n')) >= 0) { // keep going while there's a newline somewhere in the buffer
            if (pos == 0) { // if there's more than one newline in a row, the buffer will now start with a newline
                buf = buf.slice(1); // discard it
                continue; // so that the next iteration will start with data
            }
            process(buf.slice(0, pos)); // hand off the line
            buf = buf.slice(pos + 1); // and slice the processed data off the buffer
        }
    }

    function process(line) { // here's where we do something with a line

        if (line[line.length - 1] == '\r') line = line.substr(0, line.length - 1); // discard CR (0x0D)

        if (line.length > 0) { // ignore empty lines
            var obj = Number(line); // parse the JSON
            if (hrCount == 8760) {
                hrCount = 0;
                rectCount++;
                array.push([]);
            }
            array[rectCount].push(obj);
            hrCount++;
        }
    }
}
buffT();
