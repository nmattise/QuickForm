var stl = require('stl')
var fs = require('fs');

var facets = stl.toObject(fs.readFileSync('sample.stl').toString());
console.log(facets);
console.log(facets.facets[0].verts);
fs.writeFileSync('facets2.json', JSON.stringify(facets.facets));

var facets2 = {
    description: 'modelTest',
    facets: [{
            verts: [[0, 0, 0], [10, 0, 0], [10, 0, 10]]
        },
        {
            verts: [[0, 0, 0], [0, 0, 10], [10, 0, 10]]
        },
        {
            verts: [[10, 0, 0], [10, 10, 0], [10, 10, 10]]
        }
      ]
};

fs.writeFileSync('binary.stl', stl.fromObject(facets2, true));
fs.writeFileSync('ascii.stl', stl.fromObject(facets2));
