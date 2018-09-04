const test = require('tape')
const isCallable = require('is-callable')

const { call } = require('../effects')
const co = require('../index')

test('co', (t) => {
  const argumentsMock = {}

  t.test('without effects from juru', async (assert) => {
    const generatorMock = function * () {
      yield 'something'
      return 42
    }

    const result = await co(generatorMock, argumentsMock)
    assert.equal(result, 42)

    assert.end()
  })

  t.test('with effects from juru', async (assert) => {
    const method = (x) => x
    const objMock = { method }

    const generatorMock = function * () {
      const mocked = yield call(objMock, 'method', 3)
      return mocked
    }

    const result = await co(generatorMock, argumentsMock)
    assert.equal(result, 3)

    assert.end()
  })

  t.test('with a non callable object', async (assert) => {
    let result

    const objectAsArgument = {}
    result = await co(objectAsArgument, argumentsMock)
    assert.equal(result, objectAsArgument)

    const stringAsArgument = 'hello'
    result = await co(stringAsArgument, argumentsMock)
    assert.equal(result, stringAsArgument)

    const arrayAsArgument = 'hello'
    result = await co(arrayAsArgument, argumentsMock)
    assert.equal(result, arrayAsArgument)

    const promiseResultMock = 42
    const promiseAsArgument = Promise.resolve(promiseResultMock)
    result = await co(promiseAsArgument, argumentsMock)
    assert.equal(result, promiseResultMock)

    assert.end()
  })

  t.test('with a callable object', async (assert) => {
    const callableObject = (x) => x
    const result = await co(callableObject, 42)
    assert.equal(result, 42)

    assert.end()
  })

  t.test('more than one argument', async (assert) => {
    const generatorMock = function * (a, b, c) {
      yield 'something'
      return a + b + c
    }

    const result = await co(generatorMock, 1, 2, 3)
    assert.equal(result, 6)

    assert.end()
  })

  t.test('autocurry', async (assert) => {
    const generatorMock = function * (a, b, c) {
      return a + b + c
    }

    const curried = co(generatorMock)
    assert.ok(isCallable(curried))

    const result = await curried(1, 2, 3)
    assert.equal(result, 6)

    assert.end()
  })
})
