<template>
  <div id="wrapper">
    <div class="container is-fluid">
      <main-header v-bind:current="$route.name" @search-event="handleSearchEvent"></main-header>
      <div id="content-wrapper">
        <div class="columns">
          <div class="column">
            <strong class="title is-5">
              <span class="icon">
                <i class="fa fa-cubes"></i>
              </span>
              Containers
            </strong>
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
            <table class="table is-fullwidth is-narrow" style="margin-top:10px">
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
                    <router-link v-show="container.status === 'Running'" :to="{ path: '/console/' + container.name }" target="_blank">{{ container.name }}</router-link>
                    <span v-show="container.status === 'Stopped'">{{ container.name }}</span>
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
                    <span class="tag is-success" v-show="container.status === 'Running'">Running</span>
                    <span class="tag is-danger" v-show="container.status === 'Stopped'">Stopped</span>
                  </td>
                  <td>
                    <button class="button is-small is-danger" v-show="container.status == 'Running'" @click="stop_container(container.name)">
                      <span class="icon">
                        <i class="fa fa-stop"></i> 
                      </span>
                      <span>Stop</span>
                    </button>
                    <button class="button is-small is-success" v-show="container.status == 'Stopped'" @click="start_container(container.name)">
                      <span class="icon">
                        <i class="fa fa-play"></i> 
                      </span>
                      <span>Start</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import _ from 'lodash'

  import helpers from '../mixins/helpers.js'
  import lxc from '../mixins/lxc.js'
  import MainHeader from './Layout/MainHeader'

  export default {
    name: 'containers-page',
    components: { MainHeader },
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

  #content-wrapper {
    margin-top: -20px;
  }

  .card-footer-item.is-success {
    background-color: #23d160;
    border-color: transparent;
    color: #fff;
  }
</style>
