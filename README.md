常见问题：

1.点击事件
onClick={method}  点击时调用 无参数
onClick={() => {method(p1)}}  点击时调用 有参数
onClick={method(p1)}  组件渲染时就调用 慎用, 需要传参用第二种方式

2.同步state到storage, 避免刷新后导致的各种问题

3.单行禁用eslint： // eslint-disable-line no-new, no-undef
