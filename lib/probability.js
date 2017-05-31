// The code derived from jStat project.
var J = require('jStat').jStat;
var R = module.exports = require('./matrix');
var S = R;
var ncall = S.ncall;

// ========== 離散分佈的 r, q 函數 ============
S.qcdf=function(cdf, q, N, p) {
  for (var i=0; i<=N; i++) {
    if (cdf(i, N, p) > q) return i;
  }
  return N;
}

S.rcdf=function(cdf, n, N, p) {
  var a = [];
  for (var i=0; i<n; i++) {
    var q = Math.random();
    a.push(cdf(q, N, p));
  }
  return a;
}

S.EPSILON=0.0000000001;
// 均等分布 : Uniform Distribution(a,b)    1/(b-a)
S.dunif = function(x,a=0,b=1) { return (x>=a&&x<=b)?1/(b-a):0	}
S.punif = function(x,a=0,b=1) {	return (x>=b)?1:(x<=a)?0:(x-a)/(b-a) }
S.qunif = function(p,a=0,b=1) {	return (p>=1)?b:(p<=0)?a:a+p*(b-a) }
S.runif1 = function(a=0,b=1) { return S.random(a,b) }
S.runif = function(n,a=0,b=1) {	return ncall(n,S,'random',a,b) }
/*
S.dunif=(x,a=0,b=1)=>J.uniform.pdf(x,a,b);
S.punif=(q,a=0,b=1)=>J.uniform.cdf(q,a,b);
S.qunif=(p,a=0,b=1)=>J.uniform.inv(p,a,b);
S.runif=(n,a=0,b=1)=>ncall(n, J.uniform, 'sample', a, b);
*/
// 常態分布 : jStat.normal( mean, sd )
S.dnorm=(x,mean=0,sd=1)=>J.normal.pdf(x,mean,sd);
S.pnorm=(q,mean=0,sd=1)=>J.normal.cdf(q,mean,sd);
S.qnorm=(p,mean=0,sd=1)=>J.normal.inv(p,mean,sd);
S.rnorm1 = function() { // generate random guassian distribution number. (mean : 0, standard deviation : 1)
    var v1, v2, s;

    do {
        v1 = 2 * Math.random() - 1;   // -1.0 ~ 1.0 ??? ?
        v2 = 2 * Math.random() - 1;   // -1.0 ~ 1.0 ??? ?
        s = v1 * v1 + v2 * v2;
    } while (s >= 1 || s == 0);

    s = Math.sqrt( (-2 * Math.log(s)) / s );
    return v1 * s;
}

