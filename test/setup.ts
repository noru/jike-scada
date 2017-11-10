// import 'chai/register-expect'
import jQuery from 'jquery'

window.$ = jQuery

export const SvgString = `
  <svg id="svg">
    <text id="text"></text>
    <text id="text2"></text>
    <text id="text3"></text>
    <text id="text4"></text>
    <circle id="shape" />
    <circle id="shape2" />
    <circle id="shape3" />
    <circle id="shape4" />
    <image />
  </svg>
  `

export function appendSvg() {
  $(SvgString).appendTo($('body'))

  return () => $('#svg').remove()
}