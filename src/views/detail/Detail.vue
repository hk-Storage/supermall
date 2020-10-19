<template>
<div id="detail">
  <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
  <scroll class="content"
          ref="scroll"
          :probe-type="3"
          @scroll="contentScroll">
    <detail-swiper :top-images="topImages"/>
    <detail-base-info :goods="goods"/>
    <detail-shop-info :shop="shop"/>
    <detail-goods-info :detail-info="detailInfo" @imageLoad="detailimageLoad"/>
    <detail-param-info :param-info="paramInfo" ref="params"/>
    <detail-comment-info :comment-info="commentInfo" ref="comment"/>
    <goods-list :goods="recommends" ref="recommend"/>
  </scroll>
  <detail-bottom-bar @addCart="addToCart"/>
  <back-top @click.native="backClick" v-show="isShowBackTop"/>
</div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";
  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/datail";

  import {debounce} from "common/utils";
  import {itemListenerMixin, backTopMixin} from "common/mixin";

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,

    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0
      }
    },
    created() {
      //1.保存传入iid
      this.iid = this.$route.params.iid

      //2.根据iid请求详情数据
      getDetail(this.iid).then((res) => {
        //1.获取顶部图片轮播数据
        const data = res.result;
        this.topImages = data.itemInfo.topImages

        //2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        //3.创建店铺信息
        this.shop = new Shop(data.shopInfo)
        // console.log(this.shop);

        //4.保存商品的详情数据
        this.detailInfo = data.detailInfo

        //5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //6.保存评论信息
        if (data.rate.list) {
          this.commentInfo = data.rate.list[0];
        }

        //7.请求推荐数据
        getRecommend().then(res => {
          this.recommends = res.data.list
          // console.log(this.recommends);
        })

        //8.给getThemeTopY赋值(对复制操作进行防抖)
        this.getThemeTopY = debounce(() => {
          this.themeTopYs = []
          this.themeTopYs.push(0);
          this.themeTopYs.push(this.$refs.params.$el.offsetTop);
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
          // console.log(this.themeTopYs);
        },100)

        //获取offsetTop值不对：原因图片没有计算在内
        // this.$nextTick( () => {
        // //渲染完成立即执行
        // //根据最新数据，对应Dom已经被渲染出来，
        //   //但图片依然没有加载完成(目前获取offsetTOp不包含图片)
        //   this.themeTopYs = []
        //   this.themeTopYs.push(0);
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        //   console.log(this.themeTopYs);
        // })
    })
    },
    mounted() {

    },
    // updated() {
    //   this.themeTopYs = []
    //   this.themeTopYs.push(0);
    //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
    //   console.log(this.themeTopYs);
    // },
    methods: {
      detailimageLoad() {
        this.newRefresh()
        this.getThemeTopY()
      },
      titleClick(index) {
        //点击商品/参数/评论跳转到对应页面
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        // 1.获取Y值
        const positionY = -position.y
        //2.positionY与主题中的值进行比较
        for(let i in this.themeTopYs){
          i=parseInt(i)//i=i*1 //遍历i为字符串
          if (this.currentIndex !== i && ((i < this.themeTopYs.length && positionY >= this.themeTopYs[i] && positionY <
              this.themeTopYs[i+1]) || (i === this.themeTopYs.length-1 && positionY >= this.themeTopYs[i]))){
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
        //3.判断是否显示返回顶部
        this.isShowBackTop = (-position.y) > 1000
      },
      addToCart() {
        //1.获取购物车需要展示的商品信息
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid

        //2.将商品添加到购物车
        // this.$store.commit('addCart',product)
        this.$store.dispatch('addCart', product)
      }
    }
  }
</script>

<style scoped>
  #detail {
    /*隐藏主页下方导航栏*/
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    height: calc(100% - 44px - 49px);
  }
</style>
