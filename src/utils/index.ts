import get from 'lodash.get'
import { warn } from './logging'

export * from './logging'
export * from './typeGuards'

export function identity(self) { return self }

export function isUndefinedOrEmpty(arr: any[] | undefined | null) {
  return arr === null || arr === undefined || arr.length === 0
}

export function pluck(data: any, projectorOrPath?: ((i: any) => any) | string | undefined) {

  if (typeof projectorOrPath === 'function') {
    return projectorOrPath(data)
  }

  if (typeof projectorOrPath === 'string') {
    return get(data, projectorOrPath)
  }

  return data
}

export function getSvgDOM(ele: any) {

  if (ele === null) {
    warn('No svg document found, use "document" as default')
    return document
  }

  if (ele.tagName === 'svg') {
    return ele
  }

  if (ele.tagName === 'EMBED') {
    return () => (<HTMLEmbedElement> ele).getSVGDocument()
  }

  return document
}