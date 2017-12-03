import MqttAdaptor from '../../src/adaptor/MqttAdaptor'
import * as mqtt from 'mqtt/dist/mqtt.min'

describe('MqttAdaptor', () => {

  let mqttAdaptor
  const brokerUrl = 'ws://localhost:3000'
  // const brokerUrl = 'ws://broker.hivemq.com:8000'
  // const brokerUrl = 'ws://test.mosquitto.org:8080'

  afterEach(() => {
    mqttAdaptor.disconnect()
  })

  it('can be instantiated', () => {

    mqttAdaptor = new MqttAdaptor(brokerUrl, [{ name: 'topic1' }])
    expect(mqttAdaptor.constructor === MqttAdaptor).to.be.true

  })

  it('can connect', () => {

    mqttAdaptor = new MqttAdaptor(brokerUrl, [{ name: 'topic1' }])
    let subj$ = mqttAdaptor.connect()
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
    client.publish('topic2', 'test', { qos: 1 })

  })

  it('can receive message from server', (done) => {

    let client = mqtt.connect(brokerUrl)

    client.on('connect', () => {

      mqttAdaptor = new MqttAdaptor(brokerUrl, [{ name: 'topic3' }])
      let subj$ = mqttAdaptor.connect(() => {
        client.publish('topic3', JSON.stringify('test'), { qos: 1 })
      })
      subj$.subscribe(msg => {
        expect(msg.topic).to.eq('topic3')
        expect(msg.payload).to.be.eq('test')
        client.end()
        mqttAdaptor.disconnect()
        done()
      })

    })

  })

})