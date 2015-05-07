var fs = require('fs'),
    csv = require('fast-csv');

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

//loop through groups of surfaces: start, roof, end ground
// start Surf: [0, 114]
// roof Surf: [90, 354]
// end Surf: [114, 378]
// start Ground Array : [378, 474, 534, 744, 954]
// End Ground Array : [474, 534, 744, 954, 1314]

//building1 : 3 floors
//building2 : 8 floors

var walls = [];
for (var i = 2; i < 90; i += 10) {
    walls.push([])
    for (var x = 0; x < 8; x++) {
        walls[walls.length - 1].push(i + x);
    }
}
console.log(walls);

var walls1 = [];
for (var i = 116; i < 354; i += 10) {
    walls1.push([])
    for (var x = 0; x < 8; x++) {
        walls1[walls1.length - 1].push(i + x);
    }
}
console.log(walls1);

var roof1 = [];
for (var i = 96; i <= 114; i += 6) {
    roof1.push(i);
}
console.log(roof1);

var roof2 = [];
for (var i = 360; i <= 378; i += 6) {
    roof2.push(i);
}
console.log(roof2);

var innerGround = [];
for (var i = 384; i < 480; i += 6) {
    innerGround.push(i);
}
console.log(innerGround);

var leftGround = [];
for (var i = 540; i < 750; i += 6) {
    leftGround.push(i);
}
console.log(leftGround);

var topGround = [];
for (var i = 480; i < 540; i += 6) {
    topGround.push(i);
}
console.log(topGround);

var rightGround = [];
for (var i = 750; i < 960; i += 6) {
    rightGround.push(i);
}
console.log(rightGround);

var bottomGround = [];
for (var i = 960; i <= 1314; i += 6) {
    bottomGround.push(i);
}
console.log(bottomGround);