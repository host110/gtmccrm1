<template>
    <div>
      <div v-show="!!catalogId||dimensionID==-1">
        <el-row>
          <el-col :span="24">
             <content-list-toolbar ref="listToolBar" :multi-operates="multiOperates" :order-type="orderType" :selected-rows="selectedRows" :detail-content.sync="detailContent" @select-all="selectAllChanged" :catalog-id="catalogId" :content-type="contentType"></content-list-toolbar>
          </el-col>
          <el-col :span="17" class="list-or-grid" v-if="false">
            <div style="float: right;">
             <el-radio-group v-model="listLayout">
                <el-radio-button label="list">
                  <i class="fa fa-list-ul"></i>
                </el-radio-button>
                <el-radio-button label="grid">
                  <i class="fa fa-th"></i>
                </el-radio-button>
              </el-radio-group>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around" align="middle" :gutter="10" v-if="!isComplexSearch">
            <el-col :span="5">
              <el-select class="layout-select" placeholder="" clearable v-model="orderType" @change="getContentList">
                <el-option v-for="item in orderTypeList" :key="'key_'+item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
              </el-col>
              <el-col :span="5">
              <el-select class="layout-select" placeholder="" clearable v-model="status" @change="getContentList">
                <el-option v-for="item in statusList" :key="'key_'+item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
                <el-input v-model="search" placeholder="请输入标题" size="medium" @keyup.enter.native="getContentList">
                  </el-input>
            </el-col>
            <el-col :span="5">
              <el-button-group>
                  <el-button @click="getContentList" type="primary">
                    <i class="fa fa-search"></i>搜索
                  </el-button>
                  <el-button @click="isComplexSearch=!isComplexSearch">高级搜索 ...</el-button>
              </el-button-group>
            </el-col>
            <el-col :span="3" class="list-or-grid" style="line-height:normal">
              <div style="float: right;">
                <el-radio-group v-model="listLayout">
                  <el-radio-button label="list">
                    <i class="fa fa-list-ul"></i>
                  </el-radio-button>
                  <el-radio-button label="grid">
                    <i class="fa fa-th"></i>
                  </el-radio-button>
                  <el-radio-button label="table">
                    <i class="fa fa-table"></i>
                  </el-radio-button>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
        <template v-else>
          <el-row type="flex" class="row-bg" justify="space-around" align="middle" :gutter="10">
            <el-col :span="4">
              <el-select class="layout-select" placeholder="" clearable v-model="orderType" @change="getContentList">
                <el-option v-for="item in orderTypeList" :key="'key_'+item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
              </el-col>
              <el-col :span="4">
              <el-select class="layout-select" placeholder="" clearable v-model="status" @change="getContentList">
                <el-option v-for="item in statusList" :key="'key_'+item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
              </el-col>
            <el-col :span="8">
                <el-input v-model="search" placeholder="请输入标题" size="medium" @keyup.enter.native="getContentList">
                </el-input>
            </el-col>
            <el-col :span="8">
                <el-input v-model="keyWord" placeholder="请输入关键字" size="medium" @keyup.enter.native="getContentList">
                </el-input>
            </el-col>
          </el-row>
          <div style="padding:3px"></div>
          <el-row type="flex" class="row-bg" justify="space-around" align="middle" :gutter="10">
            <el-col :span="8">
                <el-input v-model="editor" placeholder="请输入编辑" size="medium" @keyup.enter.native="getContentList">
                </el-input>
            </el-col>
            <el-col :span="8">
                <el-input v-model="author" placeholder="请输入作者" size="medium" @keyup.enter.native="getContentList">
                </el-input>
            </el-col>
            <el-col :span="8">
              <el-select class="layout-select" placeholder="选择内容类型" clearable v-model="contentSelectType" @change="getContentList">
                <el-option  :label="value" :key="value" :value="key" v-for="(value,key) in contentTypeList"></el-option>
              </el-select>
            </el-col>
          </el-row>
           <div style="padding:3px"></div>
          <el-row type="flex" class="row-bg" justify="space-around" align="middle" :gutter="8">

            <el-col :span="8">
             <el-date-picker id="contentView-date-picker" class="layout-date-picker" v-model="dateInterval" type="datetimerange" format="yyyy-MM-dd HH:mm" start-placeholder="发布时间"   @change="getContentList" end-placeholder="发布时间" style="width:100%"></el-date-picker>
            </el-col>
            <el-col :span="8">
             <div>属性：
                <span title="图片" style="cursor:pointer;margin-right:6px;" :class="{active: query.attr.image}" @click="query.attr.image = !query.attr.image;getContentList()"><i class="fa fa-image"></i></span>
                <span title="视频" style="cursor:pointer;margin-right:6px;" :class="{active: query.attr.video}" @click="query.attr.video = !query.attr.video;getContentList()"><i class="fa fa-film"></i></span>
                <span title="附件" style="cursor:pointer;margin-right:6px;" :class="{active: query.attr.attach}" @click="query.attr.attach = !query.attr.attach;getContentList()"><i class="fa fa-archive"></i></span>
                <span title="热点" style="cursor:pointer;margin-right:6px;" :class="{active: query.attr.hot}" @click="query.attr.hot = !query.attr.hot;getContentList()"><i class="fa fa-fire"></i></span>
                <span title="置顶" style="cursor:pointer;margin-right:6px;" :class="{active: query.attr.top}" @click="query.attr.top = !query.attr.top;getContentList()"><i class="fa fa-arrow-up"></i></span>
                <span title="推荐" style="cursor:pointer;margin-right:6px;" :class="{active: query.attr.recommend}" @click="query.attr.recommend = !query.attr.recommend;getContentList()"><i class="fa fa-thumbs-up"></i></span>
             </div>
            </el-col>
            <el-col :span="5">
              <el-button-group>
                <el-button  type="primary" @click="getContentList">
                  <i class="fa fa-search"></i>高级搜索
                </el-button>
                <el-button @click="isComplexSearch=!isComplexSearch">搜索 ...</el-button>
              </el-button-group>
            </el-col>
            <el-col :span="3" class="list-or-grid" style="line-height:normal">
              <div style="float: right;">
                <el-radio-group v-model="listLayout">
                  <el-radio-button label="list">
                    <i class="fa fa-list-ul"></i>
                  </el-radio-button>
                  <el-radio-button label="grid">
                    <i class="fa fa-th"></i>
                  </el-radio-button>
                   <el-radio-button label="table">
                    <i class="fa fa-table"></i>
                  </el-radio-button>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
        </template>
        <div class="content-list">
          <el-table ref="multipleTable" :data-read-url="getContentData" :show-loading="false" :page-size="20" v-if="listLayout=='table'" :multi-operates="multiOperates">
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
            <el-table-column label="标题" >
              <template slot-scope="scope">
                <span v-if="hasPrivs('Draft.Dept.Draft.Edit')"><a :title="scope.row.title" @click.stop="edit(scope.row)">{{scope.row.title}}</a></span>
                <span v-else>{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
              <template slot-scope="scope">
                <span>{{scope.row.statusName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="发布时间" width="140">
              <template slot-scope="scope">
                <span>{{scope.row.publishDate | fixDateTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="110" align="right">
              <template slot-scope="scope">
                <el-button @click.stop="publishByListToolBar(scope.row.ID,'pub')" type="text" title="发布" :priv="'com.zving.cms.Catalog.Content.Publish.'+catalogId">
                  <i class="fa fa-send-o"></i>发布
                </el-button>
                <el-dropdown>
                  <el-button type='text'>
                    <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown" class="button-dropdown">
                    <el-dropdown-item>
                      <el-button v-if="hasPrivs('Draft.Person.Draft.Edit')" @click.stop="edit(scope.row)" type="text" title="编辑"  :priv="'com.zving.cms.Catalog.Content.Edit.'+scope.row.catalogID">
                        <i class="fa fa-edit"></i>编辑
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item >
                      <el-button @click.stop="preview(scope.row)" v-if="!!scope.row.catalogID" type="text" title="预览">
                        <i class="fa fa-eye"></i>预览
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <content-delete-button v-if="hasPrivs('Draft.Person.Draft.Del')" :selected-rows="[scope.row]" @refresh-content="search()" :catalog-id="scope.row.catalogID" button-type="text"></content-delete-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <el-list-view ref="multipleTable" :data="contentTable" :data-read-url="getContentData" :show-loading="false" :page-size="20"  @selection-change="onSelectionChange" :layout="listLayout" v-else selectable :multi-operates="multiOperates">
            <template slot-scope="row">
              <div class="panel-card">
                <el-row :gutter="16">
                  <el-col :span="4" class="item-logo-ct">
                    <div :class="listLayout=='list'?'logoFile':'logoFile_table'" :style="{backgroundImage:'url('+(!row.listLogo?'':row.listLogo)+'),url(assets/images/picture404-'+((row.ID||row.$index) % 4)+'.png)'}"></div>
                  </el-col>
                  <el-col :span="20" class="item-info-ct">
                    <i :class="row.contentTypeID | fixIcon" style="font-size:17px"></i><a :class="{'list-card-title' : true, 'ellipsis' : listLayout=='list'?true:false}" :title="row.title" href="javascript:void(0)" @click.stop="edit(row)" :style="row.titleStyle">&nbsp;{{row.title|getchars(60)}}</a>
                    <div v-if="listLayout=='list'">
                      <p class="summary" v-if="!row.bodyText">{{row.summary|getchars(110)}}</p>
                      <p class="summary" v-else>{{row.bodyText|getchars(110)}}</p>
                    </div>
                    <div class="datetime" :class="{absolute: listLayout=='list'}">{{row.publishDate | fixDateTime}}</div>
                  <content-quick-editbutton @sort="sort" :first="contentTable.indexOf(row) === 0" :last="contentTable.indexOf(row) === contentTable.length-1" :selected-row="row" :catalog-id="row.catalogID" :order-type="orderType"></content-quick-editbutton>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-list-view>
        </div>
      </div>
  </div>
</template>
<script>
import util from '@src/common/util.js'
import ContentListToolbar from './components/ContentListToolbar.vue'
import ContentQuickEditButton from './components/ContentQuickEditButton.vue'
import Privilege from '@src/common/privilege.js'
import ContentDeleteButton from './components/ContentDeleteButton.vue'

export default {
  components: {
    'content-list-toolbar': ContentListToolbar,
    'content-quick-editbutton': ContentQuickEditButton,
    'content-delete-button': ContentDeleteButton
  },
  filters: {
    fixIcon: function(val) {
      switch (val) {
        case 'Image':
          return 'fa fa-image'
        case 'Audio':
          return 'fa fa-music'
        case 'Video':
          return 'fa fa-video-camera'
        case 'File':
          return 'fa fa-file-archive-o'
        case 'VideoGroup':
          return 'fa fa-film'
        case 'Special':
          return 'fa fa-id-card-o'
        default:
          return 'fa fa-file-text-o'
      }
    },
    getchars: function(summary, len) {
      len = len > 60 ? 300 : 60
      return summary ? summary.slice(0, len) : ''
    },
    fixDateTime: function(val) {
      return val ? util.formatDate(val, 'yyyy-MM-dd HH:mm') : '　'
    }
  },
  props: {
    catalogId: {
      type: [Number, String],
      required: true
    },
    contentType: {
      type: String
    },
    timestr: String,
    dimensionID: [Number, String]
  },
  data() {
    return {
      listLayout: localStorage.listLayout ? localStorage.listLayout : 'list',
      contentTable: [],
      search: '',
      selectedRows: [],
      orderType: '',
      orderTypeList: [{label: '默认排序', value: ''}, {label: '按添加日期', value: 'addtime'}, {label: '按发布日期', value: 'publishdate'}],
      status: '',
      statusList: [{label: '所有', value: ''}, {label: '我创建的', value: 'add'}, {label: '初稿', value: 'draft'},
        {label: '暂存', value: 'temporary'}, {label: '重新编辑', value: 'editing'}, {label: '流转中', value: 'workflow'},
        {label: '待发布', value: 'topublish'}, {label: '已发布', value: 'published'}, {label: '已下线', value: 'offline'},
        {label: '已归档', value: 'archive'}, {label: '投稿', value: 'contribute'}],
      detailContent: {
        show: false,
        ID: '',
        catalogID: this.catalogId,
        contentTypeID: ''
      },
      query: {
        attr: {
          image: false,
          video: false,
          attach: false,
          hot: false,
          recommend: false,
          top: false
        }
      },
      contentTypeList: [],
      isComplexSearch: false,
      contentSelectType: '',
      dateInterval: '',
      author: '',
      keyWord: '',
      editor: '',
      multiOperates: [
        {
          label: '删除',
          value: 'delete',
          fn: rows => { this.$refs.listToolBar.$refs.deleteButton.del() }
        }, {
          label: '发布',
          value: 'publish',
          fn: rows => { this.$refs.listToolBar.publish(rows.map(val => val.ID).join(','), 'pub') }
        }, {
          label: '待发布',
          value: 'topublish',
          fn: rows => { this.$refs.listToolBar.publish(rows.map(val => val.ID).join(','), 'topub') }
        }, {
          label: '下线',
          value: 'offline',
          fn: rows => { this.$refs.listToolBar.publish(rows.map(val => val.ID).join(','), 'offline') }
        }, {
          label: '复制',
          value: 'copy',
          fn: rows => { this.$refs.listToolBar.$refs.copyButton.handleClick() }
        }, {
          label: '转移',
          value: 'move',
          fn: rows => { this.$refs.listToolBar.$refs.moveButton.handleClick() }
        }, {
          label: '排序',
          value: 'sort',
          fn: rows => { this.$refs.listToolBar.$refs.sortButton.sort() }
        }, {
          label: '网站群推送',
          value: 'deploy',
          fn: rows => { this.$refs.listToolBar.$refs.deployButton.open = true }
        }, {
          label: '推荐',
          value: 'setRecommend',
          fn: rows => { this.$refs.listToolBar.changeAttriutes('recommend') }
        }, {
          label: '取消推荐',
          value: 'cancelRecommend',
          fn: rows => { this.$refs.listToolBar.changeAttriutes('cancelrecommend') }
        }, {
          label: '设置热点',
          value: 'setHot',
          fn: rows => { this.$refs.listToolBar.changeAttriutes('sethot') }
        }, {
          label: '取消热点',
          value: 'cancelHot',
          fn: rows => { this.$refs.listToolBar.changeAttriutes('cancelhot') }
        }
      ]
    }
  },
  watch: {
    catalogId() {
      if (this.dimensionID !== -1) {
        this.getContentList()
      }
    },
    timestr() {
      if (this.dimensionID === -1) {
        this.getContentList()
      }
    },
    listLayout(val) {
      localStorage.listLayout = val
    }
  },
  created() {
    this.getContentTypeList()
  },

  mounted () {
    // 提供全局刷新的方法供新建窗口调用
    window.refreshContentList = this.refreshContentList
  },

  methods: {
    selectAllChanged() {
      this.$refs.multipleTable.pagination.selectAllChanged(!this.$refs.multipleTable.pagination.selectAllChecked)
    },
    getContentData() {
      const dateInterval = this.dateInterval
      if (this.dimensionID !== -1) {
        let params = {
          catalogID: this.catalogId,
          type: this.status,
          title: encodeURIComponent(this.search),
          author: encodeURIComponent(this.author),
          keyWord: encodeURIComponent(this.keyWord),
          editor: encodeURIComponent(this.editor),
          contentSelectType: this.contentSelectType,
          startTime: dateInterval ? Date.parse(dateInterval[0]) : null,
          endTime: dateInterval ? Date.parse(dateInterval[1]) : null,
          orderType: this.orderType,
          attr: this.query.attr
        }
        return ['/ui/contentcore/contents', {params}]
      } else {
        let params = {
          timestr: this.timestr,
          type: this.status,
          title: encodeURIComponent(this.search),
          author: encodeURIComponent(this.author),
          keyWord: encodeURIComponent(this.keyWord),
          editor: encodeURIComponent(this.editor),
          contentSelectType: this.contentSelectType,
          startTime: dateInterval ? Date.parse(dateInterval[0]) : null,
          endTime: dateInterval ? Date.parse(dateInterval[1]) : null,
          summary: encodeURIComponent(this.summary),
          orderType: this.orderType,
          attr: this.query.attr
        }
        return ['/ui/contentcore/timedimension/contents', {params}]
      }
    },
    gotoDetailPage(row) {

    },
    async getContentTypeList() {
      let catalogId = this.catalogId
      let resp = await axios.get(`/ui/catalogs/${catalogId}/contenttypes`)
      if (resp.data.status === 1) {
        this.contentTypeList = resp.data.data
      }
    },
    edit(row) {
      if (row.ID && row.contentTypeID === 'Special') {
        if (row.copyID && (row.copyType === 2 || row.copyType === 3)) { // 映射 或 内部链接
          window.open(`specialDesigner.html?ID=${row.copyID}`)
        } else if (row.redirectURL && row.redirectURL.indexOf('type=Special&ID=') > 0) { // 标题新闻
          var ID = util.url.getQueryValue(row.redirectURL, 'ID')
          window.open(`specialDesigner.html?ID=${ID}`)
        } else {
          window.open(`specialDesigner.html?ID=${row.ID}`)
        }
      } else {
        let id = row.ID ? row.ID : 'new'
        let format = row.extendJSON && JSON.parse(row.extendJSON).format
        let path = `/contentEditor/${id}?type=${row.contentTypeID}&cid=${row.catalogID}`
        path = format ? path + `&format=${format}` : path
        if (row.contentTypeID === 'Special'){
          this.$router.push({
            path: `/special/${row.catalogID}/${id}`
          })
        } else {
          window.open('contentEditor.html#' + path)
        }
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
        currentLink = `preview.html?id=${dataID}&type=special&pageType=Special`
      }
      window.open(currentLink)
    },
    hasPrivs: function(val) {
      return !!(val && Privilege.hasPriv(val))
    },
    async publish(id, type) {
      let resp = await axios.put(`/ui/contentcore/contentpublish/${id}/${type}`)
      util.showResponseMessage(resp.data)
      if (resp.data.status === 1) {
        this.$emit('refresh-content', this.contentId)
      }
    },
    publishByListToolBar(ID, type) {
      this.$refs.listToolBar.publish(ID, 'pub')
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
      this.$emit('refresh-content')
    },
    getContentList() {
      this.$refs.multipleTable && this.$refs.multipleTable.getData()
    },
    refreshContentList() {
      this.getContentList()
    },
    onSelectionChange(selection) {
      this.selectedRows = selection
    },
    async sort(val, isUp){
      let index = this.contentTable.indexOf(val)
      if (isUp && index === 0 || !isUp && index + 1 === this.contentTable.length) {
        return
      }
      let target = index + (isUp ? -1 : 1)
      let param = {
        targetOrderFlag: this.contentTable[target].orderFlag,
        topFlag: this.contentTable[target].topFlag,
        catalogID: val.catalogID
      }
      let resp = await axios.put(`/ui/contentcore/contents/${val.ID}/dragsort`, param)
      if (resp.data.status === 1) {
        this.getContentList()
        this.$emit('refresh-content', val.ID)
      }
    }
  }
}
</script>
<style>
.self-table .el-table__header .el-input {
  padding-left: 0;
}

.self-table th > .cell .el-select {
  float: right;
  padding: 0;
}
</style>
<style scoped>
.content-list >>> .el-loading-mask {
  background-color: rgba(0, 0, 0, 0)
}
.content-list > .el-table {
  margin-top: 10px;
}
.ellipsis {
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  display: inline-block;
  line-height: 19px;
  vertical-align: sub;
  width: 600px;
}
.col-wrap {
  background: white;
  flex-basis: 350px;
  max-width: none;
  flex-shrink: 0;
  position: relative;
}

.content-input-wrap {
  color: #999;
  font-size: 13px;
  display: inline-block;
  vertical-align: middle;
}

.page {
  float: right;
}

.div-scroll {
  height: 350px;
  overflow: auto;
}

.search-input{
  display: inline-block;
  width:260px;
}
.summary{
  line-height: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 15px;
  color: #999;
  height: 45px;
  margin-bottom: 6px;
}
.datetime{
  text-align: right;
  color: #bbb;
  right: 10px;
  top: -2px;
}
.absolute{
  position: absolute;
}
.el-list-view.grid .item-logo-ct, .el-list-view.grid .item-info-ct{
  float: none;
  width: 100%;
}
.el-list-view.grid .item-info-ct{
  padding:5px 15px !important;
}
.logoFile {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 75%;
  overflow: hidden;
  background-position: center center;
  background-repeat: no-repeat;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
  margin-top: 2px;
  margin-bottom: 2px;
  }
.logoFile_table {
  position: relative;
  width: 80%;
  height: 0;
  padding-bottom: 75%;
  overflow: hidden;
  margin-left: 10%;
  background-position: center center;
  background-repeat: no-repeat;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
  margin-top: 13px;
}
.active {
  color: #28b06e;
}
</style>
