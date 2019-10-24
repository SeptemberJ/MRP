<template>
  <div class="OperationalReport">
    <el-button style="float:right;" type="primary" size="small" @click="exportExcel">导 出</el-button>
    <p class="TextAlignL">正常： {{normalAmount}} 行<span style="margin-left: 50px;">非正常： {{reportListCopy.length - normalAmount - 1 > 0 ? reportListCopy.length - normalAmount - 1 : 0}} 行</span></p>
    <el-table
      ref="tableSelectedList"
      @filter-change="filterChange"
      v-loading="loading"
      :height="tableHieght"
      :data="reportList"
      style="width: 27000px">
      <el-table-column
        fixed
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        fixed
        prop="物料代码"
        label="物料代码"
        width="220">
      </el-table-column>
      <el-table-column
        fixed
        prop="物料名称"
        label="物料名称"
        width="180">
      </el-table-column>
      <el-table-column
        fixed
        prop="规格型号"
        label="规格型号"
        width="130">
      </el-table-column>
      <el-table-column
        prop="单位"
        label="单位"
        width="60">
      </el-table-column>
      <el-table-column
        prop="毛需求"
        label="毛需求"
        width="100">
      </el-table-column>
      <el-table-column
        prop="已分配"
        label="已分配"
        width="100">
      </el-table-column>
      <el-table-column
        prop="销售订单占用"
        label="销售订单占用"
        width="120">
      </el-table-column>
      <el-table-column
        prop="申请中"
        label="申请中"
        width="100">
      </el-table-column>
      <el-table-column
        prop="采购中"
        label="采购中"
        width="100">
      </el-table-column>
      <el-table-column
        prop="安全库存"
        label="安全库存"
        width="120">
      </el-table-column>
      <el-table-column
        prop="现有库存"
        label="现有库存"
        width="120">
      </el-table-column>
      <el-table-column
        column-key="FType"
        prop="FType"
        label="是否补充安全库存"
        :filters="[{text: 'N', value: 'N'}, {text: 'Y', value: 'Y'}]"
        width="150">
      </el-table-column>
      <el-table-column
        prop="净需求"
        label="净需求"
        width="120">
      </el-table-column>
      <el-table-column
        prop="最小订货量"
        label="最小订货量"
        width="120">
      </el-table-column>
      <el-table-column
        column-key="是否替代料"
        prop="是否替代料"
        label="是否替代料"
        :filters="[{text: 'N', value: 'N'}, {text: 'Y', value: 'Y'}]"
        width="110">
      </el-table-column>
      <el-table-column
        column-key="本次申请"
        prop="本次申请"
        label="本次申请"
        :filters="[{text: '大于0', value: '大于0'}, {text: '等于0', value: '等于0'}]"
        width="150">
        <template slot-scope="scope">
          <span v-if="scope.row['物料代码'] == '合计'"></span>
          <el-input v-else v-model="scope.row['本次申请']" @blur="saveApply(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="订单执行"
        label="订单执行"
        width="120">
      </el-table-column>
      <el-table-column
        prop="未收料"
        label="未收料"
        width="120">
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
      reportListCopy: [],
      tableHieght: 300,
      normalAmount: 0,
      filterFType: [],
      filterSFTD: [],
      filterBCSQ: []
    }
  },
  created () {
    setTimeout(() => {
      let height = document.documentElement.clientHeight
      let tableHeight = height - 130
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
    filterHandlerBCSQ (type, row, column) {
      const property = column['property']
      switch (type) {
        case '大于0':
          return row[property] > 0
        case '等于0':
          return row[property] === 0
      }
    },
    filterHandlerFType (type, row, column) {
      debugger
      const property = column['property']
      switch (type) {
        case 'Y':
          return row[property] === 'Y'
        case 'N':
          return row[property] === 'N'
      }
      debugger
    },
    filterHandler (type, row, column) {
      const property = column['property']
      switch (type) {
        case 'Y':
          return row[property] === 'Y'
        case 'N':
          return row[property] === 'N'
      }
    },
    filterChange (Info) {
      let temp = []
      let pro = ''
      if (Info.FType) {
        debugger
        pro = 'FType'
        this.filterFType = Info[pro]
      } else if (Info['是否替代料']) {
        debugger
        pro = '是否替代料'
        this.filterSFTD = Info[pro]
      } else if (Info['本次申请']) {
        pro = '本次申请'
        this.filterBCSQ = Info[pro]
      }
      if (this.filterFType.length === 0 && this.filterSFTD.length === 0 && this.filterBCSQ.length === 0) {
        this.reportList = this.reportListCopy
      } else if (this.filterFType.length !== 0 && this.filterSFTD.length === 0 && this.filterBCSQ.length === 0) {
        // 只过滤FType
        this.reportListCopy.map((item, idx) => {
          if (this.filterFType.indexOf(item.FType) !== -1) {
            temp.push(item)
          }
          if (idx === this.reportListCopy.length - 1) {
            this.reportList = temp
          }
        })
      } else if (this.filterFType.length === 0 && this.filterSFTD.length !== 0 && this.filterBCSQ.length === 0) {
        // 只过滤是否替代料
        this.reportListCopy.map((item, idx) => {
          if (this.filterSFTD.indexOf(item['是否替代料']) !== -1) {
            temp.push(item)
          }
          if (idx === this.reportListCopy.length - 1) {
            this.reportList = temp
          }
        })
      } else if (this.filterFType.length === 0 && this.filterSFTD.length === 0 && this.filterBCSQ.length !== 0) {
        debugger
        // 只过滤本次申请
        this.reportListCopy.map((item, idx) => {
          if (this.filterBCSQ.indexOf('等于0') !== -1 && item['本次申请'] === 0) {
            temp.push(item)
          } else if (this.filterBCSQ.indexOf('大于0') !== -1 && item['本次申请'] > 0) {
            temp.push(item)
          }
          if (idx === this.reportListCopy.length - 1) {
            this.reportList = temp
          }
        })
      } else {
        if (this.filterFType.length === 0 && this.filterSFTD.length > 0 && this.filterBCSQ.length > 0) {
          this.reportListCopy.map((item, idx) => {
            if (this.filterSFTD.indexOf(item['是否替代料']) !== -1) {
              if (this.filterBCSQ.indexOf('等于0') !== -1 && item['本次申请'] === 0) {
                temp.push(item)
              } else if (this.filterBCSQ.indexOf('大于0') !== -1 && item['本次申请'] > 0) {
                temp.push(item)
              }
            }
            if (idx === this.reportListCopy.length - 1) {
              this.reportList = temp
            }
          })
        } else if (this.filterFType.length > 0 && this.filterSFTD.length === 0 && this.filterBCSQ.length > 0) {
          this.reportListCopy.map((item, idx) => {
            if (this.filterFType.indexOf(item.FType) !== -1) {
              if (this.filterBCSQ.indexOf('等于0') !== -1 && item['本次申请'] === 0) {
                temp.push(item)
              } else if (this.filterBCSQ.indexOf('大于0') !== -1 && item['本次申请'] > 0) {
                temp.push(item)
              }
            }
            if (idx === this.reportListCopy.length - 1) {
              this.reportList = temp
            }
          })
        } else if (this.filterFType.length > 0 && this.filterSFTD.length > 0 && this.filterBCSQ.length === 0) {
          debugger
          this.reportListCopy.map((item, idx) => {
            if (this.filterFType.indexOf(item.FType) !== -1 && this.filterSFTD.indexOf(item['是否替代料']) !== -1) {
              temp.push(item)
            }
            if (idx === this.reportListCopy.length - 1) {
              this.reportList = temp
            }
          })
        } else {
          // 过滤所有
          this.reportListCopy.map((item, idx) => {
            if (this.filterFType.indexOf(item.FType) !== -1 && this.filterSFTD.indexOf(item['是否替代料']) !== -1) {
              if (this.filterBCSQ.indexOf('等于0') !== -1 && item['本次申请'] === 0) {
                temp.push(item)
              } else if (this.filterBCSQ.indexOf('大于0') !== -1 && item['本次申请'] > 0) {
                temp.push(item)
              }
            }
            if (idx === this.reportListCopy.length - 1) {
              this.reportList = temp
            }
          })
        }
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
          // 更新copy数据供筛选
          this.reportListCopy.map(item => {
            if (item.idx === row.idx) {
              item['本次申请'] = row['本次申请']
            }
          })
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
    // 导出
    exportExcel () {
      require.ensure([], () => {
        const { exportJsonToExcel } = require('../vendor/Export2Excel.js')
        const tHeader = ['物料代码', '物料名称', '规格型号', '单位', '毛需求', '已分配', '销售订单占用', '申请中', '采购中', '安全库存', '现有库存', '净需求', '最小订货量', '是否补充安全库存', '是否替代料', '本次申请', '订单执行', '未收料']
        const filterVal = ['物料代码', '物料名称', '规格型号', '单位', '毛需求', '已分配', '销售订单占用', '申请中', '采购中', '安全库存', '现有库存', '净需求', '最小订货量', 'FType', '是否替代料', '本次申请', '订单执行', '未收料']
        const data = this.formatJson(filterVal, this.reportList)
        exportJsonToExcel(tHeader, data, '运算报告')
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    getReportList () {
      this.loading = true
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
        if (Info.length > 0) {
          document.getElementsByClassName('el-table__fixed')[0].style.setProperty('height', this.tableHieght - 16 + 'px', 'important')
          console.log(Info)
          let normalAmount = 0
          let sumLine = {
            '物料代码': '合计',
            '物料名称': '',
            '规格型号': '',
            '单位': '',
            '毛需求': 0,
            '已分配': '',
            '销售订单占用': '',
            '申请中': '',
            '采购中': '',
            '安全库存': '',
            '现有库存': '',
            '净需求': '',
            '最小订货量': '',
            '本次申请': '',
            '订单执行': '',
            '未收料': ''
          }
          Info.map((item, idx) => {
            if (item.FType === 'N') {
              normalAmount += 1
            }
            item.idx = idx
            sumLine['毛需求'] = (Number(sumLine['毛需求']) + Number(item['毛需求'])).toFixed(2)
            if (idx === Info.length - 1) {
              this.reportList = Info.concat(sumLine)
              this.reportListCopy = Info.concat(sumLine)
              this.normalAmount = normalAmount
              this.loading = false
            }
          })
        } else {
          this.reportList = Info
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
</style>
