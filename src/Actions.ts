
import { warn } from './utils'

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
/** Reference: https://developer.mozilla.org/en-US/docs/Web/SVG/Element */
const _container = ['svg', 'a', 'g']
const _shape = ['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon']
const _text = ['altGlyph', 'textPath', 'text', 'tref', 'tspan']
const CONTAINTER = new Set(_container)
const CONTAINTER_SELECTOR = _container.join(',')
const SHAPE = new Set(_shape)
const SHAPE_SELECTOR = _shape.join(',')
const TEXT = new Set(_text)
const TEXT_SELECTOR = _text.join(',')

function isContainer(node: HTMLElement) {
  return CONTAINTER.has(node.tagName)
}

function isText(node: HTMLElement) {
  return TEXT.has(node.tagName)
}

function isSHAPE(node: HTMLElement) {
  return SHAPE.has(node.tagName)
}

// graphics element
// One of the element types that can cause graphics to be drawn onto the target canvas.
// Specifically: ‘circle’, ‘ellipse’, ‘image’, ‘line’, ‘path’, ‘polygon’, ‘polyline’, ‘rect’, ‘text’ and ‘use’.

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

    if (isContainer(node)) {
      node.querySelectorAll(SHAPE_SELECTOR + ',' + TEXT_SELECTOR)
          .forEach(n => Actions[T.fill](n as HTMLElement, data))
      return
    }

    if (isText(node) || isSHAPE(node)) {
      let style = node.getAttribute('style') || ''
      let styleObj = style.split(';').reduce((result, current) => {
        let [key, value] = current.split(':')
        if (value !== undefined) {
          result[key.trim()] = value.trim()
        }
        return result
      } , {})
      styleObj['fill'] = data
      node.setAttribute('style', Object.keys(styleObj).map(key => `${key}:${styleObj[key]}`).join(';'))
    } else {
      warn(`Tag <${node.tagName}> doen't support 'fill' attribute. It has to be a text/shape element.`)
    }
  },

  [T.stroke](node: HTMLElement, data: any) {

    function setStroke(n: Element, strokeValue: { color: string, width: string }) {
      n.setAttribute('stroke', data.color)
      strokeValue.width && n.setAttribute('stroke-width', strokeValue.width)
    }

    if (typeof data === 'string') {
      data = { color: data }
    }
    if (isContainer(node)) {
      node.querySelectorAll(SHAPE_SELECTOR + ',' + TEXT_SELECTOR)
          .forEach(n => setStroke(n, data))
      return
    }

    if (isText(node) || isSHAPE(node)) {
      setStroke(node, data)
    } else {
      warn(`Tag <${node.tagName}> doen't support 'stroke' attribute. It has to be a text/shape element.`)
    }

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
