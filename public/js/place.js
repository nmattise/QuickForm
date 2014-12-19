//Prototypes
Array.prototype.last = function () {
    return this[this.length - 1];
};

var app = angular.module('placeMap', ['uiGmapgoogle-maps']);


app.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization,drawing'
    });
})
app.controller('placeCtrl', function ($scope, $window, uiGmapGoogleMapApi) {
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
            click: function (mapModel, eventName, originalEventArgs) {
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
    $scope.editable = function () {
        $scope.mapPolygon.editable = !$scope.mapPolygon.editable;
        $scope.mapPolygon.path.last().latitude -= 0.00000000000001;
    }
    //Polygon Array for what is editable on the Map
    $scope.mapPolygon = {
        path: []
    };

    //Building Array
    $scope.buildings = new Array;
    //Test polylines Array

    $scope.saveBuilding = function () {
        var footprintArea = getArea($scope.mapPolygon.path);
        var building = new Object;
        if ($scope.buildings.length > 0) {
            var id = $scope.buildings.last().id + 1;
        } else {
            var id = 0;
        }
        building.polygon = $scope.mapPolygon;
        building.id = id;
        building.polygon.id = id;
        building.name = $scope.name;
        building.numFloors = $scope.numFloors;
        building.flrToFlrHeight = $scope.flrToFlrHeight;
        building.shape = $scope.bldgFootprint;
        building.footprintArea = footprintArea;
        building.height = $scope.flrToFlrHeight * $scope.numFloors;
        building.totalArea = $scope.numFloors * footprintArea;
        $scope.buildings.push(building);
        $scope.mapPolygon.path = new Array;
    }
    $scope.editBuilding = function (id) {
        $scope.buildings.forEach(function (b) {
            if (b.id == id) {
                $scope.mapPolygon = b.polygon;
                $scope.$apply();
            }
        })
    }
    $scope.removeBuilding = function (id) {

    }
    $scope.buildSTL = function () {
        var selectedIds = new Array,
            selectedBuildings = new Array;
        $scope.buildings.forEach(function (b) {
            if (b.selected) {
                selectedIds.push(b.id);
                selectedBuildings.push(b);
            }
        });
        if (selectedIds.length > 0) {
            $window.alert(selectedIds);
        } else {
            $window.alert("Please select at least one building to create an STL file");
        }
    };
    $scope.buildOSM = function () {
        var selectedIds = new Array,
            selectedBuildings = new Array;
        $scope.buildings.forEach(function (b) {
            if (b.selected) {
                selectedIds.push(b.id);
                selectedBuildings.push(b);
            }
        });
        if (selectedIds.length > 0) {
            $window.alert(selectedIds);
        } else {
            $window.alert("Please select at least one building to create an OSM file");
        }
    };

    uiGmapGoogleMapApi.then(function (maps) {

    });
});
