import Mounter from '../src/Mounter'
import { ActionType } from '../src/Actions'
import { appendSvg } from './setup'

describe('Mounter', () => {

  let removeSvg
  beforeEach(() => {

    removeSvg = appendSvg()

  })

  afterEach(() => {

    removeSvg()

  })

  it('can be instantiated by constructor', () => {

    let mounter = new Mounter('id', ActionType.fill)
    expect(mounter).to.be.not.null

  })

  it('can take customized DOM', () => {

    let mounter = new Mounter('id', ActionType.fill, undefined, $('#svg')[0])
    expect(mounter).to.be.not.null

  })

  it('can mount text to a <text> if the mounter is of type "text"', () => {

    let mounter = new Mounter('text', ActionType.text)
    mounter.mount('some text')
    expect($('#text').text()).to.be.eq('some text')

  })

  it('can mount color to a <circle> if the mounter is of type "color"', () => {

    let mounter = new Mounter('shape', ActionType.fill)
    mounter.mount('#333')
    expect($('#shape').attr('fill')).to.be.eq('#333')

  })

  it('can take selector instead of id if specified', () => {

    let mounter = new Mounter('some-id', ActionType.fill, 'circle')
    mounter.mount('#333')
    $('circle').each((i, node) => {
      expect($(node).attr('fill')).to.be.eq('#333')
    })

  })

  it('can work with customized DOM', () => {

    let mounter = new Mounter('some-id', ActionType.fill, 'circle', $('#svg')[0])
    mounter.mount('#333')
    $('circle').each((i, node) => {
      expect($(node).attr('fill')).to.be.eq('#333')
    })

  })

})