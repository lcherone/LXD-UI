import exec from '../mixins/exec.js'

export default {
  mixins: [exec],
  methods: {
    /**
     *
     */
    lxc_query: function (remote, action, data, callback, index) {
      //
      if (remote === undefined || remote === null) {
        remote = '/'
      }
      //
      if (action === undefined || action === null) {
        action = 'GET'
      }
      //
      if (data === undefined || data === null) {
        data = false
      }
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_query(' + remote + ', *missing)')
          console.log(response)
        }
      }
      //
      var shellescape = require('shell-escape')
      this.exec('lxc query -X ' + action + ' ' + (data !== false ? '-d ' + shellescape([data]) + '' : '') + ' ' + shellescape([remote]), function (response) {
        if (response === '') {
          response = []
        }
        callback(JSON.parse(response), index)
      })
    },
    /**
     *
     */
    lxc_start: function (name, callback) {
      //
      if (name === undefined || name === null) {
        name = ''
      }
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_stop(' + name + ', *missing)')
          console.log(response)
        }
      }
      //
      var shellescape = require('shell-escape')
      this.exec('lxc start ' + shellescape([name]), function (response) {
        callback()
      })
    },
    /**
     *
     */
    lxc_stop: function (name, callback) {
      //
      if (name === undefined || name === null) {
        name = ''
      }
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_stop(' + name + ', *missing)')
          console.log(response)
        }
      }
      //
      var shellescape = require('shell-escape')
      this.exec('lxc stop ' + shellescape([name]), function (response) {
        callback()
      })
    },
    /**
     *
     */
    lxc_info: function (remote, callback) {
      //
      if (remote === undefined || remote === null) {
        remote = '/'
      }
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_info(' + remote + ', *missing)')
          console.log(response)
        }
      }
      //
      var shellescape = require('shell-escape')
      this.exec('lxc query -X GET ' + shellescape([name]) + '/1.0', function (response) {
        if (response === '') {
          response = []
        }
        callback(JSON.parse(response))
      })
    },
    /**
     *
     */
    lxc_list: function (name, callback) {
      //
      if (name === undefined || name === null) {
        name = ''
      }
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_list(' + name + ', *missing)')
          console.log(response)
        }
      }
      //
      var shellescape = require('shell-escape')
      this.exec('lxc list ' + shellescape(['^' + name + '(.*)$']) + ' --format json', function (response) {
        if (response === '') {
          response = []
        }
        callback(JSON.parse(response))
      })
    }
  }
}
