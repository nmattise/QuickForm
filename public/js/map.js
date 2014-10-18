//Lat/Long and Coordinate Stuff
Number.prototype.toRadians = function () {
    return this * Math.PI / 180;
};
Number.prototype.toDegrees = function () {
    return this * 180 / Math.PI;
};

//Create Lat/Lng object
function latLon(lat, lng) {
    this.latitude = Number(lat);
    this.longitude = Number(lng);
}
//Latitude and Longitude to X,Y Coord
latLon.prototype.coordinatesTo = function (point) {
    var radius = 6371;
    var phi1 = this.latitude.toRadians(),
        lambda1 = this.longitude.toRadians(),
        phi2 = point.latitude.toRadians(),
        lambda2 = point.longitude.toRadians();
    var deltaPhi = phi2 - phi1,
        deltaLambda = lambda2 - lambda1;

    var a = Math.pow(Math.sin(deltaPhi / 2), 2) + Math.cos(phi1) * Math.cos(phi2) * Math.pow(Math.sin(deltaLambda / 2), 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = radius * c * 1000;

    var x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda),
        y = Math.sin(deltaLambda) * Math.cos(phi2);
    var theta = Math.atan2(y, x);
    var X = d * Math.sin(theta),
        Y = d * Math.cos(theta);
    return [X, Y];
}

//Coordinates from Basic Lat/lng point to Lat/Lng

latLon.prototype.destinationPoint = function (X, Y) {
    var radius = 6371;
    var brng = Math.atan(X / Y),
        dist = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
    var theta = Number(brng).toRadians();
    var delta = Number(dist) / radius; // angular distance in radians

    var phi1 = this.latitude.toRadians();
    var lambda1 = this.longitude.toRadians();

    var phi2 = Math.asin(Math.sin(phi1) * Math.cos(delta) +
        Math.cos(phi1) * Math.sin(delta) * Math.cos(theta));
    var lambda2 = lambda1 + Math.atan2(Math.sin(theta) * Math.sin(delta) * Math.cos(phi1),
        Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2));
    lambda2 = (lambda2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI; // normalise to -180..+180º

    return new latLon(phi2.toDegrees(), lambda2.toDegrees());
}


var app = angular.module('map', ['google-maps'.ns()]);

