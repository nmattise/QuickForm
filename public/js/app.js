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
                title: ''
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
            }
            $scope.buildings.push(building);
            $scope.building = {};
            $scope.clickedMarker = [];
        };
}]);
