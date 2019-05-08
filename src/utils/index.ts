import get from 'lodash.get'
import { warn } from './logging'

export * from './logging'
export * from './typeGuards'

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
    return () => {
      let svgDoc = (<HTMLEmbedElement> ele).getSVGDocument()
      if (!svgDoc) {
        throw new Error('No svg document found. Make sure the embed element contains valid svg and CORS rules are correctly set. ')
      }
      return svgDoc
    }
  }

  return document
}
