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
                      <p class="title is-5">CPUs</p>
                      <p class="subtitle is-6">
                        {{ info.resources.cpu.sockets[0].name }} - {{ info.resources.cpu.total }} @ {{ Number(info.resources.cpu.sockets[0].frequency_turbo / 1000).toFixed(2) }}GHz
                      </p>
                      <p style="margin-top:-6px">
                        <strong>Load:</strong> {{ info.loadavg[0].toFixed(2) }}, {{ info.loadavg[1].toFixed(2) }}, {{ info.loadavg[2].toFixed(2) }}
                      </p>
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
    </el-main>
  </div>
</template>

<script>
  // import _ from 'lodash'

  import helpers from '../mixins/helpers.js'
  import lxc from '../mixins/lxc.js'
  import MainHeader from './Layout/MainHeader'
  import SideMenu from './Layout/SideMenu'

  import ElectronStore from 'electron-store'
  const storage = new ElectronStore({
    cwd: 'lxd-ui' // ,
    // encryptionKey: 'obfuscation'
  })

  export default {
    name: 'index-page',
    components: { MainHeader, SideMenu },
    mixins: [lxc, helpers],
    data () {
      return {
        activeIndex: '/',
        info: {
          loadavg: require('os').loadavg(),
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
          containers: 0,
          profiles: 0,
          certificates: 0,
          images: 0,
          remotes: 0,
          networks: 0
        }
      }
    },
    mounted: function () {
      document.title = 'LXDui - Home'

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
    },
    methods: {
      arrayBufferToString (buffer) {
        var byteArray = new Uint8Array(buffer)
        var str = ''
        var cc = 0
        var numBytes = 0
        for (var i = 0, len = byteArray.length; i < len; ++i) {
          var v = byteArray[i]
          if (numBytes > 0) {
            // 2 bit determining that this is a tailing byte + 6 bit of payload
            if ((cc & 192) === 192) {
              // processing tailing-bytes
              cc = (cc << 6) | (v & 63)
            } else {
              throw new Error('this is no tailing-byte')
            }
          } else if (v < 128) {
            // single-byte
            numBytes = 1
            cc = v
          } else if (v < 192) {
            // these are tailing-bytes
            throw new Error('invalid byte, this is a tailing-byte')
          } else if (v < 224) {
            // 3 bits of header + 5bits of payload
            numBytes = 2
            cc = v & 31
          } else if (v < 240) {
            // 4 bits of header + 4bit of payload
            numBytes = 3
            cc = v & 15
          } else {
            // UTF-8 theoretically supports up to 8 bytes containing up to 42bit of payload
            // but JS can only handle 16bit.
            throw new Error('invalid encoding, value out of range')
          }
          if (--numBytes === 0) {
            str += String.fromCharCode(cc)
          }
        }
        if (numBytes) {
          throw new Error('the bytes don\'t sum up')
        }
        return str
      }
    }
  }
</script>

<style scoped>
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
</style>
