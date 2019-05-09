<template>
  <div class="layout-row-main">
    <el-button @click.stop="getDealershipTree"> 获取栏目 </el-button>
    <el-button @click.stop="branchimportcatalog"> 生成栏目 </el-button>
    <el-button @click.stop="updateimportcatalog"> 更新栏目 </el-button>
    <div v-html="dealershipTree">{{dealershipTree}}</div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      dealershipTree: ''
    }
  },
  methods: {
    async getDealershipTree() {
      try {
        let res = await axios.get('/ui/gtmc/batch')
        this.dealershipTree = res.data
      } catch (e) {
        util.showErrorNotification(e)
      }
    },
    async branchimportcatalog() {
      try {
        let res = await axios.post('/ui/gtmc/branchimportcatalog')
        console.log(res)
      } catch (e) {
        util.showErrorNotification(e)
      }
    },
    async updateimportcatalog() {
      try {
        let res = await axios.post('/ui/gtmc/updateCode')
        console.log(res)
      } catch (e) {
        util.showErrorNotification(e)
      }
    }
  },
  created() {
  }
}
</script>
<style scoped>
</style>
