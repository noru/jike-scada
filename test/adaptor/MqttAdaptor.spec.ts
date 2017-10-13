import MqttAdaptor from '../../src/adaptor/MqttAdaptor'
import * as mqtt from 'mqtt/dist/mqtt.min'

describe('MqttAdaptor', () => {

  let webSocketAdapter
  const brokerUrl = 'ws://localhost:3000'
  // const brokerUrl = 'ws://broker.hivemq.com:8000'
  // const brokerUrl = 'ws://test.mosquitto.org:8080'

  afterEach(() => {
    webSocketAdapter.disconnect()
  })

  it('can be instantiated', () => {

    webSocketAdapter = new MqttAdaptor(brokerUrl, [{ name: 'topic1' }])
    expect(webSocketAdapter.constructor === MqttAdaptor).to.be.true

  })

  it('can connect', () => {

    webSocketAdapter = new MqttAdaptor(brokerUrl, [{ name: 'topic1' }])
    let subj$ = webSocketAdapter.connect()
    expect(subj$).to.be.not.undefined

  })

  it('test server is ok', (done) => {

    let client = mqtt.connect(brokerUrl)
    client.subscribe('topic2')
    client.on('message', function(topic, payload) {
      if (topic === 'topic2') {
        expect(payload.toString()).to.be.eq('test')
        client.end()
        done()
      }
    })
    setTimeout(function() {
      client.publish('topic2', 'test', { qos: 1 })
    }, 1000)

  })

  it('can receive message from server', (done) => {

    let client = mqtt.connect(brokerUrl)
    webSocketAdapter = new MqttAdaptor(brokerUrl, [{ name: 'topic3' }])
    let subj$ = webSocketAdapter.connect()
    subj$.subscribe(msg => {
      expect(msg.topic).to.eq('topic3')
      expect(msg.payload).to.be.eq('test')
      client.end()
      webSocketAdapter.disconnect()
      done()
    })
    setTimeout(function() {
      client.publish('topic3', JSON.stringify('test'), { qos: 1 })
    }, 1000)

  })

})