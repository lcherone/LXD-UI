<template>
  <div id="wrapper">

    <div class="container is-fluid">
      <main-header v-bind:current="this.$route.name" @search-event="handleSearchEvent"></main-header>

      <div id="content-wrapper">
        <div class="columns">
          <div class="column is-narrow">
            <aside class="menu" style="width: 200px;">
              <p class="menu-label">
                General
              </p>
              <ul class="menu-list">
                <li><a class="is-active">Home</a></li>
                <li><router-link :to="{ path: '/console/testing' }" target="_blank">Container</router-link></li>
              </ul>
              <p class="menu-label">
                Administration
              </p>
              <ul class="menu-list">
                <li><a>Settings</a></li>
              </ul>
              <p class="menu-label">
                Transactions
              </p>
              <ul class="menu-list">
                <li><a>Payments</a></li>
                <li><a>Transfers</a></li>
                <li><a>Balance</a></li>
              </ul>
            </aside>
          </div>
          <div class="column">
            <h6 class="title is-6">Dashboard</h6>

            <div class="columns">
              <div class="column">
                <div class="card">
                  <div class="card-content">
                    <div class="media">
                      <div class="media-left">
                        <span class="icon is-large">
                          <i class="fa fa-3x fa-shield"></i>
                        </span>
                      </div>
                      <div class="media-content">
                        <p class="title is-4">CPUs</p>
                        <p class="subtitle is-6">
                          {{ info.resources.cpu.sockets[0].name }} - {{ info.resources.cpu.total }} @ {{ Number(info.resources.cpu.sockets[0].frequency_turbo / 1000).toFixed(2) }}GHz
                        </p>
                      </div>
                    </div>
                    <div class="content">
                      <strong>Load averages:</strong> {{ info.loadavg[0].toFixed(2) }}, {{ info.loadavg[1].toFixed(2) }}, {{ info.loadavg[2].toFixed(2) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="card">
                  <div class="card-content">
                    <div class="media">
                      <div class="media-left">
                        <span class="icon is-large">
                          <i class="fa fa-3x fa-microchip"></i>
                        </span>
                      </div>
                      <div class="media-content">
                        <p class="title is-4">Memory</p>
                        <p class="subtitle is-6">{{ formatBytes(info.resources.memory.total) }}</p>
                      </div>
                    </div>
                    <div class="content">
                      <strong>Total:</strong> {{ formatBytes(info.resources.memory.total) }}
                      <strong>Used:</strong> {{ formatBytes(info.resources.memory.used) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="columns">
              <div class="column">
                <div class="card">
                  <header class="card-header">
                    <p class="card-header-title">
                      Containers {{ info.containers }}
                    </p>
                  </header>
                  <footer class="card-footer">
                    <a href="#" class="card-footer-item is-success">
                      <span class="icon">
                        <i class="fa fa-plus"></i>
                      </span>
                      New
                    </a>
                  </footer>
                </div>
              </div>
              <div class="column">
                <div class="card">
                  <header class="card-header">
                    <p class="card-header-title">
                      Profiles {{ info.profiles }}
                    </p>
                  </header>
                  <footer class="card-footer">
                    <a href="#" class="card-footer-item is-success">
                      <span class="icon">
                        <i class="fa fa-plus"></i>
                      </span>
                      New
                    </a>
                  </footer>
                </div>
              </div>
              <div class="column">
                <div class="card">
                  <header class="card-header">
                    <p class="card-header-title">
                      Images {{ info.images }}
                    </p>
                  </header>
                  <footer class="card-footer">
                    <a href="#" class="card-footer-item is-success">
                      <span class="icon">
                        <i class="fa fa-plus"></i>
                      </span>
                      New
                    </a>
                  </footer>
                </div>
              </div>
            </div>
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

  import ElectronStore from 'electron-store'
  const storage = new ElectronStore({
    cwd: 'lxd-ui',
    encryptionKey: 'obfuscation'
  })

  export default {
    name: 'index-page',
    components: { MainHeader },
    mixins: [lxc, helpers],
    data () {
      return {
        search: null,
        search_result: null,
        info: {
          loadavg: require('os').loadavg(),
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
      //
      let cacheTime = 0

      // info.server
      // cacheTime = 1 day
      cacheTime = Number(1000 * 86400)
      if (Date.now() - Number(storage.get('info.server.cached', 0)) > cacheTime) {
        this.lxc_info('/', (response) => {
          this.info.server = response
          response.cached = Date.now()
          storage.set('info.server', response)
        })
      } else {
        this.info.server = storage.get('info.server')
      }

      // info.resources
      // cacheTime = 1 day
      cacheTime = Number(1000 * 86400)
      if (Date.now() - Number(storage.get('info.resources.cached', 0)) > cacheTime) {
        //
        this.lxc_query('/1.0/resources', 'GET', null, (response) => {
          this.info.resources = response
          response.cached = Date.now()
          storage.set('info.resources', response)
        })
      } else {
        this.info.resources = storage.get('info.resources')
      }

      // info.containers
      // cacheTime = 1 day
      cacheTime = Number(1000 * 86400)
      if (Date.now() - Number(storage.get('info.containers.cached', 0)) > cacheTime) {
        //
        this.lxc_query('/1.0/containers', 'GET', null, (response) => {
          this.info.containers = response.length
          response.cached = Date.now()
          storage.set('info.containers', response)
        })
      } else {
        this.info.containers = storage.get('info.containers')
      }

      // info.profiles
      // cacheTime = 1 day
      cacheTime = Number(1000 * 86400)
      if (Date.now() - Number(storage.get('info.profiles.cached', 0)) > cacheTime) {
        //
        this.lxc_query('/1.0/profiles', 'GET', null, (response) => {
          this.info.profiles = response.length
          response.cached = Date.now()
          storage.set('info.profiles', response)
        })
      } else {
        this.info.profiles = storage.get('info.profiles')
      }

      // info.images
      // cacheTime = 1 day
      cacheTime = Number(1000 * 86400)
      if (Date.now() - Number(storage.get('info.images.cached', 0)) > cacheTime) {
        //
        this.lxc_query('/1.0/images', 'GET', null, (response) => {
          this.info.images = response.length
          response.cached = Date.now()
          storage.set('info.images', response)
        })
      } else {
        this.info.images = storage.get('info.images')
      }

      this.foo()
    },
    methods: {
      foo () {
        storage.set('unicorn', '🦄')
        console.log(this.$electron.remote.app.getPath('userData'))
        // console.log(storage.openInEditor())
      },
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

  .media-content {
    overflow: hidden;
  }
</style>
