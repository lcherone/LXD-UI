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
        Profiles
        <div class="is-pulled-right">
          <button 
                  class="button is-small is-success is-pulled-right" 
                  @click="save_profile()">
            <span class="icon">
              <i class="fa fa-check"></i> 
            </span>
            <span>Save</span>
          </button>
          &nbsp;
          <!--
<button 
class="button is-small is-success" 
@click="new_profile()">
<span class="icon">
<i class="fa fa-plus"></i> 
</span>
<span>New</span>
</button>
-->
          <!--
<button v-else class="button is-small is-light" @click="state = 'view'">
<span>Back</span>
</button>
-->
        </div>
      </h6>
      <div class="box">
        <div class="card-content">
          <div style="margin-top:-5px" v-if="profiles_list.length > 0">
            <div class="tabs is-small">
              <ul>
                <li v-bind:class="{ 'is-active': profile === active_profile }" @click="edit_profile(profile)" v-for="profile in profiles_list"><a>{{ profile.substring(profile.lastIndexOf('/') + 1) }}</a></li>
              </ul>
            </div>

            <div class="columns">
              <div class="column is-narrow">
                <aside class="menu" style="width: 200px">
                  <!-- -->
                  <p class="menu-label">Section</p>
                  <ul class="menu-list">
                    <li><a @click="set_section('configuration')" v-bind:class="{ 'is-active-grey': 'configuration' === active_section }">Configuration</a></li>
                    <li><a @click="set_section('devices')" :class="{ 'is-active-grey': 'devices' === active_section }">Devices</a></li>
                  </ul>
                </aside>
              </div>
              <div class="column" v-if="'configuration' === active_section && profile">
                <h5 class="title is-5" style="margin-bottom:10px">Configuration</h5>
                <el-alert v-show="!profile_active"
                          title="Not yet active!"
                          type="info"
                          description="The following profile configuration if not yet active."
                          show-icon
                          :closable="false"
                          style="margin-bottom:15px"
                          >
                </el-alert>
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label" for="name">Name</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <p class="control">
                        <el-input placeholder="Enter image description..." v-model="profile.name"></el-input>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label" for="name">Description</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <p class="control">
                        <el-input placeholder="Enter image description..." v-model="profile.description"></el-input>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <div class="field-label is-normal">
                        <label style="text-align: left" class="label" for="autostart">Auto Start</label>
                      </div>
                      <div class="field-body">
                        <div class="field" style="margin-top:5px">
                          <el-switch active-color="#13ce66" v-model="profile.config['boot.autostart']"></el-switch>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="field">
                      <div class="field-label is-normal">
                        <label style="text-align: left" class="label" for="privileged">Privileged</label>
                      </div>
                      <div class="field-body">
                        <div class="field" style="margin-top:5px">
                          <el-switch active-color="#13ce66" v-model="profile.config['security.privileged']"></el-switch>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="field">
                      <div class="field-label is-normal">
                        <label style="text-align: left" class="label" for="autostart">Nesting</label>
                      </div>
                      <div class="field-body">
                        <div class="field" style="margin-top:5px">
                          <el-switch active-color="#13ce66" v-model="profile.config['security.nesting']"></el-switch>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h5 class="title is-5" style="margin-bottom:10px">CPU</h5>
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <div class="field-label is-normal">
                        <label style="text-align: left" class="label" for="autostart">CPU Cores ({{ profile.config['limits.cpu'] }})</label>
                      </div>
                      <div class="field-body">
                        <div class="field" style="margin-top:-3px">
                          <el-slider v-model="profile.config['limits.cpu']" :min="1" :max="max_cpu" :step="1"></el-slider>
                        </div>
                      </div>
                    </div>
                    <div class="field">
                      <div class="field-label is-normal">
                        <label style="text-align: left" class="label" for="autostart">Max Processes ({{ profile.config['limits.processes'] }})</label>
                      </div>
                      <div class="field-body">
                        <div class="field" style="margin-top:-3px">
                          <el-slider v-model="profile.config['limits.processes']" :min="100" :max="32750" :step="100"></el-slider>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="field">
                      <div class="field-label is-normal">
                        <label style="text-align: left" class="label" for="autostart">CPU Allowance ({{ profile.config['limits.cpu.allowance'] }}%)</label>
                      </div>
                      <div class="field-body">
                        <div class="field" style="margin-top:-3px">
                          <el-slider v-model="profile.config['limits.cpu.allowance']" :min="1" :max="100" :step="1"></el-slider>
                        </div>
                      </div>
                    </div>
                    <div class="field">
                      <div class="field-label is-normal">
                        <label style="text-align: left" class="label" for="autostart">CPU Priority ({{ profile.config['limits.cpu.priority'] }})</label>
                      </div>
                      <div class="field-body">
                        <div class="field" style="margin-top:-3px">
                          <el-slider v-model="profile.config['limits.cpu.priority']" :min="1" :max="10" :step="1"></el-slider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h5 class="title is-5" style="margin-bottom:10px">Memory</h5>
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <div class="field-label is-normal">
                        <label style="text-align: left" class="label" for="autostart">Memory ({{ profile.config['limits.memory'] }} MB)</label>
                      </div>
                      <div class="field-body">
                        <div class="field" style="margin-top:-3px">
                          <el-slider :min="64" :max="max_memory" :step="32" v-model="profile.config['limits.memory']"></el-slider>
                        </div>
                      </div>
                    </div> 
                    <div class="field">
                      <div class="field-label is-normal">
                        <label style="text-align: left" class="label" for="autostart">Swap Priority ({{ profile.config['limits.memory.swap.priority'] }})</label>
                      </div>
                      <div class="field-body">
                        <div class="field" style="margin-top:-3px">
                          <el-slider v-model="profile.config['limits.memory.swap.priority']" :min="1" :max="10" :step="1"></el-slider>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="field">
                      <div class="field-label is-normal">
                        <label style="text-align: left" class="label" for="autostart">Enforce</label>
                      </div>
                      <div class="field-body">
                        <div class="field" style="margin-top:-3px">
                          <el-select v-model="profile.config['limits.memory.enforce']" placeholder="Select">
                            <el-option v-for="item in [{value: 'soft', label: 'Soft'}, {value: 'hard', label: 'Hard'}]"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </div>
                    <div class="field">
                      <div class="field-label is-normal">
                        <label style="text-align: left" class="label" for="autostart">Swap</label>
                      </div>
                      <div class="field-body">
                        <div class="field" style="margin-top:-3px">
                          <el-select v-model="profile.config['limits.memory.swap']" placeholder="Select">
                            <el-option v-for="item in [{value: '1', label: 'Yes'}, {value: '0', label: 'No'}]"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="columns">
                  <div class="column">
                    <h5 class="title is-5" style="margin-bottom:10px">Disk</h5>
                    <div class="field">
                      <div class="field-label is-normal">
                        <label style="text-align: left" class="label" for="autostart">Priority ({{ profile.config['limits.disk.priority'] }})</label>
                      </div>
                      <div class="field-body">
                        <div class="field" style="margin-top:-3px">
                          <el-slider v-model="profile.config['limits.disk.priority']" :min="1" :max="10" :step="1"></el-slider>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <h5 class="title is-5" style="margin-bottom:10px">Network</h5>
                    <div class="field">
                      <div class="field-label is-normal">
                        <label style="text-align: left" class="label" for="autostart">Priority ({{ profile.config['limits.network.priority'] }})</label>
                      </div>
                      <div class="field-body">
                        <div class="field" style="margin-top:-3px">
                          <el-slider v-model="profile.config['limits.network.priority']" :min="1" :max="10" :step="1"></el-slider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column" v-if="'devices' === active_section">
                <h5 class="title is-5" style="margin-bottom:10px">Devices</h5>
                <p>Coming soon!</p>
              </div>
            </div>
            <!--