app.controller('mapController', ['$scope', '$http',
    function ($scope, $http) {
        $scope.buildings = [];
        $scope.buildingShape = 'rectangle';
        $scope.polygon = {
            "id": 1,
            "path": [{
                "latitude": 38.98998259610897,
                "longitude": -76.93853825086846
            }, {
                "latitude": 38.98998259610897,
                "longitude": -76.9381997013639
            }, {
                "latitude": 38.98964404660441,
                "longitude": -76.9381997013639
            }, {
                "latitude": 38.98964404660441,
                "longitude": -76.93853825086846
            }],
            "stroke": {
                "color": "#6060FB",
                "weight": 3
            },
            "editable": true,
            "draggable": true,
            "geodesic": false,
            "visible": true,
            "fill": {
                "color": "#ff0000",
                "opacity": 0.8
            }
        };
        $scope.polygons = [];
        $scope.lockPolygon = function () {
            $scope.polygons[$scope.polygons.length - 1].editable = false;
            $scope.polygons[$scope.polygons.length - 1].static = true;
        };
        $scope.build3D = function (footprintShape) {
            console.log(footprintShape);
            //Create Cartesian Coorinates
            var polygon = $scope.polygons[$scope.polygons.length - 1].path;
            var coords = [];
            var origin = new latLon(polygon[0].latitude, polygon[0].longitude);
            for (var i = 1; i < polygon.length; i++) {
                var point = new latLon(polygon[i].latitude, polygon[i].longitude);
                coords.push(origin.coordinatesTo(point))
            };
            coords.unshift([0, 0]);
            console.log(coords);
            $scope.coords = coords;
            var x = (coords[0][0] + coords[1][0]) / 2;
            var y = (coords[0][1] + coords[1][1]) / 2;

            var rect = [[0, 0], [x, 0], [x, y], [0, y]];
            console.log(rect);
            $http.post('/createOneSTL', {
                buildingName: "buildingName",
                buildingHeight: 15,
                points: coords

            }).
            success(function (data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(data);
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(data);
            });
        };
        $scope.map = {
            center: {
                latitude: 38.989936,
                longitude: -76.942777
            },
            zoom: 17,
            events: {
                click: function (mapModel, eventName, originalEventArgs) {
                    var e = originalEventArgs[0];
                    var lat = e.latLng.lat(),
                        lng = e.latLng.lng();
                    console.log(e);
                    $scope.latitude = lat;
                    $scope.longitude = lng;
                    var zoomScale = 591657550.500000 / Math.pow(2, $scope.map.zoom - 1);
                    var y = (zoomScale / 60) / 111111;
                    var x = (zoomScale / 60 * Math.cos(lat)) / (111111 * Math.cos(lat));
                    var center = new latLon(lat, lng);
                    switch ($scope.buildingShape) {
                    case "rectangle":
                        var pt4 = new latLon(lat + y, lng - x),
                            pt3 = new latLon(lat + y, lng + x),
                            pt2 = new latLon(lat - y, lng + x),
                            pt1 = new latLon(lat - y, lng - x);

                        var points = [pt1, pt2, pt3, pt4];

                        var polygon = {
                            id: $scope.polygon.length + 1,
                            path: points,
                            stroke: {
                                color: '#6060FB',
                                weight: 3
                            },
                            editable: true,
                            draggable: true,
                            geodesic: false,
                            visible: true,
                            fill: {
                                color: '#ff0000',
                                opacity: 0.8
                            }
                        };
                        break;
                    case "lShape":
                        var pt6 = new latLon(lat + y, lng - x / 2),
                            pt5 = new latLon(lat + y, lng + x / 2),
                            pt4 = new latLon(lat, lng + x / 2),
                            pt3 = new latLon(lat, lng + x),
                            pt2 = new latLon(lat - y, lng + x),
                            pt1 = new latLon(lat - y, lng - x / 2);
                        var points = [pt1, pt2, pt3, pt4, pt5, pt6];
                        var polygon = {
                            id: $scope.polygon.length + 1,
                            path: points,
                            stroke: {
                                color: '#6060FB',
                                weight: 3
                            },
                            editable: true,
                            draggable: true,
                            geodesic: false,
                            visible: true,
                            fill: {
                                color: '#ff0000',
                                opacity: 0.8
                            }
                        };
                        break;
                    case "tShape":
                        var pt8 = new latLon(lat + y / 2, lng - x),
                            pt7 = new latLon(lat + y / 2, lng + x),
                            pt6 = new latLon(lat, lng + x),
                            pt5 = new latLon(lat, lng + x / 2),
                            pt4 = new latLon(lat - y, lng + x / 2),
                            pt3 = new latLon(lat - y, lng - x / 2),
                            pt2 = new latLon(lat, lng - x / 2),
                            pt1 = new latLon(lat, lng - x);
                        var points = [pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8];
                        var polygon = {
                            id: $scope.polygon.length + 1,
                            path: points,
                            stroke: {
                                color: '#6060FB',
                                weight: 3
                            },
                            editable: true,
                            draggable: true,
                            geodesic: false,
                            visible: true,
                            fill: {
                                color: '#ff0000',
                                opacity: 0.8
                            }
                        };
                        break;
                    case "uShape":
                        var pt8 = new latLon(lat + y, lng - x),
                            pt7 = new latLon(lat + y, lng - x / 2),
                            pt6 = new latLon(lat, lng - x / 2),
                            pt5 = new latLon(lat, lng + x / 2),
                            pt4 = new latLon(lat + y, lng + x / 2),
                            pt3 = new latLon(lat + y, lng + x),
                            pt2 = new latLon(lat - y / 2, lng + x),
                            pt1 = new latLon(lat - y / 2, lng - x);
                        var points = [pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8];
                        var polygon = {
                            id: $scope.polygon.length + 1,
                            path: points,
                            stroke: {
                                color: '#6060FB',
                                weight: 3
                            },
                            editable: true,
                            draggable: true,
                            geodesic: false,
                            visible: true,
                            fill: {
                                color: '#ff0000',
                                opacity: 0.8
                            }
                        };
                        break;
                    case "hShape":
                        var pt12 = new latLon(lat + y, lng - x),
                            pt11 = new latLon(lat + y, lng - x / 2),
                            pt10 = new latLon(lat + y / 2, lng - x / 2),
                            pt9 = new latLon(lat + y / 2, lng + x / 2),
                            pt8 = new latLon(lat + y, lng + x / 2),
                            pt7 = new latLon(lat + y, lng + x),
                            pt6 = new latLon(lat - y, lng + x),
                            pt5 = new latLon(lat - y, lng + x / 2),
                            pt4 = new latLon(lat - y / 2, lng + x / 2),
                            pt3 = new latLon(lat - y / 2, lng - x / 2),
                            pt2 = new latLon(lat - y, lng - x / 2),
                            pt1 = new latLon(lat - y, lng - x);

                        var points = [pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9, pt10, pt11, pt12];
                        var polygon = {
                            id: $scope.polygon.length + 1,
                            path: points,
                            stroke: {
                                color: '#6060FB',
                                weight: 3
                            },
                            editable: true,
                            draggable: true,
                            geodesic: false,
                            visible: true,
                            fill: {
                                color: '#ff0000',
                                opacity: 0.8
                            }
                        };
                        break;
                    case "crossShape":
                        var pt12 = new latLon(lat + y, lng - x / 2),
                            pt11 = new latLon(lat + y, lng + x / 2),
                            pt10 = new latLon(lat + y / 2, lng + x / 2),
                            pt9 = new latLon(lat + y / 2, lng + x),
                            pt8 = new latLon(lat - y / 2, lng + x),
                            pt7 = new latLon(lat - y / 2, lng + x / 2),
                            pt6 = new latLon(lat - y, lng + x / 2),
                            pt5 = new latLon(lat - y, lng - x / 2),
                            pt4 = new latLon(lat - y / 2, lng - x / 2),
                            pt3 = new latLon(lat - y / 2, lng - x),
                            pt2 = new latLon(lat + y / 2, lng - x),
                            pt1 = new latLon(lat + y / 2, lng - x / 2);

                        var points = [pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9, pt10, pt11, pt12];
                        var polygon = {
                            id: $scope.polygon.length + 1,
                            path: points,
                            stroke: {
                                color: '#6060FB',
                                weight: 3
                            },
                            editable: true,
                            draggable: true,
                            geodesic: false,
                            visible: true,
                            fill: {
                                color: '#ff0000',
                                opacity: 0.8
                            }
                        };
                        break;
                    case "trapezoid":
                        var pt4 = new latLon(lat + y / 2, lng - x / 2),
                            pt3 = new latLon(lat + y / 2, lng + x / 2),
                            pt2 = new latLon(lat - y / 2, lng + x),
                            pt1 = new latLon(lat - y / 2, lng - x);

                        var points = [pt1, pt2, pt3, pt4];
                        var polygon = {
                            id: $scope.polygon.length + 1,
                            path: points,
                            stroke: {
                                color: '#6060FB',
                                weight: 3
                            },
                            editable: true,
                            draggable: true,
                            geodesic: false,
                            visible: true,
                            fill: {
                                color: '#ff0000',
                                opacity: 0.8
                            }
                        };
                        break;
                    case "triangle":
                        var pt3 = new latLon(lat + y, lng - x),
                            pt2 = new latLon(lat - y, lng + x),
                            pt1 = new latLon(lat - y, lng - x);

                        var points = [pt1, pt2, pt3];
                        var polygon = {
                            id: $scope.polygon.length + 1,
                            path: points,
                            stroke: {
                                color: '#6060FB',
                                weight: 3
                            },
                            editable: true,
                            draggable: true,
                            geodesic: false,
                            visible: true,
                            fill: {
                                color: '#ff0000',
                                opacity: 0.8
                            }
                        };
                        break;
                    }

                    $scope.polygons.push(polygon);
                    $scope.$apply()
                }
            }
        };

            }]);



app.config(['GoogleMapApiProvider'.ns(),
    function (GoogleMapApi) {
        GoogleMapApi.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'weather,geometry,visualization, places'
        });
    }]);