S.rnorm=(n,mean=0,sd=1)=>ncall(n, J.normal, 'sample', mean, sd);
// F 分布 : jStat.centralF( df1, df2 )
S.df=(x,df1,df2)=>J.centralF.pdf(x,df1,df2);
S.pf=(q,df1,df2)=>J.centralF.cdf(q,df1,df2);
S.qf=(p,df1,df2)=>J.centralF.inv(p,df1,df2);
S.rf=(n,df1,df2)=>ncall(n, J.centralF, 'sample', df1, df2);
// T 分布 : jStat.studentt( dof )
S.dt=(x,dof)=>J.studentt.pdf(x,dof);
S.pt=(q,dof)=>J.studentt.cdf(q,dof);
S.qt=(p,dof)=>J.studentt.inv(p,dof);
S.rt=(n,dof)=>ncall(n, J.studentt, 'sample', dof);
// Beta 分布 : jStat.beta( alpha, beta )
S.dbeta=(x,alpha,beta)=>J.beta.pdf(x,alpha,beta);
S.pbeta=(q,alpha,beta)=>J.beta.cdf(q,alpha,beta);
S.qbeta=(p,alpha,beta)=>J.beta.inv(p,alpha,beta);
S.rbeta=(n,alpha,beta)=>ncalls(n, J.beta, 'sample', alpha, beta);
// 柯西分布 : jStat.cauchy( local, scale )
S.dcauchy=(x,local,scale)=>J.cauchy.pdf(x,local,scale);
S.pcauchy=(q,local,scale)=>J.cauchy.cdf(q,local,scale);
S.qcauchy=(p,local,scale)=>J.cauchy.inv(q,local,scale);
S.rcauchy=(n,local,scale)=>ncall(n, J.cauchy, 'sample', local, scale);
// chisquare 分布 : jStat.chisquare( dof )
S.dchisq=(x,dof)=>J.chisquare.pdf(x,dof);
S.pchisq=(q,dof)=>J.chisquare.cdf(q,dof);
S.qchisq=(p,dof)=>J.chisquare.inv(p,dof);
S.rchisq=(n,dof)=>ncall(n, J.chisquare, 'sample', dof);
// 指數分布 : Exponential Distribution(b)  1/b e^{-x/b}
S.dexp = function(x,rate) { return rate * Math.exp(-rate*x) }
S.pexp = function(x,rate) { return x < 0 ? 0 : 1 - Math.exp(-rate*x) }
S.qexp = function(p,rate) { return -Math.log(1-p)/rate }
S.rexp1 = function(rate) { return S.qexp(S.random(0,1), rate) }
S.rexp = function(n,rate) { return ncall(n, S, 'rexp1', rate) }
/*
S.dexp=(x,rate)=>J.exponential.pdf(x,rate);
S.pexp=(q,rate)=>J.exponential.cdf(q,rate);
S.qexp=(p,rate)=>J.exponential.inv(p,rate);
S.rexp=(n,rate)=>ncall(n, J.exponential, 'sample', rate);
*/
// Gamma 分布 : jStat.gamma( shape, scale )
S.dgamma=(x,shape,scale)=>J.gamma.pdf(x,shape,scale);
S.pgamma=(q,shape,scale)=>J.gamma.cdf(q,shape,scale);
S.qgamma=(p,shape,scale)=>J.gamma.inv(p,shape,scale);
S.rgamma=(n,shape,scale)=>ncall(n, J.gamma, 'sample', shape, scale);
// 反 Gamma 分布 : jStat.invgamma( shape, scale )
S.rinvgamma=(n,shape,scale)=>ncall(n, J.invgamma, 'sample', shape, scale);
S.dinvgamma=(x,shape,scale)=>J.invgamma.pdf(x,shape,scale);
S.pinvgamma=(q,shape,scale)=>J.invgamma.cdf(q,shape,scale);
S.qinvgamma=(p,shape,scale)=>J.invgamma.inv(p,shape,scale);
// 對數常態分布 : jStat.lognormal( mu, sigma )
S.dlognormal=(n, mu, sigma)=>J.lognormal.pdf(x,sigma);
S.plognormal=(n, mu, sigma)=>J.lognormal.cdf(q,sigma);
S.qlognormal=(n, mu, sigma)=>J.lognormal.inv(p,sigma);
S.rlognormal=(n, mu, sigma)=>ncall(n, J.dlognormal, 'sample', mu, sigma);
// Pareto 分布 : jStat.pareto( scale, shape )
S.dpareto=(n, scale, shape)=>J.pareto.pdf(x,scale,shape);
S.ppareto=(n, scale, shape)=>J.pareto.cdf(q,scale,shape);
S.qpareto=(n, scale, shape)=>J.pareto.inv(p,scale,shape);
S.rpareto=(n, scale, shape)=>ncall(n, J.pareto, 'sample', scale, shape);
// Weibull 分布 jStat.weibull(scale, shape)
S.dweibull=(n, scale, shape)=>J.weibull.pdf(x,scale,shape);
S.pweibull=(n, scale, shape)=>J.weibull.cdf(q,scale,shape);
S.qweibull=(n, scale, shape)=>J.weibull.inv(p,scale,shape);
S.rweibull=(n, scale, shape)=>ncall(n, J.weibull, 'sample', scale, shape);
// 三角分布 : jStat.triangular(a, b, c)
S.dtriangular=(n, a, b, c)=>J.triangular.pdf(x,a,b,c);
S.ptriangular=(n, a, b, c)=>J.triangular.cdf(q,a,b,c);
S.qtriangular=(n, a, b, c)=>J.triangular.inv(p,a,b,c);
S.rtriangular=(n, a, b, c)=>ncall(n, J.triangular, 'sample', a, b, c);
// 類似 Beta 分布，但計算更簡單 : jStat.kumaraswamy(alpha, beta)
S.dkumaraswamy=(n, alpha, beta)=>J.kumaraswamy.pdf(x,alpha,beta);
S.pkumaraswamy=(n, alpha, beta)=>J.kumaraswamy.cdf(q,alpha,beta);
S.qkumaraswamy=(n, alpha, beta)=>J.kumaraswamy.inv(p,alpha,beta);
S.rkumaraswamy=(n, alpha, beta)=>ncalls(n, J.kumaraswamy, 'sample', alpha, beta);

