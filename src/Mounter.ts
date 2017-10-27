import { warn } from './utils'

export enum MounterType {
  text = 'text',
  fill = 'fill',
}

export interface Option {
  id: string,
  type: MounterType,
  selector?: string,
}

export default class Mounter {

  static from({ id, type, selector }: Option) {
    return new Mounter(id, type, selector)
  }

  private _element: HTMLElement | NodeListOf<HTMLElement> | null
  private _self: Mounter

  constructor(public id: string, public type: MounterType, public selector?: string) { }

  mount(data: string) {

    let processor
    switch (this.type) {
      case MounterType.text:
        processor = this._mountText
        break
      case MounterType.fill:
        processor = this._mountFill
        break
      default:
        warn(`Ignore tag for: unknown tag type: ${this.type}`)
    }

    this._ensureElement()
    if ('length' in this._element!) {
      (<NodeListOf<HTMLElement>> this._element).forEach(node => processor(node, data))
    } else {
      processor(this._element, data)
    }
  }

  private _ensureElement = () => {

    if (!this._isElementValid(this._element)) {
      let { id, selector } = this
      this._element = selector ? <NodeListOf<HTMLElement>> document.querySelectorAll(selector)
                               : document.getElementById(id)
    }
    if (!this._isElementValid(this._element)) {
      throw Error(`Invalid mount point selector or id: ${this.selector}/${this.id}, cannot find the target element`)
    }

  }

  private _mountText = (node: HTMLElement, data: string) => node.innerHTML = data

  private _mountFill = (node: HTMLElement, data: string) => node.setAttribute('fill', data)

  private _isElementValid(element: HTMLElement | NodeListOf<HTMLElement> | null) {
    if (element == null) {
      return false
    }
    if ('length' in element && element['length'] === 0) {
      return false
    }
    return true
  }
}
