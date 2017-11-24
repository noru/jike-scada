
export function isNodeList(element: HTMLElement | NodeListOf<HTMLElement> | null): element is NodeListOf<HTMLElement> {
  return 'length' in element!
}

export function isFunction(element: any): element is () => any {
  return typeof element === 'function'
}