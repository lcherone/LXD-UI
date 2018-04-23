<template>
  <div>
    <!-- Main header -->
    <main-header :current="$route.path"></main-header>

    <!-- Main element -->
    <el-main>
      <div class="columns">
        <div class="column is-narrow">
          <side-menu></side-menu>
        </div>
        <div class="column">
          <h6 class="title is-5">
            Dashboard
            <div class="is-pulled-right">
              <button 
                      class="button is-small is-info is-pulled-right" 
                      @click="refresh_cache"
                      v-bind:class="{ 'is-loading': btn.refreshing_cache }" 
                      :disabled="btn.refreshing_cache">
                <span class="icon">
                  <i class="fa fa-refresh"></i> 
                </span>
                <span>Refresh</span>
              </button>
            </div>
          </h6>
          <div class="columns" v-loading="loading">
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
                      <p class="title is-5">CPUs</p>
                      <p class="subtitle is-6" style="margin-top:-20px">
                        {{ info.resources.cpu.sockets[0].name }} - {{ info.resources.cpu.total }} @ {{ Number(info.resources.cpu.sockets[0].frequency_turbo / 1000).toFixed(2) }}GHz
                      </p>
                    </div>
                  </div>
                  <div class="content">
                    <div class="field is-grouped is-grouped-multiline">
                      <strong>Load:</strong>&nbsp;
                      <div style="display:flex;margin-bottom:10px">
                        <div class="control">
                          <div class="tags has-addons">
                            <span class="tag is-dark">1m</span>
                            <span class="tag" v-bind:class="tag_load_1m">{{ info.loadavg[0].toFixed(2) }}</span>
                          </div>
                        </div>&nbsp;
                        <div class="control">
                          <div class="tags has-addons">
                            <span class="tag is-dark">5m</span>
                            <span class="tag" v-bind:class="tag_load_5m">{{ info.loadavg[1].toFixed(2) }}</span>
                          </div>
                        </div>&nbsp;
                        <div class="control">
                          <div class="tags has-addons">
                            <span class="tag is-dark">15m</span>
                            <span class="tag" v-bind:class="tag_load_15m">{{ info.loadavg[2].toFixed(2) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
                      <p class="subtitle is-6"></p>
                    </div>
                  </div>
                  <div class="content">
                    <div class="field is-grouped is-grouped-multiline">
                      <strong>Usage:</strong>&nbsp;
                      <div style="display:flex;margin-bottom:10px">
                        <div class="control">
                          <div class="tags has-addons">
                            <span class="tag is-dark">Total</span>
                            <span class="tag is-info">{{ formatBytes(info.resources.memory.total) }}</span>
                          </div>
                        </div>&nbsp;
                        <div class="control">
                          <div class="tags has-addons">
                            <span class="tag is-dark">Used</span>
                            <span class="tag is-success">{{ formatBytes(info.resources.memory.used) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns" v-loading="loading">
            <div class="column">
              <div class="card">
                <header class="card-header">
                  <p class="card-header-title">
                    Containers&nbsp;&nbsp;
                    <span class="tag is-success" v-bind:class="tag_containers">{{ info.containers.length }}</span>
                  </p>
                  <router-link :to="{ path: '/containers' }" style="margin-right:10px;margin-top:10px;" class="has-text-right button is-small is-light"><i class="fa fa-list"></i></router-link>
                </header>
                <div v-for="container in containerList" class="panel-block noborder">
                  <edit-container :name="container">
                    {{ container }}
                  </edit-container>
                </div>
              </div>
              <div class="card" style="margin-top:20px">
                <header class="card-header">
                  <p class="card-header-title">
                    Profiles&nbsp;&nbsp;
                    <span class="tag is-success" v-bind:class="tag_profiles">{{ info.profiles.length }}</span>
                  </p>
                  <router-link :to="{ path: '/profiles' }" style="margin-right:10px;margin-top:10px;" class="has-text-right button is-small is-light"><i class="fa fa-list"></i></router-link>
                </header>
                <div v-for="profile in profileList" class="panel-block noborder">
                  <router-link :to="{ path: '/profiles/' + profile }">
                    {{ profile }}
                  </router-link>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="card">
                <header class="card-header">
                  <p class="card-header-title">
                    Images&nbsp;&nbsp;
                    <span class="tag is-success" v-bind:class="tag_images">{{ info.images.length }}</span>
                  </p>
                  <router-link :to="{ path: '/images' }" style="margin-right:10px;margin-top:10px;" class="has-text-right button is-small is-light"><i class="fa fa-list"></i></router-link>
                </header>
                <div v-for="image in info.images" class="panel-block noborder">
                  <edit-image :remote="'local'" :fingerprint="image.fingerprint" @on-save="load_remote_images('local')">
                    {{ image.properties.description }}
                  </edit-image>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
  import _ from 'lodash'
  import helpers from '../mixins/helpers.js'
  import lxc from '../mixins/lxc.js'
  import MainHeader from './Layout/MainHeader'
  import EditContainer from './Containers/EditContainer'
  import EditImage from './Images/EditImage'
  import SideMenu from './Layout/SideMenu'

  import ElectronStore from 'electron-store'
  const storage = new ElectronStore({
    cwd: 'lxd-ui'
  })

  const os = require('os')

  export default {
    name: 'index-page',
    components: { MainHeader, SideMenu, EditContainer, EditImage },
    mixins: [lxc, helpers],
    data () {
      return {
        loading: true,
        btn: {
          refreshing_cache: false
        },
        cache_time: Number(1000 * 86400),
        info: {
          loadavg: os.loadavg(),
          resources: {
            cpu: {
              sockets: [
                {
                  cores: 0,
                  frequency: 0,
                  frequency_turbo: 0,
                  name: null,
                  threads: 0,
                  vendor: null
                }
              ],
              total: 0
            },
            memory: {
              total: 0,
              used: 0
            },
            pool: {
              inodes: {
                total: 0,
                used: 0
              },
              space: {
                total: 0
              }
            }
          },
          server: {
            api_extensions: [],
            api_status: 'stable',
            api_version: '1.0',
            auth: null,
            auth_methods: [],
            config: {},
            environment: {
              addresses: [],
              architectures: [],
              certificate: null,
              certificate_fingerprint: null,
              driver: null,
              driver_version: null,
              kernel: null,
              kernel_architecture: null,
              kernel_version: null,
              server: null,
              server_pid: 0,
              server_version: null,
              storage: null,
              storage_version: null
            },
            public: false
          },
          containers: storage.get('info.containers', []),
          profiles: storage.get('info.profiles', []),
          certificates: [],
          images: storage.get('images.local', []),
          networks: [],
          operations: {},
          'storage-pools': []
        }
      }
    },
    filters: {
      ucfirst: function (value) {
        if (value) {
          return _.upperFirst(value)
        }
      }
    },
    computed: {
      containerList: function () {
        let ret = []
        for (let i in this.info.containers) {
          ret.push(this.info.containers[i].substring(this.info.containers[i].lastIndexOf('/') + 1))
        }
        return ret
      },
      profileList: function () {
        let ret = []
        for (let i in this.info.profiles) {
          ret.push(this.info.profiles[i].substring(this.info.profiles[i].lastIndexOf('/') + 1))
        }
        return ret
      },
      tag_load_1m: function () {
        if (this.info === undefined) {
          return {
            'is-light': true
          }
        }

        let cpus = this.info.resources.cpu.total
        let load = this.info.loadavg[0].toFixed(2)
        let actual = load / cpus

        if (actual === Infinity) {
          return {
            'is-light': true
          }
        }

        return {
          'is-success': _.inRange((load / cpus), 0, 0.75),
          'is-warning': _.inRange((load / cpus), 0.75, 1),
          'is-danger': _.inRange((load / cpus), 1, 100)
        }
      },
      tag_load_5m: function () {
        if (this.info === undefined) {
          return {
            'is-light': true
          }
        }

        let cpus = this.info.resources.cpu.total
        let load = this.info.loadavg[1].toFixed(2)
        let actual = load / cpus

        if (actual === Infinity) {
          return {
            'is-light': true
          }
        }

        return {
          'is-success': _.inRange((load / cpus), 0, 0.75),
          'is-warning': _.inRange((load / cpus), 0.75, 1),
          'is-danger': _.inRange((load / cpus), 1, 100)
        }
      },
      tag_load_15m: function () {
        if (this.info === undefined) {
          return {
            'is-light': true
          }
        }

        let cpus = this.info.resources.cpu.total
        let load = this.info.loadavg[2].toFixed(2)
        let actual = load / cpus

        if (actual === Infinity) {
          return {
            'is-light': true
          }
        }

        return {
          'is-success': _.inRange((load / cpus), 0, 0.75),
          'is-warning': _.inRange((load / cpus), 0.75, 1),
          'is-danger': _.inRange((load / cpus), 1, 100)
        }
      },
      tag_containers: function () {
        if (this.info === undefined || this.info.containers === undefined) {
          return {
            'is-light': true
          }
        }
        return {
          'is-light': this.info.containers.length === 0,
          'is-success': _.inRange(this.info.containers.length, 1, 5),
          'is-warning': _.inRange(this.info.containers.length, 6, 10),
          'is-danger': _.inRange(this.info.containers.length, 11, 1000)
        }
      },
      tag_profiles: function () {
        if (this.info === undefined || this.info.profiles === undefined) {
          return {
            'is-light': true
          }
        }
        return {
          'is-light': this.info.profiles.length === 0,
          'is-success': _.inRange(this.info.profiles.length, 1, 5),
          'is-warning': _.inRange(this.info.profiles.length, 6, 10),
          'is-danger': _.inRange(this.info.profiles.length, 11, 1000)
        }
      },
      tag_images: function () {
        if (this.info === undefined || this.info.images === undefined) {
          return {
            'is-light': true
          }
        }
        return {
          'is-light': this.info.images.length === 0,
          'is-success': _.inRange(this.info.images.length, 1, 5),
          'is-warning': _.inRange(this.info.images.length, 6, 10),
          'is-danger': _.inRange(this.info.images.length, 11, 1000)
        }
      }
    },
    mounted: function () {
      document.title = 'LXDui - Home'
      // this.$nextTick(() => {
      this.init()
      // })
    },
    methods: {
      /**
       *
       */
      refresh_cache () {
        storage.clear()
        this.init()
      },
      /**
       *
       */
      init () {
        // info.server
        this.get_info('server')

        // info.resources
        this.get_info('resources')

        // info.containers
        this.get_info('containers')

        // info.profiles
        this.get_info('profiles')

        // info.images
        this.load_remote_images('local')

        // update loadavg
        this.info.loadavg = os.loadavg()
      },
      /**
       *
       */
      get_info (type) {
        this.loading = true
        this.btn.refreshing_cache = true
        new Promise((resolve, reject) => {
          if (Date.now() - Number(storage.get('cache_time.' + type, 0)) > this.cache_time) {
            //
            this.lxc_query('/1.0' + (type === 'server' ? '' : '/' + type), 'GET', null, (response) => {
              storage.set('cache_time.' + type, Date.now())
              storage.set('info.' + type, response)
              resolve(response)
            })
          } else {
            resolve(storage.get('info.' + type))
          }
        }).then((response) => {
          this.info[type] = response
          this.btn.refreshing_cache = false
          this.loading = false
        })
      },
      /**
       *
       */
      load_remote_images (remote) {
        this.active_remote = remote
        this.active_distro = this.active_distro || 'Ubuntu'
        this.get_images(remote)
      },
      /**
       *
       */
      get_images (remote) {
        if (Date.now() - Number(storage.get('images_cached.' + remote, 0)) > this.cache_time) {
          //
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
            this.info.images = storage.get('images.local')
          })
        } else {
          this.info.images = storage.get('images.local')
        }
      }
    }
  }
</script>

<style scoped>
  .noborder {
    border-bottom: 1px solid #dbdbdb;
    border-left: 0px;
    border-right: 0px;
    padding: 0.3em 0.5em;
  }

  .card-footer-item.is-success {
    background-color: #23d160;
    border-color: transparent;
    color: #fff;
  }

  .media-content {
    overflow: hidden;
  }

  .el-header, .el-footer {
    background-color: #2b001d;
    color: #333;
    line-height: 33px;
    padding: 0
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    height: calc(100vh - 60px);
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .field.is-grouped > .control:not(:last-child) {
    margin-bottom: 0;
    margin-right: 0.40rem;
  }
</style>
