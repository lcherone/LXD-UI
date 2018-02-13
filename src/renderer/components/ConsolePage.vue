<template>
  <div id="wrapper">
    <div class="container is-fluid">
      <main-header v-bind:show_search="false" v-bind:show_links="false"></main-header>
      <div id="content-wrapper">
        <div class="columns">
          <div class="column">
            <h6 class="title is-6">Console ({{ container }})</h6>
            <div id="terminal"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  import lxc from '../mixins/lxc.js'
  import MainHeader from './Layout/MainHeader'

  import { Terminal } from 'xterm'
  import * as fit from 'xterm/lib/addons/fit/fit'

  const WebSocket = require('ws')

  export default {
    name: 'console-page',
    components: { MainHeader },
    mixins: [lxc],
    props: ['container'],
    data () {
      return {}
    },
    mounted: function () {
      // var width = 123
      // var height = Math.max(Math.round(window.innerHeight / 36), 15)
      this.lxc_query('/1.0/containers/' + this.container + '/exec', 'POST', JSON.stringify({
        'command': ['bash'],
        'environment': {
          'HOME': '/root',
          'TERM': 'xterm',
          'USER': 'root'
        },
        'wait-for-websocket': true,
        'interactive': true
      }), function (response) {
        Terminal.applyAddon(fit)
        var xterm = new Terminal({
          useStyle: true,
          screenKeys: false,
          cursorBlink: true
        })
        //
        var operationId = response.id
        var secret = response.metadata.fds[0]
        var wssurl = 'wss://127.0.0.1:8443/1.0/operations/' +
            operationId +
            '/websocket?secret=' +
            secret
        //
        var sock = new WebSocket(wssurl, {rejectUnauthorized: false, binaryType: 'Blob'})
        sock.onopen = function (e) {
          //
          xterm.open(document.getElementById('terminal'))
          xterm.fit()
          window.addEventListener('resize', _.debounce(function (e) {
            xterm.fit()
          }, 300))
          //
          xterm.on('data', function (data) {
            sock.send(data, { binary: true })
          })
          //
          sock.onmessage = function (msg) {
            xterm.write(Buffer.from(msg.data).toString())
            xterm.fit()
          }
          //
          sock.onclose = function (msg) {
            xterm.destroy()
          }
        }
        sock.onerror = function (e) {
          console.log(e)
        }
      })
    },
    methods: {}
  }
</script>

<style>
  #wrapper {
    height: 100vh;
    padding: 10px 20px 0px 10px;
    width: 100vw;
  }
  #content-wrapper {
    margin-top: -20px;
    /*    padding: 10px;*/
  }
  #terminal-container .terminal.xterm {
    height: 100%;
  }
  #terminal-container .xterm-viewport {
    height: 100% !important;
  }
</style>
