<template>
  <el-toolbar>
    <component v-for="button in buttons" :is="button" :key="button" :selected-rows="selectedRows" :detail-content.sync="addDetailContent" :catalog-id="catalogId" @updateList="updateList" v-if="catalogAlias!=='dp'"></component>
    <el-button v-if="catalogAlias==='dp'" class="add-content-btn" @click.stop="addGtmcContent('Image')"><i class="fa fa-plus"></i>新建图片</el-button>
    <el-button v-if="catalogAlias==='dp'" class="add-content-btn" @click.stop="addGtmcContent('Video')"><i class="fa fa-plus"></i>新建视频</el-button>
    <content-import-button :catalog-id="catalogId" :catalog-type="contentType" @refresh-content="updateList" ></content-import-button>
    <!--稍后进行优化-->
     <el-button @click="selectedAllHandler" :loading="selectAllLoading"><i class="fa fa-check-square"></i>全选</el-button>
      <div class="el-multi-operate">
        <el-select v-show="showBtn" value="" @change="selectOperate" placeholder="请选择操作项">
          <el-option v-for="item in multiOperates" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
      </el-select>
      </div>
    <el-dropdown v-show="false">
        <el-button>
          <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" class="button-dropdown">
          <el-dropdown-item>
           <content-delete-button ref="deleteButton" :selected-rows="selectedRows" :catalog-id="catalogId"  @refresh-content="updateList" :button-type="buttonType"></content-delete-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button type='text' @click="publish(contentIds,'pub')" :priv="'com.zving.cms.Catalog.Content.Publish.'+ catalogId">
              <i class="fa fa-share-square-o"></i>发布
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button type='text' @click="publish(contentIds,'topub')" :priv="'com.zving.cms.Catalog.Content.Publish.'+ catalogId">
              <i class="fa fa-circle-o-notch"></i>待发布
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item >
            <el-button type='text' @click="publish(contentIds,'offline')" :priv="'com.zving.cms.Catalog.Content.Publish.'+ catalogId">
              <i class="fa fa-refresh"></i>下线
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item>
           <content-copy-button ref="copyButton" :content-ids="contentIds" :content-type="contentTypes" :catalog-ids="catalogId" @refresh-content="updateList" :button-type='buttonType'></content-copy-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <content-move-button ref="moveButton" :content-ids="contentIds" :content-type="contentType" :catalog-ids="catalogId" @refresh-content="updateList" :button-type='buttonType'></content-move-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <content-sort-button :order-type="orderType" ref="sortButton" :content-ids="contentIds" :catalog-ids="catalogId" @refresh-content="updateList" :button-type='buttonType'></content-sort-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <content-deploy-button ref="deployButton" :content-ids="contentIds" :catalog-id="catalogId" @refresh-content="updateList" :button-type='buttonType'></content-deploy-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button :disabled="!contentIds"  @click="changeAttriutes('recommend')" :type="buttonType"
              :priv="'com.zving.cms.Catalog.Content.SetRecommend.'+ catalogId">
              <i class="fa fa-paper-plane"></i>推荐
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button :disabled="!contentIds" @click="changeAttriutes('cancelrecommend')" :type="buttonType"
              :priv="'com.zving.cms.Catalog.Content.SetRecommend.'+ catalogId">
              <i class="fa fa-exclamation-triangle"></i>取消推荐
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button :disabled="!contentIds" @click="changeAttriutes('sethot')" :type="buttonType"
             :priv="'com.zving.cms.Catalog.Content.SetHot.'+ catalogId">
              <i class="fa fa-bolt fa-fw"></i>设置热点
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button :disabled="!contentIds" @click="changeAttriutes('cancelhot')" :type="buttonType"
              :priv="'com.zving.cms.Catalog.Content.SetHot.'+ catalogId">
              <i class="fa fa-exclamation-triangle"></i>取消热点
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <socialmedia-push-button :content-ids="contentIds" :catalog-id="catalogId" @refresh-content="updateList" :button-type='buttonType'></socialmedia-push-button>
          </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
    <content-topsort-button :order-type="orderType" ref="topSortButton" :content-ids="contentIds" :catalog-ids="catalogId" @refresh-content="updateList" :button-type='buttonType'></content-topsort-button>
  </el-toolbar>
