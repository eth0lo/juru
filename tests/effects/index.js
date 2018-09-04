const test = require('tape')
const isCallable = require('is-callable')
const isPlainObject = require('is-plain-object')

const effects = require('../../effects')

test('effects', (t) => {
  t.test('call', (t) => {
    const { call } = effects

    t.test('signature', (assert) => {
      assert.ok(isCallable(call))
      assert.end()
    })

    t.test('effect descriptor', (assert) => {
      const effectDescriptor = call()

      assert.ok(isPlainObject(effectDescriptor))
      assert.equal(effectDescriptor.type, '@@CALL')
      assert.end()
    })

    t.test('payload', (t) => {
      t.test('without arguments', (assert) => {
        const { payload } = call()

        assert.equals(payload.obj, undefined)
        assert.equals(payload.method, undefined)
        assert.ok(Array.isArray(payload.args))
        assert.end()
      })

      t.test('with arguments', (assert) => {
        const objectMock = { }
        const methodNameMock = 'test'
        const args = [ 1, 2, 3, 4 ]

        const { payload } = call(objectMock, methodNameMock, ...args)

        assert.equals(payload.obj, objectMock)
        assert.equals(payload.method, methodNameMock)

        for (let position = 0; position < args.length; position++) {
          assert.equal(payload.args[position], args[position])
        }

        assert.end()
      })
    })
  })

  t.test('all', (t) => {
    const { all, call } = effects

    t.test('signature', (assert) => {
      assert.ok(isCallable(all))
      assert.end()
    })

    t.test('effect descriptor', (assert) => {
      const effectDescriptor = all()

      assert.ok(isPlainObject(effectDescriptor))
      assert.equal(effectDescriptor.type, '@@ALL')
      assert.end()
    })

    t.test('payload', (t) => {
      t.test('without arguments', (assert) => {
        const { payload } = all()

        assert.ok(Array.isArray(payload.effects))
        assert.end()
      })

      t.test('with arguments', (assert) => {
        const effectMock = call()
        const args = [ 1, effectMock, 3, 4 ]
        const { payload } = all(...args)

        assert.ok(Array.isArray(payload.effects))

        for (let position = 0; position < args.length; position++) {
          assert.equal(payload.effects[position], args[position])
        }

        assert.end()
      })
    })
  })
})
