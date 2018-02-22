'use strict'

module.exports = {
  empty: function () {
    return {
      config: {
        'limits.cpu': 1,
        'limits.processes': 500,
        'limits.cpu.allowance': 100, // %
        'limits.cpu.priority': 5, //    1-10
        'limits.memory': 1024,
        'limits.memory.swap.priority': 5,
        'limits.disk.priority': 5,
        'limits.network.priority': 5,
        'boot.autostart': false,
        'security.nesting': false,
        'security.privileged': false,
        'limits.memory.swap': '0',
        'limits.memory.enforce': 'soft'
      },
      description: '',
      devices: {
        // eth0: {
        // nictype: 'bridged',
        // parent: 'lxdbr0',
        // type: 'nic'
        // },
        // root: {
        // path: '/',
        // pool: 'default',
        // type: 'disk'
        // }
      },
      name: '',
      used_by: {},
      ephemeral: false
    }
  },
  /**
   * in fix: should be called before applying to model
   * - turns string values into numbers
   * - removes % from cpu.allowance
   * - removes MB from limits.memory
   */
  infix: function (profile) {
    // cast inbound config values to bool
    profile.ephemeral = (profile.ephemeral === '1')
    profile.config['boot.autostart'] = (profile.config['boot.autostart'] === '1')
    profile.config['security.privileged'] = (profile.config['security.privileged'] === '1')
    profile.config['security.nesting'] = (profile.config['security.nesting'] === '1')

    // strip off MB from end of string
    if (profile.config['limits.memory'] !== undefined && isNaN(profile.config['limits.memory'])) {
      profile.config['limits.memory'] = Number(profile.config['limits.memory'].substring(0, profile.config['limits.memory'].indexOf('MB')))
    }

    // strip off % from end of string
    if (profile.config['limits.cpu.allowance'] !== undefined && isNaN(profile.config['limits.cpu.allowance'])) {
      profile.config['limits.cpu.allowance'] = Number(profile.config['limits.cpu.allowance'].substring(0, profile.config['limits.cpu.allowance'].indexOf('%')))
    }

    // parse all stings to numbers
    profile.config['limits.cpu'] = Number(profile.config['limits.cpu'])
    profile.config['limits.cpu.priority'] = Number(profile.config['limits.cpu.priority'])
    profile.config['limits.processes'] = Number(profile.config['limits.processes'])
    profile.config['limits.memory.swap.priority'] = Number(profile.config['limits.memory.swap.priority'])
    profile.config['limits.disk.priority'] = Number(profile.config['limits.disk.priority'])
    profile.config['limits.network.priority'] = Number(profile.config['limits.network.priority'])
    return profile
  },
  /**
   * out fix: should be called before saving
   * - turns all values into strings
   * - prepends % to cpu.allowance
   * - prepends MB to limits.memory
   */
  outfix: function (profile) {
    //
    profile.ephemeral = (profile.ephemeral === true ? '1' : '0')
    // boot
    profile.config['boot.autostart'] = (profile.config['boot.autostart'] === true ? '1' : '0')
    // security
    profile.config['security.privileged'] = (profile.config['security.privileged'] === true ? '1' : '0')
    profile.config['security.nesting'] = (profile.config['security.nesting'] === true ? '1' : '0')
    // limits
    profile.config['limits.cpu'] = String(profile.config['limits.cpu'])
    profile.config['limits.processes'] = String(profile.config['limits.processes'])
    profile.config['limits.cpu.allowance'] = String(profile.config['limits.cpu.allowance']) + '%'
    profile.config['limits.cpu.priority'] = String(profile.config['limits.cpu.priority'])
    profile.config['limits.memory'] = String(profile.config['limits.memory']) + 'MB'
    profile.config['limits.memory.swap.priority'] = String(profile.config['limits.memory.swap.priority'])
    profile.config['limits.disk.priority'] = String(profile.config['limits.disk.priority'])
    profile.config['limits.network.priority'] = String(profile.config['limits.network.priority'])
    profile.config['limits.memory.swap'] = String(profile.config['limits.memory.swap'])
    profile.config['limits.memory.enforce'] = String(profile.config['limits.memory.enforce'])
    return profile
  }
}
