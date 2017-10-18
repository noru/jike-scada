import { isUndefinedOrEmpty, warn, error, debug, debugOn, pluck } from './utils'
import { HttpAdaptor, WebSocketAdaptor, MqttAdaptor, Adaptor } from './adaptor'
import { Observable, Subscription } from './modules/rxjs'
import Mounter, { MounterType } from './Mounter'
import merge from 'lodash.merge'

export enum JScadaReadyState {
  INIT = 0,
  READY = 1,
  SUSPENDED = 2,
  CLOSED = 3,
}

export type JScadaAdaptorType = 'http' | 'ws' | 'mqtt'
export interface JScadaSource {
  id: string,
  type: JScadaAdaptorType,
  url: string,
  tags: JScadaTag[],
  params?: any,
}

export interface JScadaTag {
  id: string,
  selector?: string,
  type: MounterType,
  projector?: (input: any) => any,
  path?: string,
  _mounter?: Mounter,
}

export interface JScadaOptions {
  id?: string,
  parent?: string,
  debug?: boolean,
  autoStart?: boolean,
  sources: JScadaSource[]
}

/** Aliases */
import RS = JScadaReadyState
type Tag = JScadaTag
type Type = JScadaAdaptorType
type Opt = JScadaOptions

export class JScada {

  static set DEBUG(on: boolean) {
    debugOn(on)
  }

  static get DEBUG() {
    return debugOn()
  }

  private static _getAdaptor(type: Type, url: string, params?: any) {

    params = params || {}
    switch (type) {
      case 'http':
        return new HttpAdaptor({ url }, params.interval)
      case 'mqtt':
        return new MqttAdaptor(url, params.topics || [])  // todo, topics
      case 'ws':
        return new WebSocketAdaptor(url)
      default:
        throw Error(`Unexpected source type: ${type}`)
    }

  }

  private static _subscribe(tag: Tag, observable: Observable<any>): Subscription {

    debug(`Subscribe tag ${tag.id}`)
    return observable.subscribe(data => {
      if (tag._mounter === undefined) {
        tag._mounter = new Mounter(tag.id, tag.type, tag.selector)
      }
      try {
        data = pluck(data, tag.projector || tag.path)
      } catch (e) {
        error(e)
        return
      }
      tag._mounter.mount(data)
    })

  }

  private _sources = {}

  private _readyState = RS.INIT

  get readyState() {
    return this._readyState
  }

  private _opt: Opt = {
    id: String(Math.random()).substr(2, 8),
    parent: 'body',
    autoStart: false,
    sources: [],
  }

  constructor(options: Opt) {

    if (isUndefinedOrEmpty(options.sources)) {
      warn(`No sources assigned. Nothing would happen. Id: ${options.id || '(not assigned)'}`)
    }

    merge(this._opt, options)

    if (this._opt.autoStart) {
      debug('Auto start required, starting...')
      this.start()
    }

  }

  start() {

    let { sources } = this._opt

    sources.forEach(source => {

      if (this._sources[source.id]) {
        warn(`Duplicated source id: ${source.id}`)
        return
      }
      let adaptor = JScada._getAdaptor(source.type, source.url, source.params)
      let observable = adaptor.connect()
                              .takeWhile(() => this.readyState === RS.READY)
      let subscriptions = source.tags.map(tag => JScada._subscribe(tag, observable))

      this._sources[source.id] = {
        adaptor,
        observable,
        subscriptions,
      }
    })

    this._readyState = RS.READY
    debug(`JScada instance ${this._opt.id} started`)
  }

  suspend() {
    // todo stub
    this._readyState = RS.SUSPENDED
  }

  close() {
    for (let s in this._sources) {
      let source = this._sources[s]
      source.adaptor.disconnect()
      source.subscriptions.forEach(sub => sub.unsubscribe())
    }
    this._readyState = RS.CLOSED
  }

}