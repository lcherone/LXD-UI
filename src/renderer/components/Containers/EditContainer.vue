<template>
  <div v-cloak>
    <a @click="initialise()"><slot></slot></a>

    <div class="modal" v-bind:class="{ 'is-active': isActive }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit Container</p>
          <button class="delete" aria-label="close" @click="isActive = false"></button>
        </header>
        <section class="modal-card-body">
          <h5 class="title is-5" style="margin-bottom:10px">General</h5>
          <div class="columns">
            <div class="column">
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="name">Name</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input id="name" class="input" type="text" v-model="container.name" @input="safe_name()" placeholder="Enter container name..." :disabled="container.status === 'Running'">
                    </p>
                    <p class="help" v-show="container.status === 'Stopped'">Only letters, digits or hyphens. No leading hyphen or digit. Dots are converted to hyphens.</p>
                    <p class="help" v-show="container.status === 'Running'">You must <a @click="stop_container(container.name)">stop the container</a> before changing its name.</p>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="profile">Profile</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <el-select v-model="container.profiles" multiple placeholder="Select container profile">
                      <el-option v-for="item in profiles"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <div class="field-label is-normal">
                      <label style="text-align: left" class="label" for="autostart">Auto Start</label>
                    </div>
                    <div class="field-body">
                      <div class="field" style="margin-top:5px">
                        <el-switch active-color="#13ce66" v-model="container.config['boot.autostart']"></el-switch>
                      </div>
                    </div>
                  </div>
                  <div class="field">
                    <div class="field-label is-normal">
                      <label style="text-align: left" class="label" for="privileged">Privileged</label>
                    </div>
                    <div class="field-body">
                      <div class="field" style="margin-top:5px">
                        <el-switch active-color="#13ce66" v-model="container.config['security.privileged']"></el-switch>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <div class="field-label is-normal">
                      <label style="text-align: left" class="label" for="ephemeral">Ephemeral</label>
                    </div>
                    <div class="field-body">
                      <div class="field" style="margin-top:5px">
                        <el-switch active-color="#13ce66" v-model="container.ephemeral"></el-switch>
                      </div>
                    </div>
                  </div>
                  <div class="field">
                    <div class="field-label is-normal">
                      <label style="text-align: left" class="label" for="autostart">Nesting</label>
                    </div>
                    <div class="field-body">
                      <div class="field" style="margin-top:5px">
                        <el-switch active-color="#13ce66" v-model="container.config['security.nesting']"></el-switch>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h5 class="title is-5" style="margin-bottom:10px">CPU</h5>
          <div class="columns">
            <div class="column">
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="autostart">CPU Cores ({{ container.config['limits.cpu'] }})</label>
                </div>
                <div class="field-body">
                  <div class="field" style="margin-top:-3px">
                    <el-slider v-model="container.config['limits.cpu']" :min="1" :max="max_cpu" :step="1"></el-slider>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="autostart">Max Processes ({{ container.config['limits.processes'] }})</label>
                </div>
                <div class="field-body">
                  <div class="field" style="margin-top:-3px">
                    <el-slider v-model="container.config['limits.processes']" :min="100" :max="32750" :step="100"></el-slider>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="autostart">CPU Allowance ({{ container.config['limits.cpu.allowance'] }}%)</label>
                </div>
                <div class="field-body">
                  <div class="field" style="margin-top:-3px">
                    <el-slider v-model="container.config['limits.cpu.allowance']" :min="1" :max="100" :step="1"></el-slider>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="autostart">CPU Priority ({{ container.config['limits.cpu.priority'] }})</label>
                </div>
                <div class="field-body">
                  <div class="field" style="margin-top:-3px">
                    <el-slider v-model="container.config['limits.cpu.priority']" :min="1" :max="10" :step="1"></el-slider>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h5 class="title is-5" style="margin-bottom:10px">Memory</h5>
          <div class="columns">
            <div class="column">
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="autostart">Memory ({{ container.config['limits.memory'] }} MB)</label>
                </div>
                <div class="field-body">
                  <div class="field" style="margin-top:-3px">
                    <el-slider :min="64" :max="max_memory" :step="32" v-model="container.config['limits.memory']"></el-slider>
                  </div>
                </div>
              </div> 
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="autostart">Swap Priority ({{ container.config['limits.memory.swap.priority'] }})</label>
                </div>
                <div class="field-body">
                  <div class="field" style="margin-top:-3px">
                    <el-slider v-model="container.config['limits.memory.swap.priority']" :min="1" :max="10" :step="1"></el-slider>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="autostart">Enforce</label>
                </div>
                <div class="field-body">
                  <div class="field" style="margin-top:-3px">
                    <el-select v-model="container.config['limits.memory.enforce']" placeholder="Select">
                      <el-option v-for="item in [{value: 'soft', label: 'Soft'}, {value: 'hard', label: 'Hard'}]"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>  
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="autostart">Swap</label>
                </div>
                <div class="field-body">
                  <div class="field" style="margin-top:-3px">
                    <el-select v-model="container.config['limits.memory.swap']" placeholder="Select">
                      <el-option v-for="item in [{value: '1', label: 'Yes'}, {value: '0', label: 'No'}]"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <h5 class="title is-5" style="margin-bottom:10px">Disk</h5>
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="autostart">Priority ({{ container.config['limits.disk.priority'] }})</label>
                </div>
                <div class="field-body">
                  <div class="field" style="margin-top:-3px">
                    <el-slider v-model="container.config['limits.disk.priority']" :min="1" :max="10" :step="1"></el-slider>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <h5 class="title is-5" style="margin-bottom:10px">Network</h5>
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="autostart">Priority ({{ container.config['limits.network.priority'] }})</label>
                </div>
                <div class="field-body">
                  <div class="field" style="margin-top:-3px">
                    <el-slider v-model="container.config['limits.network.priority']" :min="1" :max="10" :step="1"></el-slider>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h5 class="title is-5" style="margin-bottom:10px">Snapshots</h5>
          <table class="table is-fullwidth is-narrow">
            <tbody>
              <tr v-for="item in container.snapshots">
                <td>{{ item.name.substring(item.name.indexOf('/') + 1) }}</td>
                <td style="width:1%">
                  <div style="display: flex">
                    <a class="button is-danger is-small" @click="delete_snapshot(item.name)"><i class="fa fa-times"></i></a>
                    <a class="button is-primary is-small" @click="restore_snapshot(item.name)">Restore</a>
                  </div>
                </td>
              </tr>
              <tr v-show="container.snapshots.length === 0">
                <td colspan="2"><p style="padding-top: 3px">No snapshots have been created. <a @click="create_snapshot(container.name)">Create snapshot</a>.</p></td>
              </tr>
            </tbody>
          </table>
        </section>
        <footer class="modal-card-foot">
          <button 
                  @click="save()" 
                  v-bind:class="{ 'is-loading': isSaving }" 
                  v-bind:disabled="isSaving"
                  class="button is-success">Save</button>
          <button class="button" @click="isActive = false" v-bind:disabled="isSaving">Close</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import _ from 'lodash'

  import lxc from '../../mixins/lxc.js'

  const container = require('./Container')

  // import ElectronStore from 'electron-store'
  // const storage = new ElectronStore({
  //   cwd: 'lxd-ui'
  // })

  export default {
    props: ['name'],
    mixins: [lxc],
    data () {
      return {
        isActive: false,
        isSaving: false,
        container: container.empty(),
        profiles: []
      }
    },
    computed: {
      max_memory: function () {
        return (container.max_memory() / 1024) / 1024
      },
      max_cpu: function () {
        return container.max_cpu()
      }
    },
    methods: {
      /**
       *
       */
      initialise () {
        this.$emit('clicked')

        this.get_profiles()

        this.lxc_list(this.name, (response) => {
          if (response[0]) {
            this.container = container.infix(response[0])
            this.isActive = true
          } else {
            this.$notify({
              duration: 1500,
              title: 'Error',
              message: 'Error fetching container info.',
              type: 'error'
            })
          }
        })
      },
      /**
       *
       */
      safe_name: _.debounce(function (e) {
        this.container.name = this.container.name.replace(/[.]/g, '-').trim()
        this.container.name = this.container.name.replace(/^[0-9-]|[^a-zA-Z+-\d+]/g, '')
        this.container.name = this.container.name.replace(/[-.]+$/g, '')
      }, 1000),
      /**
       *
       */
      stop_container () {
        this.lxc_stop(this.container.name, (response) => {
          this.$notify({
            duration: 2000,
            title: 'Success',
            message: 'Container ' + this.container.name + ' stopped.',
            type: 'success'
          })
          this.$emit('container-stopped')
          //
          this.initialise()
        })
      },
      /**
       *
       */
      create_snapshot (name) {
        this.lxc_snapshot(name, name + ' (' + moment().format('LLL') + ')', (response) => {
          this.$notify({
            duration: 2000,
            title: 'Success',
            message: 'Snapshot created.',
            type: 'success'
          })
          //
          this.initialise()
        })
      },
      /**
       *
       */
      delete_snapshot (name) {
        this.lxc_snapshot_delete(this.container.name, name.substring(name.indexOf('/') + 1), (response) => {
          this.$notify({
            duration: 2000,
            title: 'Success',
            message: 'Snapshot deleted.',
            type: 'success'
          })
          //
          this.initialise()
        })
      },
      /**
       *
       */
      restore_snapshot (name) {
        this.$confirm('Are you sure you want restore container from this snapshot?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.lxc_snapshot_restore(this.container.name, name.substring(name.indexOf('/') + 1), (response) => {
            this.$notify({
              duration: 2000,
              title: 'Success',
              message: 'Container restored from snapshot.',
              type: 'success'
            })
            //
            this.initialise()
          })
        })
      },
      /**
       *
       */
      get_profiles: function () {
        //
        this.lxc_query('/1.0/profiles', 'GET', null, (response) => {
          let profiles = []
          _.each(response, function (value, key) {
            profiles.push({
              lable: value.substring(value.lastIndexOf('/') + 1),
              value: value.substring(value.lastIndexOf('/') + 1)
            })
          })
          this.profiles = profiles
        })
      },
      /**
       *
       */
      save () {
        //
        this.isSaving = true

        // apply model fixes
        this.container = container.outfix(this.container)

        //
        this.lxc_query('/1.0/containers/' + this.name, 'PATCH', JSON.stringify({
          config: this.container.config,
          ephemeral: this.container.ephemeral,
          stateful: this.container.stateful,
          profiles: this.container.profiles
        }), (response) => {
          // rename container
          if (this.name !== this.container.name) {
            this.lxc_query('/1.0/containers/' + this.name, 'POST', JSON.stringify({
              name: this.container.name
            }), (response) => {
              this.isSaving = false
              // run notification
              this.$notify({
                duration: 1200,
                title: 'Success',
                message: 'Container properties updated.',
                type: 'success'
              })
              // emit event so table will update
              this.$emit('on-save')
            })
          } else {
            this.isSaving = false
            // run notification
            this.$notify({
              duration: 1200,
              title: 'Success',
              message: 'Container properties updated.',
              type: 'success'
            })
            // emit event so table will update
            this.$emit('on-save')
          }
          this.isActive = false
        })

        // fix back so model dont funk out
        this.container = container.infix(this.container)
      }
    }
  }
</script>

<style scoped>

</style>
