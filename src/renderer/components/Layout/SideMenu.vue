<template>
  <aside class="menu" style="width: 200px;">
    <p class="menu-label">
      General
    </p>
    <ul class="menu-list">
      <li><router-link v-bind:class="{ 'is-active': $route.path === '/' }" :to="{ path: '/' }">Home</router-link></li>
      <li><router-link :to="{ path: '/console/testing' }" target="_blank">Container</router-link></li>
    </ul>
    <p class="menu-label">
      Administration
    </p>
    <ul class="menu-list">
      <li><router-link v-bind:class="{ 'is-active': $route.path === '/settings' }" :to="{ path: '/settings' }">Settings</router-link></li>
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
</template>

<script>
  export default {
    components: {},
    props: {},
    data () {
      return {}
    },
    mounted: function () {},
    methods: {}
  }
</script>

<style scoped>

</style>
