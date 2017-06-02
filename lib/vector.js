/* eslint-disable no-undef */

j6.vfill = function (n, value = 0) { return j6.trepeat([n], value) }

j6.vrandom = function (n, a, b) { return j6.trandom([n], a, b) }

j6.vresize = function (a, size) {
  var v = a.slice()
  for (var i = a.length; i < size; i++) {
    v.push(0)
  }
  return v
}

j6.vdot = function (x, y, isComplex = false) {
  let cadd = j6.ComplexField.add
  let cmul = j6.ComplexField.mul
  let sum = 0
  let len = x.length
  for (var i = 0; i < len; i++) {
    if (!isComplex) {
      sum += x[i] * y[i] // 速度較快
    } else {
      sum = cadd(sum, cmul(x[i], y[i])) // 速度稍慢(不使用多型，否則會很慢)
    }
  }
  return sum
}

j6.vadd = function (a, b) {
  let len = a.length
  let r = new Array(len)
  for (var i = 0; i < len; i++) {
    r[i] = a[i] + b[i]
  }
  return r
}

j6.vsub = function (a, b) {
  let len = a.length
  let r = new Array(len)
  for (var i = 0; i < len; i++) {
    r[i] = a[i] - b[i]
  }
  return r
}

j6.vmul = function (a, b) {
  let len = a.length
  let r = new Array(len)
  for (var i = 0; i < len; i++) {
    r[i] = a[i] * b[i]
  }
  return r
}

j6.vdiv = function (a, b) {
  let len = a.length
  let r = new Array(len)
  for (var i = 0; i < len; i++) {
    r[i] = a[i] / b[i]
  }
  return r
}

