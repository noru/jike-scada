declare var expect: Chai.ExpectStatic

interface Window {
  $: any,
  [prop: string]: any
}

declare var $: any