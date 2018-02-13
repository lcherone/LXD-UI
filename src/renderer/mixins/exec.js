//
export default {
  methods: {
    exec: function (cmd, callback) {
      //
      var exec = require('child_process').exec
      //
      exec(cmd, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('cmd: ' + cmd)
          console.log('stdout: ' + stdout)
          console.log('stderr: ' + stderr)
          console.log('exec error: ' + error)
        }
        callback(stdout)
      })
    }
  }
}
