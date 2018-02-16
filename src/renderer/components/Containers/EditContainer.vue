<template>
  <div v-cloak>
    <a @click="initialise()"><slot></slot></a>

    <div class="modal" v-bind:class="{ 'is-active': isActive }">
      <div class="modal-background"></div>
      <div class="modal-card" style="margin-top:-20vh">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit Container</p>
          <button class="delete" aria-label="close" @click="isActive = false"></button>
        </header>
        <section class="modal-card-body">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label" for="name">Name</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <input id="name" class="input" type="text" v-model="container.name" @input="safe_name()" placeholder="Enter container name..." :disabled="container.status === 'Running'">
                </p>
                <p class="help" v-show="container.status === 'Stopped'">Only letters, digits or hyphens. No leading hyphen or digit. Dots are converted to hyphens.</p>
                <p class="help" v-show="container.status === 'Running'">You must stop the container before changing its name.</p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label" for="profile">Profile</label>
            </div>
            <div class="field-body">
              <div class="field">
                <el-select v-model="container.profiles" multiple placeholder="Select container profile">
                  <el-option label="Default" value="default"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label" for="ephemeral">Ephemeral</label>
            </div>
            <div class="field-body">
              <div class="field">
                <el-switch active-color="#13ce66" v-model="container.ephemeral"></el-switch>
              </div>
            </div>
          </div>
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
  import _ from 'lodash'

  import lxc from '../../mixins/lxc.js'

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
        container: {
          architecture: '',
          config: {},
          devices: {},
          ephemeral: false,
          profiles: [
            'default'
          ],
          stateful: true,
          description: '',
          created_at: '',
          expanded_config: {},
          expanded_devices: {},
          name: '',
          status: '',
          status_code: 0,
          last_used_at: '',
          state: {
            status: '',
            status_code: 0,
            disk: {},
            memory: {
              usage: 0,
              usage_peak: 0,
              swap_usage: 0,
              swap_usage_peak: 0
            },
            network: {},
            pid: 0,
            processes: 0,
            cpu: {
              usage: 0
            }
          },
          snapshots: []
        }
      }
    },
    mounted: function () {},
    methods: {
      initialise () {
        this.lxc_list(this.name, (response) => {
          if (response[0]) {
            this.container = response[0]
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
      safe_name: _.debounce(function (e) {
        this.container.name = this.container.name.replace(/[.]/g, '-').trim()
        this.container.name = this.container.name.replace(/^[0-9-]|[^a-zA-Z+-\d+]/g, '')
        this.container.name = this.container.name.replace(/[-.]+$/g, '')
      }, 500),
      save () {
        //
        this.isSaving = true
        //
        this.lxc_query('/1.0/containers/' + this.name, 'PATCH', JSON.stringify({
          config: {},
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
            this.isActive = false
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
