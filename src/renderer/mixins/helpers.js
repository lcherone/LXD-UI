//
export default {
  methods: {
    //
    formatBytes (bytes, decimals) {
      if (bytes === 0) return '0 Bytes'
      var k = 1024
      var dm = decimals || 2
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      var i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },
    isIP4 (ipv4) {
      if (/^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/.test(ipv4)) {
        return true
      } else {
        return false
      }
    },
    uniqueId (length) {
      if (!length) {
        length = 8
      }
      var str = ''
      for (var i = 1; i < length + 1; i = i + 8) {
        str += Math.random().toString(36).substr(2, 10)
      }
      return str.substr(0, length)
    },
    UUID () {
      function chr4 () {
        return Math.random().toString(16).slice(-4)
      }
      return chr4() + chr4() +
        '-' + chr4() + '-' + chr4() +
        '-' + chr4() + '-' + chr4() + chr4() + chr4()
    }
  }
}
