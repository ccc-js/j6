/* eslint-disable no-undef */
/**
 * Created by joonkukang on 2014. 1. 12..
 */
var M = j6.M
var V = j6.V
var NN = j6.NN

HiddenLayer = module.exports = function (settings) {
  this.input = settings['input']
  var a = 1.0 / settings['nIn']
  settings['W'] = settings['W'] || M.random(settings['nIn'], settings['nOut'], -a, a)
  settings['b'] = settings['b'] || V.new(settings['nOut'])
  settings['activation'] = settings['activation'] || NN.sigmoid
  this.W = settings['W']
  this.b = settings['b']
  this.activation = settings['activation']
}

HiddenLayer.prototype.output = function (input) {
  this.input = input || this.input
  return this.linearOutput(this.input).map1(this.activation)
}

HiddenLayer.prototype.linearOutput = function (input) { // before activation
  this.input = input || this.input
  var linearOutput = M.addv(M.dot(this.input, this.W), this.b)
  return linearOutput
}

HiddenLayer.prototype.backPropagate = function (input) { // example+num * nOut matrix
  if (typeof input === 'undefined') throw new Error('No BackPropagation Input.')
  var linearOutput = input.mdot(this.W.tr())
  return linearOutput
}

HiddenLayer.prototype.sampleHgivenV = function (input) {
  this.input = input || this.input
  var hMean = this.output()
  var hSample = j6.NN.binarySample(hMean) // Gibb's random sampling
  return hSample
}
