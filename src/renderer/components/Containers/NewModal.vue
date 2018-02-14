<template>
  <div v-cloak>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
      <div class="modal-background"></div>
      <div class="modal-card" style="margin-top:-35vh">
        <header class="modal-card-head">
          <p class="modal-card-title">New Container</p>
          <button class="delete" aria-label="close" @click="close_modal()"></button>
        </header>
        <section class="modal-card-body">

          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label" for="name">Name</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <input id="name" class="input" type="name" placeholder="Enter name for new container...">
                </p>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label" for="image">Image</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control is-expanded">
                  <div class="select is-fullwidth">
                    <select id="image">
                      <option>Ubuntu 17.04</option>
                      <option>With options</option>
                    </select>
                  </div>
                </div>
                <p class="help"></p>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label" for="name">Profile</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="select">
                  <select>
                    <option>Select dropdown</option>
                    <option>With options</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </section>
        <footer class="modal-card-foot">
          <button class="button is-success">Launch</button>
          <button class="button" @click="close_modal()">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  // import _ from 'lodash'

  export default {
    props: {
      isActive: {
        default: false,
        type: Boolean
      }
    },
    data () {
      return {}
    },
    mounted: function () {},
    methods: {
      close_modal: function () {
        this.$emit('close-modal', true)
      }
    }
  }
</script>

<style scoped>

</style>
