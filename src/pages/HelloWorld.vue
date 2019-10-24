<template>
  <div class="hello">
    <el-table
      ref="filterTable"
      :data="tableData"
      @filter-change="filterChange"
      style="width: 100%">
      <el-table-column
        fixed
        prop="date"
        label="日期"
        sortable
        width="180"
        column-key="date"
        :filters="[{text: '2016-09-01', value: '2016-09-01'}, {text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]"
      >
      </el-table-column>
      <el-table-column
        fixed
        prop="name"
        label="姓名"
        column-key="name"
        :filters="[{text: '王小虎', value: '王小虎'}, {text: '张三', value: '张三'}]"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      tableData2: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          tag: '家',
          id: 0
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          tag: '公司',
          id: 1
        }, {
          date: '2016-05-01',
          name: '张三',
          address: '上海市普陀区金沙江路 1519 弄',
          tag: '家',
          id: 2
        }, {
          date: '2016-05-03',
          name: '张三',
          address: '上海市普陀区金沙江路 1516 弄',
          tag: '公司',
          id: 3
        }
      ],
      tableData3: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          tag: '家',
          id: 0
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          tag: '公司',
          id: 1
        }, {
          date: '2016-05-01',
          name: '张三',
          address: '上海市普陀区金沙江路 1519 弄',
          tag: '家',
          id: 2
        }, {
          date: '2016-05-03',
          name: '张三',
          address: '上海市普陀区金沙江路 1516 弄',
          tag: '公司',
          id: 3
        }
      ],
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          tag: '家',
          id: 0
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          tag: '公司',
          id: 1
        }, {
          date: '2016-05-01',
          name: '张三',
          address: '上海市普陀区金沙江路 1519 弄',
          tag: '家',
          id: 2
        }, {
          date: '2016-05-03',
          name: '张三',
          address: '上海市普陀区金沙江路 1516 弄',
          tag: '公司',
          id: 3
        }
      ],
      filterName: [],
      filterDate: [],
      filterNo: 0,
      showEmpty: false
    }
  },
  methods: {
    filterHandler2 (value, row, column) {
      const property = column['property']
      if (row.id === 3) {
        if (row[property] !== value && this.filterNo <= 0) {
          this.showEmpty = true
        } else {
          return row[property] === value
        }
      } else {
        if (row[property] === value) {
          this.filterNo += 1
          return row[property] === value
        } else {
          return row[property] === value
        }
      }
    },
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    filterChange (Info) {
      let temp = []
      let pro = ''
      if (Info.date) {
        pro = 'date'
        this.filterDate = Info[pro]
      } else {
        pro = 'name'
        this.filterName = Info[pro]
      }
      if (this.filterDate.length === 0 && this.filterName.length === 0) {
        this.tableData = this.tableData3
      } else if (this.filterDate.length === 0 && this.filterName.length !== 0) {
        // 只过滤姓名
        this.tableData3.map((item, idx) => {
          if (this.filterName.indexOf(item.name) !== -1) {
            temp.push(item)
          }
          if (idx === this.tableData3.length - 1) {
            this.tableData = temp
          }
        })
      } else if (this.filterDate.length !== 0 && this.filterName.length === 0) {
        // 只过滤日期
        this.tableData3.map((item, idx) => {
          if (this.filterDate.indexOf(item.date) !== -1) {
            temp.push(item)
          }
          if (idx === this.tableData3.length - 1) {
            this.tableData = temp
          }
        })
      } else {
        // 过滤两者
        this.tableData3.map((item, idx) => {
          if (this.filterDate.indexOf(item.date) !== -1 && this.filterName.indexOf(item.name) !== -1) {
            temp.push(item)
          }
          if (idx === this.tableData3.length - 1) {
            this.tableData = temp
          }
        })
      }
    },
    filterChange2 (Info) {
      let temp = []
      let Obj = Info.date
      if (Obj.length === 0 || Obj.length === 5) {
        this.tableData = this.tableData3
      } else {
        this.tableData3.map((item, idx) => {
          if (Obj.indexOf(item.date) !== -1) {
            temp.push(item)
          }
          if (idx === this.tableData3.length - 1) {
            this.tableData = temp
          }
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
