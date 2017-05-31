// http://blog.smartbear.com/testing/four-serious-math-libraries-for-javascript/
// Four Serious Math Libraries for JavaScript

module.exports = U = {};

U.extend = Object.assign;

U.clone = function(o) {	return JSON.parse(JSON.stringify(o)) }

U.assert=function(cond, msg) { 
  if (!cond) throw Error(msg) 
}

U.slice = function(a) {
	return Array.prototype.slice.call(a);
}

U.bind=function(o, member) {
	if (typeof o[member]==='Function')
		return o[member].bind(o); 
	else
		return o[member];
}

U.ncall = function() {
  var args = U.slice(arguments);
  var n = args[0];
  var o = args[1];
  var fname = args[2];
  var params = args.slice(3);
  var a=[];
  for (var i=0; i<n; i++)
    a.push(o[fname].apply(o, params));
  return a;
}

U.mapFunctions=function(host, obj, pairs) {
	for (var h in pairs) {
		var o = pairs[h];
		if (typeof host[h] !=='undefined')
			console.log('mapBind: error!', h, ' has been defined!');
		host[h]=U.bind(obj, o);
	}
}

U.copyFunctions=function(host, obj, names) {
	for (var name of names) {
		if (typeof host[name] !=='undefined')
			console.log('namesBind: error!', name, ' has been defined!');
		host[name]=U.bind(obj, name);
	}
}

U.mix=function(self, members) {
	for (var name in members) {
		var member = members[name];
		if (typeof self[name] === 'undefined') {
			Object.defineProperty(self, name, {
				enumerable: true,
				writable: true,
				value: member,
			});
		} else {
	    console.log("U.mix fail:", name, " already exists!");
			console.log(' self[name]=', self[name]);
			console.log(' member=', member);
		}
	}
}

U.arg1this = function(f,obj) { // 傳回一個已經綁定 f, obj 的函數
  return function() { 
		var args = U.slice(arguments);
    return f.apply(obj, [this].concat(args)); // 效果相當於 obj.f(this, args)
  }
}

U.mixThis=function(proto, obj, fmembers) {
	for (var fname of fmembers) {
		var f = obj[fname];
		if (typeof proto[fname] === 'undefined') {
			Object.defineProperty(proto, fname, {
				enumerable: false,
				writable: true,
				value: U.arg1this(f,obj), // proto.f(args) => obj.f(this, args) , 這行盡量不要動，除非想得很清楚了！
			});
		} else {
	    console.log("U.mixThis:", fname, " fail!");
			console.log(' obj[fname]=', obj[fname]);
			throw Error();
		}
	}
}

U.mixThisMap=function(proto, obj, poMap) {
	for (var pname in poMap) {
		var oname = poMap[pname];
		var f = obj[oname];
		if (typeof proto[pname] === 'undefined') {
			Object.defineProperty(proto, pname, {
				enumerable: false,
				writable: true,
				value: U.arg1this(f,obj), // proto.f(args) = f(this, args) , 這行盡量不要動，除非想得很清楚了！
			});
		} else {
			console.log('pname=', pname, 'proto[pname]=', proto[pname]);
	    console.log("U.mixThisMap:", oname, " fail!");
		}
	}
}

U.ctrim=function(s, set, side) {
  side = side||"both";
  for (var b=0; b<s.length; b++)
    if (set.indexOf(s[b])<0) break;
  for (var e=s.length-1; e>=0; e--)
    if (set.indexOf(s[e])<0) break;
  if (side === "right") b=0;
  if (side === "left") e=s.length-1;
  return s.substring(b, e+1);
}

U.lpad=function(s, width, ch) {
  return s.length >= width ? s : new Array(width - s.length + 1).join(ch) + s;
}

U.def = function(x, value) {
	return (typeof x !== 'undefined')?x:value;
}

U.precision = 2;

U.nstr = function(n, precision=U.precision) {
	if (n % 1 === 0) return n.toFixed(0);
	return n.toFixed(precision);
}

U.vstr = function(a, precision=U.precision) {
	var s=[];
	for (var i in a) {
		if (typeof a[i]==='undefined')
			s.push('undefined');
		else
			s.push(a[i].str(precision));
	}
	return "["+s.join(', ')+"]";
}

