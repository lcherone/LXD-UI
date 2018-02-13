<template>
  <div id="wrapper">

    <div class="container is-fluid">
      <main-header v-bind:current="this.$route.name" @search-event="handleSearchEvent"></main-header>

      <div id="content-wrapper">
        <div class="columns">
          <div class="column is-narrow">
            <aside class="menu">
              <p class="menu-label">
                General
              </p>
              <ul class="menu-list">
                <li><a class="is-active">Dashboard</a></li>
                <li><router-link :to="{ path: '/console/testing' }" target="_blank">Container</router-link></li>
              </ul>
              <p class="menu-label">
                Administration
              </p>
              <ul class="menu-list">
                <li><a>Team Settings</a></li>
                <li>
                  <a>Manage Your Team</a>
                  <ul>
                    <li><a>Members</a></li>
                    <li><a>Plugins</a></li>
                    <li><a>Add a member</a></li>
                  </ul>
                </li>
                <li><a>Invitations</a></li>
                <li><a>Cloud Storage Environment Settings</a></li>
                <li><a>Authentication</a></li>
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

            <pre>{{ info }}</pre>


            <div class="box">
              <article class="media">
                <div class="media-left">
                  <span class="icon is-large">
                    <i class="fa fa-3x fa-cog"></i>
                  </span>
                </div>
                <div class="media-content">
                  <div class="content">
                    <strong>Config</strong> <small>@johnsmith</small> <small>31m</small>
                    <ul>
                      <li v-for="(value, key) in info.server.config"><strong>{{ key }}:</strong> {{ value }}</li>
                    </ul>
                  </div>
                </div>
              </article>
            </div>

            <div class="box">
              <article class="media">
                <div class="media-left">
                  <span class="icon is-large">
                    <i class="fa fa-3x fa-cog"></i>
                  </span>
                </div>
                <div class="media-content">
                  <div class="content">
                    <strong>Environment</strong>
                    <table class="table is-fullwidth is-narrow is-striped">
                      <thead>
                        <tr>
                          <th>A</th>
                          <th>B</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>2</td>
                        </tr>
                      </tbody>
                    </table>
                    <ul>
                      <li v-for="(value, key) in info.server.environment"><strong>{{ key }}:</strong> {{ value }}</li>
                    </ul>
                  </div>
                </div>
              </article>
            </div>

            <h5>Config</h5>
            <p></p>
            <h5>Environment</h5>
            <h5>Public</h5>
            <h5>Extensions</h5>

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

            <article class="message is-success">
              <div class="message-header">
                <p>Success</p>
                <button class="delete" aria-label="delete"></button>
              </div>
              <div class="message-body">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum <a>felis venenatis</a> efficitur. Aenean ac <em>eleifend lacus</em>, in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
              </div>
            </article>
            <!--                        <div style="white-space: pre-wrap;">{{ this.$data }}</div>-->
          </div>
        </div>

      </div>



      <div style="margin-top:-10px">
        <div style="margin-bottom:10px">
          <strong class="subtitle is-5">Home</strong>
        </div>



        <h5>Config</h5>
        <h5>Environment</h5>
        <h5>Public</h5>
        <h5>Extensions</h5>

        <span class="icon">
          <i class="fa fa-home"></i>
        </span>

        <table class="table is-fullwidth is-narrow">
          <thead>
            <tr>
              <th>A</th>
              <th>B</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  // import _ from 'lodash'

  import lxc from '../mixins/lxc.js'
  import MainHeader from './Layout/MainHeader'

  export default {
    name: 'index-page',
    components: { MainHeader },
    mixins: [lxc],
    data () {
      return {
        search: null,
        search_result: null,
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
      var self = this
      //
      this.lxc_info('/', function (response) {
        self.info.server = response
      })
      //
      this.lxc_query('/1.0/resources', 'GET', null, function (response) {
        self.info.resources = response
      })
      //
      this.lxc_query('/1.0/containers', 'GET', null, function (response) {
        self.info.containers = response.length
      })
      //
      this.lxc_query('/1.0/profiles', 'GET', null, function (response) {
        self.info.profiles = response.length
      })
      //
      this.lxc_query('/1.0/images', 'GET', null, function (response) {
        self.info.images = response.length
      })
      //
    },
    methods: {
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
