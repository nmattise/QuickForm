//Starter Variables

var polygons = [
    {
        "lat": [-28.000229819458851, -28.0001540355940332, -27.9999716804509373, -28.00004983269291],
        "long": [153.421223759651181, 153.421132564544682, 153.421328365802763, 153.42141956090927]
    },
];
var lat = [-28.000229819458851, -28.0001540355940332, -27.9999716804509373, -28.00004983269291],
    long = [153.421223759651181, 153.421132564544682, 153.421328365802763, 153.42141956090927];

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var radlon1 = Math.PI * lon1 / 180
    var radlon2 = Math.PI * lon2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    switch (unit) {
    case "K":
        dist = dist * 1.609344;
        break
    case "M":
        dist = dist * 1609.344;
        break
    case "FT":
        dist = dist *5280;
        break
    default:
        dist = dist;
    }
    return dist
}

console.log(distance(lat[0], long[0], lat[1], long[1], 'FT'));

