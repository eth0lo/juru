<h1 align="center">
  Juru
</h1>

<p align="center">
  <a href="https://circleci.com/gh/eth0lo/juru">
    <img src="https://img.shields.io/circleci/project/github/eth0lo/juru.svg?style=flat-square" />
  </a>
  <a href="https://codeclimate.com/github/eth0lo/juru/maintainability">
    <img src="https://img.shields.io/codeclimate/maintainability/eth0lo/juru.svg?style=flat-square" />
  </a>
  <a href="https://codeclimate.com/github/eth0lo/juru/test_coverage">
    <img src="https://img.shields.io/codeclimate/coverage/eth0lo/juru.svg?style=flat-square" />
  </a>
  <a href="https://standardjs.com">
    <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square" alt="Standard - JavaScript Style Guide">
  </a>
</p>

Juru can be used to give visibility of side-effects (i.e. asynchronous data fetching, storing data) that happens during the application runtime; making the application easier to test, and better at handling failures.

For instance, if a module performs a HTTP remote identity provider or fetches information from your local DB, you can test that module in isolation.

**Table of Contents**

- [How does it work?](#how-does-it-work)
- [Install](#install)
- [Usage](#usage)
- [Alternatives](#alternatives)

## How does it work?

It works by leveraging the [iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) to expose side-effects descriptors of your application.

## Install

```sh
$ npm install --save juru
```

## Usage

```js
// main module
const co = require('juru')
const { all, call } = require('juru/effects')

const enhancedUser = function * (externalId) {
  const [remoteUser, userPurchases] = yield all(
    call(externalService, 'findUser', externalId),
    call(insternalStorage, 'findUserByExternalId', externalId)
  )

  return userPresenter(remoteUser, userPurchases)
}
exports = module.exports = co(enhancedUser)
exports.generator = enhancedUser

const externalService = {
  findUser: async (id) => ({ id: 'remote-service-id', name: 'Jhon Doe' })
}
exports.externalService = externalService

const insternalStorage = {
  findUserByExternalId: async (id) => ({ id: 'local-id', externalId: 'remote-service-id',  purchases: [] })
}
exports.insternalStorage = insternalStorage

const userPresenter = (user, userPurchases) => ({ ...user, purchases: userPurchases.purchases })
exports.userPresenter = userPresenter
```

```js
// test file
const test = require('tape')
const { all, call } = require('juru/effects')

const { externalService, generator, insternalStorage } = require('./enhanced_user')

test('should request user information both locally and remotely', (assert) => {
  const externalIdMock = 'remote-service-id'
  const enhancedUser = generator(externalIdMock)

  const { value: requestsDescriptor } = enhancedUser.next()

  assert.deepEqual(requestsDescriptor, all(
    call(externalService, 'findUser', externalIdMock)
    call(insternalStorage, 'findUserByExternalId', externalIdMock)
  ))
  
  assert.end()
})

test('should return the user with all his/her purchases', (assert) => {
  const externalIdMock = 'remote-service-id'
  const remoteUserMock = { id: 'remote-service-id', name: 'Jhon Doe' }
  const storageUserMock = { id: 'local-id', externalId: 'remote-service-id',  purchases: [] }

  const enhancedUser = generator(externalIdMock)
  enhancedUser.next()

  const { value: result } = enhancedUser.next([remoteUserMock, storageUserMock])
  assert.equal(result.id, remoteUserMock.id)
  assert.equal(result.purchases, storageUserMock.purchases)

  assert.end()
})
```

## Alternatives

- Proxyquire
- Rewire
- Sinon
