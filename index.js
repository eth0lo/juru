const isGeneratorFn = require('is-generator-fn')
const isCallable = require('is-callable')
const curry = require('curry-n')

const effectsResolver = require('./effects/resolver')

const coroutine = (func, ...args) => {
  if (isGeneratorFn(func)) {
    console.log('test')
    return evaluateGenerator(func.apply(this, args))
  } else if (isCallable(func)) {
    return func.apply(this, args)
  } else {
    return func
  }
}
exports = module.exports = curry(2, coroutine)
exports.coroutine = coroutine

const evaluateGenerator = async (gen) => {
  let genRightSideDescriptor, genRightSideValue, next

  next = gen.next()
  genRightSideDescriptor = next.value

  while (!next.done) {
    genRightSideValue = await effectsResolver(genRightSideDescriptor)
    next = gen.next(genRightSideValue)
    genRightSideDescriptor = next.value
  }

  return next.value
}
exports.evaluateGenerator = evaluateGenerator
