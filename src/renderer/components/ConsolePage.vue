<template>
  <div id="wrapper">
    <div class="container is-fluid">
      <main-header v-bind:show_search="false" v-bind:show_links="false"></main-header>
      <div id="content-wrapper">
        <div class="columns">
          <div class="column">
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
      this.$nextTick(() => {
        this.console()
      })
    },
    methods: {
      console () {
        //
        var width = 100
        var height = Math.max(Math.round(window.innerHeight / 19.53), 15)

        //
        this.lxc_query('/1.0/containers/' + this.container + '/exec', 'POST', JSON.stringify({
          'command': ['bash'],
          'environment': {
            'HOME': '/root',
            'TERM': 'xterm',
            'USER': 'root'
          },
          'wait-for-websocket': true,
          'interactive': true,
          'width': width,
          'height': 80
        }), function (response) {
          //
          Terminal.applyAddon(fit)
          var xterm = new Terminal({
            useStyle: false,
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
            var previousResponse = null

            //
            xterm.open(document.getElementById('terminal'))
            xterm.resize(0, height)
            xterm.fit()
            window.addEventListener('resize', _.debounce(function (e) {
              var height = Math.max(Math.round(window.innerHeight / 19.53), 15)
              xterm.resize(0, height)
              xterm.fit()
            }, 300))

            //
            xterm.on('data', function (data) {
              sock.send(data, { binary: true })
            })

            //
            sock.onmessage = function (msg) {
              msg = Buffer.from(msg.data).toString()
              console.log(previousResponse)
              if (previousResponse !== null && previousResponse.trim() === 'exit' && msg.trim() === '') {
                xterm.destroy()
                window.close()
              }
              previousResponse = msg
              xterm.write(msg)
              xterm.fit()
            }

            //
            sock.onclose = function (msg) {
              xterm.destroy()
              window.close()
            }
          }
          sock.onerror = function (e) {
            xterm.write('An error occured, press enter to close window.')
            window.close()
            xterm.destroy()
          }
        })
      }
    }
  }
</script>

<style scoped>

  #terminal {
    overflow: hidden;
    width: 100%;
    height: 100%!important;
  }
  
</style>