// ========== 離散分佈的 r, q 函數 ============
// 二項分布 : jStat.binomial(n, p0)
S.dbinom=(x, size, prob)=>J.binomial.pdf(x, size, prob);
S.pbinom=(q, size, prob)=>J.binomial.cdf(q, size, prob);
S.qbinom=(p, size, prob)=>S.qcdf(S.pbinom, p, size, prob);
S.rbinom=(n, size, prob)=>S.rcdf(S.qbinom, n, size, prob);
// 負二項分布 : jStat.negbin(r, p)
S.dnbinom=(x, size, prob)=>J.negbin.pdf(x, size, prob);
S.pnbinom=(q, size, prob)=>J.negbin.cdf(q, size, prob);
S.qnbinom=(p, size, prob)=>S.qcdf(S.pnbinom, p, size, prob);
S.rnbinom=(n, size, prob)=>S.rcdf(S.qnbinom, n, size, prob);
// 超幾何分布 : jStat.hypgeom(N, m, n)
S.dhyper=(x, m, n, k)=>J.hypgeom.pdf(k, m, n, k);
S.phyper=(q, m, n, k)=>J.hypgeom.cdf(q, m, n, k);
S.qhyper=(p, m, n, k)=>S.qcdf(S.phyper, p, m, n, k);
S.rhyper=(nn,m, n, k)=>S.rcdf(S.qhyper, nn, m, n, k);
// 布瓦松分布 : jStat.poisson(l)
S.dpois=(x, lambda)=>J.poisson.pdf(x, lambda);
S.ppois=(q, lambda)=>J.poisson.cdf(q, lambda);
S.qpois=(p, lambda)=>S.qcdf(S.ppois, p, lambda);
S.rpois=(n, lambda)=>S.rcdf(S.qpois, n, lambda);

R.copyFunctions(S, J, "sumsqrt,sumsqerr,sumrow,mean,meansqerr,geomean,median,cumsum,cumprod,diff,mode,range,variance,stdev,meandev,meddev,skewness,kurtosis,coeffvar,quartiles,quantiles,percentile,percentileOfScore,histogram,covariance,corrcoeff,calcRdx,betafn,betacf,ibetainv,ibeta,gammafn,gammaln,gammap,lowRegGamma,gammapinv,factorialln,factorial,combination,combinationln,permutation,randn,randg".split(","));

R.mapFunctions(S, J, {
	C:'combination',// C(n,m)
	choose:'combination',// C(n,m)
	lchoose:'combinationln',// log C(n,m)
	P:'permutation', // P(n,m)
	sd:'stdev',
	cov:'covariance',
	cor:'corrcoeff',
});

/*
B.copyFunctions(S, J, "sumsqrt,sumsqerr,sumrow,mean,meansqerr,geomean,median,cumsum,cumprod,diff,mode,range,variance,stdev,meandev,meddev,skewness,kurtosis,coeffvar,quartiles,quantiles,percentile,percentileOfScore,histogram,covariance,corrcoeff,calcRdx,betafn,betacf,ibetainv,ibeta,gammafn,gammaln,gammap,lowRegGamma,gammapinv,factorialln,factorial,combination,combinationln,permutation,erf,erfc,erfcinv,randn,randg".split(","));
*/

