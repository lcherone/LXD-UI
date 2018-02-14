import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/components/IndexPage').default
    },
    {
      path: '/containers',
      name: 'containers',
      component: require('@/components/ContainersNewPage').default
    },
    {
      path: '/console/:container',
      name: 'console',
      component: require('@/components/ConsolePage').default,
      props: true
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/components/SettingsPage').default
    },
    {
      path: '/images',
      name: 'images',
      component: require('@/components/ImagesPage').default
    },
    {
      path: '/profiles',
      name: 'profiles',
      component: require('@/components/ProfilesPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
