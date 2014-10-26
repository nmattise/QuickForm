var apiKey = 'AIzaSyB6sl1lQQORM2xga_Hs2X--d7wuFosl_eM';
//https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536,-104.9847034&key=API_KEY
var baseURL = 'https://maps.googleapis.com/maps/api/elevation/json?locations=';

//https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536,-104.9847034|36.455556,-116.866667&key=API_KEY

var request = require('request');
var async = require('async');

var coords = [{
    "latitude": 38.989468517547934,
    "longitude": -76.94274961460619
}, {
    "latitude": 38.989468517547934,
    "longitude": -76.94207251559706
}, {
    "latitude": 38.99014561655706,
    "longitude": -76.94207251559706
}, {
    "latitude": 38.99014561655706,
    "longitude": -76.94274961460619
}];

/*var pathURL = baseURL + coords[0].latitude + ',' + coords[0].longitude + '|' + coords[1].latitude + ',' + coords[1].longitude + '|' + coords[2].latitude + ',' + coords[2].longitude + '&key=' + apiKey;

request(pathURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(JSON.parse(body)) // Print the google web page.

    }

});*/

var pathURL = baseURL + '';
coords.forEach(function (cord) {
    pathURL += cord.latitude + ',' + cord.longitude + '|';
})
var pointsURL = pathURL.substr(0, pathURL.length - 2) + '&key=' + apiKey;

request(pointsURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(JSON.parse(body)) // Print the google web page.
        var points = JSON.parse(body).results;
        for (var i = 0; i < coords.length; i++) {
            coords[i].elevation = points[i].elevation;
        };
        console.log(coords);
    }

});

