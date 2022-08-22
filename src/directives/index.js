import store from '@/store'
export const errorImg = {
  // 被绑定的元素插入到dom中时
  inserted(el, { value }) {
    if (!el.src) {
      el.src = value
    } else {
      // 监听img的图片加载失败的事件
      el.onerror = () => {
        el.src = value
      }
    }
  },
  // 指令所绑定的元素更新时触发
  update(el, { value }) {
    if (!el.src) {
      el.src = value
    }
  }
}

export const isHas = {
  inserted(el, binding) {
    const has = store.state.permission.points.includes(binding.value)
    if (!has) {
      el.remove()
    }
  }
}
