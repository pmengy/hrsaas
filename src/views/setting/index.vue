<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="公司管理" name="first">
      <el-button type="primary" size="small" @click="addDialogVisible = true"
        >新增角色</el-button
      >
      <!-- 表格 -->
      <el-table border :data="tableData" style="width: 100%; margin-top: 20px">
        <el-table-column align="center" type="index" label="序号" width="180">
        </el-table-column>
        <el-table-column align="center" prop="name" label="角色" width="180">
        </el-table-column>
        <el-table-column align="center" prop="description" label="描述">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="success">分配权限</el-button>
            <el-button size="small" type="primary">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="onRemove(scope.row.id)"
              >删除</el-button
            >
          </template></el-table-column
        >
      </el-table>
      <el-pagination
        layout="sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20]"
        :page-size="pageSize"
        :total="total"
      >
      </el-pagination>
    </el-tab-pane>
    <el-tab-pane label="公司信息" name="second">
      <el-alert
        :closable="false"
        title="
对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
        type="info"
        show-icon
      >
      </el-alert>
      <el-form label-width="80px" style="margin-top: 40px; margin-left: 40px">
        <el-form-item prop="name" label="公司名称" style="width: 480px">
          <el-input disabled v-model="companyInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" style="width: 480px">
          <el-input disabled v-model="companyInfo.companyAddress"></el-input>
        </el-form-item>
        <el-form-item label="公司邮箱" style="width: 480px">
          <el-input disabled v-model="companyInfo.mailbox"></el-input>
        </el-form-item>
        <el-form-item label="备注" style="width: 480px">
          <el-input
            disabled
            v-model="companyInfo.remarks"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="新增角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="dialogClose"
    >
      <el-form
        ref="form"
        :model="addRoleForm"
        :rules="addRoleFormRules"
        label-width="80px"
      >
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onAddRole">确 定</el-button>
      </span>
    </el-dialog>
  </el-tabs>
</template>

<script>
import { getRolesApi, addRoleApi, removeRoleApi } from '@/api/role'
import { getCompanyInfoApi } from '@/api/setting'
export default {
  data() {
    return {
      activeName: 'first',
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      addDialogVisible: false,
      addRoleForm: {
        name: '',
        description: ''
      },
      addRoleFormRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      companyInfo: {}
    }
  },

  created() {
    this.getRoles()
    this.getCompanyInfo()
  },

  methods: {
    async getRoles() {
      const { rows, total } = await getRolesApi({
        page: this.page,
        pagesize: this.pageSize
      })
      this.tableData = rows
      this.total = total
    },
    handleCurrentChange(val) {
      this.page = val
      this.getRoles()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getRoles()
    },
    // 点击取消
    onClose() {
      this.addDialogVisible = false
    },
    async onAddRole() {
      try {
        await this.$refs.form.validate()
        const res = await addRoleApi(this.addRoleForm)
        this.getRoles()
        this.$message.success('添加角色成功')
      } catch (error) {
        this.$message.error('添加角色失败')
      } finally {
        this.addDialogVisible = false
      }
    },
    // 监听对话框关闭
    dialogClose() {
      this.$refs.form.resetFields()
      this.addRoleForm.description = ''
    },
    async onRemove(id) {
      try {
        await removeRoleApi(id)
        this.$message.success('删除角色成功')
        this.getRoles()
      } catch (error) {}
    },
    async getCompanyInfo() {
      const { name, companyAddress, mailbox, remarks } =
        await getCompanyInfoApi(this.$store.state.user.userInfo.companyId)
      this.companyInfo = { name, companyAddress, mailbox, remarks }
    }
  }
}
</script>

<style scoped lang="less"></style>
