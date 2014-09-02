'use strict'
Number.prototype.toRadians = function () {
    return this * Math.PI / 180;
};
Number.prototype.toDegrees = function () {
    return this * 180 / Math.PI;
};
var coordinatesTo = function (origin, point) {
    var R = 6371;
    var φ1 = origin.latitude.toRadians(),
        λ1 = origin.longitude.toRadians();
    var φ2 = point.latitude.toRadians(),
        λ2 = point.longitude.toRadians();
    var Δφ = φ2 - φ1;
    var Δλ = λ2 - λ1;

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c * 1000;

    var y = Math.sin(Δλ) * Math.cos(φ2);
    var x = Math.cos(φ1) * Math.sin(φ2) -
        Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    var θ = Math.atan2(y, x);
    var X = d * Math.sin(θ);
    var Y = d * Math.cos(θ);
    return [X, Y];
};

var app = angular.module('bldr', ['google-maps']);


app.controller('bldrController', ['$scope',
    function ($scope) {

        $scope.building;
        $scope.clickedMarker = [];
        $scope.buildings = [];

        $scope.map = {
            center: {
                latitude: 38.987597,
                longitude: -76.940163
            },
            zoom: 17,
            bounds: {},
            clickedMarker: {
                id: 0,
                title: '',
                coords: {}
            },
            events: {
                click: function (mapModel, eventName, originalEventArgs) {
                    // 'this' is the directive's scope
                    var e = originalEventArgs[0];
                    var lat = e.latLng.lat(),
                        lon = e.latLng.lng();
                    var marker = {
                        id: $scope.clickedMarker.length + 1,
                        coords: {
                            latitude: lat,
                            longitude: lon
                        }
                    };
                    $scope.clickedMarker.push(marker);
                    //scope apply required because this event handler is outside of the angular domain
                    $scope.$apply();
                }
            }
        }

        $scope.addBuilding = function () {
            var building = {
                buildingID: $scope.buildings.length + 1,
                buildingName: $scope.building.name,
                buildingAddress: $scope.building.address,
                buildingHeight: $scope.building.height,
                buildingColor: $scope.building.color,
                polygon: {
                    path: [],
                    stroke: {
                        color: '#222222',
                        weight: 1
                    },
                    editable: true,
                    draggable: true,
                    geodesic: false,
                    visible: true,
                    fill: {
                        color: $scope.building.color,
                        opacity: 0.6
                    }
                },
                latitude: [],
                longitude: [],
                cartesian: []
            };
            for (i in $scope.clickedMarker) {
                building.polygon.path.push($scope.clickedMarker[i].coords);
                building.latitude.push($scope.clickedMarker[i].coords.latitude);
                building.longitude.push($scope.clickedMarker[i].coords.longitude);
                /*building.cartesian.push(coordinatesTo($scope.clickedMarker[0].coords, $scope.clickedMarker[i].coords));*/
            }
            while (i < $scope.clickedMarker.length) {
                building.cartesian.push(coordinatesTo($scope.clickedMarker[0].coords, $scope.clickedMarker[i].coords));
            }
            console.log(building);
            $scope.buildings.push(building);
            $scope.building = {};
            $scope.clickedMarker = [];
        };
}]);
