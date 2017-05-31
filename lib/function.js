var R, A, V, N, F;
module.exports = R = A = V = N = F = require("./matrix");
// var A = R.Algebra, V = R.Vector, N = R.Number; //, p = N.parse;
// var F = R.F = R.Function = {}
var extend = R.extend;

// =========== Calculus =================
F.dx = 0.01;

// 微分 differential calculus
F.d = F.diff = F.differential = function(f, x, dx) {
	dx = dx || F.dx;
  var dy = f(x.add(dx)).sub(f(x.sub(dx)));
  return dy.div(dx.mul(2));
}

// 積分 integral calculus
F.i = F.integral = function(f, a, b, dx) {
	dx = dx || F.dx;
  var area = 0.0;
  for (var x=a; x<b; x=x+dx) {
    area = area + f(x).mul(dx);
  }
  return area;
}

// 偏微分 partial differential calculus
// f=[f1,f2,....] , x=[x1,x2,...] , dx=[dx1,dx2,....]
F.pdiff = F.pdifferential = function(f, x, i) {
	f = F.fa(f);
	var dx = V.fill(x.length, 0);
	dx[i] = F.dx;
//	var df = f.apply(null, x.add(dx)).sub(f.apply(null, x.sub(dx)));
	var df = f(x.add(dx)).sub(f(x.sub(dx)));
	return df.div(dx.norm().mul(2));
}

// multidimensional integral calculus
// f=[f1,f2,....] , a=[a1,a2,...] , b=[b1,b2,....]
F.pintegral = function(f, a, b) {
	
}

// 梯度 gradient : grad(f,x)=[pdiff(f,x,0), .., pdiff(f,x,n)]
F.grad = F.gradient = function(f, x) {
	var gf = [];
	for (var i=0; i<x.length; i++) {
		gf[i] = F.pdiff(f, x, i);
	}
	return gf;
}

// 散度 divergence : div(F,x) = sum(pdiff(F[i],x,i))
F.divergence = function(F, x) {
	var Fx = F(x);
	var f=[], d=[];
	for (var i=0; i<x.length; i++) {
		f[i] = (xt)=>F(xt)[i];
		d[i] = F.pdiff(f[i],x,i);
	}
	return d.sum();
}

// 旋度 curl : curl(F) = div(F)xF 
F.curl = F.curlance = function(F, x) {
	
}

// 線積分： int F●dr = int F(r(t))●r'(t) dt
F.vintegral = function(F, r, a, b, dt) {
	dt = dt||F.dx;
	var sum = 0;
	for (var t=a; t<b; t+=dt) {
		sum += F(r(t)).dot(r.diff(t));
	}
	return sum;
}

// 定理：int F●dr  = int(sum(Qxi dxi))

// 向量保守場： F=grad(f) ==> int F●dr = f(B)-f(A)

// 定理： 向量保守場 F, pdiff(Qxi,xj) == pdiff(Qxj,xi)  for any i, j
// ex: F=[x^2y, x^3] 中， grad(F)=[x^2, 3x^2] 兩者不相等，所以不是保守場

// 格林定理：保守場中 《線積分=微分後的區域積分》
// int P dx + Q dy = int int pdiff(Q,x) - pdiff(P, y) dx dy

// 散度定理：通量 = 散度的區域積分
// 2D : int F●n ds = int int div F dx dy
// 3D : int int F●n dS = int int int div F dV

// 史托克定理：  F 在曲面 S 上的旋度總和 = F 沿著邊界曲線 C 的線積分
// int int_D curl(F)●n dS = int_C F●dr

// =========== Function Operation ==============
F.neg=function(fx) { return function(v) {
  return -1*fx(v);
}}

F.inv=function(fx) { return function(v) {
  return 1/fx(v);
}}

F.add=function(fx,fy) { return function(v) {
  return fx(v).add(fy(v));
}}

F.sub=function(fx,fy) { return function(v) {
  return fx(v).sub(fy(v));
}}

F.mul=function(fx,fy) { return function(v) {
  return fx(v).mul(fy(v));
}}

F.div=function(fx,fy) { return function(v) {
  return fx(v).div(fy(v));
}}

F.compose=function(fx,fy) { return function(v) {
  return fx(fy(v));
}}

F.eval=function(f,x) { return f(x) }

// f=(x,y)=>x*y+x*x;
// f0=fa(f); f0([x,y]);
F.fa=function(f) {
  return function(x) {
    return f.apply(null, x);
  }
}

// =========== Function Field ==============
F.FunctionField=extend({}, A.Field);

F.FunctionAddGroup={
  e:function(x) { return 0 },
  op:function(x,y) { return F.add(x,y) },
  inv:function(x) { return F.neg(x) },
}
  
extend(F.FunctionAddGroup, F.AbelGroup);

F.FunctionMulGroup={
  e:function(x) { return f(x) },
  op:function(x,y) { return F.sub(x,y) },
  inv:function(x) { return F.inv(x) },
}

extend(F.FunctionMulGroup, F.AbelGroup);

F.FunctionField.init(F.FunctionAddGroup, F.FunctionMulGroup);

// =========== Polynomial Ring ==============
A.PolynomialRing=extend({}, A.Field);

