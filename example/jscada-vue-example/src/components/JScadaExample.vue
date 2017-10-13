<template>
</template>

<script>

import JScada from '../../../../dist/jscada.js'

const mqttSource = {
  id: 'mqtt-source',
  type: 'mqtt',
  url: 'ws://localhost:3000',
  tags: [
    {
      id: 'a-shape',
      selector: 'path18456',
      type: 'color',
      projector: data => {
        let num = +data.payload.a
        return num > 5 ? 'red' : 'green'
      },
    },
    {
      id: 'a',
      selector: 'tspan3024',
      type: 'text',
      path: 'payload.a',
    },
    {
      id: 'b',
      selector: 'tspan3030',
      type: 'text',
      path: 'payload.b',
    },
    {
      id: 'b-shape',
      selector: 'rect114817',
      type: 'color',
      projector: data => {
        let num = +data.payload.b
        return num > 15 ? 'red' : 'green'
      },
    },
    {
      id: 'c-shape',
      selector: 'path18450',
      type: 'color',
      projector: data => {
        let num = +data.payload.c
        return num > 15 ? 'red' : 'green'
      },
    },
    {
      id: 'c',
      selector: 'tspan4162',
      type: 'text',
      path: 'payload.c',
    },
    {
      id: 'd',
      selector: 'tspan4570',
      type: 'text',
      path: 'payload.d',
    },
    {
      id: 'e-shape',
      selector: 'path18452',
      type: 'color',
      projector: data => {
        let num = +data.payload.e
        return num > 15 ? 'red' : 'green'
      },
    },
    {
      id: 'e',
      selector: 'tspan4166',
      type: 'text',
      path: 'payload.e',
    },
    {
      id: 'f',
      selector: 'tspan3042',
      type: 'text',
      path: 'payload.f',
    },
    {
      id: 'g',
      selector: 'tspan4170',
      type: 'text',
      path: 'payload.g',
    },
    {
      id: 'g-shape',
      selector: 'path18454',
      type: 'color',
      projector: data => {
        let num = +data.payload.e
        return num > 15 ? 'red' : 'green'
      },
    },
    {
      id: 'h',
      selector: 'tspan3054',
      type: 'text',
      path: 'payload.h',
    },

  ],
}

export default {
  name: 'example',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created: function() {
    JScada.DEBUG = true
    let instance = new JScada({
      autoStart: true,
      sources: [ mqttSource ],
    })
  }
}
</script>

