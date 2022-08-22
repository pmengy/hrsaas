<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <span slot="left-tag">共{{ total }}条记录</span>
        <template slot="right">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
            v-isHas="point.employees.import"
            >导入</el-button
          >
          <el-button size="small" type="danger" @click="exportExcel"
            >导出</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="showAdd"
            v-if="hasPermission(point.employees.add)"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table :data="employees" border>
          <el-table-column label="序号" sortable type="index" />
          <el-table-column label="姓名" sortable prop="username" />
          <el-table-column label="员工">
            <template slot-scope="{ row }">
              <img
                @click="showErCodeDialog(row.staffPhoto)"
                v-errorImg="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                alt=""
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
              />
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable
            prop="formOfEmployment"
            :formatter="formatFormOfEmployment"
          />
          <el-table-column label="部门" sortable prop="departmentName" />
          <el-table-column label="入职时间" sortable>
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatTime }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable prop="enableState">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push('/employees/detail/' + row.id)"
                >查看</el-button
              >
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button
                type="text"
                size="small"
                @click="showAssignRole(row.id)"
                >角色</el-button
              >
              <el-button
                v-if="hasPermission(point.employees.del)"
                type="text"
                size="small"
                @click="onRemove(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="pages.size"
            :total="total"
            layout="prev, pager, next"
          />
        </el-row>
      </el-card>
    </div>
    <add-employee
      @updateEmployee="getEmployeesList"
      :visible.sync="showAddEmployee"
    ></add-employee>
    <!-- 头像二维码 -->
    <el-dialog title="头像二维码" :visible.sync="erCodeDialog">
      <el-row type="flex" justify="center">
        <canvas id="canvas"></canvas>
      </el-row>
    </el-dialog>
    <!-- 分配角色 -->
    <AssignRole
      :currentEmployeesId="currentEmployeesId"
      :assignVisible.sync="assignVisible"
    />
  </div>
</template>

<script>
import { getEmployeesInfoApi, delEmployeeApi } from '@/api/employees'
import employees from '@/constant/employees'
import AddEmployee from './components/AddEmployee.vue'
import AssignRole from './components/AssignRole.vue'
import MixinPermission from '@/mixins/permission'
import QRcode from 'qrcode'
const { exportExcelMapPath, hireType } = employees
export default {
  name: 'Employees',
  mixins: [MixinPermission],
  data() {
    return {
      employees: [],
      total: 0,
      pages: {
        page: 1,
        size: 5
      },
      currentEmployeesId: '',
      showAddEmployee: false,
      erCodeDialog: false,
      assignVisible: false
    }
  },
  components: { AddEmployee, AssignRole },
  created() {
    this.getEmployeesList()
  },

  methods: {
    async getEmployeesList() {
      const { rows, total } = await getEmployeesInfoApi({
        page: this.pages.page,
        size: this.pages.size
      })
      this.employees = rows
      this.total = total
    },
    handleCurrentChange(val) {
      this.pages.page = val
      this.getEmployeesList()
    },
    formatFormOfEmployment(row, column, cellValue) {
      const findItem = employees.hireType.find((item) => item.id === cellValue)
      return findItem ? findItem.value : '未知'
    },
    async onRemove(id) {
      try {
        await this.$confirm('是否删除该员工')
        await delEmployeeApi(id)
        this.getEmployeesList()
        this.$message.success('删除员工成功')
      } catch (error) {}
    },
    showAdd() {
      this.showAddEmployee = true
    },
    async exportExcel() {
      const { export_json_to_excel } = await import('@/vendor/export2Excel')
      const { rows } = await getEmployeesInfoApi({ page: 1, size: this.total })
      const header = Object.keys(exportExcelMapPath)
      const data = rows.map((item) => {
        return header.map((h) => {
          if (h === '聘用形式') {
            const findItem = hireType.find(
              (hire) => hire.id === item[exportExcelMapPath[h]]
            )
            return findItem ? findItem.value : '未知'
          } else {
            return item[exportExcelMapPath[h]]
          }
        })
      })
      export_json_to_excel({
        header,
        data,
        filename: '员工列表',
        autoWidth: true,
        bookType: 'xlsx'
        // multiHeader: [['姓名', '主要信息', '', '', '', '', '部门']], // 多级表头
        // merges: ['A1:A2', 'B1:F1', 'G1:G2'] // 单元格合并
      })
    },
    showErCodeDialog(staffPhoto) {
      if (!staffPhoto) return this.$message.warning('该用户还未设置头像')
      this.erCodeDialog = true
      // 数据变化驱动视图是异步的
      this.$nextTick(() => {
        const canvas = document.getElementById('canvas')
        QRcode.toCanvas(canvas, staffPhoto)
      })
    },
    showAssignRole(id) {
      this.assignVisible = true
      this.currentEmployeesId = id
    }
  }
}
</script>

<style scoped lang="less"></style>
