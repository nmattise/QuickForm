/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Latitude/longitude spherical geodesy formulae & scripts           (c) Chris Veness 2002-2014  */
/*   - www.movable-type.co.uk/scripts/latlong.html                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/* jshint node:true */
/* global define */
'use strict';
//if (typeof module!='undefined' && module.exports) var Geo = require('./geo'); // CommonJS (Node.js)
Number.prototype.toRadians = function () {
    return this * Math.PI / 180;
};
Number.prototype.toDegrees = function () {
    return this * 180 / Math.PI;
};

/**
 * Creates a LatLon point on the earth's surface at the specified latitude / longitude.
 *
 * @classdesc Tools for geodetic calculations
 * @requires Geo
 *
 * @constructor
 * @param {number} lat - Latitude in degrees.
 * @param {number} lon - Longitude in degrees.
 * @param {number} [height=0] - Height above mean-sea-level in kilometres.
 * @param {number} [radius=6371] - (Mean) radius of earth in kilometres.
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119);
 */
function LatLon(lat, lon, height, radius) {
    // allow instantiation without 'new'
    if (!(this instanceof LatLon)) return new LatLon(lat, lon, height, radius);

    if (typeof height == 'undefined') height = 0;
    if (typeof radius == 'undefined') radius = 6371;
    radius = Math.min(Math.max(radius, 6353), 6384);

    this.lat = Number(lat);
    this.lon = Number(lon);
    this.height = Number(height);
    this.radius = Number(radius);
}


/**
 * Returns the distance from 'this' point to destination point (using haversine formula).
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number} Distance between this point and destination point, in km (on sphere of 'this' radius).
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119), p2 = new LatLon(48.857, 2.351);
 *     var d = p1.distanceTo(p2); // d.toPrecision(4): 404.3
 */
LatLon.prototype.distanceTo = function (point) {
    var R = this.radius;
    var φ1 = this.lat.toRadians(),
        λ1 = this.lon.toRadians();
    var φ2 = point.lat.toRadians(),
        λ2 = point.lon.toRadians();
    var Δφ = φ2 - φ1;
    var Δλ = λ2 - λ1;

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
};
/**
 * Returns the (initial) bearing from 'this' point to destination point.
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number} Initial bearing in degrees from north.
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119), p2 = new LatLon(48.857, 2.351);
 *     var b1 = p1.bearingTo(p2); // b1.toFixed(1): 156.2
 */
LatLon.prototype.bearingTo = function (point) {
    var φ1 = this.lat.toRadians(),
        φ2 = point.lat.toRadians();
    var Δλ = (point.lon - this.lon).toRadians();

    // see http://mathforum.org/library/drmath/view/55417.html
    var y = Math.sin(Δλ) * Math.cos(φ2);
    var x = Math.cos(φ1) * Math.sin(φ2) -
        Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    var θ = Math.atan2(y, x);

    return (θ.toDegrees() + 360) % 360;
};

LatLon.prototype.coordinatesTo = function (distanceTo, bearingTo) {
    var x = distanceTo * Math.sin(bearingTo.toRadians());
    var y = distanceTo * Math.cos(bearingTo.toRadians());
    return [x, y];
}

var p1 = new LatLon(38.98741996725684, -76.94109611213207),
    p2 = new LatLon(38.98742934902934, -76.94059319794178),
    p3 = new LatLon(38.986759070377, -76.94057241082191);
var d = p1.distanceTo(p2); // d.toPrecision(4): 404.3
console.log(d * 3280.84);
var b1 = p1.bearingTo(p2);
console.log(b1);
var d2 = p1.distanceTo(p3); // d.toPrecision(4): 404.3
console.log(d2 * 3280.84);
var b2 = p1.bearingTo(p3);
console.log(b2);

var coords = p1.coordinatesTo(d * 3280.84, b1);
console.log(coords);
var coords = p1.coordinatesTo(d2 * 3280.84, b2);
console.log(coords);
