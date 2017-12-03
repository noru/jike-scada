import { Adaptor } from './Adaptor'
import { Observable, Subject } from '../modules/rxjs'
import * as mqtt from 'mqtt/dist/mqtt.min'
import { warn, debug } from '../utils'
import { identity, noop } from 'xz-utils/lib/func'

interface Topic {
  name: string,
  projector?: (data: any) => any,
}

export default class MqttAdaptor<T> implements Adaptor<T> {

  static _connectionCount = 0
  // tslint:disable-next-line:member-ordering
  static _defaultTopic = {
    name: '#',
    projector: identity,
  }

  // private _type: 'json' | 'string' = 'string'
  private _mqtt$: Subject<any> = new Subject()
  private _client
  private _topics = {}

  constructor(private _url: string, private topics: Topic[]) {
    if (!topics || topics.length === 0) {
      warn('No topic specified, subscript to "#" (all topics)')
      topics = [ MqttAdaptor._defaultTopic ]
    }
    topics.forEach(t => this._topics[t.name] = t.projector || identity)
  }

  connect(cb = noop) {
    this._client = mqtt.connect(this._url, {
      clientId: `jscada${MqttAdaptor._connectionCount++}_${this._url}}`,
      keepalive: 0,
    })
    for (let t in this._topics) {
      debug('Subscribe topic: ' + t)
      this._client.subscribe(t)
    }
    this._client.on('message', (topic, payload) => {
      debug('Incoming message on topic: ' + topic)
      this._mqtt$.next({
        topic,
        payload: JSON.parse(payload.toString()),
      })
    })

    this._client.on('connect', cb)

    return this._mqtt$
  }

  disconnect() {
    if (this._client) {
      this._client.end()
    }
    this._mqtt$.complete()
  }

  send(topic: string, message: any) {
    this._client.publish(topic, message)
  }

}