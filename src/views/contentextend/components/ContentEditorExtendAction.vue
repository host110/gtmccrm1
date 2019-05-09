<template>
  <div>
    <!-- <el-form :model="content" ref="pkDataForm" label-width="230px" label-suffix="："> -->
      <div v-for="group in modelSchema" :key="group.code">
        <div class="panel-fieldset" >
          <h4 class="panel-legend">{{group.name}}</h4>
            <z-from-item v-for="field in group.columns" :key="field.code" :data-var="'extend['+field.code+']'" :field="field">
              <component :is="controlType(field)" v-model="content.extend[field.code]" :config="getControlConfig(field)">
              </component>
            </z-from-item>
        </div>
      </div>

      <div v-for="group1 in contentTypeModelSchema" :key="group1.code">
        <div class="panel-fieldset" >
          <h4 class="panel-legend">{{group1.name}}</h4>
            <z-from-item v-for="field1 in group1.columns" :key="field1.code" :data-var="'contentTypeExtend['+field1.code+']'" :field="field1">
              <component :is="controlType(field1)" v-model="content.contentTypeExtend[field1.code]" :config="getControlConfig(field1)">
              </component>
            </z-from-item>
        </div>
      </div>
    <!-- </el-form> -->
  </div>
</template>

<script>
const ControlPassword = zving.views.platform.components.control.ControlPassword
const ControlRadio = zving.views.platform.components.control.ControlRadio
const ControlCheckbox = zving.views.platform.components.control.ControlCheckbox
const ControlSelect = zving.views.platform.components.control.ControlSelect
const ControlText = zving.views.platform.components.control.ControlText
const ControlTextArea = zving.views.platform.components.control.ControlTextArea
const ControlNumber = zving.views.platform.components.control.ControlNumber
const ControlDatePicker = zving.views.platform.components.control.ControlDatePicker
const ControlUpload = zving.views.platform.components.control.ControlUpload
const ControlRichText = zving.views.platform.components.control.ControlRichText
const FormItem = zving.views.platform.components.control.FormItem

window.namespace('zving.views.contentextend.components.ContentEditorExtendAction')
export default zving.views.contentextend.components.ContentEditorExtendAction
Object.assign(zving.views.contentextend.components.ContentEditorExtendAction, {
  props: {
    content: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  components: {
    'control-password': ControlPassword,
    'control-radio': ControlRadio,
    'control-select': ControlSelect,
    'control-text': ControlText,
    'control-text-area': ControlTextArea,
    'control-number': ControlNumber,
    'control-checkbox': ControlCheckbox,
    'control-date-picker': ControlDatePicker,
    'control-date-upload': ControlUpload,
    'control-rich-text': ControlRichText,
    'z-from-item': FormItem
  },
  data() {
    return {
      modelSchema: [],
      contentTypeModelSchema: [],
      catalogId: 0
    }
  },
  watch: {
    content: async function() {
      await this.loadContentExtendModelData()
      this.initContentExtendWithDefault()
    },
    deep: true
  },
  methods: {
    initContentExtendWithDefault(){
      this.modelSchema.forEach(group => {
        group.columns.forEach(field => {
          if (!this.content.extend[field.code]) {
            Vue.set(this.content.extend, field.code, field.defaultValue)
          }
        })
      })
    },

    async loadContentExtendModelData() {
      if (!this.content.catalogID || (this.content.catalogID && this.content.catalogID === this.catalogId)) {
        return
      }
      if (!this.content.extend) {
        Vue.set(this.content, 'extend', {})
      }
      this.modelSchema = []
      this.catalogId = this.content.catalogID
      this.modelSchema = []
      let resp = await axios.get(`/ui/contentcore/catalogs/${this.catalogId}/extends`)
      let config = resp.data.data
      if (config.contentModelCode) {
        resp = await axios.get(`/ui/contentextends/${config.contentModelCode}`)
        let model = resp.data.data.modelSchema
        if (model && model.length > 0 && this.content.contentTypeID !== 'Video') {
          this.$emit('callback')
          this.modelSchema = model
        }
      }

      if (this.content.contentTypeID) {
        let res = await axios.get(`/ui/contentextends/${this.content.contentTypeID}`)
        if (res.data.data) {
          let model = res.data.data.modelSchema
          if (model && model.length > 0) {
            this.$emit('callback')
            this.contentTypeModelSchema = model
          }
        }
      }
    },
    controlType(item) {
      if (item.controlType === 'Text' && item.dataType === 'Long') {
        return 'control-number'
      }
      switch (item.controlType) {
        case 'Password':
          return 'control-password'
        case 'Radio':
          return 'control-radio'
        case 'Select':
          return 'control-select'
        case 'Text':
          return 'control-text'
        case 'TextArea':
          return 'control-text-area'
        case 'Checkbox':
          return 'control-checkbox'
        case 'Date':
          return 'control-date-picker'
        case 'DateTime':
          return 'control-date-picker'
        case 'RichText':
          return 'control-rich-text'
        case 'ImageUpload':
        case 'FileUpload':
        case 'AudioUpload':
        case 'VideoUpload':
          return 'control-date-upload'
        default:
          return ''
      }
    },
    getControlConfig(field) {
      let config = {
        dataType: field.dataType
      }

      if (field.listOptions) {
        config.listOptions = field.listOptions
      }

      if (field.controlType === 'DateTime') {
        config.type = 'datetime'
      }
      if (['ImageUpload', 'FileUpload', 'AudioUpload', 'VideoUpload'].includes(field.controlType)) {
        config.resourceType = field.controlType.substring(0, field.controlType.length - 6)
      }
      return config
    }
  }

})
</script>
