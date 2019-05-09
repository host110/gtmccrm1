// 内容公用js
const contentScript = {
  handleTags(initTags, tags, val) {
    if (initTags && initTags.length > 0 && (!tags || tags.length === 0)) {
      tags = initTags.split(',')
    }
    if (tags.length === 0) {
      tags.push(val)
    } else {
      if (val && !tags.includes(val)) {
        tags.push(val)
      }
    }
    return tags
  },
  // 循环赋值
  setProperties(content, res) {
    if (res.data.status !== 1) {
      return '{}'
    }
    let keys = Object.keys(content)
    for (let key in res.data.data) {
      if (keys.includes(key)) {
        content[key] = res.data.data[key] ? res.data.data[key] : (key === 'weight' ? 0 : '')
      }
    }
    return content
  },
  // 获取允许上传的类型
  getAllowType(res) {
    return res.data.status !== 1 ? '' : res.data.data.allowType
  }
}
export default contentScript
