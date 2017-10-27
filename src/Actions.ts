export enum ActionType {
  text = 'text',
  fill = 'fill',
  stroke = 'stoke',
  rotate = 'rotate',
  visibility = 'visibility',
  scale = 'scale',
  offset = 'offset',
}

export type Action = (node: HTMLElement, data: string) => void

const Actions = {

  [ActionType.text](node: HTMLElement, data: string) {
    node.innerHTML = data
  },

  [ActionType.fill](node: HTMLElement, data: string) {
    node.setAttribute('fill', data)
  },

}

export default Actions