var app = angular.module('bldr', ['google-maps']);


app.controller('bldrController', ['$scope',
    function ($scope) {
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
                    console.log("lat: " + lat + "   Long: " + lon);
                    var path = {
                        latitude: lat,
                        longitude: lon
                    }
                    var marker = {
                        id: $scope.clickedMarker.length + 1,
                        coords: {
                            latitude: lat,
                            longitude: lon
                        }
                    };
                    $scope.clickedMarker.push(marker);
                    //$scope.polygon.path.push(path);
                    //scope apply required because this event handler is outside of the angular domain
                    $scope.$apply();
                }
            }
        }
        $scope.addBuilding = function () {
            var buildingName = $scope.buildingName;
            $scope.buildingName = "";
            var buildingAddress = $scope.buildingAddress;
            $scope.buildingAddress = "";
            var buildingHeight = $scope.buildingHeight;
            $scope.buildingHeight = "";

            var building = {
                buildingName: buildingName,
                buildingAddress: buildingAddress,
                buildingHeight: buildingHeight,
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
                        color: $scope.buildingColor,
                        opacity: 0.6
                    }
                }
            };
            for (i in $scope.clickedMarker) {
                building.polygon.path.push($scope.clickedMarker[i].coords)
            }
            $scope.clickedMarker = [];
            console.log(building);
            $scope.buildings.push(building);
            console.log($scope.buildings);
        };
}]);
