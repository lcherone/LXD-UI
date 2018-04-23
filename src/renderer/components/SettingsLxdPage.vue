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
            LXD Settings
            <div class="is-pulled-right">
              <button class="button is-small is-link" @click="set_default">
                <span class="icon">
                  <i class="fa fa-list"></i> 
                </span>
                <span>Set Default</span>
              </button>
              <button class="button is-small is-success" @click="save">
                <span class="icon">
                  <i class="fa fa-check"></i> 
                </span>
                <span>Save</span>
              </button>
            </div>
          </h6>
          <div class="box">
            <div class="card-content">
              <h5 class="title is-5" style="margin-bottom:10px">Core</h5>
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="name">Trust Password ({{ lxd.config && lxd.config['core.trust_password'] ? 'Currently set' : 'Not set' }})</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <el-input placeholder="Password to be provided by clients to setup a trust..." v-model="trust_password"></el-input>
                    </p>
                  </div>
                </div>
              </div>  
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="name">Bind Address</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <el-input placeholder="Address to bind for the remote API..." v-model="lxd.config['core.https_address']"></el-input>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="card-content">
              <h5 class="title is-5" style="margin-bottom:10px">CORS</h5>
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="name">Allowed Credentials</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <el-select v-model="lxd.config['core.https_allowed_credentials']" placeholder="Address to bind for the remote API">
                        <el-option v-for="item in [{value: true, label: 'True'}, {value: false, label: 'False'}]"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </p>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="name">Allowed Headers</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <el-input placeholder="Access-Control-Allow-Headers http header value... Origin, X-Requested-With, Content-Type, Accept" v-model="lxd.config['core.https_allowed_headers']"></el-input>
                    </p>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="name">Allowed Methods</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <el-input placeholder="Access-Control-Allow-Methods http header value... GET, POST, PUT, DELETE, OPTIONS" v-model="lxd.config['core.https_allowed_methods']"></el-input>
                    </p>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="name">Allowed Origin</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <el-input placeholder="Access-Control-Allow-Origin http header value... *" v-model="lxd.config['core.https_allowed_origin']"></el-input>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="card-content">
              <h5 class="title is-5" style="margin-bottom:10px">Proxy</h5>
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="name">HTTPS</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <el-input placeholder="https proxy to use, if any (falls back to HTTPS_PROXY environment variable)..." v-model="lxd.config['core.proxy_https']"></el-input>
                    </p>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="name">HTTP</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <el-input placeholder="http proxy to use, if any (falls back to HTTP_PROXY environment variable)..." v-model="lxd.config['core.proxy_http']"></el-input>
                    </p>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="name">Ignore Hosts</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <el-input placeholder="hosts which don't need the proxy for use (similar format to NO_PROXY, e.g. 1.2.3.4,1.2.3.5, falls back to NO_PROXY environment variable)..." v-model="lxd.config['core.proxy_ignore_hosts']"></el-input>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="card-content">
              <h5 class="title is-5" style="margin-bottom:10px">Images</h5>
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="name">Auto Update Cached</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <el-select v-model="lxd.config['images.auto_update_cached']" placeholder="Whether to automatically update any image that LXD caches">
                        <el-option v-for="item in [{value: true, label: 'True'}, {value: false, label: 'False'}]"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </p>
                  </div>
                </div>
              </div>  
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="name">Auto Update Interval</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <el-input-number v-model="lxd.config['images.auto_update_interval']" controls-position="right" :min="0" :max="10" placeholder="Interval in hours at which to look for update to cached images (0 disables it)..."></el-input-number>
                    </p>
                  </div>
                </div>
              </div>   
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="name">Compression Algorithm</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <el-select v-model="lxd.config['images.compression_algorithm']" placeholder="Compression algorithm to use for new images (bzip2, gzip, lzma, xz or none)...">
                        <el-option v-for="item in [{value: 'bzip2', label: 'bzip2'}, {value: 'gzip', label: 'gzip'}, {value: 'lzma', label: 'lzma'}, {value: 'xz', label: 'xz'}, {value: 'none', label: 'none'}]"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </p>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="field-label is-normal">
                  <label style="text-align: left" class="label" for="name">Remote Cache Expiry</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <el-input-number v-model="lxd.config['images.remote_cache_expiry']" controls-position="right" :min="1" :max="360" placeholder="Number of days after which an unused cached remote image will be flushed..."></el-input-number>
                    </p>
                  </div>
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
  import lxc from '../mixins/lxc.js'
  import MainHeader from './Layout/MainHeader'
  import SideMenu from './Layout/SideMenu'

  const lxcQuery = require('lxc-query')

  const lxdConfig = {
    'core.trust_password': false,
    'core.https_address': '[::]:8443',
    'core.https_allowed_credentials': true,
    'core.https_allowed_headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'core.https_allowed_methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'core.https_allowed_origin': '*',
    'core.proxy_https': '',
    'core.proxy_http': '',
    'core.proxy_ignore_hosts': '',
    'images.auto_update_cached': true,
    'images.auto_update_interval': 6,
    'images.compression_algorithm': 'none',
    'images.remote_cache_expiry': 10
  }

  export default {
    name: 'lxd-settings-page',
    components: { MainHeader, SideMenu },
    mixins: [lxc],
    data () {
      return {
        trust_password: '',
        lxd: {
          config: lxdConfig
        }
      }
    },
    mounted: function () {
      document.title = 'LXDui - Settings - LXD'
      this.get_config()
    },
    methods: {
      /**
       *
       */
      set_default () {
        this.lxd.config = {
          'core.trust_password': this.lxd.config['core.trust_password'],
          'core.https_address': '[::]:8443',
          'core.https_allowed_credentials': true,
          'core.https_allowed_headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'core.https_allowed_methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'core.https_allowed_origin': '*',
          'core.proxy_https': '',
          'core.proxy_http': '',
          'core.proxy_ignore_hosts': '',
          'images.auto_update_cached': true,
          'images.auto_update_interval': 6,
          'images.compression_algorithm': 'none',
          'images.remote_cache_expiry': 10
        }
      },
      /**
       *
       */
      get_config () {
        lxcQuery.query('local:/1.0', 'GET', {}).then(response => {
          this.lxd = response
          this.lxd.config = {
            'core.trust_password': Boolean(response.config['core.trust_password']),
            'core.https_address': (response.config['core.https_address'] ? String(response.config['core.https_address']) : ''),
            'core.https_allowed_credentials': Boolean(response.config['core.https_allowed_credentials']),
            'core.https_allowed_headers': (response.config['core.https_allowed_headers'] ? String(response.config['core.https_allowed_headers']) : ''),
            'core.https_allowed_methods': (response.config['core.https_allowed_methods'] ? String(response.config['core.https_allowed_methods']) : ''),
            'core.https_allowed_origin': (response.config['core.https_allowed_origin'] ? String(response.config['core.https_allowed_origin']) : ''),
            'core.proxy_https': (response.config['core.proxy_https'] ? String(response.config['core.proxy_https']) : ''),
            'core.proxy_http': (response.config['core.proxy_http'] ? String(response.config['core.proxy_http']) : ''),
            'core.proxy_ignore_hosts': (response.config['core.proxy_ignore_hosts'] ? String(response.config['core.proxy_ignore_hosts']) : ''),
            'images.auto_update_cached': Boolean(response.config['images.auto_update_cached']),
            'images.auto_update_interval': (response.config['images.auto_update_interval'] ? Number(response.config['images.auto_update_interval']) : 6),
            'images.compression_algorithm': (response.config['images.compression_algorithm'] ? String(response.config['images.compression_algorithm']) : 'none'),
            'images.remote_cache_expiry': (response.config['images.remote_cache_expiry'] ? Number(response.config['images.remote_cache_expiry']) : 10)
          }
        })
      },
      /**
       *
       */
      save () {
        // 'core.https_address': '[::]:8443'
        if (this.lxd.config.hasOwnProperty('core.https_address')) {
          this.lxd.config['core.https_address'] = String(this.lxd.config['core.https_address'])
          this.lxc_config_set('core.https_address', this.lxd.config['core.https_address'], () => {})
        } else {
          this.lxc_config_unset('core.https_address', () => {})
        }

        // 'core.https_allowed_credentials': true
        if (this.lxd.config.hasOwnProperty('core.https_allowed_credentials')) {
          if (this.lxd.config['core.https_allowed_credentials']) {
            this.lxc_config_set('core.https_allowed_credentials', true, () => {})
          } else {
            this.lxc_config_unset('core.https_allowed_credentials', () => {})
          }
        } else {
          this.lxc_config_unset('core.https_allowed_credentials', () => {})
        }

        // 'core.https_allowed_headers': 'Origin, X-Requested-With, Content-Type, Accept'
        if (this.lxd.config.hasOwnProperty('core.https_allowed_headers')) {
          if (this.lxd.config['core.https_allowed_headers']) {
            this.lxc_config_set('core.https_allowed_headers', this.lxd.config['core.https_allowed_headers'], () => {})
          } else {
            this.lxc_config_unset('core.https_allowed_headers', () => {})
          }
        } else {
          this.lxc_config_unset('core.https_allowed_headers', () => {})
        }

        // 'core.https_allowed_methods': 'GET, POST, PUT, DELETE, OPTIONS'
        if (this.lxd.config.hasOwnProperty('core.https_allowed_methods')) {
          if (this.lxd.config['core.https_allowed_methods']) {
            this.lxc_config_set('core.https_allowed_methods', this.lxd.config['core.https_allowed_methods'], () => {})
          } else {
            this.lxc_config_unset('core.https_allowed_methods', () => {})
          }
        } else {
          this.lxc_config_unset('core.https_allowed_methods', () => {})
        }

        // 'core.https_allowed_origin': '*'
        if (this.lxd.config.hasOwnProperty('core.https_allowed_origin')) {
          if (this.lxd.config['core.https_allowed_origin']) {
            this.lxc_config_set('core.https_allowed_origin', this.lxd.config['core.https_allowed_origin'], () => {})
          } else {
            this.lxc_config_unset('core.https_allowed_origin', () => {})
          }
        } else {
          this.lxc_config_unset('core.https_allowed_origin', () => {})
        }

        // 'core.proxy_https': 'https://123.123.123.123:8080'
        if (this.lxd.config.hasOwnProperty('core.proxy_https')) {
          if (this.lxd.config['core.proxy_https']) {
            this.lxc_config_set('core.proxy_https', this.lxd.config['core.proxy_https'], () => {})
          } else {
            this.lxc_config_unset('core.proxy_https', () => {})
          }
        } else {
          this.lxc_config_unset('core.proxy_https', () => {})
        }

        // 'core.proxy_http': 'http://123.123.123.123:8080'
        if (this.lxd.config.hasOwnProperty('core.proxy_http')) {
          if (this.lxd.config['core.proxy_http']) {
            this.lxc_config_set('core.proxy_http', this.lxd.config['core.proxy_http'], () => {})
          } else {
            this.lxc_config_unset('core.proxy_http', () => {})
          }
        } else {
          this.lxc_config_unset('core.proxy_http', () => {})
        }

        // 'core.proxy_ignore_hosts': '10.0.0.1, ...'
        if (this.lxd.config.hasOwnProperty('core.proxy_ignore_hosts')) {
          if (this.lxd.config['core.proxy_ignore_hosts']) {
            this.lxc_config_set('core.proxy_ignore_hosts', this.lxd.config['core.proxy_ignore_hosts'], () => {})
          } else {
            this.lxc_config_unset('core.proxy_ignore_hosts', () => {})
          }
        } else {
          this.lxc_config_unset('core.proxy_ignore_hosts', () => {})
        }

        // 'images.auto_update_cached': true
        if (this.lxd.config.hasOwnProperty('images.auto_update_cached')) {
          if (this.lxd.config['images.auto_update_cached']) {
            this.lxc_config_set('images.auto_update_cached', true, () => {})
          } else {
            this.lxc_config_unset('images.auto_update_cached', () => {})
          }
        } else {
          this.lxc_config_unset('images.auto_update_cached', () => {})
        }

        // 'images.auto_update_interval': 6
        if (this.lxd.config.hasOwnProperty('images.auto_update_interval')) {
          if (this.lxd.config['images.auto_update_interval'] && this.lxd.config['images.auto_update_interval'] !== 6) {
            this.lxc_config_set('images.auto_update_interval', Number(this.lxd.config['images.auto_update_interval']), () => {})
          } else if (this.lxd.config['images.auto_update_interval'] === 6) {
            this.lxc_config_unset('images.auto_update_interval', () => {})
          } else {
            this.lxc_config_unset('images.auto_update_interval', () => {})
          }
        } else {
          this.lxc_config_unset('images.auto_update_interval', () => {})
        }

        // 'images.compression_algorithm': 'none'
        if (this.lxd.config.hasOwnProperty('images.compression_algorithm')) {
          if (this.lxd.config['images.compression_algorithm'] && this.lxd.config['images.compression_algorithm'] !== 'none') {
            this.lxc_config_set('images.compression_algorithm', this.lxd.config['images.compression_algorithm'], () => {})
          } else if (this.lxd.config['images.compression_algorithm'] === 'none') {
            this.lxc_config_unset('images.compression_algorithm', () => {})
          } else {
            this.lxc_config_unset('images.compression_algorithm', () => {})
          }
        } else {
          this.lxc_config_unset('images.compression_algorithm', () => {})
        }

        // 'images.remote_cache_expiry': 10
        if (this.lxd.config.hasOwnProperty('images.remote_cache_expiry') && Number(this.lxd.config['images.remote_cache_expiry']) !== 10) {
          if (this.lxd.config['images.remote_cache_expiry']) {
            this.lxc_config_set('images.remote_cache_expiry', Number(this.lxd.config['images.remote_cache_expiry']), () => {})
          } else if (Number(this.lxd.config['images.remote_cache_expiry']) === 10) {
            this.lxc_config_unset('images.remote_cache_expiry', () => {})
          } else {
            this.lxc_config_unset('images.remote_cache_expiry', () => {})
          }
        } else {
          this.lxc_config_unset('images.remote_cache_expiry', () => {})
        }

        // 'core.trust_password': ''
        if (this.trust_password !== '') {
          this.lxc_config_set('core.trust_password', this.trust_password, () => {})
        }

        this.$notify({
          duration: 1200,
          title: 'Success',
          message: 'LXD settings updated.',
          type: 'success'
        })
      }
    }
  }
</script>

<style scoped>

</style>