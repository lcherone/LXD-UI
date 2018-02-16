<template>
  <div>
    <!-- Main header -->
    <main-header :current="$route.path"></main-header>

    <!-- Main element -->
    <el-main>
      <div class="columns">
        <div class="column is-narrow">
          <side-menu></side-menu>
        </div>
        <div class="column">
          <h6 class="title is-6">About</h6>

          <div class="box">
            <div class="card-content">
              <p>A simple easy to use local <a @click="open('https://linuxcontainers.org/lxd/')">LXD</a> server user interface.</p>
              <br>
              <strong>Its powered by the following stuff:</strong>
              <ul>
                <li>Electron - (<a @click="open('https://electronjs.org')">https://electronjs.org</a>)</li>
                <li>Node.js - (<a @click="open('https://nodejs.org')">https://nodejs.org</a>)</li>
                <li>Vue-Electron - (<a @click="open('https://github.com/SimulatedGREG/electron-vue')">https://github.com/SimulatedGREG/electron-vue</a>)</li>
                <li>Vue.js - (<a @click="open('https://vuejs.org')">https://vuejs.org</a>)</li>
                <li>Bulma - (<a @click="open('https://bulma.io')">https://bulma.io</a>)</li>
                <li>Element-UI - (<a @click="open('http://element.eleme.io')">http://element.eleme.io</a>)</li>
                <li>Font-Awesome - (<a @click="open('https://fontawesome.com')">https://fontawesome.com</a>)</li>
                <li>Moment.js - (<a @click="open('https://momentjs.com')">https://momentjs.com</a>)</li>
                <li>xterm.js - (<a @click="open('https://xtermjs.org')">https://xtermjs.org</a>)</li>
                <li>Electron-store - (<a @click="open('https://github.com/sindresorhus/electron-store')">https://github.com/sindresorhus/electron-store</a>)</li>
              </ul>
              <br>
              <p>Created by <a @click="open('https://github.com/lcherone')">Lawrence Cherone</a> as a fun weekend project. Its open source (MIT) and can be found on GitHub, any feedback or contributions are very welcome.</p>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
  import MainHeader from './Layout/MainHeader'
  import SideMenu from './Layout/SideMenu'

  export default {
    name: 'about-page',
    components: { MainHeader, SideMenu },
    mixins: [],
    data () {
      return {}
    },
    mounted: function () {
      document.title = 'LXDui - About'
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style scoped>

</style>