/*
var extend = P.extend;

// 均等分布 : Uniform Distribution(a,b)    1/(b-a)
P.dunif = function(x,a=0,b=1) { return (x>=a&&x<=b)?1/(b-a):0	}
P.punif = function(x,a=0,b=1) {	return (x>=b)?1:(x<=a)?0:(x-a)/(b-a) }
P.qunif = function(p,a=0,b=1) {	return (p>=1)?b:(p<=0)?a:a+p*(b-a) }
P.runif1 = function(a=0,b=1) { return P.random(a,b) }
P.runif = function(n,a=0,b=1) {	return P.repeat(n,()=>P.runif1(a,b)) }
// 指數分布 : Exponential Distribution(b)  1/b e^{-x/b}
P.dexp = function(x,rate) { return rate * P.exp(-rate*x) }
P.pexp = function(x,rate) { return x < 0 ? 0 : 1 - P.exp(-rate*x) }
P.qexp = function(p,rate) { return -P.log(1-p)/rate }
P.rexp1 = function(rate) { 
  console.log("rate=", rate);
  return P.qexp(P.random(0,1), rate) 
}
P.rexp = function(n,rate) { 
  var a=[];
  for (var i=0; i<n; i++) {
		a.push(P.rexp1(rate));
	}
  return a;
//  return P.repeat(n, ()=>P.rexp1(rate)) 
}
*/
/*
// 常態分布 : 1/((2 pi).sqrt() sd) e^{- 1/2 [(x-mu)/sd]^2}
P.dnorm = function(x,mean=0,sd=1) {
  var sd2 = 2*sd*sd, d=x-mean;
  return 1/(sd2*P.PI).sqrt()*P.exp(-d*d/sd2)
}

P.pnorm = function(x,mean=0,sd=1) {
//  return 0.5 * (1 + P.erf((x - mean) / P.sqrt(2 * sd * sd)));	
}

P.qnorm = function(p,mean=0,sd=1) {
//  return -1.41421356237309505 * sd * P.erfcinv(2 * p) + mean;
}

// 標準常態分布
P.rnorm01 = function() {
  var u, v, x, y, q;
  do {
    u = Math.random();
    v = 1.7156 * (Math.random() - 0.5);
    x = u - 0.449871;
    y = Math.abs(v) + 0.386595;
    q = x * x + y * (0.19600 * y - 0.25472 * x);
  } while (q > 0.27597 && (q > 0.27846 || v * v > -4 * Math.log(u) * u * u));
  return v / u;
}

P.rnorm = function(n,mean=0,sd=1) {
  return P.rnorm01() * sd + mean;
}
// F 分布 : jStat.centralF( df1, df2 )
P.df=function(x,df1,df2) {}
P.pf=function(q,df1,df2) {}
P.qf=function(p,df1,df2) {}
P.rf=function(n,df1,df2) {}
// T 分布 : jStat.studentt( dof )
P.dt=function(x,dof) {}
P.pt=function(q,dof) {}
P.qt=function(p,dof) {}
P.rt=function(n,dof) {}
*/

/*
// 標準常態分布
P.rnorm01 = function() {
  var u, v, x, y, q;
  do {
    u = Math.random();
    v = 1.7156 * (Math.random() - 0.5);
    x = u - 0.449871;
    y = Math.abs(v) + 0.386595;
    q = x * x + y * (0.19600 * y - 0.25472 * x);
  } while (q > 0.27597 && (q > 0.27846 || v * v > -4 * Math.log(u) * u * u));
  return v / u;
}
// Returns the error function erf(x)
P.erf = function(x) {
  var cof = [-1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2,
             -9.561514786808631e-3, -9.46595344482036e-4, 3.66839497852761e-4,
             4.2523324806907e-5, -2.0278578112534e-5, -1.624290004647e-6,
             1.303655835580e-6, 1.5626441722e-8, -8.5238095915e-8,
             6.529054439e-9, 5.059343495e-9, -9.91364156e-10,
             -2.27365122e-10, 9.6467911e-11, 2.394038e-12,
             -6.886027e-12, 8.94487e-13, 3.13092e-13,
             -1.12708e-13, 3.81e-16, 7.106e-15,
             -1.523e-15, -9.4e-17, 1.21e-16,
             -2.8e-17];
  var j = cof.length - 1;
  var isneg = false;
  var d = 0;
  var dd = 0;
  var t, ty, tmp, res;

  if (x < 0) {
    x = -x;
    isneg = true;
  }

  t = 2 / (2 + x);
  ty = 4 * t - 2;

  for(; j > 0; j--) {
    tmp = d;
    d = ty * d - dd + cof[j];
    dd = tmp;
  }

  res = t * Math.exp(-x * x + 0.5 * (cof[0] + ty * d) - dd);
  return isneg ? res - 1 : 1 - res;
}

P.erfc = function(x) {
  return 1 - P.erf(x);
}

// Returns the inverse of the complementary error function
P.erfcinv = function(p) {
  var j = 0;
  var x, err, t, pp;
  if (p >= 2)
    return -100;
  if (p <= 0)
    return 100;
  pp = (p < 1) ? p : 2 - p;
  t = Math.sqrt(-2 * Math.log(pp / 2));
  x = -0.70711 * ((2.30753 + t * 0.27061) /
                  (1 + t * (0.99229 + t * 0.04481)) - t);
  for (; j < 2; j++) {
    err = P.erfc(x) - pp;
    x += err / (1.12837916709551257 * Math.exp(-x * x) - x * err);
  }
  return (p < 1) ? x : -x;
}
*/

