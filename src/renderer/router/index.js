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
      component: require('@/components/ContainersPage').default
    },
    {
      path: '/terminal/:container/:os',
      name: 'terminal',
      component: require('@/components/TerminalPage').default,
      props: true
    },
    {
      path: '/scripts',
      name: 'scripts',
      component: require('@/components/ScriptsPage').default
    },
    {
      path: '/about',
      name: 'about',
      component: require('@/components/AboutPage').default
    },
    {
      path: '/settings/lxd',
      name: 'settings-lxd',
      component: require('@/components/SettingsLxdPage').default
    },
    {
      path: '/settings/app',
      name: 'settings-app',
      component: require('@/components/SettingsAppPage').default
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
      path: '/profiles/:param_profile',
      name: 'profiles',
      component: require('@/components/ProfilesPage').default,
      props: true
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
