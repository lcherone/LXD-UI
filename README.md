
# LXD-UI

**WIP:***

A LXD user interface, which allows you to manage your local LXD instance in a GUI, **no dependencies** simply just run the self contained AppImage! Built with [electron-vue](https://github.com/SimulatedGREG/electron-vue).

**Current features:**

 - Create, edit, start, restart, stop, freeze and thaw containers.
 - Snapshot containers.
 - Launch containers from images, from any defined LXD remote e.g: `local:`, `images:`, `ubuntu:`, `ubuntu-daily:`.
 - Direct access into the containers using xterm.js terminal.
 - Create images from containers.
 - Edit local images.
 - Scripts, launch a container and execute deployment script (not cloud-init so it works with all remotes).
 - Single click to automatically copy users SSH key to root users authorized_keys file.
 - Port checks:
   - If port 22 open, shows a link to open in file explorer over SSH.
   - If port 80 open, shows a link to open in browser.
  

**Planned features:**

 - Finish off:
   - Create image from snapshot.
 - Manage profiles.
 - Further work on per-container config, like setting max cpu, memory etc.
 - Mount local devices/disks into containers, whilst avoiding need to sudo.
 - Add LXD settings.
 - Add in-app docs.
 - Add app settings.

Want anything else added? Feel free to open an issue...


**Screen**
![Screenshot](https://i.imgur.com/Yr0WaCy.gif)

> More to come... Its my first project with [electron-vue](https://github.com/SimulatedGREG/electron-vue) and node in general, contributions/feedback is very welcome.

#### Download (.AppImage)

As versions are released, they will be posted here: [https://github.com/lcherone/lxd-ui/releases](https://github.com/lcherone/lxd-ui/releases) 
which you can just download and run. Or you can build as shown below.

#### Build Setup

``` bash
# download source
git clone git@github.com:lcherone/lxd-ui.git && cd lxd-ui

# install dependencies
npm install

# build application - built app will be here: ./build/lxd-ui-0.0.*-x86_64.AppImage
npm run build

```

#### Developer Setup

``` bash
# download source
git clone git@github.com:lcherone/lxd-ui.git && cd lxd-ui

# install dependencies
npm install

# serve with hot reload
npm run dev

# run unit & end-to-end tests
npm test

# lint all JS/Vue component files in `src/`
npm run lint

