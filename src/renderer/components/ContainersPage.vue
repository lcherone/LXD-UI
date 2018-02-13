<template>
  <div id="wrapper">

    <div class="container is-fluid">
      <main-header v-bind:current="this.$route.name"></main-header>

      <div style="margin-top:-10px">
        <div style="margin-bottom:10px">
          <strong class="subtitle is-4">Containers</strong>
        </div>

        <div class="columns">
          <div class="column" v-for="(item, index) in search_result">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  {{ item.name }}
                </p>
                <a href="#" class="card-header-icon" aria-label="more options">
                  <span class="icon">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </a>
              </header>
              <div class="card-content">
                <div class="content">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                  <a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
                  <br>
                  <time datetime="2016-1-1"><strong>Created:</strong> 11:09 PM - 1 Jan 2016</time>
                </div>
              </div>
              <footer class="card-footer">
                <a href="#" class="card-footer-item">Stop</a>
                <a href="#" class="card-footer-item">Start</a>
                <a href="#" class="card-footer-item">Delete</a>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="modal" v-bind:class="{ 'is-active': isActive }">
      <div class="modal-background"></div>
      <div class="modal-card" style="margin-top:-50vh">
        <header class="modal-card-head">
          <p class="modal-card-title">Modal title</p>
          <button class="delete" aria-label="close" @click="isActive=false"></button>
        </header>
        <section class="modal-card-body">
          ...
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success">Save changes</button>
          <button class="button" @click="isActive=false">Cancel</button>
        </footer>
      </div>
    </div>


    {~ search ~}

    <pre>{~ cmdout ~}</pre>


    <div>
      <button class="button" @click="isActive=true">Electron</button>
      <button class="alt" @click="open('https://electron.atom.io/docs/')">Electron</button>
    </div>


    <pre>{{ this.$data }}</pre>
    <pre>{{ require('os').cpus() }}</pre>
    <pre>{- execute("lxc list", function(name){ return name; }) -}</pre>



    <!--    <system-information v-bind:cmdout="cmdout"></system-information>-->

    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            <strong>Bulma</strong> by <a href="https://jgthms.com">Jeremy Thomas</a>. The source code is licensed
            <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
            is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
          </p>
        </div>
      </div>
    </footer>




    <!--
<img id="logo" src="~@/assets/logo.png" alt="electron-vue">
<main>
<div class="left-side">
<span class="title">
Welcome to your new pdfgroject!
</span>
<system-information></system-information>
</div>

<div class="right-side">
<div class="doc">
<div class="title">Getting Ssdfsdsdfdfftarted</div>


<p>
electron-vue comes packed with detailed documentation that cov;;;ers everything from
internal configurations, using the project structure, building your application,
and so much more.
</p>
<button @click="open('https://simulatedgreg.gitbooks.io/electron-vue/content/')">Read the Docs</button><br><br>
</div>
<div class="doc">
<div class="title alt">Other Documentation</div>
<button class="alt" @click="open('https://electron.atom.io/docs/')">Electron</button>
<button class="alt" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>
</div>
</div>
</main>
-->
  </div>
</template>

<script>
  import _ from 'lodash'
  
  import lxc from '../mixins/lxc.js'

  import MainHeader from './Layout/MainHeader'
  import SystemInformation from './LandingPage/SystemInformation'

  export default {
    name: 'containers-page',
    components: { MainHeader, SystemInformation },
    mixins: [lxc],
    data () {
      return {
        electron: process.versions['atom-shell'],
        name: this.$route.name,
        node: process.versions.node,
        path: this.$route.path,
        platform: require('os').platform(),
        vue: require('vue/package.json').version,
        isActive: false,
        search: '',
        search_result: null
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      search_execute: _.debounce(function (e) {
        //
        var self = this
        //
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined') {
          this.search = e.target.value
        }
        //
        var cmd = null
        if (this.search === '') {
          cmd = 'lxc list --format json'
        } else {
          cmd = 'lxc list \'^' + this.search + '(.*)$\' --format json'
        }
        //
        var exec = require('child_process').exec
        exec(cmd, function (error, stdout, stderr) {
          console.log('stdout: ' + stdout)
          console.log('stderr: ' + stderr)
          if (error !== null) {
            console.log('exec error: ' + error)
          }
          if (stdout === '') {
            stdout = []
          }
          self.search_result = JSON.parse(stdout)
        })
      }, 500)
    }
  }
</script>

<style>
  #wrapper {
    height: 100vh;
    padding: 10px 20px 0px 10px;
    width: 100vw;
  }


  /*
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }



  #logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
  }

  main {
  display: flex;
  justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
  display: flex;
  flex-direction: column;
  }

  .welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
  }

  .title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
  }

  .title.alt {
  font-size: 18px;
  margin-bottom: 10px;
  }

  .doc p {
  color: black;
  margin-bottom: 10px;
  }

  .doc button {
  font-size: .8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
  }

  .doc button.alt {
  color: #42b983;
  background-color: transparent;
  }
  */
</style>
