<template>
  <div id="wrapper">
    <div class="container is-fluid">
      <main-header v-bind:current="$route.name" @search-event="handleSearchEvent"></main-header>
      <div id="content-wrapper">
        <div class="columns">
          <div class="column">
            <div class="columns">
              <div class="column is-narrow">
                <side-menu></side-menu>
              </div>
              <div class="column">
                <h6 class="title is-6">Settings</h6>

                <p>This is a placeholder page for any settings which may be added later.</p>
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
  import SideMenu from './Layout/SideMenu'

  export default {
    name: 'settings-page',
    components: { MainHeader, SideMenu },
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
        // this.get_containers()
      })
    },
    methods: {
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
