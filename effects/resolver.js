const resolver = (effectDescriptor) => {
  if (!effectDescriptor.type) return effectDescriptor

  const { type, payload } = effectDescriptor
  return resolvers[type](payload)
}
exports = module.exports = resolver

const resolvers = {}
resolvers['@@CALL'] = ({ obj, method, args }) => obj[method](...args)
resolvers['@@ALL'] = ({ effects }) => Promise.all(effects.map(resolver))

exports.resolvers = resolvers
