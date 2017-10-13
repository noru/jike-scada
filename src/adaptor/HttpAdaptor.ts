import { Adaptor } from './Adaptor'
import { Observable, AjaxRequest, Subject } from '../modules/rxjs'

interface FlatObject {

  [key: string]: string,

}

interface HttpOptions {

  url: string,
  method?: string,
  query?: FlatObject,
  headers?: FlatObject,

}

export default class HttpAdaptor<T> implements Adaptor<T> {

  private _stop$ = new Subject<boolean>()
  private _request: AjaxRequest
  private _observable: Observable<T>

  constructor({ url, method = 'GET', query = {}, headers = {} }: HttpOptions,
              public interval: number = 3000,
              public projector?: (resp: any) => T) {

    this._request = {
      url: getUrl(url, query),
      method,
      headers,
    }
  }

  connect() {
    this._observable = Observable.timer(0, this.interval)
      .takeUntil(this._stop$)
      .flatMap(() => {
        return Observable.ajax(this._request)
      })
      .map(response => {
        if (this.projector) {
          return this.projector(response.response)
        } else {
          return <T> response.response
        }
      })
      .share()
    return this._observable
  }

  disconnect() {
    this._stop$.next(true)
  }

}

export function getUrl(url: string, query: FlatObject) {
  let [_url, queryStr] = url.split('?')

  let _query = (queryStr ? `${queryStr}&` : '')
               + Object.keys(query).map(key => `${key}=${query[key]}`).join('&')

  if (_query) {
    _query = '?' + _query
  }
  return _url + _query
}