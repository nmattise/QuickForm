// Credit goes to Chris Veness http://www.movable-type.co.uk/scripts/latlong.html

Number.prototype.toRadians = function () {
    return this * Math.PI / 180;
};
Number.prototype.toDegrees = function () {
    return this * 180 / Math.PI;
};

function LatLon(lat, lon, height, radius) {
    // allow instantiation without 'new'
    if (!(this instanceof LatLon)) return new LatLon(lat, lon, height, radius);

    if (typeof height == 'undefined') height = 0;
    if (typeof radius == 'undefined') radius = 6371;
    radius = Math.min(Math.max(radius, 6353), 6384);

    this.latitude = Number(lat);
    this.longitude = Number(lon);
    this.height = Number(height);
    this.radius = Number(radius);
}

LatLon.prototype.coordinatesTo = function (point) {
    var R = 6371;
    var φ1 = this.latitude.toRadians(),
        λ1 = this.longitude.toRadians();
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

var p1 = new LatLon(38.98741996725684, -76.94109611213207),
    p2 = new LatLon(38.98742934902934, -76.94059319794178),
    p3 = new LatLon(38.986759070377, -76.94057241082191);

console.log(p1.coordinatesTo(p2));
console.log(p1.coordinatesTo(p3));
