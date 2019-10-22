<template>
  <div class="AddOrder">
    <el-row>
      <el-col :span="24">
        <el-button type="danger" plain icon="el-icon-plus" size="small" @click="chooseOrder" style="float:right;">选择订单</el-button>
      </el-col>
      <el-col :span="24">
        <!-- 订单列表 -->
        <el-table class="MarginT_20"
          ref="addTableOrder"
          v-loading="loading"
          :data="addTableOrder"
          style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            label="checked">
            <template slot-scope="scope">
              <span>{{scope.row.checked ? 1: 0}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="uniqueSign"
            label="uniqueSign"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="单据编号"
            label="单据编号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="日期"
            label="日期"
            width="110">
          </el-table-column>
          <el-table-column
            prop="交货日期"
            label="交货日期"
            width="110">
          </el-table-column>
          <el-table-column
            prop="物料名称"
            label="物料名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="物料代码"
            label="物料代码"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="规格型号"
            label="规格型号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="数量"
            label="数量"
            width="80">
          </el-table-column>
          <el-table-column
            prop="单位"
            label="单位"
            width="60">
          </el-table-column>
          <el-table-column
            prop="购货单位"
            label="购货单位"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="部门"
            label="部门"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="业务员"
            label="业务员"
            width="100">
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            width="60">
            <template slot-scope="scope">
              <i class="el-icon-delete CursorPointer" @click="moveLine(scope.row)"></i>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="MarginT_20">
        <el-button type="danger" :loading="btLoading" size="small" @click="submit">保 存</el-button>
      </el-col>
    </el-row>
    <!-- 添加订单 -->
    <el-dialog title="订单选择" :visible.sync="dialogAddVisible" :close-on-click-modal="false" width="90%">
      <div>
        <el-row class="MarginT_10">
          <el-col :span="24">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="订单号" size="small">
                <el-input v-model="filterOrderNo" size="small" placeholder="请输入订单号"></el-input>
              </el-form-item>
              <el-form-item size="small">
                <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-table
          ref="tableSelectedList"
          @select="selectSingle"
          @select-all="selectAll"
          @selection-change="handleSelectionChange"
          v-loading="loading"
          :data="orderList"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            label="checked">
            <template slot-scope="scope">
              <span>{{scope.row.checked ? 1: 0}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="uniqueSign"
            label="uniqueSign"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="单据编号"
            label="单据编号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="日期"
            label="日期"
            width="120">
          </el-table-column>
          <el-table-column
            prop="交货日期"
            label="交货日期"
            width="120">
          </el-table-column>
          <el-table-column
            prop="物料名称"
            label="物料名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="物料代码"
            label="物料代码"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="规格型号"
            label="规格型号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="数量"
            label="数量"
            width="100">
          </el-table-column>
          <el-table-column
            prop="单位"
            label="单位"
            width="60">
          </el-table-column>
          <el-table-column
            prop="购货单位"
            label="购货单位"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="部门"
            label="部门"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="业务员"
            label="业务员"
            width="100">
          </el-table-column>
        </el-table>
        <el-pagination v-if="orderList.length > 0" style="margin: 10px 0;"
          @current-change="handleCurrentChange"
          :current-page.sync="curPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="sum">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="sureChoosAll">添加全部</el-button>
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureChoosed">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $ from 'jquery'
import {objDeepCopy} from '../util/utils'
// import { formatUrl } from '../../../../工程合同监控/HTJK/HTJK/src/util/utils'
export default {
  name: 'AddOrder',
  data () {
    return {
      loading: false,
      btLoading: false,
      dialogAddVisible: false,
      filterOrderNo: '',
      orderList: [],
      curPage: 1,
      pageSize: 5,
      sum: 0,
      addTableOrder: [],
      selectedAllList: [],
      selectedUniqueSignList: []
      // choosedOrderList: []
    }
  },
  created () {
    this.getOrderList()
  },
  watch: {
  },
  methods: {
    chooseOrder () {
      this.dialogAddVisible = true
      this.handleCurrentChange()
    },
    search () {
      this.curPage = 1
      this.handleCurrentChange()
    },
    // 去重
    RemoveDuplicate () {
      let temp = objDeepCopy(this.selectedAllList)
      let existenceArray = []
      let newList = []
      let len = temp.length
      temp.map((item, idx) => {
        if (existenceArray.indexOf(item.uniqueSign) === -1) { // 不存在时加入
          existenceArray.push(item.uniqueSign)
          newList.push(item)
        }
        if (len === idx + 1) {
          this.selectedAllList = newList
          this.addTableOrder = newList
        }
      })
    },
    // checkHased (Finterid) {
    //   return new Promise((resolve, reject) => {
    //     let len = this.selectedAllList.length
    //     let ifHas = false
    //     this.selectedAllList.map((item, idx) => {
    //       if (item.finterid === Finterid) {
    //         ifHas = true
    //         debugger
    //         resolve(true)
    //       }
    //       if (idx === len - 1) {
    //         debugger
    //         resolve(ifHas)
    //       }
    //     })
    //   })
    // },
    // 提交
    submit2 () {
      // console.log(this.addTableOrder)
      // console.log(this.selectedAllList)
      // console.log(this.selectedUniqueSignList)
      console.log(this.orderList)
    },
    submit () {
      console.log(this.addTableOrder)
      if (this.addTableOrder.length === 0) {
        this.$message({
          message: '请至少添加一条订单记录!',
          type: 'warning'
        })
        return false
      }
      let Data = {
        'items': this.addTableOrder
      }
      this.btLoading = true
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<MRP_Insert xmlns="http://tempuri.org/">'
      tmpData += '<FJSON>' + JSON.stringify(Data) + '</FJSON>'
      tmpData += '<FBiller>' + '王璐' + '</FBiller>'
      tmpData += '<ID>0</ID>'
      tmpData += '</MRP_Insert>'
      tmpData += '</soap:Body>'
      tmpData += '</soap:Envelope>'
      this.Http.post('MRP_Insert', tmpData
      ).then(res => {
        let xml = res.data
        let parser = new DOMParser()
        let xmlDoc = parser.parseFromString(xml, 'text/xml')
        // 提取数据
        let Result = xmlDoc.getElementsByTagName('MRP_InsertResponse')[0].getElementsByTagName('MRP_InsertResult')[0]
        let HtmlStr = $(Result).html()
        let Info = (JSON.parse(HtmlStr))[0]
        if (Info.code === '1') {
          this.$message({
            message: '新增成功!',
            type: 'success'
          })
          this.addTableOrder = []
          this.selectedAllList = []
          this.selectedUniqueSignList = []
          this.btLoading = false
          // this.updateBudgetId(Info.ID)
          // this.$router.push({name: 'BudgetDetail'})
        } else {
          this.$message({
            message: '新增失败!',
            type: 'error'
          })
          this.btLoading = false
        }
      }).catch((error) => {
        console.log(error)
        this.btLoading = false
      })
    },
    sureChoosed () {
      // this.RemoveDuplicate()
      this.addTableOrder = this.selectedAllList
      this.dialogAddVisible = false
    },
    // 选择添加筛选的全部数据
    sureChoosAll () {
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<JA_LIST xmlns="http://tempuri.org/">'
      tmpData += "<FSQL><![CDATA[exec [Z_MRP_SeorderAll]'" + this.filterOrderNo + "']]></FSQL>"
      tmpData += '</JA_LIST>'
      tmpData += '</soap:Body>'
      tmpData += '</soap:Envelope>'

      this.Http.post('JA_LIST', tmpData
      ).then(res => {
        let xml = res.data
        let parser = new DOMParser()
        let xmlDoc = parser.parseFromString(xml, 'text/xml')
        // 提取数据
        let Result = xmlDoc.getElementsByTagName('JA_LISTResponse')[0].getElementsByTagName('JA_LISTResult')[0]
        let HtmlStr = $(Result).html()
        let Info = JSON.parse(HtmlStr)
        // console.log('All', Info)
        // this.addTableOrder = Info.map((item, idx) => {
        //   item.idx = idx
        //   item.uniqueSign = item.FOrderEntryID + '-' + item.FOrderInterID
        //   this.selectSingle([], item)
        //   return item
        // })
        Info.map((item, idx) => {
          item.idx = idx
          item.uniqueSign = item.FOrderEntryID + '-' + item.FOrderInterID
          this.selectSingle([], item)
          return item
        })
        this.addTableOrder = this.selectedAllList
        this.handleCurrentChange()
        this.dialogAddVisible = false
      }).catch((error) => {
        console.log(error)
      })
    },
    // 工单列表的勾选切换
    async handleSelectionChange (curSelection) {
      // console.log('curSelection', curSelection)
      // if (curSelection.length > 0) {
      //   curSelection.map(item => {
      //     if (this.selectedUniqueSignList.indexOf(item.uniqueSign) === -1) {
      //       this.selectedUniqueSignList.push(item.uniqueSign)
      //       this.selectedAllList.push(item)
      //     }
      //   })
      // }
    },
    selectAll (selection) {
      if (selection.length === 0) { // 本页全部取消勾选
        this.orderList.map(order => {
          this.selectSingle([], order)
        })
      } else { // 本页全部加入勾选
        this.orderList.map(order => {
          if (!order.checked) {
            this.selectSingle([], order)
          }
        })
      }
    },
    // 单独勾选切换
    selectSingle (selection, row) {
      // console.log('selectSingle', row)
      if (row.checked) { // 取消勾选
        let temp = objDeepCopy(this.selectedAllList)
        temp.map((item, idx) => {
          if (item.uniqueSign === row.uniqueSign) {
            this.orderList[row.idx].checked = false
            this.selectedAllList.splice(idx, 1)
            let index = this.selectedUniqueSignList.indexOf(row.uniqueSign)
            if (index > -1) {
              this.selectedUniqueSignList.splice(index, 1)
            }
          }
        })
      } else { // 加入勾选
        // 再次检查重复
        let index = this.selectedUniqueSignList.indexOf(row.uniqueSign)
        if (index === -1) {
          row.checked = true
          this.selectedUniqueSignList.push(row.uniqueSign)
          this.selectedAllList.push(row)
        }
      }
      // if (selection.length === 0) { // 取消勾选
      //   this.selectedAllList.map((item, idx) => {
      //     if (item.uniqueSign === row.uniqueSign) {
      //       this.selectedAllList.splice(idx, 1)
      //       let index = this.selectedUniqueSignList.indexOf(row.uniqueSign)
      //       if (index > -1) {
      //         this.selectedUniqueSignList.splice(index, 1)
      //       }
      //     }
      //   })
      // } else { //加入勾选
      //   console.log('selection', selection)
      //   console.log('row', row)
      //   if (this.selectedUniqueSignList.indexOf(selection[0].uniqueSign) === -1) {
      //     this.selectedUniqueSignList.push(selection[0].uniqueSign)
      //     this.selectedAllList.push(selection[0])
      //   }
      // }
      // console.log('selection', selection)
    },
    async handleCurrentChange () {
      let curList = await this.getOrderList()
      if (this.selectedAllList.length > 0) {
        this.selectedAllList.map((itemS) => {
          curList.map((item, idx) => {
            if (item.uniqueSign === itemS.uniqueSign) {
              this.$refs.tableSelectedList.toggleRowSelection(curList[idx], true)
              this.orderList[idx].checked = true
            }
          })
        })
      }
    },
    moveLine (row) {
      this.$confirm('确认移除改记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectSingle([], row)
      }).catch(() => {
      })
    },
    getOrderList () {
      return new Promise((resolve, reject) => {
        this.loading = true
        var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
        tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
        tmpData += '<soap:Body> '
        tmpData += '<JA_LIST xmlns="http://tempuri.org/">'
        tmpData += "<FSQL><![CDATA[exec [Z_MRP_Seorder] '" + this.filterOrderNo + "'," + Number((this.curPage - 1) * this.pageSize + 1) + ',' + this.curPage * this.pageSize + ']]></FSQL>'
        tmpData += '</JA_LIST>'
        tmpData += '</soap:Body>'
        tmpData += '</soap:Envelope>'

        this.Http.post('JA_LIST', tmpData
        ).then(res => {
          let xml = res.data
          let parser = new DOMParser()
          let xmlDoc = parser.parseFromString(xml, 'text/xml')
          // 提取数据
          let Result = xmlDoc.getElementsByTagName('JA_LISTResponse')[0].getElementsByTagName('JA_LISTResult')[0]
          let HtmlStr = $(Result).html()
          let Info = JSON.parse(HtmlStr)
          if (Info.length > 0) {
            this.orderList = Info.map((item, idx) => {
              item.idx = idx
              item.uniqueSign = item.FOrderEntryID + '-' + item.FOrderInterID
              item.checked = false
              return item
            })
            this.sum = Info[0].fcount
            this.loading = false
            resolve(Info)
          } else {
            this.orderList = []
            this.sum = []
            this.loading = false
            resolve([])
          }
        }).catch((error) => {
          console.log(error)
          this.loading = false
        })
      })
    }
  }
}
</script>

<style scoped>
.AddOrder{
  padding: 20px;
}
</style>
