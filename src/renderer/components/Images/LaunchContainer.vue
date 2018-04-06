<template>
  <div>
    <div class="modal" :class="{ 'is-active': isActive }">
      <div class="modal-background"></div>
      <div class="modal-card" style="margin-top:-20vh">
        <header class="modal-card-head">
          <p class="modal-card-title" v-show="script === ''">Launch Container</p>
          <p class="modal-card-title" v-show="script !== ''">Launch Script</p>
          <button class="delete" aria-label="close" @click="isActive = false"></button>
        </header>
        <section class="modal-card-body">
          <div class="console" :id="'terminal-' + fingerprint"></div>
          <div v-show="!launching && !launched">
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label" for="name">Name</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <p class="control">
                    <el-input placeholder="Enter name for new container..." v-model="name"></el-input>
                  </p>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Image</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <p class="control">
                    <el-input placeholder="Please input" v-model="description" v-show="description !== ''" readonly v-if="script === ''"></el-input>
                    <el-input placeholder="Please input" v-model="description" v-show="description !== ''" readonly clearable v-else></el-input>
                    <el-select v-model="selected_image" placeholder="Select" v-show="description === ''" @change="set_image()" @clear="clear_image()" clearable>
                      <el-option
                                 v-for="(item, index) in images"
                                 :key="item.fingerprint"
                                 :label="item.properties.description"
                                 :value="index">
                      </el-option>
                    </el-select>
                  </p>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label" for="profile">Profile</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <el-select v-model="profiles" multiple placeholder="Select container profile">
                    <el-option v-for="item in profilesList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>             
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label" for="profile">Count</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <el-input-number v-model="count" controls-position="right" :min="1" :max="10"></el-input-number>
                </div>
              </div>
            </div>            
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label" for="ephemeral">Ephemeral</label>
              </div>
              <div class="field-body">
                <div class="field" style="margin-top:5px">
                  <el-switch active-color="#13ce66" v-model="ephemeral"></el-switch>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot" v-show="!launched">
          <button 
                  @click="launch()" 
                  v-bind:class="{ 'is-loading': launching }" 
                  v-bind:disabled="launching || staging"
                  class="button is-success">Launch</button>
          <button class="button" @click="isActive = false" v-bind:disabled="launching">Cancel</button>
        </footer>
        <footer class="modal-card-foot" v-show="launched">
          <button class="button is-success" @click="close_modal()">Close</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  import { Terminal } from 'xterm'
  import * as fit from 'xterm/lib/addons/fit/fit'
  import path from 'path'
  import { remote } from 'electron'
  import lxc from '../../mixins/lxc.js'

  import ElectronStore from 'electron-store'
  const storage = new ElectronStore({
    cwd: 'lxd-ui'
  })

  const fs = require('fs')
  const petname = require('node-petname')

  export default {
    mixins: [lxc],
    data () {
      return {
        isActive: false,
        description: null,
        fingerprint: null,
        remote: null,
        name: null,
        profiles: ['default'],
        profilesList: [],
        images: [],
        selected_image: [],
        script: {},
        count: 1,
        ephemeral: null,
        staging: false,
        launching: false,
        launched: false,
        xterm: null
      }
    },
    methods: {
      /**
       * Fired from parent
       */
      open (value) {
        this.get_profiles()

        this.name = value.name || ''
        this.script = value.script || ''
        this.launching = value.launching || false
        this.launched = value.launched || false
        this.staging = value.staging || false
        this.isActive = true
        this.remote = value.remote
        this.fingerprint = value.fingerprint || null
        this.description = value.description

        if (this.fingerprint === null) {
          this.remote = 'local'
          this.get_images('local')
        }

        // place script into actual file so it can be pushed into container
        if (this.script !== '') {
          this.staging = true
          fs.writeFile(path.join(remote.app.getPath('userData'), '/script.sh'), this.script.content, 'utf8', (err) => {
            if (err) {
              this.$notify({
                duration: 2000,
                title: 'Error',
                message: 'Could not placed script on filesystem.',
                type: 'error'
              })
              return console.log(err)
            } else {
              this.staging = false
            }
          })
        }
      },
      /**
       *
       */
      get_profiles: function () {
        //
        this.lxc_query('/1.0/profiles', 'GET', null, (response) => {
          let profilesList = []
          _.each(response, function (value, key) {
            profilesList.push({
              lable: value.substring(value.lastIndexOf('/') + 1),
              value: value.substring(value.lastIndexOf('/') + 1)
            })
          })
          this.profilesList = profilesList
        })
      },
      /**
       *
       */
      get_images (remote) {
        //
        if (Date.now() - Number(storage.get('images_cached.' + remote, 0)) > this.cache_time) {
          let architectures = storage.get('info.server.environment.architectures', ['x86_64', 'i686', 'amd64'])
          // for some reason amd64 is not in server environment architectures array :/ so append it if x86_64 is found
          if (_.indexOf(architectures, 'x86_64') > -1) {
            architectures.push('amd64')
          }
          let imagefilter = 'architecture=\'' + architectures.join('|') + '\''
          //
          this.lxc_images(remote + ':', imagefilter, (response) => {
            this.distros = []
            this.images = []
            for (var key in response) {
              this.images.push(response[key])
              this.distros.push(_.upperFirst(response[key].properties.os))
            }
            this.distros = _.uniq(this.distros)
            storage.set('images.' + remote, this.images)
            storage.set('images_distros.' + remote, this.distros)
            storage.set('images_cached.' + remote, Date.now())
          })
        } else {
          this.images = storage.get('images.' + remote)
          this.distros = storage.get('images_distros.' + remote)
        }
      },
      /**
       *
       */
      set_image () {
        console.log(this.images[this.selected_image])
        this.fingerprint = this.images[this.selected_image].fingerprint
        this.description = this.images[this.selected_image].properties.description
      },
      /**
       *
       */
      clear_image () {
        this.fingerprint = ''
        this.description = ''
      },
      /**
       * Used if user does not supply a name and count is > 1
       * prevents null-1 etc
       */
      random_petname () {
        return petname(2, '-')
      },
      /**
       *
       */
      launch () {
        this.launching = true

        //
        Terminal.applyAddon(fit)
        this.xterm = new Terminal({
          useStyle: false,
          screenKeys: false,
          cursorBlink: true
        })

        //
        this.xterm.open(document.getElementById('terminal-' + this.fingerprint))
        this.xterm.resize(0, 15)
        this.xterm.fit()

        //
        const { spawn } = require('child_process')

        let messageCallback = (msg) => {
          return () => {
            this.$notify({
              duration: 2000,
              title: 'Success',
              message: msg,
              type: 'success'
            })
          }
        }

        // set name if left blank
        if (this.name === '' || this.name === null) {
          this.name = this.random_petname()
        }

        //
        let ls = []
        let le = []
        let lf = []
        var shellescape = require('shell-escape')

        for (let i = 1; i <= this.count; i++) {
          //
          let spawnProps = []
          spawnProps.push(this.remote + ':' + this.fingerprint)
          if (this.count === 1) {
            spawnProps.push(this.name)
          } else {
            spawnProps.push(this.name + '-' + i)
          }
          spawnProps.push('-p ' + this.profiles.join(' -p '))
          spawnProps.push((this.ephemeral ? '-e' : ''))

          ls[i] = spawn('lxc launch', spawnProps, {
            shell: true
          })

          ls[i].stdout.on('data', (data) => {
            let line = data.toString().trim()
            if (line !== '') {
              this.xterm.writeln(line)
            }
          })

          ls[i].stderr.on('data', (data) => {
            let line = data.toString().trim()
            if (line !== '') {
              this.xterm.writeln(line)
            }
          })

          ls[i].on('close', (code) => {
            if (code === 0) {
              // do message callback
              if (this.count === 1) {
                messageCallback('Container ' + this.name + ' successfully created.')()
              } else {
                messageCallback('Container ' + this.name + '-' + i + ' successfully created.')()
              }

              // execute script if defined
              if (this.script !== '') {
                this.xterm.writeln('Staging script for execution')

                lf[i] = spawn('lxc file push --mode=700 --uid=0 --gid=0 ' + shellescape([path.join(remote.app.getPath('userData'), '/script.sh'), 'local:' + this.name + '/root/script.sh']), [], {
                  shell: true
                })

                lf[i].stdout.on('data', (data) => {
                  let line = data.toString().trim()
                  if (line !== '') {
                    this.xterm.writeln(line)
                  }
                })

                lf[i].stderr.on('data', (data) => {
                  let line = data.toString().trim()
                  if (line !== '') {
                    this.xterm.writeln(line)
                  }
                })
                lf[i].on('close', (code) => {
                  if (code === 0) {
                    this.xterm.writeln('Executing script')
                    le[i] = spawn('lxc exec ' + this.name + ' -- /bin/sh -c "/root/script.sh"', [], {
                      shell: true
                    })

                    le[i].stdout.on('data', (data) => {
                      let line = data.toString().trim()
                      if (line !== '') {
                        this.xterm.writeln(line)
                      }
                    })

                    le[i].stderr.on('data', (data) => {
                      let line = data.toString().trim()
                      if (line !== '') {
                        this.xterm.writeln(line)
                      }
                    })

                    le[i].on('close', (code) => {
                      if (code === 0) {
                        // do message callback
                        if (this.count === 1) {
                          messageCallback('Script executed successfully.')()
                        } else {
                          messageCallback('Script executed successfully.')()
                        }
                      } else {
                        // do message callback
                        if (this.count === 1) {
                          messageCallback('Script returned exit code: ' + code)()
                        } else {
                          messageCallback('Script returned exit code: ' + code)()
                        }
                      }
                      this.launching = false
                      this.launched = true
                    })
                  }
                })
              } else {
                this.launching = false
                this.launched = true
              }
            }
          })
        }
        storage.set('images_cached.local', 0)
        storage.set('cache_time.containers', 0)
      },
      /**
       *
       */
      close_modal () {
        this.xterm.destroy()
        this.remote = null
        this.fingerprint = null
        this.launching = false
        this.launched = false
        this.isActive = false
      }
    }
  }
</script>

<style scoped>

  /* for some odd reason, 
  the above modal title Container word gets selected upon submit, this is to prevent that :/ 
  */
  .modal-card-title {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .console {
    overflow: hidden;
    width: 100%;
    height: 100%!important;
  }

</style>
