<template>
  <div class="OperationalReport">
    <el-table
      ref="tableSelectedList"
      v-loading="loading"
      :height="tableHieght"
      :data="reportList"
      style="width: 100%">
      <el-table-column
        fixed
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="物料代码"
        label="物料代码"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="物料名称"
        label="物料名称"
        width="150"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="规格型号"
        label="规格型号"
        width="150"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="单位"
        label="单位"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="毛需求"
        label="毛需求"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="已分配"
        label="已分配"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="销售订单占用"
        label="销售订单占用"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="申请中"
        label="申请中"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="采购中"
        label="采购中"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="安全库存"
        label="安全库存"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="现有库存"
        label="现有库存"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="净需求"
        label="净需求"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="最小订货量"
        label="最小订货量"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="本次申请"
        label="本次申请"
        width="150"
        :filters="[{text: '大于0', value: '大于0'}, {text: '等于0', value: '等于0'}]"
        :filter-method="filterHandler"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row['本次申请']" @blur="saveApply(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="订单执行"
        label="订单执行"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="未收料"
        label="未收料"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'OperationalReport',
  props: ['timeStamp', 'orderMRPId'],
  data () {
    return {
      loading: false,
      reportList: [],
      tableHieght: 300
    }
  },
  created () {
    setTimeout(() => {
      let height = document.documentElement.clientHeight
      let tableHeight = height - 120
      this.tableHieght = tableHeight
    }, 0)
    this.getReportList()
  },
  watch: {
    timeStamp: function () {
      this.getReportList()
    }
  },
  methods: {
    filterHandler (type, row, column) {
      // console.log(type, row, column)
      const property = column['property']
      switch (type) {
        case '大于0':
          return row[property] > 0
        case '等于0':
          return row[property] === 0
      }
    },
    saveApply (row) {
      let Data = {
        'items': [{
          'FInterID': row.FInterID,
          'FNumber': row['物料代码'],
          'FQty': row['本次申请']
        }]
      }
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<MRP_FQty xmlns="http://tempuri.org/">'
      tmpData += '<FJSON>' + JSON.stringify(Data) + '</FJSON>'
      tmpData += '</MRP_FQty>'
      tmpData += '</soap:Body>'
      tmpData += '</soap:Envelope>'
      this.Http.post('MRP_FQty', tmpData
      ).then(res => {
        let xml = res.data
        let parser = new DOMParser()
        let xmlDoc = parser.parseFromString(xml, 'text/xml')
        // 提取数据
        let Result = xmlDoc.getElementsByTagName('MRP_FQtyResponse')[0].getElementsByTagName('MRP_FQtyResult')[0]
        let HtmlStr = $(Result).html()
        let Info = (JSON.parse(HtmlStr))[0]
        if (Info.code === '1') {
        } else {
          this.$message({
            message: '修改失败!',
            type: 'error'
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    getReportList () {
      var tmpData = '<?xml version="1.0" encoding="utf-8"?>'
      tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
      tmpData += '<soap:Body> '
      tmpData += '<JA_LIST xmlns="http://tempuri.org/">'
      tmpData += '<FSQL><![CDATA[exec [Z_MRP_Compute]' + this.orderMRPId + ']]></FSQL>'
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
        console.log('Detail', Info)
        if (Info.length > 0) {
          this.reportList = Info
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
</style>
