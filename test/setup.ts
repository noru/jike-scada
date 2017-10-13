// import 'chai/register-expect'
import jQuery from 'jquery'

window.$ = jQuery

export function appendSvg() {
  let svg = `
  <svg id="svg">
    <text id="text"></text>
    <circle id="shape">
  </svg>
  `
  $(svg).appendTo($('body'))

  return () => $('#svg').remove()
}