<template>
  <div id="wrapper">
    <div class="container is-fluid">
      <main-header v-bind:current="$route.name" @search-event="handleSearchEvent"></main-header>
      <div id="content-wrapper">
        <div class="columns">
          <div class="column">
            <strong class="title is-5">
              <span class="icon">
                <i class="fa fa-cogs"></i>
              </span>
              Images
            </strong>
            <div class="tabs is-small is-toggle is-pulled-right">
              <ul>
                <li v-bind:class="{ 'is-active': show_images === 'local' }">
                  <a @click="show_images_table('local')"><span>Local</span></a>
                </li>
                <li v-bind:class="{ 'is-active': show_images === 'public' }">
                  <a @click="show_images_table('public')"><span>Public</span></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Local Images -->
        <div style="margin-top:-10px" v-show="show_images === 'local'">
          <div class="tabs is-small">
            <ul>
              <li v-bind:class="{ 'is-active': disto === show_distro }" @click="filter_distro(disto)" v-for="disto in distos_list"><a>{{ disto }}</a></li>
            </ul>
          </div>
          <table class="table is-fullwidth is-narrow">
            <thead>
              <tr>
                <th style="width:39%">Description</th>
                <th style="width:10%">Version</th>
                <th style="width:10%">OS</th>
                <th style="width:10%">Release</th>
                <th style="width:10%">Size</th>
                <th style="width:20%">Uploaded</th>
                <th style="width:1%"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="image in local_images">
                <td>{{ image.properties.description | ucfirst }}</td>
                <td>{{ image.properties.version ? image.properties.version : '-' }}</td>
                <td>{{ image.properties.os | ucfirst }}</td>
                <td>{{ image.properties.release | ucfirst }}</td>
                <td>{{ formatBytes(image.size) }}</td>
                <td>{{ image.uploaded_at | formatDate }}</td>
                <td><a class="button is-primary is-small">Launch</a></td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Public Images -->
        <div style="margin-top:-10px" v-show="show_images === 'public'">
          <div class="tabs is-small">
            <ul>
              <li v-bind:class="{ 'is-active': disto === show_distro }" @click="filter_distro(disto)" v-for="disto in distos_list"><a>{{ disto }}</a></li>
            </ul>
          </div>
          <table class="table is-fullwidth is-narrow">
            <thead>
              <tr>
                <th style="width:39%">Description</th>
                <th style="width:10%">Version</th>
                <th style="width:10%">OS</th>
                <th style="width:10%">Release</th>
                <th style="width:10%">Size</th>
                <th style="width:20%">Uploaded</th>
                <th style="width:1%"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="image in public_images">
                <td>{{ image.properties.description | ucfirst }}</td>
                <td>{{ image.properties.version ? image.properties.version : '-' }}</td>
                <td>{{ image.properties.os | ucfirst }}</td>
                <td>{{ image.properties.release | ucfirst }}</td>
                <td>{{ formatBytes(image.size) }}</td>
                <td>{{ image.uploaded_at | formatDate }}</td>
                <td><a class="button is-primary is-small">Launch</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import _ from 'lodash'

  import helpers from '../mixins/helpers.js'
  import lxc from '../mixins/lxc.js'
  import MainHeader from './Layout/MainHeader'

  export default {
    name: 'images-page',
    components: { MainHeader },
    mixins: [lxc, helpers],
    filters: {
      formatDate: function (value) {
        if (value) {
          return moment(String(value)).format('DD/MM/YYYY h:mma')
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
        show_images: 'local',
        show_distro: 'Ubuntu',
        search_result: null,
        distos: [],
        images: [],
        btn: {
          refresh_containers: false
        }
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        this.get_local_images()
      })
    },
    computed: {
      local_images: function () {
        if (this.show_images !== 'local') {
          return []
        }
        return this.images.filter((row) => {
          if (_.lowerCase(this.show_distro) !== _.lowerCase(row.properties.os)) {
            return false
          }
          return row
        })
      },
      public_images: function () {
        if (this.show_images !== 'public') {
          return []
        }
        return this.images.filter((row) => {
          if (_.lowerCase(this.show_distro) !== _.lowerCase(row.properties.os)) {
            return false
          }
          return row
        })
      },
      distos_list: function () {
        return _.uniq(this.distos)
      }
    },
    methods: {
      filter_distro (distro) {
        this.show_distro = distro
      },
      show_images_table (location) {
        this.show_images = location
        this.show_distro = 'Ubuntu'

        if (location === 'local') {
          this.get_local_images()
        } else {
          this.get_public_images()
        }
      },
      /**
       *
       */
      get_local_images (callback) {
        this.lxc_images('local:', (response) => {
          console.log(response)
          this.distos = []
          this.images = []
          for (var key in response) {
            this.images.push(response[key])
            this.distos.push(_.upperFirst(response[key].properties.os))
          }
        })
      },
      /**
       *
       */
      get_public_images (callback) {
        this.lxc_images('images:', (response) => {
          this.distos = []
          this.images = []
          for (var key in response) {
            this.images.push(response[key])
            this.distos.push(_.upperFirst(response[key].properties.os))
          }
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

</style>
