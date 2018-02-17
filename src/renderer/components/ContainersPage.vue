<template>
  <div v-cloak>
    <!-- Main header -->
    <main-header :current="$route.path"></main-header>

    <!-- Main element -->
    <el-main>
      <h6 class="title is-6">
        <span class="icon">
          <i class="fa fa-cubes"></i>
        </span>
        Containers
        <button 
                class="button is-small is-link is-pulled-right" 
                @click="refresh_containers()" 
                v-bind:class="{ 'is-loading': btn.refresh_containers }" 
                v-bind:disabled="btn.refresh_containers">
          <span class="icon">
            <i class="fa fa-refresh"></i> 
          </span>
          &nbsp; Refresh
        </button>
      </h6>
      <div class="box">
        <div class="card-content" v-loading="loading">
          <div v-if="containers.length > 0">
            <table class="table is-fullwidth is-narrow">
              <thead>
                <tr>
                  <th style="width:20%">Name</th>
                  <th style="width:20%">IP</th>
                  <th style="width:20%">CPU</th>
                  <th style="width:20%">Memory</th>
                  <th style="width:10%">Status</th>
                  <th style="width:1%"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="container in containers">
                  <td>
                    <edit-container v-bind:name="container.name" @on-save="refresh_containers()" @clicked="manage_dropdown_close_all">{{ container.name }}</edit-container>
                  </td>
                  <td>
                    <!-- Running is ip4 -->
                    <a 
                       v-show="container.state && container.status === 'Running' && isIP4(container.state.network.eth0.addresses[0].address)" 
                       @click="open('http://' + container.state.network.eth0.addresses[0].address)">
                      {{ container.state && container.state.network ? container.state.network.eth0.addresses[0].address : '-' }}
                    </a>
                    <!-- Running not ip4 -->
                    <span 
                          v-show="container.status === 'Running' && isIP4(container.state.network.eth0.addresses[0].address) === false" 
                          @click="refresh_containers()">
                      <i class="fa fa-refresh"></i>
                    </span>
                    <!-- Stopped -->
                    <span v-show="container.status === 'Stopped'">-</span>
                  </td>
                  <td>{{ container.state && container.state.cpu.usage !== 0 ? Number(container.state.cpu.usage/1000000000).toFixed(2) + ' seconds' : '-' }}</td>
                  <td>{{ container.state && container.state.memory.usage !== 0 ? formatBytes(container.state.memory.usage) : '-' }}</td>
                  <td>
                    <strong :class="{
                                    'has-text-success': (container.status === 'Running'),
                                    'has-text-danger': (container.status === 'Stopped')
                                    }">{{ container.status }}</strong>
                  </td>
                  <td>
                    <div class="dropdown is-small is-right" :class="manage_dropdown_class(container.name)">
                      <div class="dropdown-trigger" @click="manage_dropdown_toggle(container.name)">
                        <button class="button is-info is-small">
                          <span>Manage</span>
                          <span class="icon is-small">
                            <i class="fa fa-angle-down"></i>
                          </span>
                        </button>
                      </div>
                      <div class="dropdown-menu" id="dropdown-menu3" role="menu">
                        <div class="dropdown-content">
                          <router-link class="dropdown-item" v-show="container.status === 'Running'" :to="{ path: '/terminal/' + container.name }" target="_blank" title="Open terminal">
                            <span class="icon">
                              <i class="fa fa-terminal"></i> 
                            </span>
                            <span>Terminal</span>
                          </router-link>
                          <a @click="start_container(container.name)" class="dropdown-item" v-if="container.status === 'Stopped'">
                            <span class="icon">
                              <i class="fa fa-play"></i> 
                            </span>
                            <span>Start</span>
                          </a>
                          <a @click="stop_container(container.name)" class="dropdown-item" v-if="container.status === 'Running'">
                            <span class="icon">
                              <i class="fa fa-stop"></i> 
                            </span>
                            <span>Stop</span>
                          </a>
                          <a @click="freeze_container(container.name)" class="dropdown-item" v-if="container.status === 'Running'">
                            <span class="icon">
                              <i class="fa fa-pause"></i> 
                            </span>
                            <span>Freeze</span>
                          </a>
                          <a @click="thaw_container(container.name)" class="dropdown-item" v-if="container.status === 'Frozen'">
                            <span class="icon">
                              <i class="fa fa-play"></i> 
                            </span>
                            <span>Thaw</span>
                          </a>
                          <a @click="restart_container(container.name)" class="dropdown-item" v-if="container.status === 'Running'">
                            <span class="icon">
                              <i class="fa fa-refresh"></i> 
                            </span>
                            <span>Restart</span>
                          </a>
                          <a @click="snapshot_container(container.name)" class="dropdown-item" v-if="container.status === 'Stopped'">
                            <span class="icon">
                              <i class="fa fa-cubes"></i> 
                            </span>
                            <span>Snapshot</span>
                          </a>
                          <a @click="image_container(container.name)" class="dropdown-item" v-if="container.status === 'Stopped'">
                            <span class="icon">
                              <i class="fa fa-hdd-o"></i> 
                            </span>
                            <span>Image</span>
                          </a>
                          <hr class="dropdown-divider" v-if="container.status === 'Stopped'">
                          <a @click="delete_container(container.name)" class="dropdown-item" v-if="container.status === 'Stopped'">
                            <span class="icon">
                              <i class="fa fa-times"></i> 
                            </span>
                            <span>Delete</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <span v-if="!loading">No containers, you can <router-link :to="{ name: 'images' }">launch one from an image</router-link>.</span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
  // import _ from 'lodash'

  import helpers from '../mixins/helpers.js'
  import lxc from '../mixins/lxc.js'
  import MainHeader from './Layout/MainHeader'
  import EditContainer from './Containers/EditContainer'

  export default {
    name: 'containers-page',
    components: { MainHeader, EditContainer },
    mixins: [lxc, helpers],
    data () {
      return {
        loading: true,
        manageButton: [],
        search: null,
        search_result: null,
        containers: [],
        btn: {
          refresh_containers: false
        }
      }
    },
    mounted: function () {
      document.title = 'LXDui - Containers'

      this.$nextTick(() => {
        this.get_containers(() => {
          this.loading = false
        })
      })
    },
    methods: {
      manage_dropdown_close_all (name) {
        for (var prop in this.manageButton) {
          if (!name || (prop !== name && this.manageButton[prop] === true)) {
            this.manageButton[prop] = false
          }
        }
      },
      manage_dropdown_toggle (name) {
        this.manage_dropdown_close_all(name)
        this.$set(this.manageButton, name, !this.manageButton[name])
      },
      manage_dropdown_class (name) {
        return {
          'is-active': this.manageButton[name]
        }
      },
      /**
       *
       */
      refresh_containers () {
        //
        this.manage_dropdown_close_all()

        this.btn.refresh_containers = true
        this.get_containers(() => {
          this.btn.refresh_containers = false
        })
      },
      /**
       *
       */
      get_containers (callback) {
        this.lxc_list(null, (response) => {
          this.containers = response
          if (typeof callback === 'function') {
            callback()
          }
        })
      },
      /**
       *
       */
      start_container (name) {
        //
        this.manage_dropdown_close_all()

        this.lxc_start(name, (response) => {
          this.$notify({
            duration: 2000,
            title: 'Success',
            message: 'Container ' + name + ' started.',
            type: 'success'
          })
          //
          this.get_containers()
        })
      },
      /**
       *
       */
      stop_container (name) {
        //
        this.manage_dropdown_close_all()

        this.lxc_stop(name, (response) => {
          this.$notify({
            duration: 2000,
            title: 'Success',
            message: 'Container ' + name + ' stopped.',
            type: 'success'
          })
          //
          this.get_containers()
        })
      },
      /**
       *
       */
      delete_container (name) {
        //
        this.manage_dropdown_close_all()

        this.lxc_delete(name, (response) => {
          this.$notify({
            duration: 2000,
            title: 'Success',
            message: 'Container ' + name + ' deleted.',
            type: 'success'
          })
          //
          this.get_containers()
        })
      },
      /**
       *
       */
      handleSearchEvent (value) {
        //
        this.lxc_list(value, (response) => {
          this.search_result = response
        })
      },
      open (link) {
        this.manage_dropdown_close_all()

        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>

</style>
