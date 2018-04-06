<template>
  <div v-cloak>
    <a @click="initialise()"><slot></slot></a>

    <div class="modal" v-bind:class="{ 'is-active': isActive }">
      <div class="modal-background"></div>
      <div class="modal-card" style="margin-top:-20vh">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit Image</p>
          <button class="delete" aria-label="close" @click="isActive = false"></button>
        </header>
        <section class="modal-card-body">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label" for="name">Description</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <el-input placeholder="Enter image description..." v-model="image.properties.description"></el-input>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label" for="version">Version</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <el-input placeholder="Enter image version..." v-model="image.properties.version"></el-input>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label" for="auto_update">Auto Update</label>
            </div>
            <div class="field-body">
              <div class="field" style="margin-top:5px">
                <el-switch active-color="#13ce66" v-model="image.auto_update"></el-switch>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label" for="public">Public</label>
            </div>
            <div class="field-body">
              <div class="field" style="margin-top:5px">
                <el-switch active-color="#13ce66" v-model="image.public"></el-switch>
              </div>
            </div>
          </div>              
        </section>
        <footer class="modal-card-foot">
          <button 
                  @click="save()" 
                  v-bind:class="{ 'is-loading': isSaving }" 
                  v-bind:disabled="isSaving"
                  class="button is-success">Save</button>
          <button class="button" @click="isActive = false" v-bind:disabled="isSaving">Close</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  import lxc from '../../mixins/lxc.js'

  import ElectronStore from 'electron-store'
  const storage = new ElectronStore({
    cwd: 'lxd-ui'
  })

  export default {
    props: ['remote', 'fingerprint'],
    mixins: [lxc],
    data () {
      return {
        imageIndex: 0,
        isActive: false,
        isSaving: false,
        image: {
          auto_update: false,
          properties: {
            architecture: '',
            description: '',
            os: '',
            version: '',
            release: '',
            serial: ''
          },
          public: false,
          aliases: [],
          architecture: '',
          cached: true,
          filename: '',
          fingerprint: '',
          size: 0,
          created_at: '',
          expires_at: '',
          last_used_at: '',
          uploaded_at: ''
        },
        launching: false,
        launched: false
      }
    },
    mounted: function () {},
    methods: {
      /**
       *
       */
      initialise () {
        // load images from cache
        this.images = storage.get('images.' + this.remote)

        // get index of image
        this.itemIndex = _.findIndex(this.images, (item) => {
          return item.fingerprint === this.fingerprint
        })

        // set image model
        if (this.images[this.itemIndex]) {
          this.image = this.images[this.itemIndex]
          this.isActive = true
        } else {
          console.error('Image index not found by fingerprint.')
          this.isActive = false
        }
      },
      /**
       *
       */
      save () {
        //
        this.isSaving = true
        //
        this.lxc_query('/1.0/images/' + this.fingerprint, 'PUT', JSON.stringify(this.image), (response) => {
          // update local images
          this.images[this.itemIndex] = this.image
          // save into cache
          storage.set('images.' + this.remote, this.images)
          this.isSaving = false
          // run notification
          this.$notify({
            duration: 1200,
            title: 'Success',
            message: 'Image properties updated.',
            type: 'success'
          })
          // emit event so table will update
          this.$emit('on-save')
          this.isActive = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
