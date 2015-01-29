  var app = angular.module('drawMap', ['uiGmapgoogle-maps']);


  app.config(function(uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
          //    key: 'your api key',
          v: '3.17',
          libraries: 'weather,geometry,visualization,drawing'
      });
  })
  app.controller('drawCtrl', function($scope, $window, uiGmapGoogleMapApi) {
      //Units
      $scope.units = "ip";
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
                  $scope.polyline.path.push({
                      latitude: lat,
                      longitude: lng
                  });
                  $scope.$apply();
              }
          }
      };
      //Building Array
      $scope.buildings = [];
      //Test polylines Array
      $scope.polyline = {
          path: [],
          stroke: {
              color: '#6060FB',
              weight: 3
          },
          editable: false,
          draggable: false,
          geodesic: false,
          visible: true
      };
      //Undo/Redo Points
      var sparePoints = new Array;
      //Functions
      $scope.undoPoint = function() {
          var pt = $scope.polyline.path.pop();
          sparePoints.push(pt);
      };
      $scope.redoPoint = function() {
          if (sparePoints[0]) {
              var pt = sparePoints.pop();
              $scope.polyline.path.push(pt);
          }

      };
      $scope.addBuilding = function() {
          var polygon = $scope.polyline.path;
          polygon.pop();
          if ($scope.buildings.length > 0) {
              var id = $scope.buildings[$scope.buildings.length - 1].id + 1;
          } else {
              var id = 0;
          }
          var footprintArea = getArea(polygon);
          var building = {
              id: id,
              name: $scope.polyline.buildingName,
              numFloors: $scope.polyline.numFloors,
              flrToFlrHeight: $scope.polyline.flrToFlrHeight,
              footprintArea: footprintArea,
              height: $scope.polyline.numFloors * $scope.polyline.flrToFlrHeight,
              totalArea: footprintArea * $scope.polyline.numFloors,
              map: {
                  path: polygon,
                  stroke: {
                      color: '#6060FB',
                      weight: 3
                  },
                  editable: false,
                  draggable: false,
                  geodesic: false,
                  visible: true,
                  fill: {
                      color: '#ff0000',
                      opacity: 0.8
                  }
              }
          };
          //find average of points
          var lat = 0,
              lng = 0,
              avgLat, avgLng;
          polygon.forEach(function(pt) {
              lat += pt.latitude;
              lng += pt.longitude;
          });
          avgLat = lat / polygon.length;
          avgLng = lng / polygon.length;
          var coords = [];
          var origin = new latLon(avgLat, avgLng);
          console.log(origin);
          polygon.forEach(function(pt) {
              var point = new latLon(pt.latitude, pt.longitude);
              coords.push(origin.coordinatesTo(point));
              console.log(coords);
          });
          building.coords = coords;
          $scope.buildings.push(building);
          //Reset the Variables
          $scope.polyline = {
              path: [],
              stroke: {
                  color: '#6060FB',
                  weight: 3
              },
              editable: false,
              draggable: false,
              geodesic: false,
              visible: true
          };
          //$scope.$apply();
      }
      $scope.editBuilding = function(id) {
          $scope.buildings.forEach(function(building) {
              if (building.id == id) {
                  building.map.editable = !building.map.editable;
              }
          });
      }
      $scope.removeBuilding = function(id) {
          var place = new Number;
          for (var i = 0; i < $scope.buildings.length; i++) {
              if ($scope.buildings[i].id == id) {
                  place = i;
              }
          };
          $scope.buildings.splice(place, place + 1)
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
          } else {
              $window.alert("Please select at least one building to create an OSM file");
          }
      };

      uiGmapGoogleMapApi.then(function(maps) {

      });
  });
