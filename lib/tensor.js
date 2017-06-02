/* eslint-disable no-undef */
// ============= Multi-Dimensional Array Operation ====================
var recursiveDim = function (a, d) { // dimension by recursion (tensor)
  if (j6.isArray(a)) {
    d.push(a.length)
    recursiveDim(a[0], d)
  }
}

var recursiveRepeat = function (dim, i, v) {
  if (i === dim.length) {
    return j6.isFunction(v) ? v() : v
  } else {
    let n = dim[i]
    let a = new Array(n)
    for (var k = 0; k < n; k++) {
      a[k] = recursiveRepeat(dim, i + 1, v)
    }
    return a
  }
}

j6.tdim = function (a) {
  var d = []
  recursiveDim(a, d)
  return d
}

j6.trepeat = function (dim, value = 0) {
  return recursiveRepeat(dim, 0, value)
}

j6.trandom = function (dim, a = 0, b = 1) {
  return j6.trepeat(dim, () => j6.random(a, b))
}

// ================== Map Reduce =========================
var map1 = j6.tmap1 = function (a, f) {
  if (a instanceof Array) {
    var fa = new Array(a.length)
    for (var i = 0; i < a.length; i++) {
      fa[i] = map1(a[i], f)
    }
    return fa
  } else {
    return f(a)
  }
}

var map2 = j6.tmap2 = function (a, b, f) {
  if (a instanceof Array) {
    var fa = new Array(a.length)
    var isArrayB = (b instanceof Array)
    for (var i = 0; i < a.length; i++) {
      var bi = isArrayB ? b[i] : b
      fa[i] = map2(a[i], bi, f)
    }
    return fa
  } else {
    return f(a, b)
  }
}

var reduce = j6.treduce = function (a, f, init) {
  var result = init
  if (a instanceof Array) {
    for (var i in a) {
      result = f(result, reduce(a[i], f, init))
    }
  } else {
    result = f(result, a)
  }
  return result
}

j6.tall = function (a) {
  return (a instanceof Array) ? a.every(e => j6.tall(e)) : (a === true)
}

j6.tany = function (a) {
  return (a instanceof Array) ? a.some(e => j6.tany(e)) : (a === true)
}

// statistics
j6.tmax = (a) => reduce(a, Math.max, -Number.MAX_VALUE)
j6.tmin = (a) => reduce(a, Math.min, Number.MAX_VALUE)
j6.tsum = (a) => reduce(a, (x, y) => x + y, 0)
j6.tproduct = (a) => reduce(a, (x, y) => x * y, 1)
// +-*/%^
j6.tadd = function (a, b) { return map2(a, b, (x, y) => x + y) }
j6.tsub = function (a, b) { return map2(a, b, (x, y) => x - y) }
j6.tmul = function (a, b) { return map2(a, b, (x, y) => x * y) }
j6.tdiv = function (a, b) { return map2(a, b, (x, y) => x / y) }
j6.tmod = function (a, b) { return map2(a, b, (x, y) => x % y) }
j6.tpower = function (a, b) { return map2(a, b, (x, y) => Math.pow(x, y)) }
j6.tneg = function (a) { return map1(a, (x) => -x) }
j6.tinv = function (a) { return map1(a, (x) => 1 / x) }
// logical
j6.tnot = function (a) { return map1(a, (x) => !x) }
j6.tand = function (a, b) { return map2(a, (x, y) => x && y) }
j6.tor = function (a, b) { return map2(a, (x, y) => x || y) }
// j6.xor=function(x,y) { return x^y }
j6.tbnot = function (x) { return map1(a, (x) => ~x) }
j6.tband = function (a, b) { return map2(a, b, (x, y) => x & y) }
j6.tbor = function (a, b) { return map2(a, b, (x, y) => x | y) }
j6.tbxor = function (a, b) { return map2(a, b, (x, y) => x ^ y) }
j6.tlshift = function (a, b) { return map2(a, b, (x) => x << b) }
j6.trshift = function (a, b) { return map2(a, b, (x) => x >> b) }
// compare
j6.teq = function (a, b) { return map2(a, b, (x, y) => x === y) }
j6.tneq = function (a, b) { return map2(a, b, (x, y) => x !== y) }
j6.tgeq = function (a, b) { return map2(a, b, (x, y) => x >= y) }
j6.tleq = function (a, b) { return map2(a, b, (x, y) => x <= y) }
j6.tgt = function (a, b) { return map2(a, b, (x, y) => x > y) }
j6.tlt = function (a, b) { return map2(a, b, (x, y) => x < y) }
j6.tnear = function (a, b) { return a.sub(b).abs().sum() < 0.001 }
// number function
j6.tsqrt = function (a) { return map1(a, Math.sqrt) }
j6.tlog = function (a) { return map1(a, Math.log) }
j6.texp = function (a) { return map1(a, Math.exp) }
j6.tabs = function (a) { return map1(a, Math.abs) }
j6.tsin = function (a) { return map1(a, Math.sin) }
j6.tcos = function (a) { return map1(a, Math.cos) }
j6.ttan = function (a) { return map1(a, Math.tan) }
j6.tasin = function (a) { return map1(a, Math.asin) }
j6.tacos = function (a) { return map1(a, Math.acos) }
j6.tatan = function (a) { return map1(a, Math.atan) }
j6.tatan2 = function (a) { return map1(a, Math.atan2) }
j6.tceil = function (a) { return map1(a, Math.ceil) }
j6.tfloor = function (a) { return map1(a, Math.floor) }
j6.tround = function (a) { return map1(a, Math.round) }
j6.tsin = function (a) { return map1(a, Math.sin) }
j6.tsqrt = function (a) { return map1(a, Math.sqrt) }
j6.tcomplex = function (a) { return map1(a, (x) => j6.Complex.toComplex(x)) }
// Operation (Object version)
j6.taddo = function (a, b) { return map2(a, b, (x, y) => x.add(y)) }
j6.tsubo = function (a, b) { return map2(a, b, (x, y) => x.sub(y)) }
j6.tmulo = function (a, b) { return map2(a, b, (x, y) => x.mul(y)) }
j6.tdivo = function (a, b) { return map2(a, b, (x, y) => x.div(y)) }
// j6.omod = function(a,b) { return map2(a,b,(x,y)=>x.mod(y)) }
j6.tsqrto = function (a) { return map1(a, (x) => x.sqrt()) }
j6.tsumo = function (a) { return reduce(a, function (x, y) { return x.add(y) }, 0) }
j6.tproducto = function (a) { return reduce(a, (x, y) => x.mul(y), 1) }

// ===================== Tensor Operation ===========================
j6.tprod = function(a,b) {
	var c=[];
	if (!j6.isArray(a)) return a.mul(b)
	for (var i=0; i<a.length; i++) {
		c.push(j6.tprod(a[i],b))
	}
	return c;
}

function contract2(b,j,ai,k) {
	if (k===j) {
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
//     [0,b]]
function contract(a,i,j,k) { // merge a[..i..j..]
  var c = [];
	if (k===i) {
		for (var ai=0; ai<a.length; ai++) {
			c.push(contract2(a[ai],j,ai,k+1));
		}
		return j6.colSum(c);
	} else {
		for (var ai=0; ai<a.length;ai++) {
		  c.push(contract(a[ai],i,j,k+1));
		}
	}
	return c;
}

j6.tcontract = function(a,i,j) {
	return contract(a,i,j,0);
}
