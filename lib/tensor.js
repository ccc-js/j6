module.exports = T =require("./matrix");

T.tadd = T.add;
T.tproduct = function(a,b) {
	var c=[];
	if (!T.isArray(a))
		return a.mul(b);
	for (var i=0; i<a.length; i++) {
		c.push(T.tproduct(a[i],b));
	}
	return c;
}

function contract2(b,j,ai,k) {
	if (k===j) {
//		console.log("b[ai]=", b[ai].str());
		return b[ai];
	} else {
		var c=[];
		for (var bi=0; bi<b.length;bi++) {
		  c.push(contract2(b,j,ai,k+1));
		}
		return c;
	}
}

// b = [[1,2],[3,4]];
// a = [[1,0],[0,1]];
// ab=[[b,0],      ab[0=1] = [b+b] = [2b] = [[2,4],[6,8]]
//     [0,b]]; 

function contract(a,i,j,k) { // merge a[..i..j..]
  var c = [];
	if (k===i) {
		for (var ai=0; ai<a.length; ai++) {
			c.push(contract2(a[ai],j,ai,k+1));
		}
		return T.colSum(c);
	} else {
		for (var ai=0; ai<a.length;ai++) {
		  c.push(contract(a[ai],i,j,k+1));
		}
	}
	return c;
}

T.tcontract = function(a,i,j) {
	return contract(a,i,j,0);
}

