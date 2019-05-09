<template>
  <div>
    <el-dialog title="选择分类" :visible.sync="isShow" width="30%" :before-close="handleClose">
     <el-toolbar>
       <el-checkbox v-model="selectAllchecked" @change="selectAllchanged">全选</el-checkbox>
    </el-toolbar>
      <el-tree :data="data" show-checkbox node-key="ID"  :check-strictly="checkStrictly" :default-checked-keys="checkedData" @check-change="onCheckChange" :props="defaultProps" ref="dimTree">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow=false">取 消</el-button>
        <el-button type="primary" @click="onOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
window.namespace('zving.views.contentadvance.components.DimensionsSelector')
export default zving.views.contentadvance.components.DimensionsSelector
Object.assign(zving.views.contentadvance.components.DimensionsSelector, {
  data() {
    return {
      checkStrictly: true,
      defaultProps: {
        children: 'children',
        label: 'name',
        key: 'ID'
      },
      selectAllchecked: false
    }
  },
  props: {
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    dimensionId: {
      type: Number,
      default: 0
    },
    checked: {
      type: Array,
      default: function() {
        return []
      }
    },
    show: {
      type: Boolean
    },
    checkedName: {
      type: String
    }
  },
  computed: {
    checkedData: {
      get() {
        return this.checked
      },
      set(val) {
        this.$emit('update:checked', val)
        return val
      }
    },
    isShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }

  },
  methods: {
    handleClose() {
      this.isShow = false
      return this.isShow
    },
    onOk() {
      console.log('entered...........')
      let arr = []
      let selected = this.$refs.dimTree.getCheckedNodes()
      console.log(selected, 'ssss')
      selected.forEach(node => { if (node.ID !== 0) { arr.push(node.name) } })
      console.log(arr.join())
      this.$emit('update:checkedName', arr.join())
      this.isShow = false
    },
    onCheckChange() {
      this.checkedData = this.$refs.dimTree.getCheckedKeys().filter(val => val !== 0)
    },
    async loadNode(node, resolve) {
      if (node.id === 0) {
        resolve(node.data)
      } else if (node.data.children && node.data.children.length > 0) {
        resolve(node.data.children)
      } else {
        let subCatalogData = await this.getNodeData(node.data.ID)
        resolve(subCatalogData)
      }
    },
    async getNodeData(nodeID) {
      const res = await axios.get(`/ui/dimensions/${this.dimensionId}/catalogstree`, {
        params: {
          parentID: nodeID
        }
      })
      return res.data.data
    },
    selectAllchanged(val) {
      if (val) {
        let arr = []
        this.data.forEach(node => { if (node.ID !== 0) { arr.push(node.ID) } })
        this.checkedData = arr
        this.$refs.dimTree.setCheckedKeys(arr)
      } else {
        this.checkedData = []
        this.$refs.dimTree.setCheckedKeys([])
      }
    }
  }
})
</script>
