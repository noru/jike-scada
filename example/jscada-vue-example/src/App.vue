<template>
  <div id="app">
    <input type="radio" id="http" value="http" v-model="type">
    <label for="http">HTTP</label>
    <input type="radio" id="mqtt" value="mqtt" v-model="type">
    <label for="mqtt">MQTT</label>
    <sample-svg class="svg" />
    <example :type="type" />
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
  data() {

    return {
      type: 'http',
    }

  }

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