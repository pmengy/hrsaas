<template>
  <div>
    <el-upload
      action="#"
      v-loading="loading"
      element-loading-text="上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      list-type="picture-card"
      :http-request="onRequest"
      :file-list="fileList"
      :on-change="onChange"
      :on-remove="onChange"
      :on-preview="onPreview"
      :before-upload="onBeforeUpload"
      :limit="1"
      class="custom-upload"
      :class="fileList.length === 1 ? 'hideAdd' : ''"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogPreview" width="50%" title="图片预览">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDJVUGTWM0TikZAXhePvDJC1e4HH3agaGj',
  SecretKey: 'LTYTAevxoV1JMCoCLL9lCPPCmAML7h5H'
})
export default {
  name: 'UploadImg',
  data() {
    return {
      fileList: [],
      dialogPreview: false,
      dialogImageUrl: '',
      loading: false
    }
  },

  created() {},

  methods: {
    onRequest({ file }) {
      this.loading = true
      cos.putObject(
        {
          Bucket: 'hrsaas-1313341473' /* 必须 */,
          Region: 'ap-shanghai' /* 存储桶所在地域，必须字段 */,
          Key: file.name /* 必须 */,
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData))
          }
        },
        (err, data) => {
          this.loading = false
          if (err || data.statusCode !== 200) {
            return this.$message.error('上传失败')
          }
          this.$emit('onSuccess', { url: 'https://' + data.Location })
        }
      )
    },
    onChange(file, fileList) {
      this.fileList = fileList
    },
    onPreview(file) {
      this.dialogPreview = true
      this.dialogImageUrl = file.url
    },
    onBeforeUpload(file) {
      // 可以上传的图片类型
      const types = ['image/jpeg', 'image/gif']
      if (!types.includes(file.type)) {
        this.$message.error('请选择' + types.join('、') + '图片')
        return false
      }
      // 限制图片大小
      const maxSize = 1 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小不能超过1M')
        return false
      }
      return true
    }
  }
}
</script>

<style scope lang="scss">
.hideAdd .el-upload--picture-card {
  display: none;
}
.custom-upload {
  width: 148px;
  height: 148px;
  overflow: hidden;
}
</style>
