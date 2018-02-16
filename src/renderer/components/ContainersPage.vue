<template>
  <div>
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
                class="button is-small is-primary is-pulled-right" 
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
        <div class="card-content">
          <div v-show="containers.length > 0">
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
                    <edit-container v-bind:name="container.name" @on-save="refresh_containers()">{{ container.name }}</edit-container>
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
                    <span class="has-text-success" v-show="container.status === 'Running'">Running</span>
                    <span class="has-text-danger" v-show="container.status === 'Stopped'">Stopped</span>
                  </td>
                  <td>
                    <div style="display: flex">
                      <router-link class="button is-small is-info" v-show="container.status === 'Running'" :to="{ path: '/console/' + container.name }" target="_blank" title="Open terminal">
                        <span class="icon">
                          <i class="fa fa-terminal"></i> 
                        </span>
                      </router-link>
                      <button class="button is-small is-warning" v-show="container.status === 'Running'" @click="stop_container(container.name)" title="Stop">
                        <span class="icon">
                          <i class="fa fa-stop"></i> 
                        </span>
                      </button>
                      <button class="button is-small is-success" v-show="container.status === 'Stopped'" @click="start_container(container.name)" title="Start">
                        <span class="icon">
                          <i class="fa fa-play"></i> 
                        </span>
                      </button>
                      <button class="button is-small is-danger" v-show="container.status === 'Stopped'" @click="delete_container(container.name)" title="Delete">
                        <span class="icon">
                          <i class="fa fa-times"></i> 
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-show="containers.length === 0">
            No containers, you can <router-link :to="{ name: 'images' }">launch one from an image</router-link>.
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
        search: null,
        search_result: null,
        containers: [],
        btn: {
          refresh_containers: false
        }
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        this.get_containers()
      })
    },
    methods: {
      /**
       *
       */
      refresh_containers () {
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
        this.lxc_start(name, (response) => {
          //
          this.get_containers()
        })
      },
      /**
       *
       */
      stop_container (name) {
        this.lxc_stop(name, (response) => {
          //
          this.get_containers()
        })
      },
      /**
       *
       */
      delete_container (name) {
        this.lxc_delete(name, (response) => {
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
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>

</style>
