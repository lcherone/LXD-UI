<template>
  <div v-cloak>

    <a class="button is-primary is-small" @click="isActive = true">Launch</a>

    <div class="modal" v-bind:class="{ 'is-active': isActive }">
      <div class="modal-background"></div>
      <div class="modal-card" style="margin-top:-29vh">
        <header class="modal-card-head">
          <p class="modal-card-title">New Container</p>
          <button class="delete" aria-label="close" @click="isActive = false"></button>
        </header>
        <section class="modal-card-body">

          <div class="console" :id="'terminal-' + fingerprint"></div>

          <div v-show="!launching">
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label" for="name">Name</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <p class="control">
                    <input id="name" class="input" type="text" v-model="name" placeholder="Enter name for new container...">
                  </p>
                </div>
              </div>
            </div>

            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label" for="name">Profile</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="select">
                    <select v-model="profile">
                      <option>default</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>
        <footer class="modal-card-foot">
          <button 
                  @click="launch()" 
                  v-bind:class="{ 'is-loading': launching }" 
                  v-bind:disabled="launching"
                  class="button is-success">Launch</button>
          <button class="button" @click="isActive = false" v-bind:disabled="launching">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  // import _ from 'lodash'

  import { Terminal } from 'xterm'
  import * as fit from 'xterm/lib/addons/fit/fit'

  import ElectronStore from 'electron-store'
  const storage = new ElectronStore({
    cwd: 'lxd-ui' // ,
    // encryptionKey: 'obfuscation'
  })

  export default {
    props: ['remote', 'fingerprint'],
    data () {
      return {
        isActive: false,
        name: null,
        profile: 'default',
        launching: false,
        launched: false
      }
    },
    mounted: function () {},
    methods: {
      launch () {
        this.launching = true

        //
        Terminal.applyAddon(fit)
        var xterm = new Terminal({
          useStyle: false,
          screenKeys: false,
          cursorBlink: true
        })

        //
        xterm.open(document.getElementById('terminal-' + this.fingerprint))
        xterm.resize(0, 10)
        xterm.fit()

        //
        const { spawn } = require('child_process')
        const ls = spawn(
          'lxc launch', [
            this.remote + ':' + this.fingerprint,
            this.name,
            '-p' + this.profile
          ],
          {
            shell: true
          }
        )

        ls.stdout.on('data', (data) => {
          let line = data.toString().trim()
          if (line !== '') {
            xterm.writeln(line)
          }
        })

        ls.stderr.on('data', (data) => {
          let line = data.toString().trim()
          if (line !== '') {
            xterm.writeln(line)
          }
        })

        ls.on('close', (code) => {
          if (code === 0) {
            xterm.writeln('Container successfully created.')
            this.launching = false
            this.launched = true
          }
        })

        storage.set('images_cached.local', 0)
      },
      close_modal: function () {
        this.$emit('close-modal', true)
      }
    }
  }
</script>

<style scoped>
  .console {
    overflow: hidden;
    width: 100%;
    height: 100%!important;
  }
</style>
