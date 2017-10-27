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

const Actions: Actions = {

  [ActionType.text](node: HTMLElement, data: string) {
    node.innerHTML = data
  },

  [ActionType.fill](node: HTMLElement, data: string) {
    node.setAttribute('fill', data)
  },

  [ActionType.stroke](node: HTMLElement, data: any) {

    if (typeof data === 'string') {
      data = { color: data }
    }
    node.setAttribute('stroke', data.color)
    data.width && node.setAttribute('stroke-width', data.width)
    // others?

  },

  [ActionType.visible](node: HTMLElement, data: any) {
    if (!!data) {
      node.removeAttribute('visibility')
    } else {
      node.setAttribute('visibility', 'hidden')
    }
  },

  [ActionType.opacity](node: HTMLElement, opacity: any ) {
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

  [ActionType.rotate](node: HTMLElement, opacity: any ) {
    throw new Error('Not Implemented')
  },

  [ActionType.scale](node: HTMLElement, opacity: any ) {
    throw new Error('Not Implemented')
  },

  [ActionType.offset](node: HTMLElement, opacity: any ) {
    throw new Error('Not Implemented')
  },

}

export default Actions