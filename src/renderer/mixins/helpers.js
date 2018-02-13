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
    }
  }
}