U.sstr = function(s) { return s.toString(); }

/*
U.ostr = function(o, precision=U.precision) {
  var s = [];
  for (var k in o)
    s.push(k+":"+U.str(o[k], precision));
  return "{"+s.join(", ")+"}";
}
*/

U.ostr = function(o) { return o.toString() }

U.str = function(o, precision=U.precision) {
	if (typeof o ==='undefined')
		return 'undefined';
	else
		return o.str(precision);
}


// ================= Rule =====================
U.check = U.assert = function(cond, msg) {
  if (cond) {
		if (U.assertMessage)
			console.log("O:"+msg);
  } else {
    console.log("X:"+msg);
    if (U.throwError) throw Error('check fail!');
  }
}

U.assertMessage = true;
U.throwError = false;

U.be =function(msg,cond) { return U.check(cond, msg) }

U.proto=function(o) { return Object.getPrototypeOf(o) }

// relation
U.eq=function(a,b)  {
  return (typeof a === typeof b) && a.toString()===b.toString() 
}
U.neq=function(a,b)  { return !U.eq(a,b) }
U.leq=function(a,b)  { return a<=b }
U.geq=function(a,b)  { return a>=b }
U.lt =function(a,b)  { return a<b  }
U.gt =function(a,b)  { return a>b  }
U.near=function(a,b)  {
  return Math.abs(a-b) < 0.0001;
}

// =========== Integer ====================
U.isPrime=function(n) {
	for (var i=2; i<=Math.sqrt(n); i++)
		if (n%i===0) return false;
	return n%1===0;
}

U.gcd = function(a, b) {
  if (!b) return a;
  return U.gcd(b, a % b);
}

U.lcm = function(a, b) {
  return (a * b) / U.gcd(a, b);   
}

// ========= type checking =================
U.yes=function(a) { return true }
U.no=function(a) {return false }
U.isBool=function(a) { 
  return typeof a === 'boolean' || a instanceof Boolean 
}
U.isFunction=function(a) { 
  return typeof a==='function' || a instanceof Function 
}
U.isString=function(a) { 
  return typeof a==='string' || a instanceof String 
}
U.isObject=function(a) { 
  return typeof a==='object' || a instanceof Object 
}
U.isArray=function(a) { 
  return a instanceof Array 
}
U.isUndefined=function(a) { 
  return typeof a === 'undefined' 
}
U.isSet=function(a) { 
  return a instanceof Set 
}
U.isFloat=U.isNumber=function(a) { 
  return typeof a === 'number' || a instanceof Number 
}
U.isInteger=function(a) { return U.isFloat(a) && a%1===0 }
U.isZero=function(a) { return a===0 }
U.isPositive=function(a) { return a>0 }
U.isNegative=function(a) { return a<0 }
U.isEven=function(a) { return (U.isInteger(a) && a%2===0) }
U.isOdd=function(a) { return (U.isInteger(a) && a%2===1) }

// ========== Random ==============
U.random=function(a=0,b=1) {
  return a+Math.random()*(b-a);
}

U.randomInt=function(a,b) {
  return Math.floor(U.random(a,b));
}

U.sample=function(a) {
  return a[U.randomInt(0,a.length)]; 
}

U.steps=function(a,b,step) {
  var array=[];
  for (var i=a; i<=b; i+=step) 
    array.push(i);
  return array;
}

U.toArray=function(arg) { return Array.prototype.slice.call(arg) }
// Global
U.debug = debug = function() {
	var arg = U.toArray(arguments);
	console.debug.apply(console, arg);
}

U.print = print = function() {
	var arg = U.toArray(arguments);
	console.log.apply(console, arg);
}

U.json=function(o) { return JSON.stringify(this) }

U.mixThisMap(String.prototype, U, {str:'sstr',print:'print',json:'json'});
U.mixThisMap(Number.prototype, U, {str:'nstr',print:'print',json:'json'});
U.mixThisMap(Array.prototype,  U, {str:'vstr',print:'print',json:'json'});
U.mixThisMap(Object.prototype, U, {str:'ostr',print:'print',json:'json'});
Array.prototype.toString = function() { return U.vstr(this) };
Number.prototype.toString = function() { return U.nstr(this) };



