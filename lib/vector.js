var R, V, A, N;
module.exports = R = A = N = require("./algebra");
R.V = V = {}
// ============= Array Operation =========================
V.recursiveDim = function(a,d) { // dimension by recursion
	if (R.isArray(a)) {
		d.push(a.length)
		V.recursiveDim(a[0],d);
	}
}

R.dim = V.dim = function(a) {
	var d=[];
	V.recursiveDim(a,d);
	return d;
}

V.recursiveRepeat = function(dim, i, v) {
	if (i===dim.length) {
		return R.isFunction(v)?v():v;
	} else {
		var n = dim[i], a = new Array(n);
		for (var k=0; k<n; k++) {
			a[k] = V.recursiveRepeat(dim, i+1, v);
		}
		return a;
	}
}

V.repeat = function(dim, value=0) {
	return V.recursiveRepeat(dim, 0, value);
}

R.newV = V.newV = R.fill = V.fill = function(n, value=0) {
  return V.repeat([n], value);
}

V.random = function(dim, a=0, b=1) {
	return V.repeat(dim, ()=>R.random(a,b));
}

R.randomV = V.randomV = function(n, a, b) { return V.random([n], a, b) }

R.samples = V.samples = function(n, a) { return V.map1(new Array(n), ()=>R.sample(a)) }

V.extend=function(a, size) {
	var v = a.slice();
	for (var i=a.length; i<size; i++) {
		v.push(0);
	}
	return v;
}

var cadd = A.ComplexField.add, cmul=A.ComplexField.mul;

R.vdot = V.vdot = function(x,y,isComplex=false) {
	var sum = 0, len = x.length;
	for (var i=0; i<len; i++) {
		if (!isComplex)
			sum += x[i]*y[i]; // 速度較快
		else
			sum = cadd(sum, cmul(x[i], y[i])); // 速度稍慢(不使用多型，否則會很慢)
	}
	return sum;
}

R.vadd = V.vadd = function(a,b) {
	var len=a.length, r=new Array(len);
  for (var i=0; i<len; i++)	
		r[i] = a[i]+b[i];
	return r;
}

R.vsub = V.vsub = function(a,b) {
	var len=a.length, r=new Array(len);
  for (var i=0; i<len; i++)	
		r[i] = a[i]-b[i];
	return r;
}

R.vmul = V.vmul = function(a,b) {
	var len=a.length, r=new Array(len);
  for (var i=0; i<len; i++)	
		r[i] = a[i]*b[i];
	return r;
}

R.vdiv = V.vdiv = function(a,b) {
	var len=a.length, r=new Array(len);
  for (var i=0; i<len; i++)	
		r[i] = a[i]/b[i];
	return r;
}

// ================== Map Reduce =========================
var map1 = R.map1 = V.map1 = function(a,f) {
	if (a instanceof Array) {
		var fa = new Array(a.length);
		for (var i=0; i<a.length; i++) {
			fa[i] = map1(a[i], f);
		}
		return fa;
	} else {
		return f(a);
	}
}

var map2 = R.map2 = V.map2 = function(a,b,f) {
	if (a instanceof Array) {
		var fa = new Array(a.length);
		var isArrayB = (b instanceof Array);
		for (var i=0; i<a.length; i++) {
			var bi = isArrayB?b[i]:b;
			fa[i] = map2(a[i], bi, f);
		}
		return fa;
	} else {
		return f(a, b);
	}
}

var reduce = R.reduce = V.reduce = function(a,f,init) {
	var result=init;
	if (a instanceof Array) {
		for (var i in a) {
			result = f(result, V.reduce(a[i], f, init));
		}
	} else {
		result = f(result, a);
	}
	return result;
}

V.all = function (a) {
	return (a instanceof Array) ? a.every(e => V.all(e)) : (a === true)
}

V.any = function (a) {
	return (a instanceof Array) ? a.some(e => V.some(e)) : (a === true)
}

