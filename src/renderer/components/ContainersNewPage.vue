<template>
  <div id="wrapper">
    <div class="container is-fluid">
      <main-header v-bind:current="this.$route.name" @search-event="handleSearchEvent"></main-header>
      <div id="content-wrapper">
        <div class="columns">
          <div class="column">
            <strong class="title is-5">
              <span class="icon">
                <i class="fa fa-cubes"></i>
              </span>
              Containers
            </strong>
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
                    <router-link :to="{ path: '/console/' + container.name }" target="_blank">{{ container.name }}</router-link>
                  </td>
                  <td>{{ container.network ? container.network.eth0.addresses[0].address : '-' }}</td>
                  <td>{{ container.cpu.usage !== 0 ? container.cpu.usage : '-' }}</td>
                  <td>{{ container.memory.usage !== 0 ? container.memory.usage : '-' }}</td>
                  <td>{{ container.status }}</td>
                  <td>
                    <button class="button is-small is-danger" v-show="container.status == 'Running'" @click="stop_container(container.name)">Stop</button>
                    <button class="button is-small is-success" v-show="container.status == 'Stopped'" @click="start_container(container.name)">Start</button>
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

  import lxc from '../mixins/lxc.js'
  import MainHeader from './Layout/MainHeader'

  export default {
    name: 'containers-page',
    components: { MainHeader },
    mixins: [lxc],
    data () {
      return {
        search: null,
        search_result: null,
        containers: [],
        info: {
          server: {config: null},
          resources: null,
          containers: null,
          profiles: null,
          certificates: null,
          images: null,
          remotes: null,
          networks: null
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.get_containers()
      })
    },
    methods: {
      get_containers () {
        this.containers = []
        var self = this
        this.lxc_query('/1.0/containers', 'GET', null, function (response) {
          for (var key in response) {
            var name = response[key].substr(response[key].lastIndexOf('/') + 1)
            self.lxc_query(response[key] + '/state', 'GET', null, function (response, index) {
              response.name = index
              self.containers.push(response)
            }, name)
          }
        })
      },
      start_container (name) {
        var self = this
        this.lxc_start(name, function (response) {
          //
          self.get_containers()
        })
      },
      stop_container (name) {
        var self = this
        this.lxc_stop(name, function (response) {
          //
          self.get_containers()
        })
      },
      handleSearchEvent (value) {
        var self = this
        //
        this.lxc_list(value, function (response) {
          self.search_result = response
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