</template>
<script>
import ContentTopSortButton from './ContentTopSortButton.vue'
import './contentOperatScript.js'
const util = zving.common.util
const ContentAddButton = zving.views.contentcore.components.ContentAddButton
const ContentDeleteButton = zving.views.contentcore.components.ContentDeleteButton
const ContentDeployButton = zving.views.contentcore.components.ContentDeployButton
const ContentCopyButton = zving.views.contentcore.components.ContentCopyButton
const ContentMoveButton = zving.views.contentcore.components.ContentMoveButton
const ContentSortButton = zving.views.contentcore.components.ContentSortButton
const ContentImportButton = zving.views.contentcore.components.ContentImportButton
const ContentAttributesButton = zving.views.contentcore.components.ContentAttributesButton
const socialMediaPushButton = zving.views.contentcore.components.SocialMediaPushButton

window.namespace('zving.views.contentcore.components.ContentListToolbar')
export default zving.views.contentcore.components.ContentListToolbar
Object.assign(zving.views.contentcore.components.ContentListToolbar, {
  components: {
    'content-add-button': ContentAddButton,
    'content-delete-button': ContentDeleteButton,
    'content-deploy-button': ContentDeployButton,
    'content-copy-button': ContentCopyButton,
    'content-move-button': ContentMoveButton,
    'content-sort-button': ContentSortButton,
    'content-topsort-button': ContentTopSortButton,
    'content-import-button': ContentImportButton,
    'content-attributes-button': ContentAttributesButton,
    'socialmedia-push-button': socialMediaPushButton
  },
  props: {
    selectedRows: {
      type: Array,
      default: function() {
        return []
      }
    },
    catalogId: {
      type: [Number, String]
    },
    detailContent: {
      type: Object
    },
    contentType: {
      type: String
    },
    orderType: {
      type: String
    },
    multiOperates: {
      type: Array,
      default: function() {
        return []
      }
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
      return this.selectedRows && this.selectedRows.length > 1 ? this.selectedRows.map(val => val.ID).join(',') : ''
    },
    showBtn() {
      return !!(this.selectedRows && this.selectedRows.length > 1)
    },
    contentTypes() {
      let selectTypes = this.selectedRows && this.selectedRows.length > 1 ? this.selectedRows.map(val => val.contentTypeID) : new Set()
      let arrays = Array.from(selectTypes)
      return arrays.join(',')
    }
  },
  watch: {
    catalogId() {
      this.getCatalogAlias()
    }
  },
  data() {
    return {
      buttons: ['content-add-button'],
      buttonType: 'text',
      selectAllLoading: false,
      operateFuncs: [],
      catalogAlias: ''
    }
  },
  methods: {
    // 刷新列表
    updateList() {
      if (window.refreshContentList) {
        window.refreshContentList()
      }
    },
    selectOperate(e) {
      let fn = this.operateFuncs[e]
      if (typeof fn === 'function') {
        fn(this.selectedRows)
      }
    },
    selectedAllHandler() {
      this.selectAllLoading = true
      this.$emit('select-all')
      setTimeout(() => { this.selectAllLoading = false }, 1000)
    },
    async publish(ids, type) {
      let resp = await axios.put(`/ui/contentcore/contentpublish/${ids}/${type}`, {
        catalogID: this.catalogId
      })
      util.showResponseMessage(resp.data)
      resp.data.status === 1 && this.updateList()
    },

    async changeAttriutes(val) {
      let resp = await axios.put(`/ui/contentcore/contents/${this.contentIds}/${val}`, {
        catalogID: this.catalogId
      })
      util.showResponseMessage(resp.data)
      resp.data.status === 1 && this.updateList()
    },
    async getCatalogAlias() {
      let resp = await axios.get(`/ui/catalogs/${this.catalogId}`)
      this.catalogAlias = resp.data.data.alias
    },
    addGtmcContent(type) {
      let path = `/contentEditor/new?type=${type}${this.catalogId !== 0 ? `&cid=${this.catalogId}` : ''}`
      window.open('contentEditor.html#' + path)
    }
  },
  created() {
    this.getCatalogAlias()
    let obj = {}
    for (let i = 0; i < this.multiOperates.length; i++) {
      let opt = this.multiOperates[i]
      obj[opt.value] = opt.fn
    }
    this.operateFuncs = obj
  }
})
</script>
<style>
.el-multi-operate .el-input__inner {
  height: 28px;
}
</style>
