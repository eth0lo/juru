const call = (obj, method, ...args) => ({
  type: '@@CALL',
  payload: {
    obj,
    method,
    args
  }
})
exports.call = call

const all = (...effects) => ({
  type: '@@ALL',
  payload: {
    effects
  }
})
exports.all = all
