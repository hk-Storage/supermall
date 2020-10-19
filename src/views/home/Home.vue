<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control" v-show="isTabFixed"></tab-control>

    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
<!--  上拉加载方法1          @pullingUp="loadMore"-->

      <!--    轮播图-->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"></tab-control>
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>

  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";

  import {getHomeMultidata, getHomeGoods} from "network/home";
  import {debounce} from "common/utils";


  export default {
    name: "Home",
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,  //tabcontrol距顶部位置
        isTabFixed: false, //是否需要吸顶
        saveY: 0,
        itemImgListener: null
      }
    },
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop,

    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      //1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()

      //2.取消全局事件监听
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()

      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      //1.监听item中图片加载完成
      const refresh = debounce(this.$refs.scroll.refresh, 200)
      //对监听事件保存
      this.itemImgListener = () => {
        refresh()
      }
      this.$bus.$on('itemImageLoad', this.itemImgListener)

    },
    methods: {
      /**
       * 事件监听事件
       */

      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        //让两个导航栏保持一致
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      backClick() {
       this.$refs.scroll.scrollTo(0, 0 , 500)
      },
      contentScroll(position) {
        //1.判断backtop是否显示
        this.isShowBackTop = (-position.y) > 1000
        //2.判断tabcontrol何时吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {  //上拉加载方法1
        this.getHomeGoods(this.currentType)
        //监听图片刷新完成后,重新计算高度
        // this.$refs.scroll.scroll.refresh()
      },
      swiperImageLoad() {
        //2.对tabcontrol高度赋值
        //所有组件都有一个属性$el:用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },

      /**
       * 网络请求相关方法
       * */
      getHomeMultidata() {
        //1.请求多个数据
        getHomeMultidata().then(res => {
          // console.log(res);
          // this.result = res;
          this.banners = res.data.banner.list  //横幅
          this.recommends = res.data.recommend.list //推荐
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          // console.log(res);
          this.goods[type].list.push(...res.data.list)
          // console.log(this.goods);
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp() //完成上拉加载更多上拉加载方法1
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /*在使用原生滚动时使用*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }
  /*设置标签栏停留效果*/
  /*.tab-control {*/
  /*  position: sticky;*/
  /*  top: 43px;*/
  /*  z-index: 9;*/
  /*}*/
  .content {
    /*height: 300px;*/
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    right: 0;
    left: 0;
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }
  /*.content {*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/

</style>
