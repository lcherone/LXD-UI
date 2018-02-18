<template>
  <el-container>
    <el-header>
      <div id="logo">
        <div style="float:left;">
          <img src="~@/assets/lxc-logo.png" alt="electron-vue">
        </div>
        <div id="logo-text">
          <strong>LXD<span>ui</span></strong>
        </div>
      </div>
      <el-menu :router="true"
               :default-active="activeIndex"
               mode="horizontal"
               background-color="#e34b14"
               text-color="#fff"
               active-text-color="#2b001d">
        <el-menu-item index="/">Home</el-menu-item>
        <el-menu-item index="/scripts">Scripts</el-menu-item>
        <el-menu-item index="/containers">Containers</el-menu-item>
        <el-menu-item index="/profiles">Profiles</el-menu-item>
        <el-menu-item index="/images">Images</el-menu-item>
      </el-menu>
    </el-header>
  </el-container>
</template>

<script>
  export default {
    // components: { },
    props: ['current'],
    data () {
      return {
        activeIndex: this.current
      }
    }// ,
    // mounted: function () {},
    // methods: {}
  }
</script>

<style scoped>
  .el-header {
    background-color: #2b001d;
    color: #333;
    line-height: 33px;
    padding: 0
  }

  .el-menu {
    margin-left: 150px
  }

  #logo {
    width:150px;
    height:60px;
    float:left;
  }

  #logo img {
    height: auto;
    width: 45px;
    margin:8px 12px 0px 15px
  }

  #logo strong {
    font-size:20px;
    text-shadow:
      -1px -1px 0 #f05e24,  
      1px -1px 0 #f05e24,
      -1px 1px 0 #f05e24,
      1px 1px 0 #f05e24;
  } 

  #logo-text {
    color:#31353d;
    padding-top:12px
  }

  #logo span {
    color:#ddd;
    font-size:18px;
    text-shadow:
      -1px -1px 0 #000,  
      1px -1px 0 #000,
      -1px 1px 0 #000,
      1px 1px 0 #000;
  }

</style>
