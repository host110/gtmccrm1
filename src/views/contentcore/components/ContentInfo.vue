<template>
  <div class="editor-content">
    <el-form ref="contentForm" :rules="contentFormRules" :model="mContent"  label-suffix=":" label-width="120px"  class="content-form">
      <el-row :gutter="20">
        <el-col :span="24">
          <content-detail-toolbar ref="contentDetailToolbar" :content.sync="content" :content-id="contentId" :catalog-id="catalogId"></content-detail-toolbar>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :lg="17" :xl="17">
          <slot name="afterEditor">
          </slot>
          <div class="panel-fieldset">
            <el-form-item prop="title" label="标题">
              <el-row>
                <el-col :span="18">
                  <el-input v-model="mContent.title" class="editor-style-title" :style="mContent.titleStyle"></el-input>
                </el-col>
                <el-col :span="1">
                  <span style="margin: 6px;">{{mContent.title?mContent.title.length:0}}</span>
                </el-col>
                <el-col :span="5" class="right">
                    <el-button-group>
                      <el-button :type="typeof(mContent.titleStyle) === 'string' ? (mContent.titleStyle.indexOf('black') > -1 ? 'primary' : '') : ''" @click="setTitleStyle('black')">加黑</el-button>
                      <el-button :type="typeof(mContent.titleStyle) === 'string' ? (mContent.titleStyle.indexOf('red') > -1 ? 'primary' : '') : ''" @click="setTitleStyle('red')">加红</el-button>
                      <el-button :type="typeof(mContent.titleStyle) === 'string' ? (mContent.titleStyle.indexOf('bold') > -1 ? 'primary' : '') : ''" @click="setTitleStyle('bold')">加粗</el-button>
                    </el-button-group>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item>
              <el-row>
                <el-col :span="3">
                  <el-button @click="showShortTitle=!showShortTitle" type="text">
                    <span style="color:#b1afaf"> <i class="fa" :class="{'fa-plus':!showShortTitle,'fa-minus':showShortTitle}"> </i>短标题</span>
                  </el-button>
                </el-col>
                <el-col :span="3">
                  <el-button @click="showSubTitle=!showSubTitle" type="text">
                    <span style="color:#b1afaf"> <i class="fa" :class="{'fa-plus':!showSubTitle,'fa-minus':showSubTitle}"> </i>副标题</span>
                  </el-button>
                </el-col>
                <el-col :span="3">
                  <el-button @click="showSourceTitleFlag=!showSourceTitleFlag" type="text">
                    <span style="color:#b1afaf"> <i class="fa" :class="{'fa-plus':!showSourceTitleFlag,'fa-minus':showSourceTitleFlag}"> </i>原标题</span>
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="shortTitle" label="短标题" v-show="showShortTitle">
              <el-row>
                <el-col :span="18">
                  <el-input v-model="mContent.shortTitle"></el-input>
                </el-col>
                <el-col :span="1">
                  <span style="margin: 6px;">{{mContent.shortTitle?mContent.shortTitle.length:0}}</span>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="subTitle" label="副标题" v-show="showSubTitle">
              <el-row>
                <el-col :span="18">
                  <el-input v-model="mContent.subTitle"></el-input>
                </el-col>
                <el-col :span="1">
                  <span style="margin: 6px;">{{mContent.subTitle?mContent.subTitle.length:0}}</span>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="sourceTitle" label="原标题" v-show="showSourceTitleFlag">
              <el-row>
                <el-col :span="18">
                  <el-input v-model="mContent.sourceTitle"></el-input>
                </el-col>
                <el-col :span="1">
                  <span style="margin: 6px;">{{mContent.sourceTitle?mContent.sourceTitle.length:0}}</span>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
          <div :class="{'panel-fieldset': isShowDiv()}" v-show="showPanel">
            <el-row v-if="customLayout.author === 'L' || customLayout.editor === 'L'">
              <el-col :span="12">
                <el-form-item prop="author" label="作者" v-if="customLayout.author === 'L'" :verify="['Length<50']">
                  <el-input v-model="mContent.author"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="editor" label="编辑" v-if="customLayout.editor === 'L'" :verify="['Length<50']">
                  <el-input v-model="mContent.editor"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item prop="attributes" label="内容属性" v-if="customLayout.attributes === 'L'" class="content-attriute">
              <el-row>
                <el-col :span="18">
                    <el-checkbox-group v-model="mContent.attributes" class="content-list">
                      <el-checkbox v-for="attribute in contentAttributes" :key="attribute.value" :value="attribute.value" :label="attribute.value">{{attribute.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="platformAttribute" label="发布平台" v-if="customLayout.platformAttribute === 'L'">
              <el-checkbox-group v-model="mContent.platformAttribute">
                <el-checkbox v-for="plat in platformAttributes" :key="plat.ID" :label="plat.ID">{{plat.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item prop="tags" label="Tag词" v-if="customLayout.tag === 'L'" class="content-attriute">
              <el-tag
                v-for="tag in mContent.tag"
                :key="tag"
                closable
                :disable-transitions="false"
                @close="handleTagClose(tag)"
              >
                <span :title="tag">{{tag | charWidth(10)}}</span>
              </el-tag>
                <select-tags  :tags.sync="mContent.tag" :content-type="mContent.contentTypeID" :show.sync="addTags"></select-tags>
              <el-button v-show="!addTags" class="button-new-tag" size="small" @click="addTags=true"><i class="fa fa-plus"></i></el-button>
            </el-form-item>
            <el-form-item prop="keyword" label="关键字" v-if="customLayout.keyword === 'L'" class="content-attriute">
              <el-row>
                <el-col :span="20">
                  <el-tag
                    v-for="word in keywords"
                    :key="word"
                    closable
                    :disable-transitions="false"
                    @close="handleWordClose(word)"
                  >
                    <span :title="word">{{word | charWidth(10)}}</span>
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="wordInfo.addWord"
                    v-model="wordInfo.inputWord"
                    ref="wordRefs"
                    size="small"
                    @keyup.enter.native="handleWordConfirm"
                    @blur="handleWordConfirm"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showWord"><i class="fa fa-plus"></i></el-button>
                    <!-- <el-input v-model="mContent.keyword"></el-input> -->
                </el-col>
              </el-row>
            </el-form-item>
            <el-row v-if="customLayout.source === 'L'">
              <el-col :span="12">
                <el-form-item prop="source" label="来源" :verify="['Length<80']" class="source-box">
                  <el-input v-model="mContent.source">
                    <el-button @click="pickWord('source','来源词选择')" slot="append"><i class="fa fa-plus"></i></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="sourceURL" label="来源地址" :verify="['Length<150']">
                  <el-input v-model="mContent.sourceURL" placeholder="http://"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item prop="weight" v-if="customLayout.weight === 'L'" label="权重">
              <el-col :span="20">
                <el-slider v-model="mContent.weight" show-input class="weight-slider"></el-slider>
              </el-col>
            </el-form-item>
            <comment-form-item :content.sync="mContent" v-if="customLayout.comment === 'L'"></comment-form-item>
            <content-editor-extend :content.sync="mContent" @callback="showExtend = true"></content-editor-extend>
          </div>
          <slot name="editorList">
          </slot>

        </el-col>
        <el-col :lg="7" :xl="7">
          <div class="sidebar">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本属性" name="1" class="sidebar-item-box">
                <el-form label-width="80px" label-suffix=":">
                  <el-form-item prop="author" label="作者" v-if="customLayout.author !== 'L'" :verify="['Length<50']">
                    <el-input v-model="mContent.author"></el-input>
                  </el-form-item>
                  <el-form-item prop="editor" label="编辑" v-if="customLayout.editor !== 'L'" :verify="['Length<50']">
                    <el-input v-model="mContent.editor"></el-input>
                  </el-form-item>
                    <el-form-item label="所属栏目">
                       <el-input disabled v-model="mContent.catalogName"></el-input>
                         <content-move-button class="btn-move-catalog" :content-ids="!mContent.ID?'new':mContent.ID" :isEditContent="true" :button-name='"切换"' :content-type="mContent.contentTypeID" :catalog-ids="mContent.catalogID" @refresh-content="catalogSelection" :size='"medium"' :button-type='"primary"'></content-move-button>
                    </el-form-item>
                    <div class="sidebar-item-box-logo">
                      <logo-path :path.sync="mContent.logoFile" :preview-path.sync="mContent.fullLogoFile" :resource-dialog-props="resourceDialogProps" :logo-style="logoStyle" @callback="updateResourceID" editPosition="right"></logo-path>
                    </div>
                    <el-form-item prop="attributes" label="内容属性" v-if="customLayout.attributes !== 'L'" class="content-attriute">
                      <el-row>
                        <el-col :span="18">
                            <el-checkbox-group v-model="mContent.attributes" class="content-list">
                              <el-checkbox v-for="attribute in contentAttributes" :key="attribute.value" :value="attribute.value" :label="attribute.value">{{attribute.label}}</el-checkbox>
                            </el-checkbox-group>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item prop="platformAttribute" label="发布平台" v-if="customLayout.platformAttribute !== 'L'">
                      <el-checkbox-group v-model="mContent.platformAttribute">
                        <el-checkbox v-for="plat in platformAttributes" :key="plat.ID" :label="plat.ID">{{plat.name}}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                </el-form>
              </el-collapse-item>
              <slot name="fileExif" >
              </slot>
              <el-collapse-item title="扩展属性" name="2" class="sidebar-item-box sidebar-item-box-extend">
                <el-form label-width="80px" label-suffix=":">
                  <el-form-item prop="tags" label="Tag词" v-if="customLayout.tag !== 'L'" class="content-attriute">
                    <el-tag
                      v-for="tag in mContent.tag"
                      :key="tag"
                      closable
                      :disable-transitions="false"
                      @close="handleTagClose(tag)"
                    >
                      <span :title="tag">{{tag | charWidth(10)}}</span>
                    </el-tag>
                      <select-tags  :tags.sync="mContent.tag" :content-type="mContent.contentTypeID" :show.sync="addTags"></select-tags>
                    <el-button v-show="!addTags" class="button-new-tag" size="small" @click="addTags=true"><i class="fa fa-plus"></i></el-button>
                  </el-form-item>
                  <el-form-item prop="keyword" label="关键字" v-if="customLayout.keyword !== 'L'" class="content-attriute">
                    <el-row>
                      <el-col :span="20">
                        <el-tag
                          v-for="word in keywords"
                          :key="word"
                          closable
                          :disable-transitions="false"
                          @close="handleWordClose(word)"
                        >
                          <span :title="word">{{word | charWidth(10)}}</span>
                        </el-tag>
                        <el-input
                          class="input-new-tag"
                          v-if="wordInfo.addWord"
                          v-model="wordInfo.inputWord"
                          ref="wordRefs"
                          size="small"
                          @keyup.enter.native="handleWordConfirm"
                          @blur="handleWordConfirm"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showWord"><i class="fa fa-plus"></i></el-button>
                          <!-- <el-input v-model="mContent.keyword"></el-input> -->
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item prop="textarea" label-width="0px">
                    <el-row style="position:relative;">
                      <el-col>
                        <el-input type="textarea" v-model="mContent.summary" class="form-item" placeholder="摘要" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
                        <span style="position:absolute;bottom:0px;right:6px;color:#999;">{{summaryCounter}}</span>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item label="发布时间" prop="publishDate" class="time_picker_css">
                    <el-date-picker id="publishDatepick" v-model="mContent.publishDate" value-format="yyyy-MM-dd HH:mm:ss" @change="publishDateChange" type="datetime" placeholder="请选择发布时间">{{mContent.publishDate}}</el-date-picker>
                  </el-form-item>
                  <el-form-item label="下线时间" prop="downlineDate" class="time_picker_css">
                    <el-date-picker id="downlineDatepick" v-model="mContent.downlineDate" value-format="yyyy-MM-dd HH:mm:ss" @change="downlineDateChange" type="datetime" placeholder="请选择下线时间">{{mContent.downlineDate}}}</el-date-picker>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="其它属性" name="3" class="sidebar-item-box">
                <el-form label-width="100px" label-suffix=":">
                  <div v-if="customLayout.source !== 'L'">
                    <el-form-item prop="source" label="来源" :verify="['Length<80']" class="source-box">
                      <el-input v-model="mContent.source">
                        <el-button @click="pickWord('source','来源词选择')" slot="append"><i class="fa fa-plus"></i></el-button>
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="sourceURL" label="来源地址" :verify="['Length<80']">
                      <el-input v-model="mContent.sourceURL" placeholder="http://"></el-input>
                    </el-form-item>
                  </div>
                  <el-form-item prop="weight" v-if="customLayout.weight !== 'L'" label="权重" class="custom-weight">
                    <el-slider v-model="mContent.weight" show-input class="weight-slider"></el-slider>
                  </el-form-item>
                  <comment-form-item :content.sync="mContent" :is-custom-edit="true" v-if="customLayout.comment !== 'L'"></comment-form-item>
                  <el-form-item prop="templateFlag" label="独立模板">
                    <el-switch v-model="mContent.templateFlag" active-value="Y" inactive-value="N"></el-switch>
                  </el-form-item >
                  <div v-if="mContent.templateFlag ==='Y'">
                    <template v-for="item in platformAttributes">
                      <el-form-item :label="item.ID" :key="item.ID" >
                          <template-picker  v-model.trim="mContent.detailTemplate[item.ID]" type="ArticleDetail" :target-platform="item.ID" input-width="110px" ></template-picker>
                      </el-form-item>
                    </template>
                  </div>

                </el-form>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <pick-word :word-flag.sync="pickContent.show" :content-type="mContent.contentTypeID" @wordCallBack="wordCallBack" :type="pickContent.type" :title="pickContent.title"></pick-word>
  </div>
</template>
<script>
import '../js/contentScript.js'
const util = zving.common.util
const TemplatePicker = zving.views.contentcore.TemplatePicker
const LogoPath = zving.views.contentcore.components.LogoPath
const ContentEditorExtend = zving.views.contentcore.components.ContentEditorExtend
const selectWordsDialog = zving.views.wordmanage.components.WordPicker
const selectTags = zving.components.contentComponent.selectTags
const TreeSelect = zving.components.TreeSelect
const emitter = zving.mixins.emitter
const commentFormItem = zving.views.comment.components.ContentEditorExtendAction
const nwCornerButton = zving.components.nwCornerButton
const contentMoveButton = zving.views.contentcore.components.ContentMoveButton
const contentDetailToolbar = zving.views.contentcore.components.ContentDetailToolbar

window.namespace('zving.views.contentcore.components.ContentInfo')
export default zving.views.contentcore.components.ContentInfo
Object.assign(zving.views.contentcore.components.ContentInfo, {
  mixins: [emitter],
  components: {
    nwCornerButton,
    contentDetailToolbar,
    commentFormItem,
    'template-picker': TemplatePicker,
    'logo-path': LogoPath,
    'content-editor-extend': ContentEditorExtend,
    'pick-word': selectWordsDialog,
    'tree-select': TreeSelect,
    'select-tags': selectTags,
    'content-move-button': contentMoveButton
  },

  props: {
    content: {
      type: Object,
      default: function() {
        return {
          titleStyle: { color: '' },
          shortTitleStyle: { color: '' },
          detailTemplate: {},
          templateFlag: 'N'
        }
      }
    },
    siteConfig: {
      type: Object
    },
    contentId: {
      type: [String, Number]
    },
    catalogId: {
      type: [String, Number]
    }
  },
  data() {
    var validateTitle = (rule, value, callback) => {
      if (value) {
        if (value.replace(/[^\x00-\xFF]/g, '***').length > 360) {
          callback(new Error('字数必须小于或等于120个汉字或360个字母'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入内容'))
      }
    }
    var validateShortTitle = (rule, value, callback) => {
      if (value) {
        if (value.replace(/[^\x00-\xFF]/g, '***').length > 150) {
          callback(new Error('字数必须小于或等于50个汉字或150个字母'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateSubTitle = (rule, value, callback) => {
      if (value) {
        if (value.replace(/[^\x00-\xFF]/g, '***').length > 200) {
          callback(new Error('字数必须小于或等于66个汉字或200个字母'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateSourceTitle = (rule, value, callback) => {
      if (value) {
        if (value.replace(/[^\x00-\xFF]/g, '***').length > 360) {
          callback(new Error('字数必须小于或等于120个汉字或360个字母'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateSource = (rule, value, callback) => {
      if (value) {
        if (value.replace(/[^\x00-\xFF]/g, '***').length > 360) {
          callback(new Error('字数必须小于或等于33个汉字或100个字母'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      showExtend: false,
      customLayout: {},
      // 内容属性
      contentAttributes: [],
      platformAttributes: this.$root.platformAttributes,
      shortTitleBak: '',
      showSubTitle: false,
      showShortTitle: false,
      showSourceTitleFlag: false,
      subTitleBak: '',
      bold: false,
      italic: false,
      underline: false,
      // wordpicker
      pickContent: {
        show: false,
        type: '',
        title: ''
      },
      formatItem: ['props', 'extend', 'attributes', 'detailTemplate'],
      activeNames: ['1', '2', '3'],
      selectCatalogFlag: false,

      tagInfo: {
        addTag: false,
        inputTag: '',
        hasSelect: false
      },
      wordInfo: {
        addWord: false,
        inputWord: ''
      },
      keywords: [],
      catalogTree: [],

      resourceDialogProps: {
        selectorURL: 'imageResources',
        resourceType: 'image',
        allowType: '.jpg,.jpeg,.png,gif,.bmp',
        height: 200,
        width: 200,
        imageWidth: 260,
        imageHeight: 260,
        url: ''
      },

      logoStyle: '',
      addTags: false,
      contentFormRules: {
        title: [{ required: true, validator: validateTitle, trigger: 'blur' }],
        shortTitle: [{ required: false, validator: validateShortTitle, trigger: 'blur' }],
        subTitle: [{ required: false, validator: validateSubTitle, trigger: 'blur' }],
        sourceTitle: [{ required: false, validator: validateSourceTitle, trigger: 'blur' }],
        source: [{ required: false, validator: validateSource, trigger: 'blur' }]
      },
      dataLoaded: false,
      oldPublishDate: '',
      oldDownlineDate: ''
    }
  },
  computed: {
    summaryCounter() {
      return this.mContent.summary ? this.mContent.summary.length : 0
    },
    counter() {
      return this.mContent.title ? this.mContent.title.length : 0
    },
    showPanel() {
      if (this.showExtend) {
        return true
      }
      let isShow = false
      for (let i in this.customLayout) {
        if (i !== 'bodyWidth' && this.customLayout[i] === 'L') {
          isShow = true
          return isShow
        }
      }
      return isShow
    },
    mContent: {
      set(val) {
        this.$emit('update:content', val)
      },
      get() {
        return this.getMContent()
      }
    }
  },
  watch: {
    bold(val) {
      if (val) {
        this.mContent.shortTitleStyle.fontWeight = 'bold'
      } else {
        this.mContent.shortTitleStyle.fontWeight = ''
      }
    },
    italic(val) {
      if (val) {
        this.mContent.shortTitleStyle.fontStyle = 'italic'
      } else {
        this.mContent.shortTitleStyle.fontStyle = ''
      }
    },
    underline(val) {
      if (val) {
        this.mContent.shortTitleStyle.textDecoration = 'underline'
      } else {
        this.mContent.shortTitleStyle.textDecoration = ''
      }
    },
    showShortTitle(val) {
      if (val) {
        this.mContent.showSubTitleAndShortTitle = true
      }
    },
    showSubTitle(val) {
      if (val) {
        this.mContent.showSubTitleAndShortTitle = true
      }
    },
    siteConfig: {
      handler: function(val) {
        this.customLayout = JSON.parse(this.siteConfig.articleCustomLayout)
      },
      deep: true
    }
  },
  async created() {
    await this.initContent()
    this.initFormRule()
    this.oldPublishDate = this.content.publishDate
    this.oldDownlineDate = this.content.downlineDate
    // this.$refs['contentForm'].resetFields()
  },
  mounted() {
    this.initFormRule()
  },
  methods: {
    getMContent(){
      if (!this.dataLoaded && this.content.ID) {
        this.showShortTitle = !!this.content.showSubTitleAndShortTitle || (this.content.shortTitle && this.content.shortTitle.length > 0)
        this.showSubTitle = !!this.content.showSubTitleAndShortTitle || (this.content.subTitle && this.content.subTitle.length > 0)
        this.showSourceTitleFlag = this.content.sourceTitle && this.content.sourceTitle.length > 0
        this.dataLoaded = true
      }
      this.keywords = this.content.keyword ? this.content.keyword.split(',') : []
      return this.content
    },
    catalogSelection(catalog) {
      this.resourceDialogProps.catalogID = catalog.ID
      this.mContent.catalogID = catalog.ID
      this.mContent.catalogName = catalog.name
      this.$emit('catalog-change', catalog)
    },
    async initContent() {
      let attResp = await axios.get('/ui/platform/codes/ContentAttribute')
      if (attResp.data.status === 1) {
        this.contentAttributes = attResp.data.data
      }
      let getCatalogTree = await axios.get('/ui/catalog/admintree', {params: {contentType: this.$route.query.type}})
      this.catalogTree = getCatalogTree.data.data
      this.resourceDialogProps = Object.assign({}, this.resourceDialogProps, {catalogID: this.mContent.catalogID})
    },
    pickWord(type, title) {
      this.pickContent = {
        show: true,
        type: type,
        title: title
      }
    },
    wordCallBack(val) {
      if (this.pickContent.type === 'tag') {
        if (val && !this.mContent.tag.includes(val)) {
          this.mContent.tag.push(val)
        }
      } else {
        this.mContent.source = val
      }
    },
    initFormRule() {
      Window.saveContent = this.saveContent
    },
    async saveContent(isOpenNewPage = true) {
      try {
        await util.validateForm(this.$refs.contentForm)
        let resp = {}
        if (this.mContent.file) {
          let allowtype = this.mContent.allowType
          let extension = this.mContent.file.name.substring(this.mContent.file.name.lastIndexOf('.') + 1, this.mContent.file.length)
          if (allowtype && !allowtype.includes(extension.toLowerCase())) {
            util.showResponseMessage({message: `不支持的文件格式${extension}`})
            this.confirmLoading = false
            return
          }
          let formData = new FormData()
          for (let i in this.mContent) {
            this.mContent[i] && formData.append(i, this.formatItem.includes(i) ? JSON.stringify(this.mContent[i]) : this.mContent[i])
          }
          // 新建文章时，避免重复保存内容
          if (this.content.addContentID){
            formData.addContentID = this.content.addContentID
            formData.method = 'ADD'
          }
          let progressInfo = this.$parent.$refs['uploadFile'].progressInfo
          progressInfo.visible = true
          resp = await axios.post('/ui/contentcore/contents/upload', formData, {
            timeout: 6000000000,
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: progressEvent => {
              let total = progressEvent.total - 0
              let loaded = progressEvent.loaded - 0
              progressInfo.percent = total === loaded ? 100 : (loaded / total * 100).toFixed() - 0
            }
          })
          progressInfo.visible = false
        } else {
          // 判断编辑时不需要校验文件存在
          if (!this.content.ID && ((this.mContent.contentTypeID === 'Video' && this.mContent.isExternalURL === 'N' && !this.mContent.fileName) || this.mContent.contentTypeID === 'File' || this.mContent.contentTypeID === 'Audio')) {
            util.showResponseMessage({message: `未选择文件`})
            this.confirmLoading = false
            return
          }
          if (this.mContent.contentTypeID === 'Video' && this.mContent.isExternalURL === 'Y') {
            if (!this.mContent.externalSource) {
              util.showResponseMessage({message: `未填写视频地址`})
              this.confirmLoading = false
              return
            }
          }
          let formData = {}
          for (let i in this.mContent) {
            Vue.set(formData, i, this.mContent[i] && this.formatItem.includes(i) ? JSON.stringify(this.mContent[i]) : this.mContent[i])
          }
          // 相关内容单独处理
          delete formData.relativeContent
          // 新建文章时，避免重复保存内容
          if (this.content.addContentID){
            formData.addContentID = this.content.addContentID
            formData.method = 'ADD'
          }
          resp = this.mContent.ID
            ? await axios.put(`/ui/contentcore/contents/${this.mContent.ID}`, formData)
            : await axios.post('/ui/contentcore/contents', formData)
        }
        util.showResponseMessage(resp.data)
        if (resp.data.status === 1) {
          if (!this.mContent.ID) {
            this.dataLoaded = true
            await util.updatePriv()
            this.mContent.ID = resp.data.contentID || ''
            let path = `/contentEditor/${resp.data.contentID}?type=${this.mContent.contentTypeID}${this.mContent.catalogID ? `&cid=${this.mContent.catalogID}` : ''}`
            if (isOpenNewPage) {
              window.open('contentEditor.html#' + path)
            } else {
              this.$router.replace({path: path})
            }
          }
          this.dispatch('ContentEditor', 'load-content')
          this.$emit('refresh-content')
        }
      } catch (e) {
        util.showErrorMessageBox(e)
      }
    },

    catalogCallBack(row) {
      this.mContent.catalogID = row.ID
      this.mContent.catalogName = row.name
      this.selectCatalogFlag = false
    },

    handleTagClose(tag) {
      this.mContent.tag.splice(this.mContent.tag.indexOf(tag), 1)
    },
    showTag() {
      this.tagInfo.addTag = true
      this.$nextTick(_ => {
        this.$refs.tagRefs.$refs.input.focus()
      })
    },
    handleTagConfirm() {
      let inputTag = this.tagInfo.inputTag
      if (inputTag && !this.mContent.tag.includes(inputTag)) {
        this.mContent.tag.push(inputTag)
      }
      this.tagInfo.addTag = false
      this.tagInfo.inputTag = ''
    },

    handleWordClose(value) {
      this.keywords.splice(this.keywords.indexOf(value), 1)
      this.mContent.keyword = this.keywords.join(',')
    },
    showWord() {
      this.wordInfo.addWord = true
      this.$nextTick(_ => {
        this.$refs.wordRefs.$refs.input.focus()
      })
    },
    handleWordConfirm() {
      let inputWord = this.wordInfo.inputWord
      if (inputWord) {
        this.keywords.push(inputWord)
        this.mContent.keyword = this.keywords.join(',')
      }
      this.wordInfo.addWord = false
      this.wordInfo.inputWord = ''
    },

    setTitleStyle(color) {
      if (typeof this.mContent.titleStyle === 'object') {
        let val = ''
        for (let i in this.mContent.titleStyle) {
          val += i + ':' + this.mContent.titleStyle[i] + ';'
        }
        this.mContent.titleStyle = val
      }
      if (this.mContent.titleStyle.indexOf('{"color":"rgba(0, 0, 0, 1)"}') > -1) {
        this.mContent.titleStyle = ''
      }
      if (color === 'bold') {
        let index = this.mContent.titleStyle.indexOf('font-weight')
        if (index > -1) {
          this.mContent.titleStyle = this.mContent.titleStyle.replace('font-weight:bold;', '')
          return
        }
        this.mContent.titleStyle += 'font-weight:bold;'
      } else {
        let colorStyle = 'color:' + color + ';'
        let colorIndex = this.mContent.titleStyle.indexOf(colorStyle)
        if (colorIndex > -1) {
          let part1 = this.mContent.titleStyle.substring(0, colorIndex)
          let part2 = this.mContent.titleStyle.substring(colorIndex + colorStyle.length)
          this.mContent.titleStyle = part1 + part2
        } else {
          let index = this.mContent.titleStyle.indexOf('color:')
          if (index > -1) {
            let part1 = this.mContent.titleStyle.substring(0, index)
            let part2 = this.mContent.titleStyle.substring(index + this.mContent.titleStyle.substring(index).indexOf(';') + 1)
            this.mContent.titleStyle = part1 + part2
          }
          this.mContent.titleStyle += 'color:' + color + ';'
        }
      }
    },
    setSubTitleColor(val) {
      this.mContent = Object.assign({}, this.mContent, { subTitleStyle: { color: val } })
    },
    setShortTitleColor(val) {
      this.mContent = Object.assign({}, this.mContent, { shortTitleStyle: { color: val } })
    },
    updateResourceID(val) {
      this.mContent.resourceID = val
    },
    isShowDiv() {
      let customLayout = this.customLayout
      if (customLayout.author === 'L') {
        return true
      }
      if (customLayout.editor === 'L') {
        return true
      }
      if (customLayout.attributes === 'L') {
        return true
      }
      if (customLayout.platformAttribute === 'L') {
        return true
      }
      if (customLayout.tag === 'L') {
        return true
      }
      if (customLayout.keyword === 'L') {
        return true
      }
      if (customLayout.source === 'L') {
        return true
      }
      if (customLayout.weight === 'L') {
        return true
      }
      if (customLayout.comment === 'L') {
        return true
      }
      return false
    },
    publishDateChange(value) {
      if (value) {
        if (this.mContent.downlineDate && value > this.mContent.downlineDate) {
          this.mContent.publishDate = this.oldPublishDate
          util.showErrorMessage('发布时间必须小于下线时间')
        }
        if (value < util.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')) {
          this.mContent.publishDate = this.oldPublishDate
          util.showErrorMessage('发布时间必须大于当前时间')
        }
      }
    },
    downlineDateChange(value) {
      if (value) {
        if (this.mContent.publishDate && value < this.mContent.publishDate) {
          this.mContent.downlineDate = this.oldDownlineDate
          util.showErrorMessage('下线时间必须大于发布时间')
        }
        if (value < util.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')) {
          this.mContent.downlineDate = this.oldDownlineDate
          util.showErrorMessage('下线时间必须大于当前时间')
        }
      }
    }
  }
})
</script>

<style scoped>
.editor-content {
  padding-bottom: 20px;
}
.active {
  background-color: #eed2c1;
  border-color: #b39;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 0;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  border-style: dashed;
}
.input-new-tag {
  width: 120px;
  vertical-align: bottom;
}
.sidebar-item-box-extend >>> .el-collapse-item__wrap{
  overflow: initial
}
</style>
<style>
.custom-weight .el-slider__runway.show-input {
  margin-right: 120px;
}

.custom-weight .el-input-number.el-slider__input.el-input-number--small {
  width: 105px;
}

.time_picker_css .el-date-editor.el-input {
  width: 100%;
}
</style>
