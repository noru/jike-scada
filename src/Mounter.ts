import { warn, isNodeList } from './utils'
import Actions, { ActionType, Action } from './Actions'

export interface Option {
  id: string,
  type: ActionType,
  selector?: string,
}

type _Element = HTMLElement | NodeListOf<HTMLElement> | null

export default class Mounter {

  static from({ id, type, selector }: Option) {
    return new Mounter(id, type, selector)
  }

  private _element: _Element
  private _self: Mounter
  private _action: Action | undefined

  constructor(public id: string, public type: ActionType, public selector?: string) {
    this._action = Actions[this.type]
  }

  mount(data: string) {

    if (this._action === undefined) {
      warn(`Ignore tag for: unknown tag type: ${this.type}`)
      return
    }

    this._ensureElement()
    if (isNodeList(this._element)) {
      (<NodeListOf<HTMLElement>> this._element).forEach(node => this._action!(node, data))
    } else {
      this._action(this._element!, data)
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

  private _isElementValid(element: _Element) {
    if (element == null) {
      return false
    }
    if (isNodeList(element) && element.length === 0) {
      return false
    }
    return true
  }
}