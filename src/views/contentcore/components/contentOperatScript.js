const contentOperatScript = {
  /** 发布·待发布·下线 */
  async publish(ids, type) {
    let resp = await axios.put(`/ui/contentcore/contentpublish/${ids}/${type}`)
    util.showResponseMessage(resp.data)
    if (resp.data.status === 1) {
      this.$emit('refresh-content', this.contentId)
    }
  },
  async del(rowIds) {
    try {
      await this.$confirm('确定删除吗？删除后无法恢复。是否继续删除？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    } catch (e) {
      return
    }
    let resp = await axios.delete(`/ui/contentcore/contents/${rowIds}`)
    await util.showProgress(resp.data.taskID, resp.data.message)
    this.$emit('refresh-content')
  }
}

export default contentOperatScript
