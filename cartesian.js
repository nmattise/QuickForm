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

var markers = [{"id":1,"coords":{"latitude":38.987426221772004,"longitude":-76.94108068943024}},{"id":2,"coords":{"latitude":38.98740120370816,"longitude":-76.94060862064362}},{"id":3,"coords":{"latitude":38.9867757492385,"longitude":-76.94050133228302}},{"id":4,"coords":{"latitude":38.98673405207736,"longitude":-76.94108068943024}},{"id":5,"coords":{"latitude":38.986892501159,"longitude":-76.94162786006927}},{"id":6,"coords":{"latitude":38.98682578579945,"longitude":-76.94170296192169}},{"id":7,"coords":{"latitude":38.98682578579945,"longitude":-76.9415956735611}},{"id":8,"coords":{"latitude":38.98682578579945,"longitude":-76.94167077541351}},{"id":9,"coords":{"latitude":38.986892501159,"longitude":-76.94202482700348}},{"id":10,"coords":{"latitude":38.98732614946358,"longitude":-76.94201409816742}},{"id":11,"coords":{"latitude":38.98785986680692,"longitude":-76.94175660610199}}];

var m1 = new LatLon(markers[0].coords.latitude, markers[0].coords.longitude);

for (var i = 1; i < markers.length; i++) {
    var m2 = new LatLon(markers[i].coords.latitude, markers[i].coords.longitude);
    console.log(m1.coordinatesTo(m2));
}
