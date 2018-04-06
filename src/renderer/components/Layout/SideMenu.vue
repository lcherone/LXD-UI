<template>
  <aside class="menu" style="width: 200px">
    <!-- -->
    <p class="menu-label">General</p>
    <ul class="menu-list">
      <li><router-link v-bind:class="{ 'is-active': $route.path === '/' }" :to="{ path: '/' }">Home</router-link></li>
    </ul>
    <!-- -->
    <p class="menu-label">Administration</p>
    <ul class="menu-list">
      <li><router-link v-bind:class="{ 'is-active': $route.path === '/settings/lxd' }" :to="{ path: '/settings/lxd' }">LXD Settings</router-link></li>
<!--      <li><router-link v-bind:class="{ 'is-active': $route.path === '/settings/app' }" :to="{ path: '/settings/app' }">App Settings</router-link></li>-->
    </ul>
    <!-- -->
    <p class="menu-label">Support</p>
    <ul class="menu-list">
      <li><router-link :to="{ path: '/about' }" v-bind:class="{ 'is-active': $route.path === '/about' }">About</router-link></li>
      <li><a @click="open('https://github.com/lcherone/lxd-ui')">Github</a></li>
    </ul>
  </aside>
</template>

<script>
  export default {
    components: {},
    props: {},
    data () {
      return {}
    },
    mounted: function () {},
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style scoped>

</style>
