// 可以定义一个对象,然后混入到组件中
import permissionPoint from '@/constant/permission'
export default {
  data() {
    return {
      point: permissionPoint
    }
  },
  methods: {
    hasPermission(point) {
      return this.$store.state.permission.points.includes(point)
    }
  }
}
