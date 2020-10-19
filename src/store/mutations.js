import {ADD_COUNTER, ADD_TO_CART} from "./mutation-types";

export default {
  //mutations唯一目的修改state中的数据且每一个方法完成事情比较单一
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, paload) {
    state.cartList.push(paload)
  }
}
