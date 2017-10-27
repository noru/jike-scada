import Actions, { ActionType } from '../src/Actions'

describe.only('Actions', () => {

  let el, $el
  beforeEach(() => {
    $el = $('<div></div>')
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

  it(ActionType.fill, () => {

    Actions[ActionType.fill](el, '#333')
    expect($el.attr('fill')).to.eq('#333')

  })

  it(ActionType.stroke, () => {

    Actions[ActionType.stroke](el, 'red')
    expect($el.attr('stroke')).to.eq('red')

    Actions[ActionType.stroke](el, { color: 'green', width: 7 })
    expect($el.attr('stroke')).to.eq('green')
    expect($el.attr('stroke-width')).to.eq('7')

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