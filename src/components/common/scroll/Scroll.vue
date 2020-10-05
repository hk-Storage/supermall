<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: { //上拉加载方法1
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      //1.创建better-scroll对象
      this.scroll = new BScroll(this.$refs.wrapper,{
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })
      //2.监听滚动位置
      this.scroll.on('scroll', (position) => {
        //传出事件
        // console.log(position);
        this.$emit('scroll', position)
      })
      // //3.监听scrool滚动到底部  上拉加载方法1
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
      })
      //刷新高度
      // this.scroll.refresh()
    },
    methods: {
      scrollTo(x, y, time=300) {
        // 防止redresh不能找到函数this.scroll &&---
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>
