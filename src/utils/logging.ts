const TAG = '[JScada] '
let _debug = false

function warn(msg, ...args) {
  _call('warn', msg, ...args)
}

function error(msg, ...args) {
  _call('error', msg, ...args)
}

function info(msg, ...args) {
  _call('info', msg, ...args)
}

function log(msg, ...args) {
  _call('log', msg, ...args)
}

function debug(msg, ...args) {
  if (_debug) {
    _call('debug', msg, ...args)
  }
}

function debugOn(on: boolean) {
  _debug = on
}

function _call(name, msg, ...args) {

  if (typeof msg === 'string') {
    console[name](TAG + msg, ...args)
  } else {
    console[name](TAG)
    console[name](msg)
  }

}

export { error, warn, info, log, debug, debugOn }