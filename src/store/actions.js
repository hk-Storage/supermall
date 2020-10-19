import {ADD_COUNTER, ADD_TO_CART} from "./mutation-types";

export default {
  addCart(context, payload){
    //payload新添加商品
    let oldProduct = null;
    for(let item of context.state.cartList){
      if(item.iid === payload.iid){
        oldProduct = item;
      }
    }
    //2.方法2
    // let product = state.cartList.find(function (item) {
    //   return item.iid === payload.iid
    // }
    //判断oldProduct
    if (oldProduct) {
      // oldProduct.count += 1
      context.commit(ADD_COUNTER, oldProduct)
    }else {
      payload.count = 1
      // state.cartList.push(payload)
      context.commit(ADD_TO_CART, payload)
    }
  }
}
