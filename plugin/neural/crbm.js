/**
 * Created by joonkukang on 2014. 1. 13..
 */

// var math = require('./utils').math;
// RBM = require('./RBM');
RBM = R.NN.RBM;

CRBM = module.exports = function (settings) {
    RBM.call(this,settings);
};

CRBM.prototype = new RBM();

CRBM.prototype.propdown = function(h) {
    var self = this;
//    var preSigmoidActivation = math.addMatVec(math.mulMat(h,math.transpose(self.W)),self.vbias);
		preSigmoidActivation = h.mdot(this.W.tr()).addMV(this.vbias);
    return preSigmoidActivation;
};

CRBM.prototype.sampleVgivenH = function(h0_sample) {
    var self = this;
    var a_h = self.propdown(h0_sample);
    var a = R.map1(a_h, function(x) { return 1. / (1-Math.exp(-x)) ; });
    var b = R.map1(a_h, function(x){ return 1./x ;});
    var v1_mean = a.msub(b);
    var U = R.randomM(v1_mean.rows(),v1_mean.cols(),0,1);
    var c = R.map1(a_h, function(x) { return 1 - Math.exp(x);});
    var d = R.map1(U.mmul(c), function(x) {return 1-x;});
    var v1_sample = R.map2(R.map1(d,Math.log),a_h,function(x,y) {
        if(y==0) y += 1e-14; // Javascript Float Precision Problem.. This is a limit of javascript.
        return x/y;
    })
/*		
    var a = math.activateMat(a_h,function(x) { return 1. / (1-Math.exp(-x)) ; });
    var b = math.activateMat(a_h,function(x){ return 1./x ;});
    var v1_mean = math.minusMat(a,b);
    var U = math.randMat(math.shape(v1_mean)[0],math.shape(v1_mean)[1],0,1);
    var c = math.activateMat(a_h,function(x) { return 1 - Math.exp(x);});
    var d = math.activateMat(math.mulMatElementWise(U,c),function(x) {return 1-x;});
    var v1_sample = math.activateTwoMat(math.activateMat(d,Math.log),a_h,function(x,y) {
        if(y==0) y += 1e-14; // Javascript Float Precision Problem.. This is a limit of javascript.
        return x/y;
    })
*/		
    return [v1_mean,v1_sample];
};
CRBM.prototype.getReconstructionCrossEntropy = function() {
    var self = this;
    var reconstructedV = self.reconstruct(self.input);
    var a = R.map2(self.input,reconstructedV,function(x,y){
        return x*Math.log(y);
    });

    var b = R.map2(self.input,reconstructedV,function(x,y){
        return (1-x)*Math.log(1-y);
    });

    var crossEntropy = -a.madd(b).colSum().mean(); 
		// math.meanVec(math.sumMatAxis(math.addMat(a,b),1));
    return crossEntropy;

};

CRBM.prototype.reconstruct = function(v) {
    var self = this;
    var reconstructedV = self.sampleVgivenH(self.sampleHgivenV(v)[0])[0];
    return reconstructedV;
};