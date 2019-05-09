<template>
  <div>
    <el-row>
      <template v-for="dimension in dimensions">
        <el-col :span="12" :key="dimension.ID">
          <el-form-item :label="dimension.name+''">
            <el-input v-model="dimension.selectedCatalogNames"  placeholder="请选择分类" :disabled="true" style="max-width:360px;">
              <el-button slot="append" @click="onClick(dimension)">选择</el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <dimensions-selector ref="dimSelector" :data="data" :dimension-id="currentDim.ID" :checked.sync="checkedData" :checkedName.sync="checkedNames" :show.sync="dialogVisible"></dimensions-selector>
  </div>
</template>
<script>
import DimensionsSelector from './DimensionsSelector.vue'
// const DimensionsSelector = zving.views.contentadvance.components.DimensionsSelector
window.namespace('zving.views.contentadvance.components.ContentEditorExtendAction')
export default zving.views.contentadvance.components.ContentEditorExtendAction
Object.assign(zving.views.contentadvance.components.ContentEditorExtendAction, {
  data() {
    return {
      dialogVisible: false,
      dimensions: [],
      data: [],
      dimensionsBak: [],
      currentDim: [],
      checkedNames: '',
      changeDims: [],
      delDims: [],
      checkedData: [],
      currentID: -1,
      defaultProps: {
        children: 'children',
        label: 'name',
        key: 'ID'
      }
    }
  },
  props: {
    content: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  methods: {
    onClick(dim) {
      this.currentDim = dim
      this.data = dim.catalogDatas
      this.checkedData = dim.selectedCatalogIDs
      this.checkedNames = dim.selectedCatalogNames
      this.dialogVisible = true
    },
    async loadDimension() {
      let resp = await axios.get(`/ui/gtmc/contentadv/dinmentsiondatas?contentID=${this.content.ID}&catalogID=${this.content.catalogID}`)
      if (resp.data.status === 1) {
        this.dimensions = resp.data.data
        this.dimensionsBak = Object.assign([], resp.data.data)
        if (this.dimensions.length > 0) {
          const dim = this.dimensions[0]
          this.$emit('callback')
          if (!this.content.ID) {
            this.content['changDims'] = [{ID: dim.ID, catalogIDs: dim.selectedCatalogIDs, op: 'ADD'}]
            this.$emit('update:content', this.content)
          }
        }
      }
    }
  },
  watch: {
    content: {
      handler(val, oldVal) {
        if (this.currentID !== val.ID) {
          this.loadDimension()
          this.currentID = val.ID
        }
      },
      deep: true
    },
    checkedNames(curVal) {
      this.currentDim.selectedCatalogNames = curVal
      let bak = this.dimensionsBak.find(val => this.currentDim.ID === val.ID)
      if (bak) {
        if (!this.content.ID) {
          bak = Object.assign(bak, {selectedCatalogIDs: []})
        }
        let addIds = this.checkedData.filter(val => !bak.selectedCatalogIDs.find(val2 => val2 === val))
        let delIds = bak.selectedCatalogIDs.filter(val => !this.checkedData.find(val2 => val2 === val))
        this.changeDims = this.changeDims.filter(val => val.ID === this.currentDim.ID && val.op === 'ADD')
        this.changeDims = this.changeDims.filter(val => val.ID === this.currentDim.ID && val.op === 'DEL')
        if (addIds.length > 0) {
          bak.selectedCatalogIDs = bak.selectedCatalogIDs.concat(addIds)
          this.changeDims.push({ ID: this.currentDim.ID, catalogIDs: addIds, op: 'ADD' })
        }
        if (delIds.length > 0) {
          bak.selectedCatalogIDs = bak.selectedCatalogIDs.filter(val => delIds.indexOf(val) === -1)
          this.changeDims.push({ ID: this.currentDim.ID, catalogIDs: delIds, op: 'DEL' })
        }
      }
      if (this.changeDims.length > 0) {
        let dims = this.content
        let currentDimID = this.currentDim.ID
        if (dims['changDims'] && dims['changDims'].length > 0) {
          let otherDims = dims['changDims'].filter(item => item.ID !== currentDimID)
          let allChangedDims = otherDims.concat(this.changeDims)
          dims['changDims'] = allChangedDims
        } else {
          dims['changDims'] = this.changeDims
        }
        this.$emit('update:content', dims)
      }
    }
  },
  components: {
    'dimensions-selector': DimensionsSelector
  }
})
</script>
