import { JScada, JScadaAdaptorType } from '../src/JScada'
import { spy, createFakeServer, SinonFakeServer } from 'sinon'
import { MounterType } from '../src/Mounter'
import { appendSvg } from './setup'
import * as mqtt from 'mqtt/dist/mqtt.min'
import * as _ from 'lodash'
import MockWebSocket from './adaptor/MockWebSocket'

const _respondStub = {
  color: '#FFF',
  text: 'some text',
}

describe('JScada', () => {

  let server: SinonFakeServer
  let removeSvg
  let httpSource = {
    id: 'http-source',
    type: <JScadaAdaptorType> 'http',
    url: 'http://some/url',
    params: {
      interval: 100,
    },
    tags: [{
        id: 'text',
        type: MounterType.text,
        projector: data => data.text,
      },
      {
        id: 'shape',
        type: MounterType.color,
        path: 'color',
      },
    ],
  }

  let webSocketSource = {
    id: 'ws-source',
    type: <JScadaAdaptorType> 'ws',
    url: 'ws://localhost',
    tags: [{
        id: 'text',
        type: MounterType.text,
        projector: data => data.text,
      },
      {
        id: 'shape',
        type: MounterType.color,
        path: 'color',
      },
    ],
  }

  let mqttSource = {
    id: 'mqtt-source',
    type: <JScadaAdaptorType> 'mqtt',
    url: 'ws://localhost:3000',
    tags: [{
        id: 'text',
        type: MounterType.text,
        projector: data => data.payload.text,
      },
      {
        id: 'shape',
        type: MounterType.color,
        path: 'payload.color',
      },
    ],
  }

  beforeEach(() => {
    removeSvg = appendSvg()
  })

  afterEach(() => {
    removeSvg()
  })

  it('can be constructed', () => {

    let inst = new JScada({
      sources: [],
    })
    expect(inst.constructor === JScada).to.be.true

  })

  it('can auto start if the flag is set', () => {

    let startSpy = spy(JScada.prototype, 'start')

    let inst1 = new JScada({ sources: [] })
    expect(startSpy.calledOnce).to.be.false

    let inst2 = new JScada({
      autoStart: true,
      sources: [],
    })
    expect(startSpy.calledOnce).to.be.true

  })

  it('set "readyState" flag to 1 after start()', () => {

    let inst = new JScada({
      autoStart: true,
      sources: [],
    })
    expect(inst.readyState).to.be.eq(1)

  })

  it('set "readyState" flag to 2 after suspend()', () => {

    let inst = new JScada({
      autoStart: true,
      sources: [],
    })
    inst.suspend()
    expect(inst.readyState).to.be.eq(2)

  })

  it('set "readyState" flag to 3 after close()', () => {

    let inst = new JScada({
      autoStart: true,
      sources: [],
    })
    inst.close()
    expect(inst.readyState).to.be.eq(3)

  })

  describe('Http Source', () => {

    let instance

    beforeEach(() => {

      server = createFakeServer()
      server.respondImmediately = true
      server.respondWith(JSON.stringify(_respondStub))

    })

    afterEach(() => {

      server.restore()
      instance.close()
    })

    it('should accept http source', () => {

      instance = new JScada({
        autoStart: true,
        sources: [httpSource],
      })
      expect(instance.readyState).to.be.eq(1)

    })

    it('should accept http source, update the dom correctly', (done) => {

      instance = new JScada({
        autoStart: true,
        sources: [httpSource],
      })
      setTimeout(function() {
        expect($('#text').text()).to.eq(_respondStub.text)
        expect($('#shape').attr('fill')).to.eq(_respondStub.color)
        done()
      }, 120)

    })

    it('should accept http source, update the dom correctly, repeatly', (done) => {

      instance = new JScada({
        autoStart: true,
        sources: [httpSource],
      })

      let _source = instance['_sources']['http-source']
      let count = 0
      _source.observable.subscribe(val => {
        count++
      })

      setTimeout(function() {
        expect(count).to.eq(10)
        done()
      }, 1010)

    })

    it('should accept selector instead of id in Tags, and update the dom correctly', (done) => {

      let _httpSource = _.cloneDeep(httpSource)

      _httpSource.tags[0].selector = 'text'

      instance = new JScada({
        autoStart: true,
        sources: [_httpSource],
      })
      setTimeout(function() {
        $('text').each((i, t) => expect($(t).text()).to.eq(_respondStub.text))
        done()
      }, 120)

    })
  })

  describe('WebSocket Source', () => {

    let _ws
    function setupMockWebSocket() {
      MockWebSocket.clearSockets()
      _ws = window.WebSocket
      window.WebSocket = MockWebSocket
    }
    function teardownMockWebSocket() {
      window.WebSocket = _ws
      MockWebSocket.clearSockets()
    }
    beforeEach(function() {
      setupMockWebSocket()
    })
    afterEach(function() {
      teardownMockWebSocket()
    })

    it('should accept websocket source', () => {

      let inst = new JScada({
        autoStart: true,
        sources: [webSocketSource],
      })
      expect(inst.readyState).to.be.eq(1)

    })

    it('should accept websocket source, update the dom correctly', () => {

      let inst = new JScada({
        autoStart: true,
        sources: [webSocketSource],
      })

      let socket = MockWebSocket!.lastSocket!
      socket.open()
      socket.triggerMessage(JSON.stringify(_respondStub))

      expect($('#text').text()).to.eq(_respondStub.text)
      expect($('#shape').attr('fill')).to.eq(_respondStub.color)

      socket.triggerMessage(JSON.stringify(_respondStub).replace('#FFF', '#AAA'))
      expect($('#shape').attr('fill')).to.eq('#AAA')

    })

  })

  describe('Mqtt Source', () => {

    const brokerUrl = 'ws://localhost:3000'
    let mqttClient

    beforeEach(() => {
      mqttClient = mqtt.connect(brokerUrl)
    })

    afterEach(() => {
      mqttClient.end()
    })

    it('should accept Mqtt source', () => {

      let inst = new JScada({
        autoStart: true,
        sources: [ mqttSource ],
      })
      expect(inst.readyState).to.be.eq(1)

    })

    it('should accept Mqtt source, update the dom correctly', (done) => {

      let inst = new JScada({
        autoStart: true,
        sources: [ mqttSource ],
      })

      mqttClient.publish('topic1', JSON.stringify(_respondStub), { qos: 1 })

      setTimeout(function() {
        expect($('#text').text()).to.eq(_respondStub.text)
        expect($('#shape').attr('fill')).to.eq(_respondStub.color)
        mqttClient.publish('topic1', JSON.stringify(_respondStub).replace('#FFF', '#AAA'), { qos: 1 })
      }, 2000)

      setTimeout(function() {
        expect($('#text').text()).to.eq(_respondStub.text)
        expect($('#shape').attr('fill')).to.eq('#AAA')
        done()
      }, 4000)

      inst.close()

    }).timeout(5000)

  })

})