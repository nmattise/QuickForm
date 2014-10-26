var rect = [[0, 0], [29.25992190946141, 0.00005438960892975053], [29.25978195665714, 37.64504171452473], [0, 37.644987325118564]];
//L Shape
var lShape = [[0, 0], [29.260022236090915, 0.000054389608930479266], [29.2601621880931, -37.644932935079744], [43.89024328247792, -37.64486494763048], [43.89045320879839, -75.28985227350465], [9.220362646416448e-15, -75.28997465094444]];
var hShape = [[0, 0], [7.314938702695629, 0.0000033993947656681205], [7.314947449825986, -9.411243432251544], [21.944842347285306, -9.411216237123552], [21.94481610586253, 0.000030594552890114854], [29.259754808520253, 0.000054389962591562513], [29.259894761833728, -37.644932935316284], [21.944921070928867, -37.644956730807436], [21.944894830046042, -28.233709899638363], [7.3149649441024716, -28.233737094794478], [7.314973691023224, -37.64498392575607], [4.610181323164913e-15, -37.644987325118564]];
var cross = [[0, 0],
     [-14.629837974530815, 0.000013597579062511844],
     [-14.629907951730436, -37.64497372825691],
     [4.610181323251536e-15, -37.64498732582589],
     [6.915271984747369e-15, -56.467480987677845],
     [29.259885881103248, -56.4674265975198],
     [29.25981590447643, -37.64493293557596],
     [43.88972385727202, -37.644864947607324],
     [43.88951392558933, 0.00012237785790143485],
     [29.259675950110623, 0.00005438996258860597],
     [29.259605972681065, 18.822548052603892],
     [0, 18.822493662559282]];

var uShape = [[0, 0], [14.629851248369631, 0.000013597579062043672], [14.629921225474554, -37.64497372755522], [43.88976367835188, -37.644864947128525], [43.889553747105765, 0.00012237785790664583], [58.519404995172074, 0.00021756020402277296], [58.51982485692092, -56.46726342679208], [6.915271984747369e-15, -56.467480987677845]];

var tShape = [[0, 0], [7.314981943914533, 0.000003399394765457238], [7.314999437993286, -18.822490263191344], [21.944998310745657, -18.82246306814325], [21.944945828419684, 0.00003059455289155676], [29.259927772296304, 0.00005438960892586044], [29.25989278411707, 9.411301221293458], [0, 9.411246831633303]];;

//Distance Formula
function distance(pt1, pt2) {
    var dist = Math.sqrt(Math.pow(pt2[0] - pt1[0], 2) + Math.pow(pt2[1] - pt1[1], 2)),
        distRounded = dist.toFixed(2);
    return Number(distRounded);
}



//Rectangle
//Target is Length and Width
var length = distance(rect[0], rect[1]),
    width = distance(rect[0], rect[3]);
//No Tests Needed
console.log("Width: " + width + "   Length: " + length);

//L Shape
var length = distance(lShape[0], lShape[1]),
    width = distance(lShape[0], lShape[5]),
    end1 = distance(lShape[1], lShape[2]),
    end2 = distance(lShape[5], lShape[4]);

console.log("Width: " + width + "   Length: " + length + "  end1 : " + end1 + "   end2: " + end2);

//T Shape
var length = distance(tShape[7], tShape[6]),
    width = distance(tShape[3], tShape[4]) + distance(tShape[5], tShape[6]),
    end1 = distance(tShape[0], tShape[7]),
    end2 = distance(tShape[2], tShape[3]),
    off1 = distance(tShape[0], tShape[1]),
    off2 = distance(tShape[4], tShape[5]);

console.log("T Shape:  Width: " + width + "   Length: " + length + "  end1 : " + end1 + "   end2: " + end2 + "   off1: " + off1 + "   off2: " + off2);
var length2 = off1 + end2 + off2;
console.log(length + "\n" + length2);

//UShape
var length = distance(uShape[1], uShape[0]),
    width1 = distance(uShape[7], uShape[0]),
    width2 = distance(uShape[2], uShape[1]),
    end1 = distance(uShape[7], uShape[6]),
    end2 = distance(uShape[3], uShape[2]),
    off = distance(uShape[6], uShape[5]);

console.log("Ushape:  Width1: " + width1 + "   Width2: " + width2 + "   Length: " + length + "  end1 : " + end1 + "   end2: " + end2 + "   off: " + off);


//HShape
var length = distance(hShape[0], hShape[5]),
    length1 = distance(hShape[11], hShape[6]),
    leftWidth = distance(hShape[0], hShape[11]),
    rightWidth = distance(hShape[5], hShape[6]),
    letfEndWidth = distance(hShape[0], hShape[1]),
    rightEndWidth = distance(hShape[4], hShape[5]),
    centerWidth = distance(hShape[2], hShape[9]),
    centerWidth1 = distance(hShape[3], hShape[8]),
    leftEndOffset = distance(hShape[9], hShape[10]),
    rightEndOffset = distance(hShape[8], hShape[7]);

console.log(length + "\n" + length1);
console.log(centerWidth + "\n" + centerWidth1);

//Cross Shape
var length = distance(cross[1], cross[8]),
    width = distance(cross[4], cross[11]),
    length1 = distance(cross[2], cross[7]),
    width1 = distance(cross[5], cross[10]),
    end1 = distance(cross[2], cross[1]),
    end2 = distance(cross[11], cross[10]),
    end3 = distance(cross[7], cross[8]),
    end4 = distance(cross[4], cross[5]),
    offset1 = distance(cross[1], cross[0]),
    offset2 = distance(cross[0], cross[11]),
    offset3 = distance(cross[9], cross[10]),
    offset4 = distance(cross[9], cross[8]),
    offset5 = distance(cross[6], cross[7]),
    offset6 = distance(cross[5], cross[6]),
    offset7 = distance(cross[4], cross[3]),
    offset8 = distance(cross[2], cross[3]);

console.log("\n\n" + length + "\n" + length1);
console.log(width + "\n" + width1);
console.log("end1: " + end1 + "\nend2:" + end2 + "\nend3:" + end3 + "\nend4:" + end4);
console.log("offset1:" + offset1 + "\noffset2:" + offset2 + "\noffset3:" + offset3 + "\noffset4:" + offset4);
console.log("offset5:" + offset5 + "\noffset6:" + offset6 + "\noffset7:" + offset7 + "\noffset8:" + offset8);
console.log(offset7 + offset2 + end1)
