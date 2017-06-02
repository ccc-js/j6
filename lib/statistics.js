
var ncall = j6.ncall;

// ====================== statistics =================================
j6.random = function (a = 0, b = 1) {
	let r = a + (Math.random() * (b - a))
  return r
}

j6.randomInt = function (a, b) {
	let r = j6.random(a, b + 0.999999999)
	return Math.floor(r)
}

j6.sample = function (space, probs) {
  if (probs == null) return space[j6.randomInt(0, space.length-1)]
  let p = j6.random(0, 1)
  let sump = 0
  for (let i = 0; i < space.length; i++) {
    sump += probs[i]
    if (p <= sump) return space[i]
  }
  throw new Error('j6.sample fail!')
}

j6.samples = function(space, size, arg) {
	var arg = _.defaults(arg, {replace:true});
	if (arg.replace) {
		var results = []
		for (let i=0; i < size; i++)
			results.push(j6.sample(space, arg.prob))
		return results
//		return _.times(size, ()=>_.sample(space));
  } else {
		if (space.length < size) throw Error('statistics.samples() : size > space.length')
		return _.sampleSize(space, size);
	}
}

j6.normalize=function(a) {
	var sum = j6.sum(a);
	return a.map(function(x) { return x/sum});
}

j6.max = j6.tmax
j6.min = j6.tmin
j6.sum = j6.tsum
j6.product = j6.tproduct

j6.mean = function (a) {
  return a.sum().div(a.length)
}

j6.norm = function (a) {
  return a.map1((x) => x * x).sum().sqrt()
}

