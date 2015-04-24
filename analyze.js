var fs = require('fs');
var csv = require('fast-csv');

var stream = fs.createReadStream("streamOut.csv");
var headers = [];
var csvStream = csv()
    .on("data", function(data) {
        //console.log(data);
        if (headers.length == 0) headers = data;
    })
    .on("end", function() {
        console.log("done");
        console.log(headers)
        var groundCount = {
                all: 0,
                inner: 0,
                bottom: 0,
                left: 0,
                right: 0,
                top: 0

            },
            buildingCount = 0,
            windowCount = 0,
            roofCount = 0;
        headers.forEach(function(patch) {
            if (patch.indexOf("grass") > 0) groundCount.all++;
            if (patch.indexOf("inner") > 0) groundCount.inner++;
            if (patch.indexOf("bottom") > 0) groundCount.bottom++;
            if (patch.indexOf("top") > 0) groundCount.top++;
            if (patch.indexOf("left") > 0) groundCount.left++;
            if (patch.indexOf("right") > 0) groundCount.right++;
            if (patch.indexOf("brick") > 0) buildingCount++;
            if (patch.indexOf("glass") > 0) windowCount++;
            if (patch.indexOf("asphalt") > 0) roofCount++;
        });
        console.log("Ground: " + groundCount.all);
        console.log("Ground.Inner: " + groundCount.inner);
        console.log("Ground.Left: " + groundCount.left);
        console.log("Ground.Right: " + groundCount.right);
        console.log("Ground.Top: " + groundCount.top);
        console.log("Ground.Bottom: " + groundCount.bottom);
        console.log("Building: " + buildingCount);
        console.log("Windows: " + windowCount);
        console.log("Roof: " + roofCount);
        console.log("length: " + headers.length)
    });

stream.pipe(csvStream);
