<template>
  <el-dialog
    @open="onOpen"
    @close="close"
    :visible="assignVisible"
    title="分配角色"
  >
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in roles" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="assignRole">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getRolesApi } from '@/api/role'
import { getUserDetailsApi } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  data() {
    return {
      checkList: [],
      roles: []
    }
  },
  props: {
    assignVisible: {
      type: Boolean,
      required: true
    },
    currentEmployeesId: {
      type: String,
      required: true
    }
  },

  created() {},

  methods: {
    close() {
      this.$emit('update:assignVisible', false)
    },
    async getRoleList() {
      const roles = await getRolesApi()
      this.roles = roles.rows
    },
    onOpen() {
      this.getRoleList()
      this.getEmployeesRoles()
    },
    // 分配角色
    async assignRole() {
      if (!this.checkList.length) return this.$message.success('请选择角色')
      await assignRoles({
        id: this.currentEmployeesId,
        roleIds: this.checkList
      })
      this.$message.success('分配成功')
      this.close()
    },
    // 获取员工角色
    async getEmployeesRoles() {
      const { roleIds } = await getUserDetailsApi(this.currentEmployeesId)
      this.checkList = roleIds
    }
  }
}
</script>

<style scoped lang="less"></style>