<table class="table is-fullwidth is-narrow">
<thead>
<tr>
<th>Container</th>
</tr>
</thead>
<tbody>
<tr v-for="container in profile.used_by">
<td>{{ container }}</td>
</tr>
</tbody>
</table>
-->
          </div>
          <div v-else>
            Currently, there are no profiles.
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

  const profile = require('./Profiles/Profile')

  export default {
    name: 'profiles-page',
    props: ['param_profile'],
    components: { MainHeader },
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
        active_section: 'configuration',
        active_profile: '/1.0/profiles/' + (this.param_profile ? this.param_profile : 'default'),
        profile_active: false,
        search_result: null,
        remotes: [],
        profiles: [],
        profile: this.empty_profile,
        profile_name: '',
        images: [],
        btn: {
          refresh_containers: false
        }
      }
    },
    computed: {
      empty_profile: function () {
        return profile.empty()
      },
      image_list: function () {
        return this.images.filter((row) => {
          if (_.lowerCase(this.active_profile) !== _.lowerCase(row.properties.os)) {
            return false
          }
          return row
        })
      },
      profiles_list: function () {
        return _.uniq(this.profiles)
      },
      max_memory: function () {
        return (profile.max_memory() / 1024) / 1024
      },
      max_cpu: function () {
        return profile.max_cpu()
      }
    },
    mounted: function () {
      document.title = 'LXDui - Profiles'
      this.$nextTick(() => {
        //
        this.lxc_query('/1.0/profiles', 'GET', null, (response) => {
          this.profiles = response
          //
          this.edit_profile(this.active_profile)
        })
      })
    },
    methods: {
      /**
       *
       */
      set_section (name) {
        this.active_section = name
      },
      /**
       *
       */
      edit_profile (name) {
        this.active_profile = name
        this.profile_active = false
        // get profile from lxd
        this.lxc_query(name, 'GET', null, (response) => {
          this.profile_name = response.name
          this.profile = Object.assign({}, this.empty_profile, response)
          this.profile.devices = Object.assign({}, this.empty_profile.devices, response.devices)
          this.profile.config = Object.assign({}, this.empty_profile.config, response.config)
          //
          this.profile = profile.infix(this.profile)

          // detect if profile has ever been saved
          if (response.config['boot.autostart'] !== undefined) {
            this.profile_active = true
          }
        })
      },
      /**
       *
       */
      save_profile () {
        // change numbers to strings and append any
        let savedProfile = profile.outfix(this.profile)
        //
        this.lxc_query(this.active_profile, 'PATCH', JSON.stringify({
          config: savedProfile.config,
          description: savedProfile.description,
          devices: savedProfile.devices
          // ephemeral: savedProfile.ephemeral
        }), (response) => {
          if (savedProfile.name !== this.profile_name) {
            this.lxc_query(this.active_profile, 'POST', JSON.stringify({
              name: savedProfile.name
            }), (response) => {})
          }
          this.$notify({
            duration: 1200,
            title: 'Success',
            message: 'Profile updated.',
            type: 'success'
          })
        })
        profile.infix(this.profile)
      }
    }
  }
</script>

<style scoped>
  .menu-list a.is-active-grey {
    background-color: whitesmoke;
    color: #363636;
  }
</style>
