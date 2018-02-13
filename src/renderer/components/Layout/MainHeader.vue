<template>
  <div>
    <nav class="level" style="margin-bottom: -15px ">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-4">
            <strong>LXD</strong>UI
          </p>
        </div>
        <div class="level-item" v-show="show_search">
          <div class="field has-addons">
            <p class="control">
              <input class="input" type="text" :value="search" @input="search_execute" :placeholder="placeholder">
            </p>
            <p class="control">
              <button class="button" @click="search_execute()">
                Search
              </button>
            </p>
          </div>
        </div>
      </div>
      <div class="level-right" v-show="show_links">
        <!-- Home -->
        <p class="level-item" v-show="current != 'index'"><router-link :to="{ name: 'index' }">Home</router-link></p>
        <p class="level-item" v-show="current == 'index'"><strong>Home</strong></p>
        <!-- Containers -->
        <p class="level-item" v-show="current != 'containers'"><router-link :to="{ name: 'containers' }">Containers</router-link></p>
        <p class="level-item" v-show="current == 'containers'"><strong>Containers</strong></p>        
        <!-- Profiles -->
        <p class="level-item" v-show="current != 'containers'"><router-link :to="{ name: 'containers' }">Profiles</router-link></p>
        <p class="level-item" v-show="current == 'containers'"><strong>Profiles</strong></p>
        <!-- Images -->
        <p class="level-item" v-show="current != 'containers'"><router-link :to="{ name: 'containers' }">Images</router-link></p>
        <p class="level-item" v-show="current == 'containers'"><strong>Images</strong></p>
        <!-- New -->
        <p class="level-item"><a class="button is-success">New</a></p>
      </div>
    </nav>
    <hr>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    props: {
      current: {},
      show_search: {
        default: true,
        type: Boolean
      },
      show_links: {
        default: true,
        type: Boolean
      }
    },
    data () {
      return {
        // show_search: true,
        // show_links: true,
        search: null,
        placeholder: null
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        if (this.$route.name === 'index') {
          this.placeholder = 'Find containers, images...'
        } else if (this.$route.name === 'containers') {
          this.placeholder = 'Find container...'
        }
      })
    },
    methods: {
      search_execute: _.debounce(function (e) {
        // get event value
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined') {
          this.search = e.target.value
        }
        // emit search event
        this.$emit('search-event', this.search)
      }, 300)
    }
  }
</script>

<style scoped>

</style>
