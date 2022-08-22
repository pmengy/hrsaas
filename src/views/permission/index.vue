<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :isShowLeft="false">
        <template #right>
          <el-button type="primary" @click="showAddDialog('0', 1)"
            >添加权限</el-button
          >
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table
        ref="table"
        fit
        :data="permissions"
        style="width: 100%; margin: 20px 0"
        row-key="id"
      >
        <el-table-column prop="name" label="名称">
          <template v-slot="{ row }">
            <i
              @click="expend(row)"
              v-if="row.children"
              style="margin-right: 10px"
              class="el-icon-folder-opened"
            ></i>
            <i
              class="el-icon-tickets"
              v-if="row.type === 2"
              style="margin-right: 10px"
            ></i>
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="标识"> </el-table-column>
        <el-table-column prop="description" label="描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="text" @click="showAddDialog(row.id, row.type + 1)"
              >添加</el-button
            >
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置一个弹层 用来编辑新增节点 -->
      <el-dialog :visible.sync="showDialog" title="权限点">
        <!-- 表单 -->
        <el-form
          ref="form"
          :model="formData"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width: 90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width: 90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width: 90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="onSave"
              >确定</el-button
            >
            <el-button size="small" @click="showDialog = false">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, addPermission } from '@/api/permission'
import { transListToTree } from '@/utils'
export default {
  data() {
    return {
      permissions: [],
      showDialog: false,
      formData: {
        name: '',
        code: '',
        pid: '',
        type: '',
        description: '',
        enVisible: '0'
      },
      rules: {
        name: {
          required: true,
          message: '权限名称不能为空',
          trigger: 'blur'
        },
        code: {
          required: true,
          message: '权限标识不能为空',
          trigger: 'blur'
        }
      }
    }
  },

  created() {
    this.getPermissionList()
  },

  methods: {
    async getPermissionList() {
      const res = await getPermissionList()
      this.permissions = transListToTree(res, '0')
    },
    expend(row) {
      row.isExpend = !row.isExpend
      this.$refs.table.toggleRowExpansion(row, row.isExpend)
    },
    showAddDialog(id, type) {
      this.showDialog = true
      this.formData.pid = id
      this.formData.type = type
      console.log(this.formData)
    },
    onSave() {
      this.$refs.form.validate(async (validate) => {
        if (!validate) return
        await addPermission(this.formData)
        this.$message.success('添加成功')
        this.showDialog = false
        this.getPermissionList()
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-table [class*='el-table__row--level'] .el-table__expand-icon {
  display: none;
}
</style>
