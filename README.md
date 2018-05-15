# LXD-UI

<img src="https://i.imgur.com/MDcbkne.png" alt="LXDui screen" title="LXDui" align="right" />

A simple easy to use GUI for your local LXD server.

**No dependencies!** simply run the self contained AppImage!

**You must be using >= LXD 2.17**

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
 - ngrok HTTP tunnel.
  

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
| [LXDui-0.0.9-x86_64.AppImage](https://github.com/lcherone/lxd-ui/releases/download/0.0.9a/LXDui-0.0.9-x86_64.AppImage) | Version 0.0.9a - [Release Notes](https://github.com/lcherone/lxd-ui/releases/tag/0.0.9a) | Linux

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

## Issues

 - Home and Containers pages hang :( - This will happen if you have an older version of LXD installed or you have recently installed the LXD snap without removing the old apt version of `lxd` and the `lxd-client`, the app does not check for `lxd.lxc` but instead expects the standard lxc commands to hit the correct binary.
 
If you encounter anything else which does not work, please open an issue.

## Developer Support / Sponsor

If you enjoy using this app and want to show your appreciation,
please feel free to make a donation [https://www.paypal.me/lcherone](https://www.paypal.me/lcherone), thanks.

Built with [electron-vue](https://github.com/SimulatedGREG/electron-vue).
