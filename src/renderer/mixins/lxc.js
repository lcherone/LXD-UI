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
    },
    /**
     *
     */
    lxc_images: function (remote, filter, callback) {
      //
      if (remote === undefined || remote === null) {
        remote = 'local:'
      }
      //
      if (filter === undefined || filter === null) {
        filter = ''
      }
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_images(' + name + ', *missing)')
          console.log(response)
        }
      }
      //
      this.exec('lxc image list ' + remote + ' ' + filter + ' --format=json', function (response) {
        if (response === '') {
          response = []
        }
        callback(JSON.parse(response))
      })
    },
    /**
     * gets an array of remotes names only
     */
    lxc_remotes: function (callback) {
      //
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_remotes(*missing)')
          console.log(response)
        }
      }
      /* eslint-disable no-useless-escape */
      this.exec('lxc remote list | tail -n +4 | awk \'{print $2}\' | egrep -v \'^(\\||^$)\'', function (response) {
        callback(response.trim().split(/\r?\n/))
      })
    },
    /**
     *
     */
    lxc_launch: function (remote, fingerprint, name, callback) {
      //
      if (remote === undefined || remote === null) {
        remote = 'local:'
      }
      //
      if (fingerprint === undefined || fingerprint === null) {
        console.log('ERROR: Image fingerprint must be supplied to lxc_launch(remote, fingerprint, name, callback)')
        return false
      }
      //
      if (name === undefined || name === null) {
        name = ''
      }
      //
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_launch(*missing)')
          console.log(response)
        }
      }
      this.exec('lxc launch ' + remote + ':' + fingerprint + ' ' + name, function (response) {
        callback(response.trim().split(/\r?\n/))
      })
    },
    /**
     *
     */
    lxc_image_delete: function (fingerprint, callback) {
      //
      if (fingerprint === undefined || fingerprint === null) {
        console.log('ERROR: Image fingerprint must be supplied to lxc_image_delete(remote, fingerprint, name, callback)')
        return false
      }
      //
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_image_delete(*missing)')
          console.log(response)
        }
      }
      this.exec('lxc image delete ' + fingerprint, function (response) {
        callback(response)
      })
    }
  }
}
