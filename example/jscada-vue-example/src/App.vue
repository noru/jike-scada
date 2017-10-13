<template>
  <div id="app">
    <sample-svg class="svg"/>
    <example />
  </div>
</template>

<script>
import Example from './components/JScadaExample'
import SampleSvg from './assets/sample.svg'
export default {
  name: 'app',
  components: {
    Example,
    SampleSvg,
  },

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
.svg {
  display: block;
  transform: scale(.8);
}
</style>