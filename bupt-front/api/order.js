import request from "../utils/request";
const api_name = "/orderservice/t-order";
export default {
  //1.创建订单
  createOrder(courseId) {
    return request({
      url: `${api_name}/createOrder/${courseId}`,
      method: 'get'
    })
  },
  //2.根据订单id查询订单信息
  getOrderInfo(orderNo) {
    return request({
      url: `${api_name}/${orderNo}`,
      method: 'get'
    })
  },
  //3.生成微信支付二维码
  createNative(orderNo) {
    return request({
      url: `/orderservice/t-pay-log/createNative/${orderNo}`,
      method: 'get'
    })
  },
  //4.根据订单号查询订单支付状态
  queryStatus(orderNo) {
    return request({
      url: `/orderservice/t-pay-log/queryPayStatus/${orderNo}`,
      method: 'get'
    })
  }
}
