// 定义的函数可以变为过滤器
import dayjs from 'dayjs'
export const formatTime = (val) => {
  return dayjs(val).format('YYYY-MM-DD')
}
