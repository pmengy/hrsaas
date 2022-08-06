<template>
  <el-dialog
    @close="$emit('update:visible', false)"
    title="新增部门"
    :visible="visible"
    width="50%"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="部门名称" placeholder="1-50个字符" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="部门编码" placeholder="1-50个字符" prop="code">
        <el-input v-model="formData.code"></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 100%"
          placeholder="请选择负责人"
        >
          <el-option
            v-for="item in getEmployees"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" placeholder="1-300个字符" prop="introduce">
        <el-input type="textarea" v-model="formData.introduce"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button @click="onSave" type="primary">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartment } from '@/api/departments'
import { getEmployeesApi } from '@/api/employees'
export default {
  data() {
    // 校验部门名称
    const checkDeptName = (rule, value, callback) => {
      this.currentDept.children?.some((item) => item.name === value)
        ? callback(new Error('部门名称重复'))
        : callback()
    }
    // 校验部门编码
    const checkDeptCode = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      depts.some((item) => item.code === value)
        ? callback(new Error('部门编码重复'))
        : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      formRules: {
        name: [
          {
            required: true,
            message: '部门名称不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur'
          },
          {
            validator: checkDeptName,
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '部门编码不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: 'blur'
          },
          { validator: checkDeptCode, trigger: 'blur' }
        ],
        manager: [
          {
            required: true,
            message: '部门负责人不能为空',
            trigger: 'change'
          }
        ],
        introduce: [
          {
            required: true,
            message: '部门介绍不能为空',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            min: 1,
            max: 300,
            message: '部门介绍要求1-50个字符'
          }
        ]
      },
      getEmployees: []
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    currentDept: {
      type: Object,
      required: true
    }
  },
  created() {
    this.getEmployeesApi()
  },

  methods: {
    // 获取员工列表
    async getEmployeesApi() {
      const res = await getEmployeesApi()
      this.getEmployees = res
    },
    async onSave() {
      await this.$refs.form.validate()
      this.formData.pid = this.currentDept.id
      try {
        await addDepartment(this.formData)
        this.$emit('update:visible', false)
        this.$message.success('新增部门成功')
        this.$emit('success')
      } catch (error) {
        this.$message.error('网络异常,请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
