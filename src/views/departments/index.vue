<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <!-- 头部 -->
        <tree-tools @add="AddDept" :isRoot="true" :treeNode="company" />
        <!-- 树形 -->
        <el-tree default-expand-all :data="departs" :props="defaultProps">
          <template v-slot="scope">
            <tree-tools
              @add="AddDept"
              @update="getDepartments"
              :treeNode="scope.data"
            />
          </template>
        </el-tree>
        <!-- 新增部门弹出层 -->
        <add-department
          :visible.sync="dialogVisible"
          :currentDept="currentDept"
          @success="getDepartments"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/TreeTools.vue'
import AddDepartment from './components/AddDepartment.vue'
import { getDepartments } from '@/api/departments'
import { transListToTree } from '@/utils'
export default {
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      company: { name: '传智教育', manager: '负责人' },
      departs: [],
      dialogVisible: false,
      currentDept: {}
    }
  },

  components: {
    TreeTools,
    AddDepartment
  },
  created() {
    this.getDepartments()
  },

  methods: {
    async getDepartments() {
      const res = await getDepartments()
      this.departs = transListToTree(res.depts, '')
      this.company.name = res.companyName
      this.company.manager = res.companyManage
    },
    AddDept(val) {
      this.dialogVisible = true
      this.currentDept = val
    }
  }
}
</script>

<style scoped lang="less"></style>
