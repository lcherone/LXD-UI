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
        Images
        <div class="tabs is-small is-toggle is-pulled-right">
          <ul>
            <li v-bind:class="{ 'is-active': remote === active_remote }" v-for="remote in remotes">
              <a @click="load_remote_images(remote)"><span>{{ remote | ucfirst }}</span></a>
            </li>
          </ul>
        </div>
      </h6>
      <div class="box">
        <div class="card-content">
          <div style="margin-top:-5px" v-show="distros_list.length > 0">
            <div class="tabs is-small">
              <ul>
                <li v-bind:class="{ 'is-active': distro === active_distro }" @click="filter_distro(distro)" v-for="distro in distros_list"><a>{{ distro }}</a></li>
              </ul>
            </div>
            <table class="table is-fullwidth is-narrow" style="margin-top:-10px">
              <thead>
                <tr>
                  <th style="width:40%">Description</th>
                  <th style="width:12%">Version</th>
                  <th style="width:12%">Release</th>
                  <th style="width:12%">Size</th>
                  <th style="width:12%">Uploaded</th>
                  <th style="width:2%"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="image in image_list">
                  <td>{{ image.properties.description | ucfirst }}</td>
                  <td>{{ image.properties.version ? image.properties.version : '-' }}</td>
                  <td>{{ image.properties.release | ucfirst }}</td>
                  <td>{{ formatBytes(image.size) }}</td>
                  <td>{{ image.uploaded_at | formatDate }}</td>
                  <td>
                    <div style="display: flex">
                      <a v-show="active_remote === 'local'" class="button is-danger is-small" @click="delete_image(image.fingerprint)"><i class="fa fa-times"></i></a>
                      <launch-container v-bind:remote="active_remote" v-bind:fingerprint="image.fingerprint"></launch-container>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-show="distros_list.length === 0">
            <article class="message">
              <div class="message-body">
                <span v-show="active_remote === 'local'">Currently, there are no locally cached images.</span>
                <span v-show="active_remote !== 'local'">Oops! There was a problem when trying to fetch images from: {{ active_remote }}, check your internet connection and try again.</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
  import moment from 'moment'
  import _ from 'lodash'

  import helpers from '../mixins/helpers.js'
  import lxc from '../mixins/lxc.js'
  import MainHeader from './Layout/MainHeader'
  import LaunchContainer from './Images/LaunchContainer'

  import ElectronStore from 'electron-store'
  const storage = new ElectronStore({
    cwd: 'lxd-ui' // ,
    // encryptionKey: 'obfuscation'
  })

  export default {
    name: 'images-page',
    components: { MainHeader, LaunchContainer },
    mixins: [lxc, helpers],
    filters: {
      formatDate: function (value) {
        if (value) {
          return moment(String(value)).format('DD/MM/YYYY')
        }
      },
      ucfirst: function (value) {
        if (value) {
          return _.upperFirst(value)
        }
      }
    },
    data () {
      return {
        cache_time: Number(1000 * 86400),
        active_remote: 'local',
        active_distro: 'Ubuntu',
        search_result: null,
        remotes: [],
        distros: [],
        images: [],
        btn: {
          refresh_containers: false
        }
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        this.load_remote_images('local')
        //
        if (Date.now() - Number(storage.get('remotes_cached', 0)) > this.cache_time) {
          //
          this.lxc_remotes((response) => {
            this.remotes = response
            storage.set('remotes', response)
            storage.set('remotes_cached', Date.now())
          })
        } else {
          this.remotes = storage.get('remotes')
        }
      })
    },
    computed: {
      image_list: function () {
        return this.images.filter((row) => {
          if (_.lowerCase(this.active_distro) !== _.lowerCase(row.properties.os)) {
            return false
          }
          return row
        })
      },
      distros_list: function () {
        return _.uniq(this.distros)
      }
    },
    methods: {
      delete_image (fingerprint) {
        this.lxc_image_delete(fingerprint, (response) => {
          storage.set('images_cached.local', 0)
          this.load_remote_images('local')
        })
      },
      filter_distro (distro) {
        this.active_distro = distro
      },
      load_remote_images (remote) {
        this.active_remote = remote
        // default back to ubuntu
        this.active_distro = 'Ubuntu'
        this.get_images(remote)
      },
      /**
       *
       */
      get_images (remote) {
        //
        if (Date.now() - Number(storage.get('images_cached.' + remote, 0)) > this.cache_time) {
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
          })
        } else {
          this.images = storage.get('images.' + remote)
          this.distros = storage.get('images_distros.' + remote)
        }
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
