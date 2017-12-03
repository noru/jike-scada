import HttpAdaptor, { getUrl } from '../../src/adaptor/HttpAdaptor'
import { createFakeServer, SinonFakeServer } from 'sinon'

let _respondStub = {
  a: 123,
  b: '123',
}

describe('HttpAdapter', () => {

  let server: SinonFakeServer
  let httpAdapter: HttpAdaptor<any>

  before(() => {
    server = createFakeServer()
    server.respondImmediately = true
    server.respondWith(JSON.stringify(_respondStub))
  })

  after(() => {
    server.restore()
  })

  afterEach(() => {
    httpAdapter.disconnect()
  })

  it('can be instantiated', () => {

    httpAdapter = new HttpAdaptor({ url: '/test' })
    expect(httpAdapter.constructor === HttpAdaptor).to.be.true

  })

  it('return an oberservable after connected', () => {

    httpAdapter = new HttpAdaptor({ url: '/some/path' })
    let $obs = httpAdapter.connect()
    expect($obs.subscribe).to.not.be.undefined

  })

  it('emmits response after subscribe the observable', (done) => {
    httpAdapter = new HttpAdaptor({ url: '/some/path' })
    let $obs = httpAdapter.connect()
    $obs.subscribe(resp => {
      expect(resp).to.deep.equal(_respondStub)
      done()
    })
  })

  it('interval can work properly', (done) => {
    httpAdapter = new HttpAdaptor({ url: '/some/path' }, 100)
    let $obs = httpAdapter.connect()
    let count = 0
    $obs.subscribe(resp => {
      count++
    })
    setTimeout(() => {
      expect(count).to.be.gte(10)
      done()
    }, 1010)
  })

  it('projector can project properly', (done) => {
    httpAdapter = new HttpAdaptor<number>({ url: '/some/path' }, undefined, response => response.a)
    let $obs = httpAdapter.connect()
    $obs.subscribe(resp => {
      expect(resp).to.deep.equal(123)
      done()
    })
  })

  describe('getUrl()', () => {

    it('should concat a path and a query object into a url', () => {

      let concated = getUrl('/path', { a: '123', b: '345' })
      expect(concated).to.be.eq('/path?a=123&b=345')

    })

    it('should merge existing query on path', () => {

      let concated = getUrl('/path?c=456', { a: '123', b: '345' })
      expect(concated).to.be.eq('/path?c=456&a=123&b=345')

    })

    it('edge case: only path', () => {
      expect(getUrl('/path', {})).to.be.eq('/path')
    })

    it('edge case: only query', () => {
      expect(getUrl('', { a: '123' })).to.be.eq('?a=123')
    })

  })

})