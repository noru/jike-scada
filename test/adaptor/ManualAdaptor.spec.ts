import ManualAdaptor from '../../src/adaptor/ManualAdaptor'

describe('HttpAdapter', () => {

  let manualAdaptor

  afterEach(() => {
    manualAdaptor = null
  })

  it('can be instantiated', () => {

    manualAdaptor = new ManualAdaptor()
    expect(manualAdaptor.constructor === ManualAdaptor).to.be.true

  })

  it('return an oberservable after connected', () => {

    manualAdaptor = new ManualAdaptor()
    let $obs = manualAdaptor.connect()
    expect($obs.subscribe).to.not.be.undefined

  })

  it('accept data manually fed by user', () => {

    manualAdaptor = new ManualAdaptor()
    let $obs = manualAdaptor.connect()
    let result
    $obs.subscribe(function(data) {
      result = data
    })

    manualAdaptor.feed(1)
    expect(result).to.eq(1)
  })

  it('projector works', () => {
    manualAdaptor = new ManualAdaptor(data => data.a)
    let $obs = manualAdaptor.connect()
    let result
    $obs.subscribe(function(data) {
      result = data
    })

    manualAdaptor.feed({a: 1})
    expect(result).to.eq(1)
  })

})