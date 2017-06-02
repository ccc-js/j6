/* eslint-disable no-undef */
/* eslint-disable one-var */
var N = require('numeric')
j6.N = N
// Advance mathematics
j6.ode = N.dopri // dopri(x0,x1,y0,f,tol,maxit,event) #Ordinary Diff Eq
j6.minimize = N.uncmin // uncmin(f,x0,tol,gradient,maxit,callback,options) # Unconstrained optimization
j6.solveLP = N.solveLP // dopri(x0,x1,y0,f,tol,maxit,event) #Ordinary Diff Eq
j6.sparse = N.ccsSparse // Matrix => Sparse
j6.sparse2full = N.ccsFull // Sparse => Matrix
j6.spline = N.spline
j6.linspace = N.linspace
// j6.complex=N.t
// matrix
j6.svd = N.svd
// j6.det = N.det
// j6.inv = N.inv
j6.lu = N.cLU
j6.luSolve = N.cLUsolve
// j6.dot = N.dot
// j6.rep = N.rep
// j6.tr = N.transpose
// j6.diag = N.diag
// j6.sumM = N.sum

j6.str = j6.strM = N.prettyPrint
j6.rows = function (m) { return m.length }
j6.cols = function (m) { return m[0].length }
j6.row = function (m, i) { return m[i] }
j6.col = function (m, j) {
  var rows = m.length
  var c = new Array(rows)
  for (var i = 0; i < rows; i++) {
    c[i] = m[i][j]
  }
  return c
}

j6.newM = function (rows, cols, value = 0) {
  return j6.trepeat([rows, cols], value)
}

j6.randomM = function (rows, cols, a, b) {
  return j6.trandom([rows, cols], a, b)
}

j6.rowSum = function (m) {
  var rows = m.length
  var s = new Array(rows)
  for (var i = 0; i < rows; i++) {
    s[i] = j6.sum(m[i])
  }
  return s
}

j6.colSum = function (m) {
  var rows = m.length
  if (rows === 0) return []
  var s = m[0]
  for (var i = 1; i < rows; i++) {
    s = j6.vadd(s, m[i])
  }
  return s
}

j6.rowMean = function (m) {
  return j6.rowSum(m).div(m.cols())
}

j6.colMean = function (m) {
  return j6.colSum(m).div(m.rows())
}

j6.addMV = function (m, v) {
  var rows = m.length
  var r = new Array(rows)
  for (var i = 0; i < rows; i++) {
    r[i] = j6.vadd(m[i], v)  // 這行比較快 (使用多型速度會變慢)
  }
  return r
}

j6.madd = function (m1, m2) {
  var rows = m1.length
  var r = new Array(rows)
  for (var i = 0; i < rows; i++) {
    r[i] = j6.vadd(m1[i], m2[i])
  }
  return r
}

j6.msub = function (m1, m2) {
  var rows = m1.length
  var r = new Array(rows)
  for (var i = 0; i < rows; i++) {
    r[i] = j6.vsub(m1[i], m2[i])
  }
  return r
}

j6.mmul = function (m1, m2) {
  var rows = m1.length
  var r = new Array(rows)
  for (var i = 0; i < rows; i++) {
    r[i] = j6.vmul(m1[i], m2[i])
  }
  return r
}

j6.mdiv = function (m1, m2) {
  var rows = m1.length
  var r = new Array(rows)
  for (var i = 0; i < rows; i++) {
    r[i] = j6.vdiv(m1[i], m2[i])
  }
  return r
}

j6.fillMV = function (v, rows, cols) {
  var m = new Array(rows)
  for (var r = 0; r < rows; r++) {
    var mr = m[r] = new Array(cols)
    for (var c = 0; c < cols; c++) {
      mr[c] = v[(r * cols) + c]
    }
  }
  return m
}

j6.eig = function (m) {
  console.log('eig:m=%j', m)
  var E = N.eig(m)
  console.log('eig:E=%j', E)
  return {lambda: E.lambda.x, E: E.E.x}
}

j6.tr = function (m) {
  var r = []
  var rows = m.length
  var cols = m[0].length
  for (var j = 0; j < cols; j++) {
    var rj = r[j] = []
    for (var i = 0; i < rows; i++) {
      rj[i] = m[i][j]
    }
  }
  return r
}

j6.mdot = function (a, b, isComplex = false) {
  var arows = a.length
  var bcols = b[0].length
  var r = []
  var bt = j6.tr(b)
  for (var i = 0; i < arows; i++) {
    var ri = r[i] = []
    for (var j = 0; j < bcols; j++) {
      ri.push(j6.vdot(a[i], bt[j], isComplex))
    }
  }
  return r
}

