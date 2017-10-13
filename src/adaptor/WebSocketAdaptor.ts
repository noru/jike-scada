import { Adaptor } from './Adaptor'
import { Observable, WebSocketSubject, Subject } from '../modules/rxjs'

export default class WebSocketAdaptor<T> implements Adaptor<T> {

  // private _type: 'json' | 'string' = 'string'
  private _stop$ = new Subject<boolean>()
  private _webSocket$: WebSocketSubject<any>

  constructor(private _url: string, private _projector?: (resp: any) => T) {
  }

  connect() {
    let ws = this._webSocket$ = Observable.webSocket(this._url)

    return ws
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

  send(message: any) {
    if (this._webSocket$) {
      let payload = typeof message === 'string' ? message : JSON.stringify(message)
      this._webSocket$.next(payload)
    }
  }

}