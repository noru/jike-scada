
export enum MounterType {
  text = 'text',
  color = 'color',
}

export interface Option {
  id: string,
  type: MounterType,
}

export default class Mounter {

  static from({ id, type }: Option) {
    return new Mounter(id, type)
  }

  private _element: HTMLElement | null
  private _self: Mounter

  constructor(public id: string, public type: MounterType) { }

  mount(data: string) {

    switch (this.type) {
      case MounterType.text:
        this._mountText(data)
        break
      case MounterType.color:
        this._mountColor(data)
        break
    }

  }

  private _ensureElement = () => {

    if (!this._element) {
      this._element = <HTMLElement> document.getElementById(this.id)
    }
    if (!this._element) {
      throw Error(`Invalid mount point id: ${this.id}, cannot find the target element`)
    }

  }

  private _mountText = (data: string) => {

    this._ensureElement()
    this._element!.innerHTML = data

  }

  private _mountColor = (data: string) => {

    this._ensureElement()
    this._element!.setAttribute('fill', data)

  }
}
