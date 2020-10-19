import {debounce} from "./utils";

import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
  data() {
    return {
      newRefresh: null
    }
  },
  mounted() {
    this.newRefresh = debounce(this.$refs.scroll.refresh, 400)
    this.itemImgListener = () => {
      this.newRefresh()
    }
    this.$bus.$on('itemImgLoad', this.itemImgListener)
  }
}

//返回顶部
export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0 , 500)
    },
  }
}
