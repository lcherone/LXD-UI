<template>
  <div>
    <!-- Main header -->
    <main-header :current="$route.path"></main-header>

    <!-- Main element -->
    <el-main>
      <h6 class="title is-5">
        Scripts
        <div class="is-pulled-right">
          <button 
                  class="button is-small is-success is-pulled-right" 
                  @click="save" 
                  v-if="state === 'create' || state === 'edit'" 
                  :disabled="script.description === ''">
            <span class="icon">
              <i class="fa fa-check"></i> 
            </span>
            <span>Save</span>
          </button>
          &nbsp;
          <button 
                  class="button is-small is-success" 
                  @click="create()" 
                  v-if="state !== 'create' && state !== 'edit'">
            <span class="icon">
              <i class="fa fa-plus"></i> 
            </span>
            <span>New</span>
          </button>
          <button v-else class="button is-small is-light" @click="state = 'view'">
            <span>Back</span>
          </button>
        </div>
      </h6>
      <div class="box">
        <div class="card-content">
          <div v-if="state === 'view'">
            <!-- All Scripts -->
            <div class="field is-pulled-right">
              <div class="control">
                <input class="input" type="text" v-model="table_filter" placeholder="Filter...">
              </div>
            </div>
            <table class="table is-fullwidth is-narrow" style="margin-top:-10px">
              <thead>
                <tr>
                  <th style="width:80%">Description</th>
                  <th style="width:20%">Added</th>
                  <th style="width:1%"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in scripts_list" v-show="scripts_list.length > 0">
                  <td><a @click="edit(item.key)">{{ item.description }}</a></td>
                  <td><span>{{ item.date | formatDate }}</span></td>
                  <td>
                    <div style="display: flex">
                      <a class="button is-danger is-small" @click="delete_script(item.key)"><i class="fa fa-times"></i></a>
                      <a class="button is-primary is-small" @click="launch_script(item)">
                        <span class="icon" style="margin-right:1px">
                          <i class="fa fa-rocket"></i>
                        </span>
                        Launch
                      </a>
                    </div>
                  </td>
                </tr>
                <tr v-show="scripts_list.length === 0">
                  <td colspan="3" v-if="scripts.length === 0">No scripts have been created.</td>
                  <td colspan="3" v-else>No scripts found matching filter.</td>
                </tr>
              </tbody>
            </table>
            <!-- /All Scripts -->
          </div>
          <div v-else>
            <!-- Create Script -->
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label" for="description">Description</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <p class="control">
                    <el-input placeholder="Enter description for script..." v-model="script.description"></el-input>
                  </p>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label" for="content">Source</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <p class="control">
                    <editor v-model="script.content" @init="editorInit" lang="sh" theme="eclipse" width="100%" height="calc(100vh - 230px)"></editor>
                  </p>
                </div>
              </div>
            </div>
            <!-- /Create Script -->
          </div>
        </div>
      </div>
    </el-main>
    <launch-container ref="LaunchContainer"></launch-container>
  </div>
</template>

<script>
  // import _ from 'lodash'
  import moment from 'moment'
  import helpers from '../mixins/helpers.js'
  import MainHeader from './Layout/MainHeader'
  import SideMenu from './Layout/SideMenu'
  import LaunchContainer from './Images/LaunchContainer'

  import ElectronStore from 'electron-store'
  const storage = new ElectronStore({
    cwd: 'lxd-ui-scripts'
  })

  export default {
    name: 'scripts-page',
    components: {
      MainHeader,
      SideMenu,
      LaunchContainer,
      editor: require('vue2-ace-editor-electron')
    },
    mixins: [helpers],
    filters: {
      formatDate: function (value) {
        if (value) {
          return moment(String(value)).format('DD/MM/YYYY')
        }
      }
    },
    data () {
      return {
        state: 'view',
        scripts: storage.get('scripts', []),
        script: this._emptyScriptModel(),
        content: '',
        table_filter: ''
      }
    },
    computed: {
      type_list: function () {
        return ['Bash']
      },
      scripts_list: function () {
        return Object.values(this.scripts).filter((row) => {
          if (row.description.indexOf(this.table_filter) > -1) {
            return row
          }
          if (row.date.indexOf(this.table_filter) > -1) {
            return row
          }
          return false
        })
      }
    },
    beforeDestroy: function () {
    },
    mounted: function () {
      document.title = 'LXDui - Scripts'
    },
    methods: {
      /**
       * Empty script model
       */
      _emptyScriptModel () {
        this.script = {
          key: '',
          description: '',
          content: '' +
          '#!/bin/bash\n\n' +
          '# upon launch wait for internet connection\n' +
          'echo "Waiting for network connection."\n' +
          'while [ 1 ]; do\n' +
          '  if ping -q -c 1 -W 1 8.8.8.8 > /dev/null 2>&1; then\n' +
          '    break;\n' +
          '  fi\n' +
          '  sleep 1\n' +
          'done\n',
          date: new Date()
        }
        return this.script
      },
      /**
       * Ace editor init
       */
      editorInit () {
        require('brace/mode/sh')
        require('brace/theme/eclipse')
      },
      /**
       * Directly call child component LaunchContainer::open()
       * - huge speed improvement over component instance per table row
       */
      launch_script (script) {
        this.$refs.LaunchContainer.open({
          name: '',
          description: '',
          fingerprint: null,
          remote: 'local',
          script: script,
          staging: false,
          launching: false,
          launched: false
        })
      },
      /**
       * Create script
       */
      create (state) {
        this.script = this._emptyScriptModel()
        this.state = 'create'
      },
      /**
       * Edit script
       */
      edit (key) {
        this.script = storage.get('scripts.' + key)
        this.state = 'edit'
      },
      /**
       * Delete script
       */
      delete_script (key) {
        this.$confirm('Are you sure you want to delete this script?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          storage.delete('scripts.' + key)
          this.scripts = storage.get('scripts')
        })
      },
      /**
       * Save script
       */
      save () {
        // storage.clear()
        //
        let msg
        if (this.script.key === '') {
          this.script.key = this.UUID()
          msg = 'Script added.'
        } else {
          msg = 'Script updated.'
        }
        //
        storage.set('scripts.' + this.script.key, this.script)
        //
        this.scripts = storage.get('scripts')
        // clear model
        this._emptyScriptModel()
        //
        this.$notify({
          duration: 2000,
          title: 'Success',
          message: msg,
          type: 'success'
        })
        //
        this.state = 'view'
      }
    }
  }
</script>

<style scoped>
  .ace_editor {
    height: calc(100vh);
  }
</style>
