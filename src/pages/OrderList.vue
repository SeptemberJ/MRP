<template>
  <div class="orderMRPList">
    <el-row class="MarginT_10">
      <el-col :span="24">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="订单号" size="small">
            <el-input v-model="filterOrderNo" size="small" placeholder="请输入订单号" clearable style="width: 150px;"></el-input>
          </el-form-item>
          <el-form-item label="运算编号" size="small">
            <el-input v-model="filterCode" size="small" placeholder="请输入运算编号" clearable style="width: 150px;"></el-input>
          </el-form-item>
          <el-form-item label="运算人" size="small">
            <el-select v-model="filterPerson" placeholder="请选择" style="width: 150px;" size="small">
              <el-option
                v-for="item in personOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" size="small">
            <el-checkbox v-model="ifHasTF">是否含投放</el-checkbox>
          </el-form-item>
          <el-form-item size="small">
            <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-button type="danger" icon="el-icon-plus" size="small" @click="addOrder" style="float:right;">新 增</el-button>
      </el-col>
    </el-row>
    <el-table class="MarginT_10"
      v-loading="loading"
      :data="orderList"
      @row-dblclick="toDetail"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="运算人"
        label="运算人"
        width="90">
      </el-table-column>
      <el-table-column
        prop="运算日期"
        label="运算日期"
        width="110">
      </el-table-column>
      <el-table-column
        prop="运算编号"
        label="运算编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="订单号"
        label="订单号"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="产品代码"
        label="产品代码"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="产品名称"
        label="产品名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="规格型号"
        label="规格型号"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="单位"
        label="单位"
        width="60">
      </el-table-column>
      <el-table-column
        prop="数量"
        label="数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="交期"
        label="交期"
        width="110">
      </el-table-column>
      <el-table-column
        prop="状态"
        label="状态"
        width="100">
      </el-table-column>
    </el-table>
    <el-pagination v-if="orderList.length > 0" style="margin: 10px 0;"
      @current-change="getData"
      :current-page.sync="curPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="sum">
    </el-pagination>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import $ from 'jquery'
export default {
  name: 'HelloWorld',
  data () {
    return {
      loading: false,
      orderList: [],
      curPage: 1,
      pageSize: 50,
      sum: 0,
      personOptions: [
        {lable: '张东琴', value: '张东琴'},
        {lable: '王璐', value: '王璐'},
        {lable: '储开琴', value: '储开琴'}
      ]
    }
  },
  computed: {
    filterOrderNo: {
      get: function () {
        return this.$store.state.filterOrderNo_MRP
      },
      set: function (newValue) {
        this.$store.state.filterOrderNo_MRP = newValue
      }
    },
    filterPerson: {
      get: function () {
        return this.$store.state.filterPerson_MRP
      },
      set: function (newValue) {
        this.$store.state.filterPerson_MRP = newValue
      }
    },
    filterCode: {
      get: function () {
        return this.$store.state.filterCode_MRP
      },
      set: function (newValue) {
        this.$store.state.filterCode_MRP = newValue
      }
    },
    ifHasTF: {
      get: function () {
        return this.$store.state.ifHasTF_MRP
      },
      set: function (newValue) {
        this.$store.state.ifHasTF_MRP = newValue
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    ...mapActions([
      'updateOrderMRPId'
    ]),
    search () {
      this.curPage = 1
      this.getData()
    },
    addOrder () {
      this.$router.push({name: 'AddOrder'})
    },
    toDetail (row) {
      this.updateOrderMRPId(row.finterid)
      this.$router.push({name: 'MRPDetail'})
    },
    getData () {
      this.loading = true
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<JA_LIST xmlns="http://tempuri.org/">'
      tmpData += "<FSQL><![CDATA[exec [Z_MRPList]'" + this.filterOrderNo + "','" + this.filterPerson + "','" + this.filterCode + "','" + (this.ifHasTF ? '投放' : '') + "'," + Number((this.curPage - 1) * this.pageSize + 1) + ',' + this.curPage * this.pageSize + ']]></FSQL>'
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
        console.log(Info)
        if (Info.length > 0) {
          this.orderList = Info
          this.sum = Info[0].fcount
          this.loading = false
        } else {
          this.orderList = []
          this.sum = []
          this.loading = false
        }
      }).catch((error) => {
        console.log(error)
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.orderMRPList{
  padding: 20px;
}
</style>
