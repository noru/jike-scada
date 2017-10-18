<template>
</template>

<script>

import JScada from '../../../../dist/jscada.js'
import { createFakeServer, SinonFakeServer } from 'sinon'
import _ from 'lodash'

const mqttSource = {
  id: 'mqtt-source',
  type: 'mqtt',
  url: 'ws://localhost:3000',
  tags: [
    {
      id: 'path18456',
      type: 'color',
      projector: data => {
        let num = +data.payload.a
        return num > 5 ? 'red' : 'green'
      },
    },
    {
      id: 'tspan3024',
      type: 'text',
      path: 'payload.a',
    },
    {
      id: 'tspan3030',
      selector: '',
      type: 'text',
      path: 'payload.b',
    },
    {
      id: 'rect114817',
      type: 'color',
      projector: data => {
        let num = +data.payload.b
        return num > 15 ? 'red' : 'green'
      },
    },
    {
      id: 'path18450',
      type: 'color',
      projector: data => {
        let num = +data.payload.c
        return num > 15 ? 'red' : 'green'
      },
    },
    {
      id: 'tspan4162',
      type: 'text',
      path: 'payload.c',
    },
    {
      id: 'tspan4570',
      type: 'text',
      path: 'payload.d',
    },
    {
      id: 'path18452',
      type: 'color',
      projector: data => {
        let num = +data.payload.e
        return num > 15 ? 'red' : 'green'
      },
    },
    {
      id: 'tspan4166',
      type: 'text',
      path: 'payload.e',
    },
    {
      id: 'tspan3042',
      selector: '',
      type: 'text',
      path: 'payload.f',
    },
    {
      id: 'tspan4170',
      type: 'text',
      path: 'payload.g',
    },
    {
      id: 'path18454',
      type: 'color',
      projector: data => {
        let num = +data.payload.e
        return num > 15 ? 'red' : 'green'
      },
    },
    {
      id: 'tspan3054',
      type: 'text',
      path: 'payload.h',
    },

  ],
}

let httpSource = {
  id: 'http-source',
  type: 'http',
  url: 'http://some.domain',
  tags: [
    {
      id: 'path18456',
      type: 'color',
      projector: data => {
        let num = +data.a
        return num > 5 ? 'red' : 'green'
      },
    },
    {
      id: 'tspan3024',
      type: 'text',
      path: 'a',
    },
    {
      id: 'tspan3030',
      selector: '',
      type: 'text',
      path: 'b',
    },
    {
      id: 'rect114817',
      type: 'color',
      projector: data => {
        let num = +data.b
        return num > 15 ? 'red' : 'green'
      },
    },
    {
      id: 'path18450',
      type: 'color',
      projector: data => {
        let num = +data.c
        return num > 15 ? 'red' : 'green'
      },
    },
    {
      id: 'tspan4162',
      type: 'text',
      path: 'c',
    },
    {
      id: 'tspan4570',
      type: 'text',
      path: 'd',
    },
    {
      id: 'path18452',
      type: 'color',
      projector: data => {
        let num = +data.e
        return num > 15 ? 'red' : 'green'
      },
    },
    {
      id: 'tspan4166',
      type: 'text',
      path: 'e',
    },
    {
      id: 'tspan3042',
      selector: '',
      type: 'text',
      path: 'f',
    },
    {
      id: 'tspan4170',
      type: 'text',
      path: 'g',
    },
    {
      id: 'path18454',
      type: 'color',
      projector: data => {
        let num = +data.e
        return num > 15 ? 'red' : 'green'
      },
    },
    {
      id: 'tspan3054',
      type: 'text',
      path: 'h',
    },

  ],
}
let server = createFakeServer()
server.respondImmediately = true
server.respondWith(JSON.stringify({
  "a": "6",
  "b": "19",
  "c": "3",
  "d": "13",
  "e": "12",
  "f": "3",
  "g": "4",
  "h": "10"
}))

export default {
  name: 'example',

  props: [
    'type',
  ],

  watch: {
    'type': function() {
      this.initJScada()
    }
  },

  mounted() {
    JScada.DEBUG = true
    this.initJScada()
  },

  methods: {

    initJScada() {
      this._jscada && this._jscada.close()

      let source = _getSource(this.$props.type)

      this._jscada = new JScada({
        autoStart: true,
        sources: [ source ],
      })
    },
  }
}

function _getSource(type) {
  switch (type) {
    case 'http':
      return httpSource
    case 'mqtt':
      return mqttSource
  }
}
</script>

