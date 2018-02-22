import exec from '../mixins/exec.js'

export default {
  mixins: [exec],
  methods: {
    /**
     *
     */
    lxc_query: function (remote, action, data, callback) {
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
          response = '[]'
        }
        callback(JSON.parse(response))
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
    lxc_restart: function (name, callback) {
      //
      if (name === undefined || name === null) {
        name = ''
      }
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_restart(' + name + ', *missing)')
          console.log(response)
        }
      }
      //
      var shellescape = require('shell-escape')
      this.exec('lxc restart ' + shellescape([name]), function (response) {
        callback()
      })
    },
    /**
     *
     */
    lxc_copy_ssh_key: function (name, key, callback) {
      //
      if (name === undefined || name === null) {
        name = ''
      }
      //
      if (key === undefined || key === null) {
        key = ''
      }
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_copy_ssh_key(' + name + ', ' + key + ', *missing)')
          console.log(response)
        }
      }
      //
      // lxc file push [-r|--recursive] [-p|--create-dirs] [--uid=UID] [--gid=GID] [--mode=MODE] <source path> [<source path>...] [<remote>:]<container>/<path>
      var shellescape = require('shell-escape')
      this.exec('lxc file push --mode=600 --uid=0 --gid=0 ' + shellescape([key, 'local:' + name + '/root/.ssh/authorized_keys']), (response) => {
        this.exec('lxc exec ' + name + ' -- /bin/sh -c "sed -i \'s/PermitRootLogin prohibit-password/PermitRootLogin yes/g\' /etc/ssh/sshd_config && sed -i \'s/StrictModes yes/StrictModes no/g\' /etc/ssh/sshd_config && service ssh restart"', function (response) {
          callback()
        })
      })
    },
    /**
     *
     */
    lxc_state: function (name, state, callback) {
      //
      if (name === undefined || name === null) {
        name = ''
      }
      //
      if (state === undefined || state === null) {
        state = ''
      }
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_state(' + name + ', *missing)')
          console.log(response)
        }
      }
      //
      // var shellescape = require('shell-escape')
      this.lxc_query('/1.0/containers/' + name + '/state', 'PUT', JSON.stringify({
        action: state,
        timeout: 30// ,
        // force: true,
        // stateful: true
      }), function (response) {
        callback(response)
      })
    },
    /**
     *
     */
    lxc_snapshot: function (name, snapshot, callback) {
      //
      if (name === undefined || name === null) {
        name = ''
      }
      //
      if (snapshot === undefined || snapshot === null) {
        snapshot = ''
      }
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_snapshot(' + name + ', ' + snapshot + ', *missing)')
          console.log(response)
        }
      }
      //
      // var shellescape = require('shell-escape')
      this.lxc_query('/1.0/containers/' + name + '/snapshots', 'POST', JSON.stringify({
        name: snapshot,
        stateful: false
      }), function (response) {
        callback(response)
      })
    },
    /**
     *
     */
    lxc_snapshot_delete: function (name, snapshot, callback) {
      //
      if (name === undefined || name === null) {
        name = ''
      }
      //
      if (snapshot === undefined || snapshot === null) {
        snapshot = ''
      }
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_snapshot_delete(' + name + ', ' + snapshot + ', *missing)')
          console.log(response)
        }
      }
      //
      // var shellescape = require('shell-escape')
      this.lxc_query('/1.0/containers/' + name + '/snapshots/' + snapshot, 'DELETE', JSON.stringify({
        // no params
      }), function (response) {
        callback(response)
      })
    },
    /**
     *
     */
    lxc_snapshot_restore: function (name, snapshot, callback) {
      //
      if (name === undefined || name === null) {
        name = ''
      }
      //
      if (snapshot === undefined || snapshot === null) {
        snapshot = ''
      }
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_snapshot_restore(' + name + ', ' + snapshot + ', *missing)')
          console.log(response)
        }
      }
      //
      // var shellescape = require('shell-escape')
      this.lxc_query('/1.0/containers/' + name, 'PUT', JSON.stringify({
        restore: snapshot
      }), function (response) {
        callback(response)
      })
    },
    /**
     *
     */
    lxc_image_container: function (name, properties, callback) {
      //
      if (name === undefined || name === null) {
        name = ''
      }
      //
      if (properties === undefined || properties === null) {
        properties = {
          description: name,
          label: '',
          architecture: '',
          build: new Date(),
          distribution: '',
          os: '',
          release: '',
          version: ''
        }
      }
      if (typeof callback !== 'function') {
        callback = function (response) {
          console.log('ERROR: no callback supplied for lxc_image_container(' + name + ', properties, *missing)')
          console.log(response)
        }
      }

      //
      // var shellescape = require('shell-escape')
      this.lxc_query('/1.0/images', 'POST', JSON.stringify({
        source: {
          type: 'container',
          name: name
        },
        public: false,
        properties: properties,
        auto_update: false
      }), function (response) {
        callback(response)
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
      this.exec('lxc stop ' + shellescape([name, '--force']), function (response) {
        callback()
      })
    },
    /**
     *
     */
    lxc_delete: function (name, callback) {
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
      this.exec('lxc delete ' + shellescape([name, '--force']), function (response) {
        callback()
      })
    },
    /**
     *
     */
    /*
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
    */
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
