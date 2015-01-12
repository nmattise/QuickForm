//Prototypes
Array.prototype.last = function() {
    return this[this.length - 1];
};

var app = angular.module('placeMap', ['uiGmapgoogle-maps']);


app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization,drawing'
    });
})
app.controller('placeCtrl', function($scope, $window, uiGmapGoogleMapApi, $http) {
    //Units
    $scope.units = "ip";
    //Initialize
    $scope.bldgFootprint = 'rect';
    //Initial Map Settings
    $scope.map = {
        center: {
            latitude: 38.988889,
            longitude: -76.942050
        },
        zoom: 17,
        bounds: {},
        options: {
            scrollwheel: true,
            draggableCursor: 'url(), crosshair'
        },
        events: {
            click: function(mapModel, eventName, originalEventArgs) {
                var e = originalEventArgs[0];
                var lat = e.latLng.lat(),
                    lng = e.latLng.lng();
                if ($scope.bldgFootprint) {
                    var zoomScale = 591657550.500000 / Math.pow(2, $scope.map.zoom - 1);
                    var y = (zoomScale / 60) / 111111;
                    var x = (zoomScale / 60 * Math.cos(lat)) / (111111 * Math.cos(lat));
                    var center = new latLon(lat, lng);
                    switch ($scope.bldgFootprint) {
                        case "rect":
                            var pt4 = new latLon(lat + y, lng - x),
                                pt3 = new latLon(lat + y, lng + x),
                                pt2 = new latLon(lat - y, lng + x),
                                pt1 = new latLon(lat - y, lng - x);

                            var points = [pt1, pt2, pt3, pt4];
                            var polygon = {
                                path: points,
                                stroke: {
                                    color: '#6060FB',
                                    weight: 3
                                },
                                static: false,
                                editable: true,
                                draggable: false,
                                geodesic: false,
                                visible: true,
                                fill: {
                                    color: '#ff0000',
                                    opacity: 0.6
                                }
                            };
                            $scope.mapPolygon = polygon;
                            $scope.$apply();
                            break;
                    }
                } else {
                    $window.alert("Please Select a Building Footprint");
                }
            }
        }
    };

    //Functions
    $scope.editable = function() {
            $scope.mapPolygon.editable = !$scope.mapPolygon.editable;
            $scope.mapPolygon.path.last().latitude -= 0.00000000000001;
        }
        //Polygon Array for what is editable on the Map
    $scope.mapPolygon = {
        path: []
    };

    //Building Array
    $scope.buildings = new Array;
    $scope.removedBuildings = new Array;
    //Test polylines Array

    $scope.saveBuilding = function() {
        //Use Building Path to Find Footprint Area
        var path = $scope.mapPolygon.path;
        var footprintArea = getArea(path);
        //Initialize new Building Object
        var building = new Object;
        building.polygon = new Object;
        building.polygon.path = new Array;
        building.polygon.fill = new Object;
        building.polygon.stroke = new Object;
        if ($scope.buildings.length > 0) {
            var id = $scope.buildings.last().id + 1;
            building.polygon.id = id;
            building.id = id;
        } else {
            var id = 0;
            building.polygon.id = id;
            building.id = id;
        }
        building.polygon.path = path;
        building.polygon.stroke = {
            color: '#777',
            weight: 1
        };
        building.polygon.fill = {
            color: '#777',
            opacity: 0.6
        };
        building.name = $scope.name;
        building.numFloors = $scope.numFloors;
        building.flrToFlrHeight = $scope.flrToFlrHeight;
        building.shape = $scope.bldgFootprint;
        building.footprintArea = footprintArea;
        building.height = $scope.flrToFlrHeight * $scope.numFloors;
        building.totalArea = $scope.numFloors * footprintArea;
        building.bldgFootprint = $scope.bldgFootprint;
        $scope.buildings.push(building);
        $scope.mapPolygon.path = new Array;
        $scope.name = new String;
        $scope.numFloors = new Number;
        $scope.flrToFlrHeight = new Number;
        $scope.bldgFootprint = 'rect';
    }
    $scope.editBuilding = function(id) {
        $scope.buildings.forEach(function(b) {
            if (b.id == id) {
                $scope.mapPolygon = b.polygon;
                $scope.$apply();
            }
        });
    }
    $scope.removeBuilding = function(id) {
        for (var i = 0; i < $scope.buildings.length; i++) {
            if ($scope.buildings[i].id == id) {
                $scope.removeBuildings.push($scope.buildings[i]);
                $scope.buildings.splice(i, 1);
            }
        }
    }
    $scope.buildSTL = function() {
        var selectedIds = new Array,
            selectedBuildings = new Array;
        $scope.buildings.forEach(function(b) {
            if (b.selected) {
                selectedIds.push(b.id);
                selectedBuildings.push(b);
            }
        });
        if (selectedIds.length > 0) {
            $window.alert(selectedIds);
            $http.post('/createSTL', {
                buildings: $scope.buildings
            }).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(data);
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(data);
            });
        } else {
            $window.alert("Please select at least one building to create an STL file");
        }
    };
    $scope.buildOSM = function() {
        var selectedIds = new Array,
            selectedBuildings = new Array;
        $scope.buildings.forEach(function(b) {
            if (b.selected) {
                selectedIds.push(b.id);
                selectedBuildings.push(b);
            }
        });
        if (selectedIds.length > 0) {
            $window.alert(selectedIds);
            $http.post('/createOSM', {
                buildings: $scope.buildings
            }).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(data);
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(data);
            });
        } else {
            $window.alert("Please select at least one building to create an OSM file");
        }
    };

    uiGmapGoogleMapApi.then(function(maps) {

    });
});
