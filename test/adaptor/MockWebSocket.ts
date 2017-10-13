
export default class MockWebSocket {

  static sockets: MockWebSocket[] = []
  static clearSockets() {
    MockWebSocket.sockets.length = 0
  }
  readyState = 0
  closeCode = 0
  closeReason = undefined
  _sent: any[] = []
  _handlers: any = {}

  constructor(public url: string, public protocol: string) {
    this.url = url
    this.protocol = protocol
    MockWebSocket.sockets.push(this)
  }

  trigger(name: string, e: any) {
    if (this['on' + name]) {
      this['on' + name](e)
    }
    let lookup = this._handlers[name]
    if (lookup) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < lookup.length; i++) {
        lookup[i](e)
      }
    }
  }

  open() {
    this.readyState = 1
    this.trigger('open', {})
  }

  close(code, reason) {
    if (this.readyState < 2) {
      this.readyState = 2
      this.closeCode = code
      this.closeReason = reason
      this.triggerClose({ wasClean: true })
    }
  }

  send(data: any) {
    this._sent.push(data)
  }

  triggerClose(e) {
    this.readyState = 3
    this.trigger('close', e)
  }

  triggerMessage(data) {
    let messageEvent = {
      data,
      origin: 'mockorigin',
      ports: undefined,
      source: window,
    }
    this.trigger('message', messageEvent)
  }

  static get lastSocket(): MockWebSocket | undefined {
    let sockets = MockWebSocket.sockets
    let length = sockets.length
    return length > 0 ? sockets[length - 1] : undefined
  }

  get lastMessageSent(): any {
    let sent = this._sent
    let length = sent.length
    return length > 0 ? sent[length - 1] : undefined
  }

}
