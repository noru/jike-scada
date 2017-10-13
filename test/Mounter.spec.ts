import Mounter, { MounterType } from '../src/Mounter'
import { appendSvg } from './setup'

describe('Mounter', () => {

  let removeSvg
  before(() => {

    removeSvg = appendSvg()

  })

  after(() => {

    removeSvg()

  })

  it('can be instantiated by constructor', () => {

    let mounter = new Mounter('id', MounterType.color)
    expect(mounter).to.be.not.null

  })

  it('can be instantiated by helper method: from', () => {

    let mounter = Mounter.from({ id: 'id', type: MounterType.color })
    expect(mounter).to.be.not.null

  })

  it('can mount text to a <text> if the mounter is of type "text"', () => {

    let mounter = new Mounter('text', MounterType.text)
    mounter.mount('some text')
    expect($('#text').text()).to.be.eq('some text')

  })

  it('can mount color to a <circle> if the mounter is of type "color"', () => {

    let mounter = new Mounter('shape', MounterType.color)
    mounter.mount('#333')
    expect($('#shape').attr('fill')).to.be.eq('#333')

  })

})