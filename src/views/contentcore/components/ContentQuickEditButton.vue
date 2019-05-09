<template>
    <el-row v-if="showStatus">
      <el-col :span="10" class="item-status">
        <el-tag size="small">{{selectedRow.statusName}}</el-tag>
        <span style="color: #28b06e;" v-for="(value,key) in selectedRow.checkedAttrs" :key="key" :title="value"><i :class="key | fixIcon"></i></span>
        <span v-if="!!selectedRow.imagesTotal" title="图片" style="margin-right:6px;"><i class="fa fa-file-image-o"></i><span class="num-circle">{{selectedRow.imagesTotal}}</span></span>
        <span v-if="!!selectedRow.videosTotal" title="视频" style="margin-right:6px;"><i class="fa fa-file-video-o"></i><span class="num-circle">{{selectedRow.videosTotal}}</span></span>
        <span v-if="!!selectedRow.audiosTotal" title="音频" style="margin-right:6px;"><i class="fa fa-file-audio-o"></i><span class="num-circle">{{selectedRow.audiosTotal}}</span></span>
        <span v-if="!!selectedRow.filesTotal" title="文件" style="margin-right:6px;"><i class="fa fa-file-archive-o"></i><span class="num-circle">{{selectedRow.filesTotal}}</span></span>
        <span v-for="item in selectedRow.pushChannels" :key="item">
          <img :src="`./assets/images/socialmedia/${item.toLowerCase()}-logo-18x18.png`" onerror="this.src='assets/images/picture404-'+((row.ID||row.$index) % 4)+'.png';" height="16px" width="16px" style="margin-right:8px;" :title="item | fixChannelName" />
        </span>
      </el-col>
      <el-col :span="14" class="item-buttons">
        <el-button @click="sort(selectedRow,true)" v-if="!first" type="text" :priv="'com.zving.cms.Catalog.Content.Sort.'+catalogId">
          <i class="fa fa-arrow-up"></i>上移
        </el-button>
        <el-button @click="sort(selectedRow,false)" v-if="!last" type="text" :priv="'com.zving.cms.Catalog.Content.Sort.'+catalogId">
          <i class="fa fa-arrow-down"></i>下移
        </el-button>

        <el-button @click.stop="publish(selectedRow.ID,'pub')" type="text" title="发布" :priv="'com.zving.cms.Catalog.Content.Publish.'+catalogId">
          <i class="fa fa-send-o"></i>发布
        </el-button>
        <el-button @click.stop="editSpecial(selectedRow)" type="text" v-if="contentType === 'Special'" title="编辑"  :priv="'com.zving.cms.Catalog.Content.Edit.'+catalogId">
          <i class="fa fa-edit"></i>编辑</el-button>
        <el-button @click.stop="edit(selectedRow)" type="text" v-else title="编辑"  :priv="'com.zving.cms.Catalog.Content.Edit.'+catalogId">
          <i class="fa fa-edit"></i>编辑</el-button>
        <el-button @click.stop="preview(selectedRow)" type="text" title="预览">
          <i class="fa fa-eye"></i>预览</el-button>
        <content-delete-button :selected-rows="[selectedRow]" :catalog-id="catalogId"
          @refresh-content="updateList" :button-type="buttonType" ></content-delete-button>
        <el-dropdown>
        <el-button type='text'>
          <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
        </el-button>
          <el-dropdown-menu slot="dropdown" class="button-dropdown">
            <el-dropdown-item>
              <el-button type='text' @click="publish(contentIds,'topub')"  :priv="'com.zving.cms.Catalog.Content.Publish.'+catalogId">
                <i class="fa fa-circle-o-notch"></i>待发布
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item v-if="status === 30">
              <el-button type='text' @click="show(selectedRow.publishUrl)">
                <i class="fa fa-bolt fa-fw"></i>浏览
              </el-button>
            </el-dropdown-item>

            <el-dropdown-item v-if="contentType === 'Special'">
              <el-button @click.stop="edit(selectedRow)" type="text" title="配置"  :priv="'com.zving.cms.Catalog.Content.Edit.'+catalogId">
          <i class="fa fa-edit"></i>配置</el-button>
            </el-dropdown-item>
            <el-dropdown-item >
              <el-button type='text' @click="publish(contentIds,'offline')" :priv="'com.zving.cms.Catalog.Content.Publish.'+catalogId">
                <i class="fa fa-refresh"></i>下线
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
                <content-copy-button :content-ids="contentIds" :catalog-ids="catalogId" @refresh-content="updateList" :button-type='buttonType' :content-type="selectedRow.contentTypeID" :priv="'com.zving.cms.Catalog.Content.Copy.'+catalogId"></content-copy-button>
            </el-dropdown-item>
            <el-dropdown-item>
                <content-move-button :content-ids="contentIds" :catalog-ids="catalogId" @refresh-content="updateList" :button-type='buttonType' :content-type="selectedRow.contentTypeID" :priv="'com.zving.cms.Catalog.Content.Move.'+catalogId"></content-move-button>
            </el-dropdown-item>
            <el-dropdown-item>
                <content-sort-button :content-ids="contentIds" :catalog-ids="catalogId" :order-type="orderType" @refresh-content="updateList" :button-type='buttonType' :priv="'com.zving.cms.Catalog.Content.Sort.'+catalogId"></content-sort-button>
            </el-dropdown-item>
            <el-dropdown-item>
                <content-deploy-button :content-ids="contentIds" :catalog-id="catalogId" @refresh-content="updateList" :button-type='buttonType' :priv="'com.zving.cms.Catalog.Content.Copy.'+catalogId"></content-deploy-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button :disabled="!contentIds" @click="changeAttriutes('recommend')" :type="buttonType" :priv="'com.zving.cms.Catalog.Content.SetRecommend.'+catalogId">
                <i class="fa fa-paper-plane"></i>推荐
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button :disabled="!contentIds" @click="changeAttriutes('cancelrecommend')" :type="buttonType" :priv="'com.zving.cms.Catalog.Content.SetRecommend.'+catalogId">
                <i class="fa fa-exclamation-triangle"></i>取消推荐
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button :disabled="!contentIds" @click="changeAttriutes('sethot')" :type="buttonType" :priv="'com.zving.cms.Catalog.Content.SetHot.'+catalogId">
                <i class="fa fa-bolt fa-fw"></i>设置热点
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button :disabled="!contentIds" @click="changeAttriutes('cancelhot')" :type="buttonType" :priv="'com.zving.cms.Catalog.Content.SetHot.'+catalogId">
                <i class="fa fa-exclamation-triangle"></i>取消热点
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <content-settop-button :catalog-id="catalogId" :content.sync="selectedRow" @refresh-content="updateList" :button-type="buttonType"></content-settop-button>
            </el-dropdown-item>
            <el-dropdown-item command="rec" >
              <content-rec-block-button :content="selectedRow" :hidden-detail="true" @refresh-content="updateList" :button-type="buttonType"></content-rec-block-button>
            </el-dropdown-item>
            <el-dropdown-item v-if="selectedRow.contentTypeID === 'Article'">
              <socialmedia-push-button :content="selectedRow" :content-ids="contentIds" :catalog-id="catalogId" @refresh-content="updateList" :button-type='buttonType'></socialmedia-push-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <div v-else>
       <el-button @click="sort(selectedRow,true)" v-if="!first" type="text" :priv="'com.zving.cms.Catalog.Content.Sort.'+catalogId">
          <i class="fa fa-arrow-up"></i>上移
        </el-button>
        <el-button @click="sort(selectedRow,false)" v-if="!last" type="text" :priv="'com.zving.cms.Catalog.Content.Sort.'+catalogId">
          <i class="fa fa-arrow-down"></i>下移
        </el-button>
        <el-button @click.stop="publish(selectedRow.ID,'pub')" type="text" title="发布" :priv="'com.zving.cms.Catalog.Content.Publish.'+catalogId">
          <i class="fa fa-send-o"></i>发布
        </el-button>
        <el-button @click.stop="preview(selectedRow)" type="text" title="预览"><i class="fa fa-eye"></i>预览</el-button>
        <el-dropdown>
        <el-button type='text'>
          <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
        </el-button>
          <el-dropdown-menu slot="dropdown" class="button-dropdown">
            <el-dropdown-item>
              <el-button @click.stop="editSpecial(selectedRow)" type="text" v-if="contentType === 'Special'" title="编辑"  :priv="'com.zving.cms.Catalog.Content.Edit.'+catalogId"><i class="fa fa-edit"></i>编辑</el-button>
              <el-button @click.stop="edit(selectedRow)" type="text" v-else title="编辑"  :priv="'com.zving.cms.Catalog.Content.Edit.'+catalogId"><i class="fa fa-edit"></i>编辑</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <content-delete-button :selected-rows="[selectedRow]" :catalog-id="catalogId" @refresh-content="updateList" :button-type="buttonType" ></content-delete-button>
            </el-dropdown-item>
            <el-dropdown-item></el-dropdown-item>
            <el-dropdown-item>
              <el-button type='text' @click="publish(contentIds,'topub')"  :priv="'com.zving.cms.Catalog.Content.Publish.'+catalogId">
                <i class="fa fa-circle-o-notch"></i>待发布
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type='text' @click="show(selectedRow.publishUrl)">
                <i class="fa fa-bolt fa-fw"></i>浏览
              </el-button>
            </el-dropdown-item>

            <el-dropdown-item v-if="contentType === 'Special'">
              <el-button @click.stop="edit(selectedRow)" type="text" title="配置"  :priv="'com.zving.cms.Catalog.Content.Edit.'+catalogId">
          <i class="fa fa-edit"></i>配置</el-button>
            </el-dropdown-item>
            <el-dropdown-item >
              <el-button type='text' @click="publish(contentIds,'offline')" :priv="'com.zving.cms.Catalog.Content.Publish.'+catalogId">
                <i class="fa fa-refresh"></i>下线
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
                <content-copy-button :content-ids="contentIds" :catalog-ids="catalogId" @refresh-content="updateList" :button-type='buttonType' :content-type="selectedRow.contentTypeID" :priv="'com.zving.cms.Catalog.Content.Copy.'+catalogId"></content-copy-button>
            </el-dropdown-item>
            <el-dropdown-item>
                <content-move-button :content-ids="contentIds" :catalog-ids="catalogId" @refresh-content="updateList" :button-type='buttonType' :content-type="selectedRow.contentTypeID" :priv="'com.zving.cms.Catalog.Content.Move.'+catalogId"></content-move-button>
            </el-dropdown-item>
            <el-dropdown-item>
                <content-sort-button :content-ids="contentIds" :catalog-ids="catalogId" :order-type="orderType" @refresh-content="updateList" :button-type='buttonType' :priv="'com.zving.cms.Catalog.Content.Sort.'+catalogId"></content-sort-button>
            </el-dropdown-item>
            <el-dropdown-item>
                <content-deploy-button :content-ids="contentIds" :catalog-id="catalogId" @refresh-content="updateList" :button-type='buttonType' :priv="'com.zving.cms.Catalog.Content.Copy.'+catalogId"></content-deploy-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button :disabled="!contentIds" @click="changeAttriutes('recommend')" :type="buttonType" :priv="'com.zving.cms.Catalog.Content.SetRecommend.'+catalogId">
                <i class="fa fa-paper-plane"></i>推荐
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button :disabled="!contentIds" @click="changeAttriutes('cancelrecommend')" :type="buttonType" :priv="'com.zving.cms.Catalog.Content.SetRecommend.'+catalogId">
                <i class="fa fa-exclamation-triangle"></i>取消推荐
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button :disabled="!contentIds" @click="changeAttriutes('sethot')" :type="buttonType" :priv="'com.zving.cms.Catalog.Content.SetHot.'+catalogId">
                <i class="fa fa-bolt fa-fw"></i>设置热点
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button :disabled="!contentIds" @click="changeAttriutes('cancelhot')" :type="buttonType" :priv="'com.zving.cms.Catalog.Content.SetHot.'+catalogId">
                <i class="fa fa-exclamation-triangle"></i>取消热点
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <content-settop-button :catalog-id="catalogId" :content.sync="selectedRow" @refresh-content="updateList" :button-type="buttonType"></content-settop-button>
            </el-dropdown-item>
            <el-dropdown-item command="rec" >
              <content-rec-block-button :content="selectedRow" :hidden-detail="true" @refresh-content="updateList" :button-type="buttonType"></content-rec-block-button>
            </el-dropdown-item>
            <el-dropdown-item v-if="selectedRow.contentTypeID === 'Article'">
              <socialmedia-push-button :content="selectedRow" :content-ids="contentIds" :catalog-id="catalogId" @refresh-content="updateList" :button-type='buttonType'></socialmedia-push-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
