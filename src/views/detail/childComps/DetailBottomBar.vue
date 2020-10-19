<template>
  <div class="bottom-bar">
    <div class="bar-item bar-left">
      <div>
        <i class="icon service"></i>
        <span class="text">客服</span>
      </div>
      <div>
        <i class="icon shop"></i>
        <span class="text">店铺</span>
      </div>
      <div>
        <i class="icon select"></i>
        <span class="text">收藏</span>
      </div>
    </div>
    <div class="bar-item bar-right">
      <div class="cart" @click="addTocart">加入购物车</div>
      <div class="buy">购买</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "DetailBottomBar",
    methods: {
      addTocart() {
        this.$emit('addCart')
      }
    }
  }
</script>

<style scoped>
  /*.bottom-bar {*/
  /*  height: 49px;*/
  /*  background: red;*/
  /*  position: relative;*/
  /*  bottom: 49px;*/
  /*  !*position: fixed;*!*/
  /*  !*left: 0;*!*/
  /*  !*right: 0;*!*/
  /*  !*bottom: 0;*!*/
  /*}*/

  .bottom-bar {
    height: 58px;
    position: fixed;
    background-color: #fff;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    text-align: center;
  }

  .bar-item {
    flex: 1;
    display: flex;
  }

  .bar-item>div {
    flex: 1;
  }

  .bar-left .text {
    font-size: 13px;
  }

  .bar-left .icon {
    display: block;
    width: 22px;
    height: 22px;
    margin: 10px auto 3px;
    background: url("~assets/img/detail/detail_bottom.png") 0 0/100%;

    /*background: url(http://demo.lanrenzhijia.com/2015/css0122/images/lanrenzhijia.jpg)*/
    /*0 0 / 200px 340px no-repeat;*/
    /*背景dao：背景图片地址http://demo.lanrenzhijia.com/2015/css0122/images/lanrenzhijia.jpg */
    /*x轴从dao0位置开始平铺 y轴从0位置开始平铺 / 把图片宽度缩小为200px 把图片高度缩小为340px显示 图片不重复；*/
  }

  .bar-left .service {
    background-position:0 -54px;
  }

  .bar-left .shop {
    background-position:0 -98px;
  }

  .bar-right {
    font-size: 15px;
    color: #fff;
    line-height: 58px;
  }

  .bar-right .cart {
    background-color: #ffe817;
    color: #333;
  }

  .bar-right .buy {
    background-color: #f69;
  }
</style>
