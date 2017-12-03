import { Observable } from '../modules/rxjs'

export interface Adaptor<T = {}> {

  connect(): Observable<T> // FIXME: async connection

  disconnect(): void

}