const util = zving.common.util
const ContentAddButton = zving.views.contentcore.components.ContentAddButton
const ContentDeleteButton = zving.views.contentcore.components.ContentDeleteButton
const ContentDeployButton = zving.views.contentcore.components.ContentDeployButton
const ContentCopyButton = zving.views.contentcore.components.ContentCopyButton
const ContentMoveButton = zving.views.contentcore.components.ContentMoveButton
const ContentSortButton = zving.views.contentcore.components.ContentSortButton
const ContentSetTopButton = zving.views.contentcore.components.ContentSetTopButton
const SocialMediaPushButton = zving.views.contentcore.components.SocialMediaPushButton
const ContentRecBlockButton = zving.views.contentcore.components.ContentRecBlockButton

window.namespace('zving.views.contentcore.components.ContentQuickEditButton')
export default zving.views.contentcore.components.ContentQuickEditButton
Object.assign(zving.views.contentcore.components.ContentQuickEditButton, {
  components: {
    'content-add-button': ContentAddButton,
    'content-delete-button': ContentDeleteButton,
    'content-deploy-button': ContentDeployButton,
    'content-copy-button': ContentCopyButton,
    'content-move-button': ContentMoveButton,
    'content-rec-block-button': ContentRecBlockButton,
    'content-sort-button': ContentSortButton,
    'content-settop-button': ContentSetTopButton,
    'socialmedia-push-button': SocialMediaPushButton
  },
  filters: {
    fixIcon: function(val) {
      switch (val) {
        case 'attach':
          return 'fa fa-paperclip'
        case 'contribute':
          return 'fa fa-pencil-square-o'
        case 'copy':
          return 'fa fa-copy'
        case 'copySource':
          return 'fa fa-copy'
        case 'copyout':
          return 'fa fa-clipboard'
        case 'hot':
          return 'fa fa-fire'
        case 'image':
          return 'fa fa-image'
        case 'notation':
          return 'fa fa-file'
        case 'recommend':
          return 'fa fa-thumbs-up'
        case 'refer':
          return 'fa fa-external-link'
        case 'top':
          return 'fa fa-arrow-up'
        case 'video':
          return 'fa fa-film'
        default:
          return ''
      }
    },
    fixChannelName: function(val) {
      switch (val) {
        case 'QQNewsSite':
          return '企鹅号内容网站'
        case 'QQNewsPlat':
          return '企鹅号服务平台'
        case 'QQWeiBo':
          return '腾讯微博'
        case 'SinaWeiBo':
          return '新浪微博'
        case 'TouTiaoMedia':
          return '今日头条平台'
        case 'WeChatAccount':
          return '微信公众平台'
        case 'WeChatMedia':
          return '微信开放平台'
        case 'ZhiHuAccount':
          return '知乎'
        default:
          return ''
      }
    }
  },
  props: {
    selectedRow: {
      type: Object,
      default: function() {
        return {}
      }
    },
    catalogId: {
      type: [Number, String]
    },
    detailContent: {
      type: Object
    },
    orderType: {
      type: String
    },
    first: {
      type: Boolean
    },
    showStatus: {
      type: Boolean,
      default: true
    },
    last: {
      type: Boolean
    }
  },
  computed: {
    addDetailContent: {
      set(val) {
        this.$emit('update:detailContent', val)
      },
      get() {
        return this.detailContent
      }
    },
    contentIds() {
      return this.selectedRow ? this.selectedRow.ID : ''
    },
    showBtn() {
      return !!this.selectedRow
    },
    contentType() {
      return this.selectedRow.contentTypeID
    },
    status() {
      return this.selectedRow.status
    }
  },
  data() {
    return {
      buttons: ['content-add-button'],
      buttonType: 'text',
      userName: localStorage.userName
    }
  },
  created() {
  },
  methods: {
    // 刷新列表
    updateList() {
      if (window.refreshContentList) {
        window.refreshContentList()
      }
    },

    async changeAttriutes(val) {
      let resp = await axios.put(`/ui/contentcore/contents/${this.contentIds}/${val}`, {
        catalogID: this.catalogId
      })
      util.showResponseMessage(resp.data)
      resp.data.status === 1 && this.updateList()
    },
    editSpecial(row) {
      if (row.copyID && (row.copyType === 2 || row.copyType === 3)) {
        window.open(`specialDesigner.html?ID=${row.copyID}`)
      } else if (row.redirectURL && row.redirectURL.indexOf('type=Special&ID=') > 0) {
        var ID = util.url.getQueryValue(row.redirectURL, 'ID')
        window.open(`specialDesigner.html?ID=${ID}`)
      } else {
        window.open(`specialDesigner.html?ID=${row.ID}`)
      }
    },

    edit(row) {
      let id = row.ID ? row.ID : 'new'
      let format = row.extendJSON && JSON.parse(row.extendJSON).format
      let path = `/contentEditor/${id}?type=${row.contentTypeID}&cid=${row.catalogID}`
      path = format ? path + `&format=${format}` : path
      if (row.contentTypeID === 'Special') {
        let dataID = row.ID
        if (row.copyID && (row.copyType === 2 || row.copyType === 3)) {
          dataID = row.copyID
        } else if (row.redirectURL && row.redirectURL.indexOf('type=Special&ID=') > 0) { // 标题新闻
          dataID = util.url.getQueryValue(row.redirectURL, 'ID')
        }
        this.$router.push({
          path: `/special/${row.catalogID}/${dataID}`
        })
      } else {
        window.open('contentEditor.html#' + path)
      }
    },

    preview(row) {
      let currentLink = `preview.html?id=${row.ID}&type=content`
      if (row.contentTypeID === 'Special') {
        let dataID = row.ID
        if (row.copyID && (row.copyType === 2 || row.copyType === 3)) {
          dataID = row.copyID
        } else if (row.redirectURL && row.redirectURL.indexOf('type=Special&ID=') > 0) { // 标题新闻
          dataID = util.url.getQueryValue(row.redirectURL, 'ID')
        }
        currentLink = `preview.html?id=${dataID}&type=special&catalogID=${row.catalogID}&templateFlag=N&pageType=Special`
      }
      window.open(currentLink)
    },

    show(url) {
      window.open(url)
    },

    async publish(id, type) {
      if (this.selectedRow.isLock === 'Y' && this.selectedRow.lockUser !== this.userName) {
        util.showResponseMessage({message: `当前内容已经被“${this.selectedRow.lockUser}”用户锁定！`})
        return
      }

      // 视频内容，未转换完成不允许发布
      if (this.selectedRow.contentTypeID === 'Video') {
        let videoExtend = JSON.parse(this.selectedRow.extendJSON)
        if (videoExtend.convertFlag === 'Y' && videoExtend.convertSuccess !== 'Y') {
          util.showError('视频转换以后才可以发布')
          return
        }
      }

      let resp = await axios.put(`/ui/contentcore/contentpublish/${id}/${type}`, {
        catalogID: this.catalogId
      })
      util.showResponseMessage(resp.data)
      // resp.data.status === 1 && this.updateList()
      resp.data.status === 1 && this.updateText(type)
    },

    async del(id) {
      try {
        await this.$confirm('确定删除吗？删除后无法恢复。是否继续删除？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch (e) {
        return
      }
      let resp = await axios.delete(`/ui/contentcore/contents/${id}`)
      await util.showProgress(resp.data.taskID, resp.data.message)
      this.updateList()
    },
    updateText(type) {
      switch (type) {
        case 'pub':
          this.selectedRow.statusName = '已发布'
          this.selectedRow.status = 30
          break
        case 'topub':
          this.selectedRow.statusName = '待发布'
          this.selectedRow.status = 20
          break
        case 'offline':
          this.selectedRow.statusName = '已下线'
          this.selectedRow.status = 40
          break
      }
    },
    sort(val, isUp){
      this.$emit('sort', val, isUp)
    }
  }
})
</script>
<style scoped>
.el-list-view.list .item-buttons {
  text-align: right;
}
.el-list-view.grid .item-status,
.el-list-view.grid .item-buttons {
  float: none;
  width: 100%;
}
</style>