j6.isMatrix = function (m) {
  return (m instanceof Array && m[0] instanceof Array)
}

j6.dot = function (a, b, isComplex = false) {
  return (j6.isMatrix(a)) ? j6.mdot(a, b, isComplex) : j6.vdot(a, b, isComplex)
}

j6.diag = function (v) {
  var rows = v.length
  var r = j6.newM(rows, rows)
  for (var i = 0; i < rows; i++) {
    r[i][i] = v[i]
  }
  return r
}

j6.identity = function (n) {
  return j6.diag(j6.trepeat([n], () => 1))
}

j6.inv = function (m0) {
  var s = j6.tdim(m0), abs = Math.abs, m = s[0], n = s[1]
  var A = j6.clone(m0), Ai, Aj
  var I = j6.identity(m), Ii, Ij
  var i, j, k, x
  for (j = 0; j < n; ++j) {
    var i0 = -1
    var v0 = -1
    for (i = j; i !== m; ++i) {
      k = abs(A[i][j])
      if (k > v0) { i0 = i; v0 = k }
    }
    Aj = A[i0]; A[i0] = A[j]; A[j] = Aj
    Ij = I[i0]; I[i0] = I[j]; I[j] = Ij
    x = Aj[j]
    for (k = j; k !== n; ++k) Aj[k] /= x
    for (k = n - 1; k !== -1; --k) Ij[k] /= x
    for (i = m - 1; i !== -1; --i) {
      if (i !== j) {
        Ai = A[i]
        Ii = I[i]
        x = Ai[j]
        for (k = j + 1; k !== n; ++k) Ai[k] -= Aj[k] * x
        for (k = n - 1; k > 0; --k) { Ii[k] -= Ij[k] * x; --k; Ii[k] -= Ij[k] * x }
        if (k === 0) Ii[0] -= Ij[0] * x
      }
    }
  }
  return I
}

j6.det = function (x) {
  var s = j6.dim(x)
  if (s.length !== 2 || s[0] !== s[1]) { throw new Error('numeric: det() only works on square matrices') }
  var n = s[0], ret = 1, i, j, k, A = j6.clone(x), Aj, Ai, alpha, temp, k1
  for (j = 0; j < n - 1; j++) {
    k = j
    for (i = j + 1; i < n; i++) { if (Math.abs(A[i][j]) > Math.abs(A[k][j])) { k = i } }
    if (k !== j) {
      temp = A[k]; A[k] = A[j]; A[j] = temp
      ret *= -1
    }
    Aj = A[j]
    for (i = j + 1; i < n; i++) {
      Ai = A[i]
      alpha = Ai[j] / Aj[j]
      for (k = j + 1; k < n - 1; k += 2) {
        k1 = k + 1
        Ai[k] -= Aj[k] * alpha
        Ai[k1] -= Aj[k1] * alpha
      }
      if (k !== n) { Ai[k] -= Aj[k] * alpha }
    }
    if (Aj[j] === 0) { return 0 }
    ret *= Aj[j]
  }
  return ret * A[j][j]
}

j6.mixThisMap(Array.prototype, j6, {
  lu: 'lu',
  luSolve: 'luSolve',
  svd: 'svd',
  // 'cdelsq',
  // 'clone',
  rows: 'rows',
  cols: 'cols',
  row: 'row',
  col: 'col',
  tr: 'tr',
  inv: 'inv',
  // 'all',
  // 'any',
  // 'same',
  // 'isFinite',
  // 'isNaN',
  // 'mapreduce',
  // 'complex',
  det: 'det',
  // 'norm2',
  // 'norm2Squared',
  // 'norm2inf',
  madd: 'add',
  msub: 'sub',
  mmul: 'mul',
  mdiv: 'div',
  mdot: 'dot',
  // 'dim',
  eig: 'eig',
  // 'sum',
  rowSum: 'rowSum',
  colSum: 'colSum',
  rowMean: 'rowMean',
  colMean: 'colMean',
  // mapM: 'mmap1',
  // mapMM: 'mmap2',
  flat: 'flat',
  fillVM: 'fillVM',
  addMV: 'addMV',
  // fillMM: 'fillMM',
  getBlock: 'getBlock',
  setBlock: 'setBlock',
  getDiag: 'getDiag',
  diag: 'diag',
  // 'parseFloat',
  // 'parseDate',
  // 'parseCSV',
  // 'toCSV',
  strM: 'strM',
  mstr: 'mstr',
  // 'sumM',
  isMatrix: 'isMatrix'
})

j6.mixThisMap(Array.prototype, j6, {
  dot: 'dot'
})

// console.log('msub=', [[1,2],[3,4]].msub);
