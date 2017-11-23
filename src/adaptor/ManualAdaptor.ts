import { Adaptor } from './Adaptor'
import { Observable, WebSocketSubject, Subject } from '../modules/rxjs'

export default class ManualAdaptor<T> implements Adaptor<T> {

  // private _type: 'json' | 'string' = 'string'
  private _stop$ = new Subject<boolean>()
  private _manual$: Subject<any> = new Subject()

  constructor(private _projector?: (resp: any) => T) { }

  connect() {
    return this._manual$
    .takeUntil(this._stop$)
    .map(message => {
      if (this._projector) {
        return this._projector(message)
      } else {
        return <T> message
      }
    })
    .share()
  }

  disconnect() {
    this._stop$.next(true)
  }

  feed(data: T) {
    this._manual$.next(data)
  }

  send(message: any) {
    // todo, stub
  }

}