// +-*/%^
V.add  = function(a,b) { return map2(a,b,(x,y)=>x+y) }
V.sub  = function(a,b) { return map2(a,b,(x,y)=>x-y) }
V.mul  = function(a,b) { return map2(a,b,(x,y)=>x*y) }
V.div  = function(a,b) { return map2(a,b,(x,y)=>x/y) }
V.mod  = function(a,b) { return map2(a,b,(x,y)=>x%y) }
V.power= function(a,b) { return map2(a,b, (x,y)=>Math.pow(x,y)) }
V.neg  = function(a)   { return map1(a,(x)=>-x) }
V.inv  = function(a)   { return map1(a,(x)=>1/x) }
// logical
V.not  = function(a)   { return map1(a,(x)=>!x) }
V.and  = function(a,b) { return map2(a,(x,y)=>x&&y) }
V.or   = function(a,b) { return map2(a,(x,y)=>x||y) }
// V.xor=function(x,y) { return x^y }
V.bnot = function(x)   { return map1(a,(x)=>~x)}
V.band = function(a,b) { return map2(a,b,(x,y)=>x&y) }
V.bor  = function(a,b) { return map2(a,b,(x,y)=>x|y) }
V.bxor = function(a,b) { return map2(a,b,(x,y)=>x^y) }
V.lshift=function(a,b) { return map2(a,b,(x)=>x << b) }
V.rshift=function(a,b) { return map2(a,b,(x)=>x >> b) }
// compare
V.eq   = function(a,b) { return map2(a,b,(x,y)=>x===y) }
V.neq  = function(a,b) { return map2(a,b,(x,y)=>x!==y) }
V.geq  = function(a,b) { return map2(a,b,(x,y)=>x>=y) }
V.leq  = function(a,b) { return map2(a,b,(x,y)=>x<=y) }
V.gt   = function(a,b) { return map2(a,b,(x,y)=>x>y) }
V.lt   = function(a,b) { return map2(a,b,(x,y)=>x<y) }
V.near = function(a,b) { return a.sub(b).abs().sum()<0.001 }
// number function
V.sqrt = function(a)   { return map1(a,Math.sqrt) }
V.log  = function(a)   { return map1(a,Math.log) }
V.exp  = function(a)   { return map1(a,Math.exp) }
V.abs  = function(a)   { return map1(a,Math.abs) }
V.sin  = function(a)   { return map1(a,Math.sin) }
V.cos  = function(a)   { return map1(a,Math.cos) }
V.tan  = function(a)   { return map1(a,Math.tan) }
V.asin = function(a)   { return map1(a,Math.asin) }
V.acos = function(a)   { return map1(a,Math.acos) }
V.atan = function(a)   { return map1(a,Math.atan) }
V.atan2= function(a)   { return map1(a,Math.atan2) }
V.ceil = function(a)   { return map1(a,Math.ceil) }
V.floor= function(a)   { return map1(a,Math.floor) }
V.round= function(a)   { return map1(a,Math.round) }
V.sin  = function(a)   { return map1(a,Math.sin) }
V.sqrt = function(a)   { return map1(a,Math.sqrt) }

V.max = (a)=>V.reduce(a,Math.max,-Number.MAX_VALUE);
V.min = (a)=>V.reduce(a,Math.min,Number.MAX_VALUE);
V.sum = (a)=>V.reduce(a,(x,y)=>x+y,0);
V.product = (a)=>V.reduce(a,(x,y)=>x*y,1);
V.mean=function(a) {
	return a.sum().div(a.length);
}
V.norm=function(a) {
	return a.map1((x)=>x*x).sum().sqrt();
}

V.toComplex = function(a) { return map1(a, (x)=>N.Complex.toComplex(x)) }
// Operation (Object version) 
V.oadd = function(a,b) { return map2(a,b,(x,y)=>x.add(y)) }
V.osub = function(a,b) { return map2(a,b,(x,y)=>x.sub(y)) }
V.omul = function(a,b) { return map2(a,b,(x,y)=>x.mul(y)) }
V.odiv = function(a,b) { return map2(a,b,(x,y)=>x.div(y)) }
// R.omod = function(a,b) { return map2(a,b,(x,y)=>x.mod(y)) }
V.osqrt= function(a)   { return map1(a, (x)=>x.sqrt()) }
V.osum = function(a)   { return V.reduce(a, function(x,y) { return x.add(y) }	,0) }
V.oproduct = function(a) { return V.reduce(a,(x,y)=>x.mul(y),1) }

R.mixThisMap(Array.prototype, V, {
dim:"dim",
sum:"sum",
near:'near',
max:"max",
min:"min",
sum:"sum",
product:"product",
norm:"norm",
mean:"mean",
map1:"map1",
map2:"map2",
// fast vector op
vdot:"vdot",
vadd:"vadd",
vsub:"vsub",
vmul:"vmul",
vdiv:"vdiv",
// slow map version
// logical
all:'all',
// compare
eq:'eq',
neq:'neq',
geq:'geq',
leq:'leq',
gt:'gt',
lt:'lt',
near:'near',
// +-*/%
add:"add",
sub:"sub",
mul:"mul",
div:"div",
mod:"mod",
neg:"neg",
and:"and",
or:"or",
xor:"xor",
not:"not",
// bits operation
bnot:"bnot",
band:"band",
bor:"bor",
bxor:"bxor",
// function
power:"power",
// "dot", 和矩陣相衝
sqrt:"sqrt",
log:"log",
exp:"exp",
abs:"abs",
sin:"sin",
cos:"cos",
tan:"tan",
asin:"asin",
acos:"acos",
atan:"atan",
ceil:"ceil",
floor:"floor",
round:"round",
toComplex:"toComplex",
// Object version
oadd:"oadd",
osub:"osub",
omul:"omul", 
odiv:"odiv",
osqrt:"osqrt",
osum:"osum",
oproduct:"oproduct",
});