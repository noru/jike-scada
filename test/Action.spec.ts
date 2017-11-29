import Actions, { ActionType } from '../src/Actions'
import { SvgString } from './setup'

describe('Actions', () => {

  let el, $el
  beforeEach(() => {
    $el = $(SvgString)
    el = $el[0]
  })

  afterEach(() => {
    $el = undefined
    el = undefined
  })

  it(ActionType.text, () => {

    Actions[ActionType.text](el, 'some text')
    expect($el.text()).to.eq('some text')

  })

  it(ActionType.fill + ': single node', () => {

    let text = $el.find('text')
    Actions[ActionType.fill](text[0], '#333')
    expect(text.attr('style')).to.contains('fill:#333')

    let shape = $el.find('circle')
    Actions[ActionType.fill](shape[0], '#333')
    expect(shape.attr('style')).to.contains('fill:#333')

    let nonSupport = $el.find('image')
    Actions[ActionType.fill](nonSupport[0], '#333')
    expect(nonSupport.attr('style')).to.be.undefined

  })

  it(ActionType.fill + ': container', () => {

    Actions[ActionType.fill](el, '#333')
    $el.children().each((i, node) => {
      if (node.tagName !== 'image') {
        expect($(node).attr('style')).to.contains('fill:#333')
      }
    })

  })

  it(ActionType.stroke + ': single node', () => {

    let text = $el.find('text')

    Actions[ActionType.stroke](text[0], 'red')
    expect(text.attr('stroke')).to.eq('red')

    let shape = $el.find('circle')
    Actions[ActionType.stroke](shape[0], { color: 'green', width: 7 })
    expect(shape.attr('stroke')).to.eq('green')
    expect(shape.attr('stroke-width')).to.eq('7')

    let nonSupport = $el.find('image')
    Actions[ActionType.stroke](nonSupport[0], '#333')
    expect(nonSupport.attr('stroke')).to.not.eq('#333')

  })

  it(ActionType.stroke + ': container', () => {

    Actions[ActionType.stroke](el, 'red')
    $el.children().each((i, node) => {
      if (node.tagName !== 'image') {
        expect($(node).attr('stroke')).to.eq('red')
      }
    })

    Actions[ActionType.stroke](el, { color: 'green', width: 7 })
    $el.children().each((i, node) => {
      if (node.tagName !== 'image') {
        expect($(node).attr('stroke')).to.eq('green')
        expect($(node).attr('stroke-width')).to.eq('7')
      }
    })

  })

  it(ActionType.visible, () => {

    Actions[ActionType.visible](el, false)
    expect($el.attr('visibility')).to.eq('hidden')
    el.removeAttribute('visibility')

    Actions[ActionType.visible](el, null)
    expect($el.attr('visibility')).to.eq('hidden')
    el.removeAttribute('visibility')

    Actions[ActionType.visible](el, undefined)
    expect($el.attr('visibility')).to.eq('hidden')
    el.removeAttribute('visibility')

    Actions[ActionType.visible](el, true)
    expect($el.attr('visibility')).to.be.undefined

    Actions[ActionType.visible](el, '(!*&#')
    expect($el.attr('visibility')).to.be.undefined

    Actions[ActionType.visible](el, {})
    expect($el.attr('visibility')).to.be.undefined

  })

  it(ActionType.opacity, () => {

    Actions[ActionType.opacity](el, .5)
    expect($el.attr('fill-opacity')).to.eq('0.5')
    expect($el.attr('stroke-opacity')).to.eq('0.5')

    Actions[ActionType.opacity](el, { fill: .43, stroke: .21 })
    expect($el.attr('fill-opacity')).to.eq('0.43')
    expect($el.attr('stroke-opacity')).to.eq('0.21')

    Actions[ActionType.opacity](el, 1)
    expect($el.attr('fill-opacity')).to.be.undefined
    expect($el.attr('stroke-opacity')).to.be.undefined

    Actions[ActionType.opacity](el, { fill: .5 })
    expect($el.attr('fill-opacity')).to.eq('0.5')
    expect($el.attr('stroke-opacity')).to.be.undefined

    Actions[ActionType.opacity](el, { stroke: .5 })
    expect($el.attr('fill-opacity')).to.be.undefined
    expect($el.attr('stroke-opacity')).to.eq('0.5')

    Actions[ActionType.opacity](el, { fill: 1, stroke: 1 })
    expect($el.attr('fill-opacity')).to.be.undefined
    expect($el.attr('stroke-opacity')).to.be.undefined

  })

})