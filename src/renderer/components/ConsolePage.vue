<template>
  <el-main>
    <div id="terminal"></div>
  </el-main>
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
        var height = Math.max(Math.round(window.innerHeight / 19.50), 15)

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
            xterm.focus()

            //
            window.addEventListener('resize', _.debounce(function (e) {
              var height = Math.max(Math.round(window.innerHeight / 19.50), 15)
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
            xterm.writeln('An error occured, press enter to close window.')
            window.close()
            xterm.destroy()
          }
        })
      }
    }
  }
</script>

<style>
  html {
    overflow: auto;
  }
  html, body {
    background:black;
    height: 100%
  }
  body {
    position: absolute;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .el-main {
    background-color: #000;
    color: #333;
    height: calc(100vh);
    padding-top: 20px;
    padding-right: 0px;
  }

  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
    -webkit-border-radius: 10px;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background: rgba(227, 75, 20, 0.8); 
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
  }

  ::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(227, 75, 20, 0.4); 
  }

  #terminal {
    overflow: hidden;
    width: 100%;
    height: calc(100vh - 40px);
  }

</style>