class Polynomial extends A.FieldObj {
  constructor(c) {
    super(A.PolynomialRing);
    this.c = c; // sum(ci x^i)
  }
	
	eval(x) {
		var c = this.c, i=c.length-1, sum=c[i];
		for (i--;i>=0; i--) {
			sum = c[i].add(x.mul(sum));
		}
		return sum;
	}
	
	size() { return this.c.length }
	
	toString() {
		var s = [], c=this.c;
		for (var i=c.length-1; i>=0; i--) {
			s.push(c[i]+'x^'+i);
		}
		return s.join('+');
	}
	
	root() {
		var p = this.normalize(); // 正規化
		var c = p.c.toComplex();
		console.log("c=%s", c);
		switch (this.size()) {
		  case 2:return p.c[0].neg();
		  case 3:return p.root2(c[1], c[0]);
			case 4:return p.root3(c[2], c[1], c[0]);
			default:throw Error('root() fail');
		}	
	}

	root2(b,c) { // x^2 + bx + c	=0
		var d = b.mul(b).sub(c.mul(N.parse('4+0i'))).sqrt();
		return [b.neg().add(d), b.neg().sub(d)];
	}
	
	root3(a,b,c) { // x^3+ax^2+bx+c=0
		var q=a.power(3).mul(2/27).sub(a.mul(b).div(3).add(c)).div(2); // q=((2*a*a*a/27)-(a*b/3)+c)/2;
		var p=b.sub(a.power(2).div(3)).div(3); // p=(b-a*a/3)/3;
		var D=p.power(3).add(q.power(2)); // D=p*p*p+q*q;
		var Dsqrt = D.sqrt(), _q=q.neg();
		console.log("Dsqrt=%s _q=%s", Dsqrt, _q);
		var u_p=_q.add(Dsqrt).power(1/3); // u+ = (-q+sqrt(D))^1/3
		var u_m=_q.sub(Dsqrt).power(1/3); // u- = (-q-sqrt(D))^1/3
		console.log("q=%s p=%s D=%s u+=%s u-=%s", q, p, D, u_p, u_m);
		var rho_p = N.parse('-1+3i').div(2); // rho+ = (-1+3i)/2
		var rho_m = N.parse('-1-3i').div(2); // rho- = (-1-3i)/2
		console.log("rho_p=%s rho_m=%s", rho_p, rho_m);
		var y1=u_p.add(u_m); // y1 = (u+) + (u-)
		var y2=rho_p.add(u_p).add(rho_m.mul(u_m)); // y2=(rho+)+(u+)+(rho-)*(u+)
		var y3=rho_p.sub(u_p).add(rho_p.mul(u_m)); // y2=(rho+)+(u+)+(rho+)*(u-)
		return [y1, y2, y3];
/*	
		var q=((2*a*a*a/27)-(a*b/3)+c)/2;
		var p=(b-a*a/3)/3;
		var D=p*p*p+q*q;
		var Dsqrt = D.sqrt(), _q=q.neg();
		console.log("Dsqrt=%s _q=%s", Dsqrt, _q);
		var u_p=_q.add(Dsqrt).power(1/3); // (-q+sqrt(D))^1/3
		var u_m=_q.sub(Dsqrt).power(1/3); // (-q-sqrt(D))^1/3
		console.log("q=%s p=%s D=%s u+=%s u-=%s", q, p, D, u_p, u_m);
		var rho_p = (1/2).mul(N.parse('-1+3i'));
		var rho_m = (1/2).mul(N.parse('-1-3i'));
		console.log("rho_p=%s rho_m=%s", rho_p, rho_m);
		var y1=u_p.add(u_m);
		var y2=rho_p.add(u_p).add(rho_m.mul(u_m));
		var y3=rho_p.sub(u_p).add(rho_p.mul(u_m));
		return [y1, y2, y3];
*/		
	}	
	
	normalize() {
		var a = this.c[this.size()-1];
		var nc = this.c.div(a);
		return new Polynomial(nc);
	}
}

R.Polynomial = A.Polynomial = Polynomial;

A.PolynomialAddGroup={
  e:new Polynomial([0]), // 到底應該設幾個？
  op:function(x,y) {
		var size = Math.max(x.size(), y.size());
		var a=V.extend(x.c,size), b=V.extend(y.c,size);
	  var c=a.add(b);
		return new Polynomial(c);
	},
  inv:function(x) {
		var c = x.c.neg();
		return new Polynomial(c);
	},
}
  
extend(A.PolynomialAddGroup, A.Group);

A.PolynomialMulSemiGroup={
  e:new Polynomial([1]),
  op:function(x,y) { 
	  var c=[];
	  for (var xi=0; xi<x.c.length; xi++) {
			for (var yi=0; yi<y.c.length; yi++) {
				var cxy = (typeof c[xi+yi]==='undefined')?0:c[xi+yi];
				c[xi+yi] = cxy+x.c[xi]*y.c[yi];
			}
		}
		return new Polynomial(c);
	},
  inv:function(x) { throw Error('PolynomialMulSemiGroup.inv not defined') },
}

extend(A.PolynomialMulSemiGroup, A.Group);

A.PolynomialRing.init(A.PolynomialAddGroup, A.PolynomialMulSemiGroup);

