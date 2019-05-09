<template>
  <el-button @click="sort" :type="buttonType" :priv="'com.zving.cms.Catalog.Content.Sort.'+catalogIds">
    <i class="fa fa-arrow-up"></i>播放排序
  <el-dialog title="播放排序" :visible.sync="show" :append-to-body="true" class="sort-dialog">
    <!-- 判断是否选中任务来显示工具栏  -->
    <!-- <div class="explain-div div-color-extend">
      内容排序<br>
      调整内容顺序，使内容排列在当前对话框中选中的内容之前
    </div> -->
    <!-- 字段映射表格 -->
    <el-table tooltip-effect="dark" ref="dataTable" highlight-current-row  :data-read-url="getcontents" :data="contents"  :row-class-name="tableRowClassName">
      <el-table-column  type="index" width="60" label="序号" align="center"></el-table-column>
      <el-table-column  prop="title" label="标题" min-width="45%"></el-table-column>
      <el-table-column  prop="checkedAttrs" label="分类" min-width="20%">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span style="color: #28b06e;" v-for="(value,key) in scope.row.checkedAttrs" :key="key" :title="value"  class="page"><i :class="key | fixIcon"></i></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  prop="statusName" label="状态" min-width="15%"></el-table-column>
       <el-table-column label="操作" align="center" min-width="15%">
          <template slot-scope="scope">
            <el-button @click.stop="stepUp(scope.row)" :priv="'com.zving.cms.Catalog.Content.Sort.'+catalogIds" type="text" title="上移" class="table-operate-icon">
              <i class="fa fa-arrow-up f16"></i>
            </el-button>
            <el-button @click.stop="stepDown(scope.row)" :priv="'com.zving.cms.Catalog.Content.Sort.'+catalogIds" type="text" title="下移" class="table-operate-icon">
              <i class="fa fa-arrow-down f16"></i>
            </el-button>
          </template>
        </el-table-column>
    </el-table>
    <!-- 选择字段弹框 -->

    <!-- 底部确认按钮 -->
    <span slot="footer">
        <button type="button" class="el-button el-button--default" @click="show = false"><span>取 消</span>
        </button>
        <button type="button" class="el-button el-button--primary" @click="confirm" :loading="handlerLoading"><span>确 定</span>
        </button>
    </span>
  </el-dialog>
  </el-button>
</template>

<script>
const util = zving.common.util

export default {
  props: {
    contentIds: {
      type: [String, Number]
    },
    catalogIds: {
      type: [String, Number]
    },
    buttonType: {
      type: String,
      default: 'info'
    },
    orderType: {
      type: String,
      default: ''
    }
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
    }
  },
  data() {
    return {
      imgList: {
        recommendingImg: '/assets/images/bullet/bullet_good.gif',
        hotImg: '/assets/images/bullet/bullet_hot.gif',
        settopImg: '/assets/images/bullet/bullet_up.gif',
        pictureImg: '/assets/images/bullet/bullet_picture.gif',
        videoImg: '/assets/images/bullet/bullet_video.gif',
        attachImg: '/assets/images/bullet/bullet_attach.gif',
        notationImg: '/assets/images/bullet/bullet_notation.gif'
      },
      contents: [],
      handlerLoading: false,
      show: false,
      currentRow: {}
    }
  },
  watch: {
    show: 'loadData'
  },
  methods: {
    sort() {
      if (this.orderType !== '') {
        this.$alert('默认排序下才可能调整顺序，请先切换到默认排序。', '提示', {type: 'info'})
        return
      }
      this.show = true
      this.currentRow = {}
    },
    getcontents() {
      return ['/ui/gtmc/contents', {
        params: {
          catalogID: this.catalogIds
        }
      }
      ]
    },
    loadData() {
      if (this.show === true && !!this.$refs.dataTable) {
        this.$refs.dataTable.getData()
      }
    },
    async confirm() {
      this.show = false
      this.$emit('refresh-content')
    },
    stepUp(row) {
      console.log(this.contents)
      let index = row.index
      if (index > 0) {
        this.sortSave(row, this.contents[index - 1])
      } else {
        util.showResponseMessage({message: '已在最前'})
      }
    },
    stepDown(row) {
      let index = row.index
      if (index + 1 < this.contents.length) {
        this.sortSave(this.contents[index + 1], row)
      } else {
        util.showResponseMessage({message: '已在最后'})
      }
    },
    async sortSave(source, target) {
      this.handlerLoading = true
      let topFlag = target.topFlag > 0 ? 'true' : 'false'
      let resp = await axios.put(
        `/ui/contentcore/contents/${source.ID}/sort`,
        {
          type: 'Before',
          target: target.orderFlag,
          catalogID: this.catalogIds,
          topFlag: topFlag
        }
      )
      util.showResponseMessage(resp.data)
      this.handlerLoading = false
      if (resp.data.status === 1) {
        this.loadData()
      }
    },
    tableRowClassName({row, rowIndex}) {
      row.index = rowIndex
    }
  }
}
</script>
<style>
  .sort-dialog .el-dialog {
    width: 700px;
  }

  @media (max-width: 480px) {
    .sort-dialog .el-dialog {
      width: 96%;
    }
  }
</style>
<style scoped>
.explain-div {
  padding:0 0 20px 0;
  color: gray;
}

.input-350 {
  width: 350px;
}

.pageBar {
  width: 100%;
  margin-top: 10px;
  text-align: right;
  padding-right: 15px;
}
.div-color-extend {
  background-color: aliceblue;
}
.button-style-extend {
  text-align: right;
}
.dialog-style {
  width: 75%;
}

.el-checkbox-group{
  font-size:12px;
}
</style>
