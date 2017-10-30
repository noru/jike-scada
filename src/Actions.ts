import * as transform from 'd3-transform'

export enum ActionType {
  text = 'text',
  fill = 'fill',
  stroke = 'stoke',
  visible = 'visible',
  opacity = 'opacity',
  rotate = 'rotate',
  scale = 'scale',
  offset = 'offset',
}

export type Action = (node: HTMLElement, data: any) => void
interface Actions {
  [props: string]: Action
}

import T = ActionType

const Actions: Actions = {

  [T.text](node: HTMLElement, data: string) {
    node.innerHTML = data
  },

  [T.fill](node: HTMLElement, data: string) {
    node.setAttribute('fill', data)
  },

  [T.stroke](node: HTMLElement, data: any) {

    if (typeof data === 'string') {
      data = { color: data }
    }
    node.setAttribute('stroke', data.color)
    data.width && node.setAttribute('stroke-width', data.width)
    // others?

  },

  [T.visible](node: HTMLElement, data: any) {
    if (!!data) {
      node.removeAttribute('visibility')
    } else {
      node.setAttribute('visibility', 'hidden')
    }
  },

  [T.opacity](node: HTMLElement, opacity: any ) {
    let _opacity: any = {}
    if (typeof opacity === 'number') {
      _opacity.fill = _opacity.stroke = opacity
    } else {
      _opacity.fill = opacity.fill || 1
      _opacity.stroke = opacity.stroke || 1
    }

    for (let key in _opacity) {
      let attr = key + '-opacity'
      let val = _opacity[key]
      if (val === 1) {
        node.removeAttribute(attr)
      } else {
        node.setAttribute(attr, val)
      }
    }
  },

  [T.rotate](node: HTMLElement, opacity: any ) {
    throw new Error('Not Implemented')
  },

  [T.scale](node: HTMLElement, opacity: any ) {
    throw new Error('Not Implemented')
  },

  [T.offset](node: HTMLElement, opacity: any ) {
    throw new Error('Not Implemented')
  },

}

export default Actions