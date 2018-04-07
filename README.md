# LXD-UI

<img src="https://i.imgur.com/MDcbkne.png" alt="LXDui screen" title="LXDui" align="right" />

A simple easy to use GUI for your local LXD server.

**No dependencies!** simply run the self contained AppImage!

**Features:**

 - Create, edit, start, restart, stop, freeze, thaw and snapshot containers.
 - Launch containers from images, from any defined LXD remote e.g: `local:`, `images:`, `ubuntu:`, `ubuntu-daily:`, `production:`.
 - Direct access into the containers using xterm.js terminal.
 - Create images from containers.
 - Edit local images.
 - Easily edit core LXD settings.
 - Scripts, launch a container and execute a deployment shell script (not cloud-init so it works with all remotes and you fully see the process).
 - Single click to automatically copy users SSH key to root users authorized_keys file.
 - Service port checks:
   - If port 22 open, shows link to open in file explorer over SSH.
   - If port 80 open, shows link to open in browser.
   - If port 5901 open, shows link to open vncviewer.
  

**Planned features:**

 - Finish off:
   - Create image from snapshot.
 - Manage profiles (configuration done, still need to add devices).
 - Add app settings.
 - Add in-app docs.

Want anything else added? Feel free to open an issue...

**Screens**
![Screenshot](https://i.imgur.com/Yr0WaCy.gif)

**XFCE4 over VNC!**
![Screenshot](https://i.imgur.com/3VoYpCX.gif)


#### Downloads (.AppImage)

| File | Description | Platform
| --- | --- | --- |
| [LXDui-0.0.6-x86_64.AppImage](https://github.com/lcherone/lxd-ui/releases/download/0.0.6a/LXDui-0.0.6-x86_64.AppImage) | Version 0.0.6a - [Release Notes](https://github.com/lcherone/lxd-ui/releases/tag/0.0.6a) | Linux
| [LXDui-0.0.5-x86_64.AppImage](https://github.com/lcherone/lxd-ui/releases/download/0.0.5a/LXDui-0.0.5-x86_64.AppImage) | Version 0.0.5a - [Release Notes](https://github.com/lcherone/lxd-ui/releases/tag/0.0.5a) | Linux
| [lxd-ui-0.0.4a-x86_64.AppImage](https://github.com/lcherone/lxd-ui/releases/download/0.0.4a/lxd-ui-0.0.4-x86_64.AppImage) | Version 0.0.4a - [Release Notes](https://github.com/lcherone/lxd-ui/releases/tag/0.0.4a) | Linux
| [lxd-ui-0.0.3a-x86_64.AppImage](https://github.com/lcherone/lxd-ui/releases/download/0.0.3a/lxd-ui-0.0.3-x86_64.AppImage) | Version 0.0.3a - [Release Notes](https://github.com/lcherone/lxd-ui/releases/tag/0.0.3a) | Linux
| [lxd-ui-0.0.2a-x86_64.AppImage](https://github.com/lcherone/lxd-ui/releases/download/0.0.2a/lxd-ui-0.0.2-x86_64.AppImage) | Version 0.0.2a - [Release Notes](https://github.com/lcherone/lxd-ui/releases/tag/0.0.2a) | Linux
| [lxd-ui-0.0.1a-x86_64.AppImage](https://github.com/lcherone/lxd-ui/releases/download/0.0.1a/lxd-ui-0.0.1a-x86_64.AppImage) | Initial Release - [Release Notes](https://github.com/lcherone/lxd-ui/releases/tag/0.0.1a) | Linux

As versions are released, they will be posted here: [https://github.com/lcherone/lxd-ui/releases](https://github.com/lcherone/lxd-ui/releases) 
which you can just download and run. Or you can build as shown below. Windows or mac its not supported.

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

```

Built with [electron-vue](https://github.com/SimulatedGREG/electron-vue).
