var fs = require('fs'),
    express = require('express'),
    createSTL = require('./createSTL.js').createSTL,
    createAllBuildingsSTL = require('./allBuildingsSTL.js').allBuildingsSTL,
    buildSTL = require('./buildSTL.js').buildSTL,
    bodyParser = require('body-parser');


var app = express();
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/place.html');
});

app.post('/createSTL', function (req, res) {
    console.log(req.body);
});

app.post('/createOneSTL', function (req, res) {
    createSTL(req.body.points, req.body.buildingHeight, req.body.buildingName);
    res.send("Stl File Created");
});
app.post('/createAllBuildingsSTL', function (req, res) {
    createAllBuildingsSTL(req.body.buildings);
    res.send("Stl File Created");
});

app.listen(3000);
