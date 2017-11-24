import { warn, error, isNodeList, isFunction } from './utils'
import Actions, { ActionType, Action } from './Actions'

type _Element = HTMLElement | NodeListOf<HTMLElement> | null

export default class Mounter {

  private _element: _Element
  private _self: Mounter
  private _action: Action | undefined

  constructor(
    public id: string,
    public type: ActionType,
    public selector?: string,
    private _DOM: Document | (() => Document) = document) {
    this._action = Actions[this.type]
  }

  mount(data: string) {

    if (this._action === undefined) {
      warn(`Ignore tag for: unknown tag type: ${this.type}`)
      return
    }

    this._ensureElement()

    if (!this._isElementValid(this._element)) {
      error(`Invalid mount point id or selector: ${this.id}/${this.selector}, cannot find the target element`)
      return
    }

    if (isNodeList(this._element)) {
      (<NodeListOf<HTMLElement>> this._element).forEach(node => this._action!(node, data))
    } else {
      this._element && this._action(this._element!, data)
    }

  }

  private _ensureElement = () => {

    if (!this._isElementValid(this._element)) {
      let { id, selector, _DOM } = this
      if (isFunction(_DOM)) {
        _DOM = _DOM()
      }
      this._element = selector ? <NodeListOf<HTMLElement>> _DOM.querySelectorAll(selector)
                               : _DOM.getElementById(id)
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