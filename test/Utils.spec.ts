import * as Utils from '../src/utils'

describe('Utils', () => {

  it('array: undefined or empty', () => {

    expect(Utils.isUndefinedOrEmpty([])).to.be.true
    expect(Utils.isUndefinedOrEmpty(null)).to.be.true
    expect(Utils.isUndefinedOrEmpty(undefined)).to.be.true

  })

})