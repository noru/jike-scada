import Actions, { ActionType } from '../src/Actions'

describe.only('Actions', () => {

  let element
  beforeEach(() => {
    element = $('<div></div>')[0]
  })

  afterEach(() => {
    element = undefined
  })

  it(ActionType.text, () => {

    Actions[ActionType.text](element, 'some text')
    expect($(element).text()).to.eq('some text')

  })

  it(ActionType.fill, () => {
    Actions[ActionType.fill](element, '#333')
    expect($(element).attr('fill')).to.eq('#333')
  })

})