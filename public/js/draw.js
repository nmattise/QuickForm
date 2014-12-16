  var app = angular.module('drawMap', ['uiGmapgoogle-maps']);


  app.config(function (uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
          //    key: 'your api key',
          v: '3.17',
          libraries: 'weather,geometry,visualization,drawing'
      });
  })
   app.controller('drawCtrl', function ($scope, $window, uiGmapGoogleMapApi) {
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
              draggableCursor: 'url(), crosshair',
              draggingCursor: 'url(), crosshair'
          },
          events: {
              click: function (mapModel, eventName, originalEventArgs) {
                  var e = originalEventArgs[0];
                  var lat = e.latLng.lat(),
                      lng = e.latLng.lng();
                  $scope.polygons[$scope.polygons.length - 1].path.push({
                      latitude: lat,
                      longitude: lng
                  });
                  $scope.$apply();
              }
          }
      };
      //Building Array
      $scope.buildings = [{
          id: 1,
          name: "Venture Tech Building",
          footprintArea: 5000,
          height: 21,
          floorHeight: 3,
          floors: 7,
          totalArea: 35000,
          path: [],
          style: {
              stroke: {
                  color: '#6060FB',
                  weight: 3
              },
              fill: {
                  color: '#4f75b2',
                  opacity: 0.8
              }
          },
          selected: true
      }, {
          id: 1,
          name: "Venture Tech Building",
          footprintArea: 5000,
          height: 21,
          floorHeight: 3,
          floors: 7,
          totalArea: 35000,
          path: [],
          style: {
              stroke: {
                  color: '#6060FB',
                  weight: 3
              },
              fill: {
                  color: '#4f75b2',
                  opacity: 0.8
              }
          },
          selected: false
      }, {
          id: 1,
          name: "Venture Tech Building",
          footprintArea: 5000,
          height: 21,
          floorHeight: 3,
          floors: 7,
          totalArea: 35000,
          path: [],
          style: {
              stroke: {
                  color: '#6060FB',
                  weight: 3
              },
              fill: {
                  color: '#4f75b2',
                  opacity: 0.8
              }
          },
          selected: false
      }, {
          id: 1,
          name: "Venture Tech Building",
          footprintArea: 5000,
          height: 21,
          floorHeight: 3,
          floors: 7,
          totalArea: 35000,
          path: [],
          style: {
              stroke: {
                  color: '#6060FB',
                  weight: 3
              },
              fill: {
                  color: '#4f75b2',
                  opacity: 0.8
              }
          },
          selected: false
      }, {
          id: 1,
          name: "Venture Tech Building",
          footprintArea: 5000,
          height: 21,
          floorHeight: 3,
          floors: 7,
          totalArea: 35000,
          path: [],
          style: {
              stroke: {
                  color: '#6060FB',
                  weight: 3
              },
              fill: {
                  color: '#4f75b2',
                  opacity: 0.8
              }
          },
          selected: false
      }, {
          id: 1,
          name: "Venture Tech Building",
          footprintArea: 5000,
          height: 21,
          floorHeight: 3,
          floors: 7,
          totalArea: 35000,
          path: [],
          style: {
              stroke: {
                  color: '#6060FB',
                  weight: 3
              },
              fill: {
                  color: '#4f75b2',
                  opacity: 0.8
              }
          },
          selected: false
      }, {
          id: 1,
          name: "Venture Tech Building",
          footprintArea: 5000,
          height: 21,
          floorHeight: 3,
          floors: 7,
          totalArea: 35000,
          path: [],
          style: {
              stroke: {
                  color: '#6060FB',
                  weight: 3
              },
              fill: {
                  color: '#4f75b2',
                  opacity: 0.8
              }
          },
          selected: false
      }];
      //Test Polygon Array
      $scope.polygons = [{
          id: 1,
          path: [

                ],
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
              opacity: 0.5
          }
                }];
      //Functions
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
