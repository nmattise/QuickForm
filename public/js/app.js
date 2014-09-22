'use strict'
Number.prototype.toRadians = function () {
    return this * Math.PI / 180;
};
Number.prototype.toDegrees = function () {
    return this * 180 / Math.PI;
};

function coordinatesTo(origin, point) {
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
}

function polygonArea(coords) {
    var numPoints = coords.length,
        area = 0,
        j = numPoints - 1;

    for (var i = 0; i < numPoints; i++) {
        area += (coords[j][0] + coords[i][0]) * (coords[j][1] - coords[i][1]);
        j = i;
    }
    return area / 2;
}

var app = angular.module('bldr', ['google-maps', 'ngAutocomplete']);


app.controller('bldrController', ['$scope',
    function ($scope) {

        $scope.building;
        $scope.clickedMarker = [];
        $scope.buildings = [];

        $scope.map = {
            center: {
                latitude: $scope.building.address.details.geometry.location.k,
                longitude: $scope.building.address.details.geometry.location.B
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
                buildingFunction: $scope.building.function,
                buildingHeight: $scope.building.height,
                floors: $scope.building.floors,
                buildingArea: '',
                buildingColor: $scope.building.color,
                polygon: {
                    path: [],
                    stroke: {
                        color: '#222222',
                        weight: 1
                    },
                    editable: false,
                    draggable: false,
                    geodesic: false,
                    visible: true,
                    fill: {
                        color: $scope.building.color,
                        opacity: 0.6
                    }
                },
                latitude: [],
                longitude: [],
                footprintCoords: [[0, 0]],
                footprintArea: '',
                mechanical: {
                    systemType: $scope.building.mechanical.systemType,
                    boilerEfficiency: $scope.building.mechanical.boilerEfficiency,
                    fanEfficiency: $scope.building.mechanical.fanEfficiency
                }

            };
            for (i in $scope.clickedMarker) {
                building.polygon.path.push($scope.clickedMarker[i].coords);
                building.latitude.push($scope.clickedMarker[i].coords.latitude);
                building.longitude.push($scope.clickedMarker[i].coords.longitude);
            }
            for (var i = 1; i < $scope.clickedMarker.length; i++) {
                var coordinates = coordinatesTo($scope.clickedMarker[0].coords, $scope.clickedMarker[i].coords);
                building.footprintCoords.push(coordinates);
            }
            building.footprintArea = polygonArea(building.footprintCoords);
            building.buildingArea = building.footprintArea * building.floors;
            if (building.footprintArea <= 0) {
                console.log("reverse");
                $scope.clickedMarker.reverse();
                building.latitude.reverse();
                building.longitude.reverse();
                for (var i = 1; i < $scope.clickedMarker.length; i++) {
                    var coordinates = coordinatesTo($scope.clickedMarker[0].coords, $scope.clickedMarker[i].coords);
                    building.footprintCoords.push(coordinates);
                }
                building.footprintArea = polygonArea(building.footprintCoords);
                building.buildingArea = building.footprintArea * building.floors;
            }
            console.log(building);
            $scope.buildings.push(building);
            $scope.building = {};
            $scope.clickedMarker = [];
        };
}]);
