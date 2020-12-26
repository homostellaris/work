const doNotDisturb = require('@sindresorhus/do-not-disturb')

async function start () {
  await doNotDisturb.enable()
}

async function stop () {
  await doNotDisturb.disable()
}

module.exports = {
  start,
  stop
}