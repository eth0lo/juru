const test = require('tape')
const isCallable = require('is-callable')
const isPromise = require('is-promise')

const resolver = require('../../../effects/resolver')
const effects = require('../../../effects')

test('resolver', (t) => {
  t.test('signature', (assert) => {
    assert.ok(isCallable(resolver))
    assert.end()
  })

  t.test('call', (assert) => {
    const method = (x) => x
    const mockObject = { method }
    const { call } = effects

    const result = resolver(call(mockObject, 'method', 42))
    assert.equal(result, 42)
    assert.end()
  })

  t.test('all', async (assert) => {
    const { all } = effects

    const result = resolver(all(
      Promise.resolve(42),
      24
    ))
    assert.ok(isPromise(result))

    const [ promise, constant ] = await result
    assert.equal(promise, 42)
    assert.equal(constant, 24)

    assert.end()
  })

  t.test('without type', (assert) => {
    let result

    const objMock = {}
    result = resolver(objMock)
    assert.equal(result, objMock)

    const stringMock = 'mock'
    result = resolver(stringMock)
    assert.equal(result, stringMock)

    const numberMock = 42
    result = resolver(numberMock)
    assert.equal(result, numberMock)

    assert.end()
  })

  t.test('unknown type', (assert) => {
    const throwable = () => {
      resolver({ type: 'mock' })
    }

    assert.throws(throwable)
    assert.end()
  })
})
