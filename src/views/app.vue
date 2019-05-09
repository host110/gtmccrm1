<template>
  <div :class="'app-wrap'+ (navbarCollapsed?' navbar-is-open':'')">
    <header class="app-header">
      <div class="navbar navbar-color-bg select-disable">
        <div class="buttons-left">
          <a class="logo">
            <img src="@static/assets/images/product/logo_zh-cn.png" height="40" />
          </a>
        </div>
        <div class="buttons-center">
          <div class="first-level-navbar select-disable">
            <div :class="'navbar-collapse'+ (navbarCollapsed?' is-open':'')">
              <el-menu theme="primary" :default-active="activeMenu">
                <template v-for="menu in menus">
                  <el-menu-item v-if="menu.meta && menu.meta.title" :index="menu.path" :key="menu.path" @click="onSelectMenun(menu)">
                    <i :class="menu.meta.icon" class="menu-icon"></i>
                    <span class="menu-title">{{menu.meta.title}}</span>
                  </el-menu-item>
                </template>
              </el-menu>

            </div>
          </div>
        </div>
        <div class="buttons-right">
          <el-tooltip class="item" effect="dark" content="消息" placement="bottom">
            <a class="ringer-on-navbar" @click="getMessage">
              <i class="fa fa-bell-o"></i>
              <span class="badge msg-count" :style="message.count ? '':'opacity: 0.5'">{{message.count}}</span>
            </a>
          </el-tooltip>
          <el-dropdown @command="handleCommand" style="cursor:pointer;line-height:0;vertical-align:middle" :hide-timeout="hideTimeout">

            <span class="el-dropdown-link" style="line-height:18px;display:inline-block;padding:8px 5px;text-align:left;">{{userDlrCode}}<br/>{{realName}}
              <!-- <img :src="avatorPath" class="img-circle b-a b-lter" style="max-width:36px;max-height:36px;" onerror="this.src='assets/images/picture404-'+Math.floor(Math.random()*4)+'.png';" /> -->
               <i class="el-icon-arrow-down f12"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="personal-info">
              <el-dropdown-item v-if="!fullscreened" command="handleFullscreen">
                <i class="fa fa-arrows-alt"></i>全屏</el-dropdown-item>
              <el-dropdown-item v-else command="handleFullscreen">
                <i class="fa fa-compress"></i>退出全屏</el-dropdown-item>
              <el-dropdown-item command="showUserSetting">
                <i class="fa fa-cog"></i>个人设置</el-dropdown-item>
              <el-dropdown-item command="passwd">
                <i class="fa fa-key"></i>修改密码</el-dropdown-item>
              <!-- <el-dropdown-item divided command="lockScreen">
                  <i class="fa fa-lock"></i>锁屏</el-dropdown-item>   -->
              <el-dropdown-item command="logout">
                <i class="fa fa-sign-out"></i>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <tree-select ref="treeSelect" class="site-selector" width="130" top :value.sync="currentSiteID" :items="siteListTreeData" @click="siteSelectChange"></tree-select>
        </div>
        <el-button type="text" @click="toggleNavbar" class="navbar-toggle">
          <i class="fa fa-align-justify"></i>
        </el-button>
      </div>
    </header>
    <router-view :key="routerName" v-if="isRouterAlive"></router-view>
    <!-- <div class="feedback">
      <el-tooltip class="item" effect="dark" content="建议反馈" placement="left">
        <el-button type="text" @click="doFeedback">
          <i class="fa fa-inbox f20"></i>
        </el-button>
      </el-tooltip>
    </div> -->
    <footer class="app-footer">
      <div style="max-width: 1080px; margin:0 auto;">
        <el-row>
           <!-- <el-col :span="4">
            <el-tooltip effect="light" content="关于ZCMS" placement="top">
               <a href="javascript:void(0);" @click="aboutThisApp">
                <i class="fa fa-info-circle f20"></i>
              </a>
            </el-tooltip>
            <el-tooltip effect="light" placement="top">
               <div slot="content">泽元软件官网<br>
                <img src="@static/assets/images/qr_for_share@2x.png" /></div>
              <i class="fa fa-weixin f20"></i>
            </el-tooltip>
          </el-col>
          <el-col :span="20">
            <p class="tar">Copyright © 2007-2018 ZvingSoft,Inc. All rights reserved.泽元软件版权所有</p>
          </el-col> -->
        </el-row>
      </div>
    </footer>
    <el-dialog title="修改密码" :visible.sync="modifyPasswordModal" class="modify-password-dialog" @open="changePwdDialogOpen">
      <el-col :span="16" :offset="4">
        <el-form :model="temp" :rules="tempRules" ref="modifyPasswordForm" label-width="100px" label-suffix="：">
          <el-form-item label="当前密码" prop="oldPassword">
            <el-input type="password" v-model="temp.oldPassword" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input type="password" v-model="temp.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="repeatPassword">
            <el-input type="password" v-model="temp.repeatPassword" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <div slot="footer">
        <el-button @click="modifyPasswordModal = false">取 消</el-button>
        <el-button type="primary" @click="modifyPasswordHandler" :loading="handlerLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 短消息列表dialog -->
    <msg-dialog :messageShow.sync="messageShow" @afterRead="msgAfterRead"></msg-dialog>
    <!-- 锁屏：功能暂时取消，页面的引用临时注释 -->
    <!-- <lock-screen :show-unlock.sync="showUnlock"></lock-screen> -->

    <!-- 个人设置dialog -->
    <user-setting :showDialog.sync="userSettingShow" :isBanner="isBanner"></user-setting>

    <feedback :showDialog.sync="feedbackShow"></feedback>
  </div>
