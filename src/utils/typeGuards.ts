
export function isNodeList(element: HTMLElement | NodeListOf<HTMLElement> | null): element is NodeListOf<HTMLElement> {
  return 'length' in element!
}