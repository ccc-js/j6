/**
 * Created by joonkukang on 2014. 1. 15..
 */
var R = require('../../j6');
R.precision = 4;
var startTime = new Date();

var data = [
[1,1,1,0,0,0],
[1,0,1,0,0,0],
[1,1,1,0,0,0],
[0,0,1,1,1,0],
[0,0,1,1,0,0],
[0,0,1,1,1,0]];

var rbm = new R.NN.RBM({
    input : data,
    nVisible : 6,
    nHidden : 2
});

rbm.train({
    lr : 0.6,
    k : 1,
    epochs : 500
});

var v = [[1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0]];

print(rbm.reconstruct(v).strM());
print(rbm.sampleHgivenV(v)[0].strM());
var stopTime = new Date();
console.log('millseconds=', stopTime-startTime);
