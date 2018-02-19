'use strict'

function createProxyAccessDialogStore (i18n, runtime) {
  return function proxyAccessDialogStore (state, emitter) {
    state.origin = null
    state.permission = null
    state.loading = true
    state.wildcard = false

    const port = runtime.connect({ name: 'proxy-access-dialog' })

    const onMessage = (data) => {
      if (!data || !data.origin || !data.permission) return
      port.onMessage.removeListener(onMessage)

      state.origin = data.origin
      state.permission = data.permission
      state.loading = false

      emitter.emit('render')
    }

    port.onMessage.addListener(onMessage)

    emitter.on('allow', () => port.postMessage({ allow: true, wildcard: state.wildcard }))
    emitter.on('deny', () => port.postMessage({ allow: false, wildcard: state.wildcard }))

    emitter.on('wildcardToggle', () => {
      state.wildcard = !state.wildcard
      emitter.emit('render')
    })
  }
}

module.exports = createProxyAccessDialogStore