</template>

<script>
const userSetting = zving.views.platform.userSettingTabs
const message = zving.views.platform.message.message
const TreeSelect = zving.components.TreeSelect
const LockScreen = zving.views.lockScreen
const feedback = zving.views.feedback
const util = zving.common.util

window.namespace('zving.views.app')
export default zving.views.app
Object.assign(zving.views.app, {
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    let routePath = location.hash.substr(1)
    if (routePath && routePath.split('/').length > 2) {
      routePath = routePath
        .split('/')
        .slice(0, 2)
        .join('/')
    }
    return {
      isRouterAlive: true,
      userName: localStorage.userName || 'anonymous',
      realName: localStorage.realName || localStorage.userName,
      userDlrCode: '',
      routerName: this.$route.name || '/',
      menus: window.routes,
      systemMenus: {},
      activeMenu: routePath,
      navbarCollapsed: false, // 导航是否展开
      modifyPasswordModal: false,
      passwordVeriry: {
        maxLen: 18,
        minLen: 5
      },
      handlerLoading: false,
      messageShow: false,
      userSettingShow: false,
      feedbackShow: false,
      isBanner: true,
      temp: {
        oldPassword: '',
        password: '',
        repeatPassword: ''
      },
      tempRules: {
        oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value.length < this.passwordVeriry.minLen || value.length > this.passwordVeriry.maxLen) {
                callback(new Error(`必须是${this.passwordVeriry.minLen}-${this.passwordVeriry.maxLen}位的字符`))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        repeatPassword: [
          { required: true, message: '请重复输入一次新密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.temp.password) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      currentSiteID: 0,
      currentSiteName: '',
      siteListTreeData: [], // 站点列表树数据
      message: {
        count: 0
      },
      fullscreened: false, // 是否为全屏
      showUnlock: String(localStorage.locking) === '1', // 显示解锁屏幕
      hideTimeout: 750
    }
  },
  computed: {
    avatorPath() {
      return './ui/avatar/' + this.userName
    }
  },
  components: {
    'user-setting': userSetting,
    'msg-dialog': message,
    'tree-select': TreeSelect,
    'lock-screen': LockScreen,
    feedback: feedback
  },
  async created() {
    let self = this
    // 监听全屏切换事件
    document.addEventListener('fullscreenchange', function() {
      self.fullscreened = !self.fullscreened
    })
    document.addEventListener('mozfullscreenchange', function() {
      self.fullscreened = !self.fullscreened
    })
    document.addEventListener('webkitfullscreenchange', function() {
      self.fullscreened = !self.fullscreened
    })
    document.addEventListener('msfullscreenchange', function() {
      self.fullscreened = !self.fullscreened
    })

    await this.loadSiteListTreeData()
    await this.getUserDlrCode()
    let res = await axios.get('/ui/message/unread')
    this.message = res.data.data
  },
  watch: {
    '$route.path'(val, oldVal) {
      let index = val.indexOf('/')
      index = val.indexOf('/', index + 1)
      let route = index > -1 ? val.substring(0, index) : val
      if (route === oldVal.substring(0, index)) {
        return
      }
      let m = this.menus.find(menu => menu.path === route)
      this.activeMenu = m ? m.path : this.activeMenu
    },
    '$route.name'(val, oldVal) {
      this.routerName = this.$route.name || '/'
    },
    async currentSiteID(val, oldVal) {
      if (oldVal !== 0) {
        let res = await axios.put('/ui/sites/change', { siteID: val })
        if (res.data.status === 1) {
          this.$root.siteID = val
          window.location.reload()
        } else {
          util.showNotification(res.data)
        }
      }
    }
  },
  methods: {
    msgAfterRead() {
      this.message.count > 0 && this.message.count--
    },
    changePwdDialogOpen() {
      this.handlerLoading = false
      this.initPwdCheck()
    },
    async initPwdCheck() {
      let res = await axios.get('/ui/users/initpwdcheck')
      if (res.data.status === 1) {
        this.passwordVeriry = { maxLen: res.data.maxLen, minLen: res.data.minLen }
      }
    },
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    async loadSiteListTreeData() {
      let res = await axios.get('/ui/sites')
      this.currentSiteID = res.data.siteID
      this.currentSiteName = res.data.siteName
      this.siteListTreeData = res.data.data
    },
    async getUserDlrCode() {
      let res = await axios.get(`/ui/users/${this.userName}`)
      if (res.data.status === 1) {
        this.userDlrCode = res.data.data.prop1
      }
    },
    async siteSelectChange(isOpen) {
      if (isOpen) {
        await this.loadSiteListTreeData()
        this.$refs.treeSelect.setCurrentKey(this.currentSiteID)
      }
    },
    // 切换全屏
    handleFullscreen() {
      // var bd = document.body // 全屏后背景会是黑色的
      var bd = document.getElementsByTagName('html')[0]
      this.fullscreened
        ? document.exitFullscreen
          ? document.exitFullscreen()
          : document.mozCancelFullScreen
            ? document.mozCancelFullScreen()
            : document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen()
        : bd.requestFullscreen
          ? bd.requestFullscreen()
          : bd.mozRequestFullScreen
            ? bd.mozRequestFullScreen()
            : bd.webkitRequestFullScreen ? bd.webkitRequestFullScreen() : bd.msRequestFullscreen && bd.msRequestFullscreen()
    },
    // 锁屏
    lockScreen() {
      this.showUnlock = true
    },
    onSelectMenun(menu) {
      let hash = menu.children && menu.children.length ? menu.children[0].path : ''
      if (hash.charAt(0) !== '/') {
        hash = '/' + hash
      }
      if (hash.indexOf(menu.path) === -1) {
        hash = menu.path + hash
      }
      util.recordMenuClick(hash)
      window.location.hash = hash
      localStorage.lastRoutePath = hash
    },
    toggleNavbar() {
      this.navbarCollapsed = !this.navbarCollapsed
    },
    async logout() {
      let resp = await axios.get('/ui/logout', {params: {'referer': window.location.href}})
      localStorage.removeItem('logined')
      localStorage.removeItem('realName')
      localStorage.removeItem('adminUserName')
      if (resp.data.status === 1) {
        window.location.href = resp.data.loginURL || 'login.html'
        return
      }
      location.href = 'login.html'
    },
    async handleCommand(cmd) {
      if (cmd === 'handleFullscreen') {
        this.handleFullscreen()
      }
      if (cmd === 'lockScreen') {
        this.lockScreen()
      }
      if (cmd === 'showUserSetting') {
        this.showUserSetting()
      }
      if (cmd === 'logout') {
        this.logout()
      }
      if (cmd === 'passwd') {
        this.temp = {
          oldPassword: '',
          password: '',
          repeatPassword: ''
        }
        this.modifyPasswordModal = true
      }
    },
    getMessage() {
      this.messageShow = true
    },
    showUserSetting() {
      this.isBanner = true
      this.userSettingShow = true
    },
    async modifyPasswordHandler() {
      try {
        await util.validateForm(this.$refs['modifyPasswordForm'])
      } catch (e) {
        this.handlerLoading = false
        return
      }
      this.handlerLoading = true
      let data = await axios.put('/ui/application/password', this.temp)
      if (data.data.status === 1) {
        this.modifyPasswordModal = false
        this.temp = {
          oldPassword: '',
          password: '',
          repeatPassword: ''
        }
      }
      this.handlerLoading = false
      util.showResponseMessage(data.data)
    },
    aboutThisApp() {
      console.log('显示zcms信息功能待实现')
    },
    doFeedback() {
      this.feedbackShow = true
    }
  }
})

</script>

<style scoped>
.app-wrap {
  /* background-color: #F6F7F9; */
  width: 100%;
  height: 100%;
  position: relative;
  /* overflow-x: hidden; 注意！这儿加hidden会导致window不响应scroll事件*/
}
.app-header {
  background-color: #f12605;
  /* box-shadow: 0 0 100px rgba(0,0,0,.1); */
  margin-bottom: 10px;
}
.app-footer {
  background-color: #303133;
  padding: 26px 0;
  line-height: 20px;
}
.app-footer .fa {
  color: #777;
  margin-right: 10px;
}
.first-level-navbar {
  background-color: #f12605;
  /* border-bottom: 1px solid #eee; */
}
.first-level-navbar .el-menu-item {
  display: inline-block;
  color: #dee;
  padding: 0 10px !important;
}
.first-level-navbar li > i {
  padding-right: 0;
}
.first-level-navbar .el-menu {
  text-align: center;
  white-space: nowrap;
}
.first-level-navbar .el-menu-item.is-active {
  /* border-bottom: 2px solid #fff; */
  color: #fff;
  position: relative;
}
.first-level-navbar .el-menu-item.is-active::after {
  content: ' ';
  display: block;
  height: 2px;
  border-radius: 2px;
  background-color: #fff;
  margin-top: 0px;
}
.first-level-navbar .menu-icon {
  display: none;
}
.navbar-collapse .menu-icon {
  width: 20px;
}
.navbar-collapse.is-open {
  width: 150px;
}
.navbar-collapse.is-open .menu-title {
  visibility: visible;
}
.first-level-navbar,
.navbar {
  max-width: 1280px;
  margin: 0 auto;
}
.navbar {
  height: 60px;
  line-height: 59px;
  padding: 0;
  border: 0;
  border-radius: 0;
  position: relative;
  /* box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.1), inset 0 -1px 2px rgba(0, 0, 0, 0.1); */
  z-index: 101;
  margin-bottom: 0;
  background-color: #f12605;
}

.logo {
  padding-left: 0;
  max-width: 260px;
  display: inline-block;
  height: 59px;
  vertical-align: middle;
  font-size: 0px;
  display: inline-block;
  border-radius: 0;
}
.buttons-left {
  float: left;
  position: relative;
  z-index: 103;
  /* padding-left: 20px; */
}
.buttons-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.buttons-right {
  text-align: right;
  float: right;
  position: relative;
  z-index: 103;
  /* padding-right: 15px; */
  height: 50px;
}
.buttons-right > a,
.buttons-right button {
  padding: 8px;
}
.buttons-right .fa {
  font-size: 124%;
}
@media (max-width: 576px) {
  .navbar-collapse {
    z-index: 102;
    transition: all 0.3s;
  }
  .logo {
    background-color: transparent;
  }
  .buttons-right {
    display: none;
  }
  .navbar-toggle {
    width: 55px;
    line-height: 30px;
  }
  .navbar-collapse.is-open .el-menu--horizontal .el-menu-item {
    float: none;
    border-bottom-width: 1px;
  }
}

@media (min-width: 576px) {
  .navbar-toggle {
    display: none;
  }
}

.visible-on-mobile.el-menu .el-menu-item {
  padding-left: 40px;
}
.msg-count {
  background-color: #ff6f4b;
  position: relative;
  top: -10px;
  left: -10px;
  margin-right: -5px;
  font-weight: 400;
  transform: scale(0.75, 0.75);
}
.el-dropdown-link {
  padding: 21px 0 24px;
}
.personal-info.el-popper {
  margin-top: 2px;
}
</style>
<style>
.modify-password-dialog .el-dialog {
  width: 600px;
}

@media (max-width: 480px) {
  .modify-password-dialog .el-dialog {
    width: 96%;
  }
}

.navbar-is-open .layout-row-main {
  left: 150px;
}
.site-selector {
  margin-left: 10px;
}
.site-selector .select-icon {
  top: 30px;
  float: right;
  right: 8px;
  bottom: auto;
}
.site-selector .select-icon.el-icon-caret-bottom:before {
  color: #fff;
}
.site-selector .el-input__inner {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #fff;
  font-weight: 600;
  text-shadow: 0px 0px 1px rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  font-size: 16px;
  letter-spacing: 0em;
  width: 100%;
  height: 33px;
  padding: 8px;
}

.feedback {
  position: fixed;
  right: 10px;
  bottom: 60px;
}

.fa-lock {
  width: 19px;
}
</style>
