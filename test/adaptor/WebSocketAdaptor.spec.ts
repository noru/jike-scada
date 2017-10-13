import WebSocketAdapter from '../../src/adaptor/WebSocketAdaptor'
import MockWebSocket from './MockWebSocket'

describe('WebSocketAdapter', () => {

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

  it('can be instantiated', () => {

    let webSocketAdapter = new WebSocketAdapter('ws://test')
    expect(webSocketAdapter.constructor === WebSocketAdapter).to.be.true

  })

  it('can connect', () => {

    expect(MockWebSocket.lastSocket).to.be.undefined
    let webSocketAdapter = new WebSocketAdapter('ws://test')
    let subj$ = webSocketAdapter.connect()
    expect(subj$).to.be.not.null

    subj$.subscribe(msg => { /* do nothing */ })

    expect(MockWebSocket.lastSocket).to.not.be.undefined

  })

  it('can receive message from socket', (done) => {

    let webSocketAdapter = new WebSocketAdapter('ws://test')
    let subj$ = webSocketAdapter.connect()
    subj$.subscribe(msg => {
      expect(msg).to.be.eq('test')
      done()
    })
    let socket = MockWebSocket!.lastSocket!
    socket.open()
    socket.triggerMessage(JSON.stringify('test'))

  })

  it('projector works', (done) => {

    let webSocketAdapter = new WebSocketAdapter('ws://test', msg => msg.someProp)
    let subj$ = webSocketAdapter.connect()
    subj$.subscribe(msg => {
      expect(msg).to.be.eq(123)
      done()
    })
    let socket = MockWebSocket!.lastSocket!
    socket.open()
    socket.triggerMessage(JSON.stringify({ someProp: 123 }))

  })

})