/*
S.pnorm=(q,mean=0,sd=1)=>J.normal.cdf(q,mean,sd);
S.qnorm=(p,mean=0,sd=1)=>J.normal.inv(p,mean,sd);
S.rnorm=(n,mean=0,sd=1)=>ncall(n, J.normal, 'sample', mean, sd);
// F 分布 : jStat.centralF( df1, df2 )
S.df=(x,df1,df2)=>J.centralF.pdf(x,df1,df2);
S.pf=(q,df1,df2)=>J.centralF.cdf(q,df1,df2);
S.qf=(p,df1,df2)=>J.centralF.inv(p,df1,df2);
S.rf=(n,df1,df2)=>ncall(n, J.centralF, 'sample', df1, df2);
// T 分布 : jStat.studentt( dof )
S.dt=(x,dof)=>J.studentt.pdf(x,dof);
S.pt=(q,dof)=>J.studentt.cdf(q,dof);
S.qt=(p,dof)=>J.studentt.inv(p,dof);
S.rt=(n,dof)=>ncall(n, J.studentt, 'sample', dof);
// Beta 分布 : jStat.beta( alpha, beta )
S.dbeta=(x,alpha,beta)=>J.beta.pdf(x,alpha,beta);
S.pbeta=(q,alpha,beta)=>J.beta.cdf(q,alpha,beta);
S.qbeta=(p,alpha,beta)=>J.beta.inv(p,alpha,beta);
S.rbeta=(n,alpha,beta)=>ncalls(n, J.beta, 'sample', alpha, beta);
// 柯西分布 : jStat.cauchy( local, scale )
S.dcauchy=(x,local,scale)=>J.cauchy.pdf(x,local,scale);
S.pcauchy=(q,local,scale)=>J.cauchy.cdf(q,local,scale);
S.qcauchy=(p,local,scale)=>J.cauchy.inv(q,local,scale);
S.rcauchy=(n,local,scale)=>ncall(n, J.cauchy, 'sample', local, scale);
// chisquare 分布 : jStat.chisquare( dof )
S.dchisq=(x,dof)=>J.chisquare.pdf(x,dof);
S.pchisq=(q,dof)=>J.chisquare.cdf(q,dof);
S.qchisq=(p,dof)=>J.chisquare.inv(p,dof);
S.rchisq=(n,dof)=>ncall(n, J.chisquare, 'sample', dof);
// 指數分布 : jStat.exponential( rate )
S.dexp=(x,rate)=>J.exponential.pdf(x,rate);
S.pexp=(q,rate)=>J.exponential.cdf(q,rate);
S.qexp=(p,rate)=>J.exponential.inv(p,rate);
S.rexp=(n,rate)=>ncall(n, J.exponential, 'sample', rate);
// Gamma 分布 : jStat.gamma( shape, scale )
S.dgamma=(x,shape,scale)=>J.gamma.pdf(x,shape,scale);
S.pgamma=(q,shape,scale)=>J.gamma.cdf(q,shape,scale);
S.qgamma=(p,shape,scale)=>J.gamma.inv(p,shape,scale);
S.rgamma=(n,shape,scale)=>ncall(n, J.gamma, 'sample', shape, scale);
// 反 Gamma 分布 : jStat.invgamma( shape, scale )
S.rinvgamma=(n,shape,scale)=>ncall(n, J.invgamma, 'sample', shape, scale);
S.dinvgamma=(x,shape,scale)=>J.invgamma.pdf(x,shape,scale);
S.pinvgamma=(q,shape,scale)=>J.invgamma.cdf(q,shape,scale);
S.qinvgamma=(p,shape,scale)=>J.invgamma.inv(p,shape,scale);
// 對數常態分布 : jStat.lognormal( mu, sigma )
S.dlognormal=(n, mu, sigma)=>J.lognormal.pdf(x,sigma);
S.plognormal=(n, mu, sigma)=>J.lognormal.cdf(q,sigma);
S.qlognormal=(n, mu, sigma)=>J.lognormal.inv(p,sigma);
S.rlognormal=(n, mu, sigma)=>ncall(n, J.dlognormal, 'sample', mu, sigma);
// Pareto 分布 : jStat.pareto( scale, shape )
S.dpareto=(n, scale, shape)=>J.pareto.pdf(x,scale,shape);
S.ppareto=(n, scale, shape)=>J.pareto.cdf(q,scale,shape);
S.qpareto=(n, scale, shape)=>J.pareto.inv(p,scale,shape);
S.rpareto=(n, scale, shape)=>ncall(n, J.pareto, 'sample', scale, shape);
// Weibull 分布 jStat.weibull(scale, shape)
S.dweibull=(n, scale, shape)=>J.weibull.pdf(x,scale,shape);
S.pweibull=(n, scale, shape)=>J.weibull.cdf(q,scale,shape);
S.qweibull=(n, scale, shape)=>J.weibull.inv(p,scale,shape);
S.rweibull=(n, scale, shape)=>ncall(n, J.weibull, 'sample', scale, shape);
// 三角分布 : jStat.triangular(a, b, c)
S.dtriangular=(n, a, b, c)=>J.triangular.pdf(x,a,b,c);
S.ptriangular=(n, a, b, c)=>J.triangular.cdf(q,a,b,c);
S.qtriangular=(n, a, b, c)=>J.triangular.inv(p,a,b,c);
S.rtriangular=(n, a, b, c)=>ncall(n, J.triangular, 'sample', a, b, c);
// 類似 Beta 分布，但計算更簡單 : jStat.kumaraswamy(alpha, beta)
S.dkumaraswamy=(n, alpha, beta)=>J.kumaraswamy.pdf(x,alpha,beta);
S.pkumaraswamy=(n, alpha, beta)=>J.kumaraswamy.cdf(q,alpha,beta);
S.qkumaraswamy=(n, alpha, beta)=>J.kumaraswamy.inv(p,alpha,beta);
S.rkumaraswamy=(n, alpha, beta)=>ncalls(n, J.kumaraswamy, 'sample', alpha, beta);

// ========== 離散分佈的 r, q 函數 ============
// 二項分布 : jStat.binomial(n, p0)
S.dbinom=(x, size, prob)=>J.binomial.pdf(x, size, prob);
S.pbinom=(q, size, prob)=>J.binomial.cdf(q, size, prob);
S.qbinom=(p, size, prob)=>S.qcdf(S.pbinom, p, size, prob);
S.rbinom=(n, size, prob)=>S.rcdf(S.qbinom, n, size, prob);
// 負二項分布 : jStat.negbin(r, p)
S.dnbinom=(x, size, prob)=>J.negbin.pdf(x, size, prob);
S.pnbinom=(q, size, prob)=>J.negbin.cdf(q, size, prob);
S.qnbinom=(p, size, prob)=>S.qcdf(S.pnbinom, p, size, prob);
S.rnbinom=(n, size, prob)=>S.rcdf(S.qnbinom, n, size, prob);
// 超幾何分布 : jStat.hypgeom(N, m, n)
S.dhyper=(x, m, n, k)=>J.hypgeom.pdf(k, m, n, k);
S.phyper=(q, m, n, k)=>J.hypgeom.cdf(q, m, n, k);
S.qhyper=(p, m, n, k)=>S.qcdf(S.phyper, p, m, n, k);
S.rhyper=(nn,m, n, k)=>S.rcdf(S.qhyper, nn, m, n, k);
// 布瓦松分布 : jStat.poisson(l)
*/

/*
P.Distribution = {
  pdf:function(x) { throw Error() },
  cdf:function(x) { throw Error() },
  inv:function(p) { throw Error() },
  random:function(n) { throw Error() },
	create:function() { throw Error() },
}

extend(P.Distribution, P.ProbabilitySpace);

P.Uniform = {
	pdf:function(x) { 
	  var p = this.param, a=p.a, b=p.b;
		return (x>=a&&x<=b)?1/(b-a):0;
	},
	cdf:function(x) {
		return (x>=b)?1
		      :(x<=a)?0
					:(x-a)/(b-a);
	},
	inv:function(p) {
		return (p>=1)?b
		      :(p<=0)?a
					:a+p*(b-a);
	},
	random:function(p) {
		return P.random(a,b);
	},
}

extend(P.Uniform, P.Distribution);

P.Uniform.create=function(a,b) {
	return Object.create(P.Uniform);
}
*/

