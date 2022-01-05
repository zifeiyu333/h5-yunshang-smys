<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>

					<!-- 订单列表 -->
					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item">
						<view class="i-top b-b">
							<text class="time">订单号：{{item.weituoLogCode}}</text>
							<text class="status">{{statusMap[item.status]}}</text>
						</view>

						<view class="goods-box-single">
							<image class="goods-img" :src="item.goodsImg" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{item.goodsName}}</text>
								<text class="title clamp" v-if="userCode === item.sellerUserCode">买家：{{item.buyNickName}}</text>
								<text class="title clamp" v-else-if="item.sellerNickName">卖家：{{item.sellerNickName}}</text>
								<text class="title clamp" v-else>卖家：平台</text>
								<text class="price">{{item.goodsPrice}}</text>
							</view>
						</view>
						<view class="price-box">
							<text class="time">{{(item.addTime * 1000) | dateFormat}}</text>
							<text class="num" v-if="userCode === item.buyUserCode">买</text>
							<text class="num" v-else>卖</text>
							<text class="num" v-if="userCode === item.buyUserCode">{{buyStatusMap[item.status]}}</text>
							<text class="num" v-else>{{sellerStatusMap[item.status]}}</text>
						</view>
						<view v-if="item.status === 1">
							<view class="action-box b-t" v-if="userCode === item.buyUserCode">
								<!-- <button :disabled="submiting" class="action-btn" @click="cancelOrder(item)">取消订单</button> -->
								<button :disabled="submiting" class="action-btn recom" @click="confirmPay(item)">已付款</button>
								<button :disabled="submiting" class="action-btn recom" @click="payOrder(item)">去付款</button>
							</view>
						</view>
						
						<view v-if="item.status === 2">
							<view class="action-box b-t" v-if="userCode === item.buyUserCode">
								<!-- <button :disabled="submiting" class="action-btn" @click="cancelOrder(item)">取消订单</button> -->
								<button :disabled="submiting" class="action-btn recom" @click="payOrder(item)">重新付款</button>
							</view>
							<view class="action-box b-t" v-else>
								<button :disabled="submiting" class="action-btn recom" @click="complaintOrder(item)">投诉订单</button>
								<button :disabled="submiting" class="action-btn recom" @click="collectedPay(item)">确认收款</button>
							</view>
						</view>
						
						<view v-if="item.status === 3">
							<view class="action-box b-t" v-if="userCode === item.buyUserCode">
								<button :disabled="submiting" class="action-btn recom" @click="payOrder(item)">重新付款</button>
							</view>
							<view class="action-box b-t" v-else>
								<button :disabled="submiting" class="action-btn recom" @click="cancelComplaint(item)">取消投诉</button>
								<button :disabled="submiting" class="action-btn recom" @click="collectedPay(item)">确认收款</button>
							</view>
						</view>
						<view class="action-box b-t" v-if="item.status === 4">
							<view class="action-box b-t" v-if="userCode === item.buyUserCode">
								<button :disabled="submiting" class="action-btn recom" @click="toExtractOrder(item)">提取货物</button>
								<view :disabled="submiting" class="action-btn recom" id="nofill" @tap="weituoOrderView(item)">立即委托</view>
							</view>
						</view>
					</view>

					<uni-load-more :status="tabItem.loadingType"></uni-load-more>

				</scroll-view>
			</swiper-item>
		</swiper>
		
		<view class="more-page">
			<zwp-blowup-popup
				ref="nofillPopup"
				selector="nofill"
				:duration="100"
				:ani-after-styles="{
					paddingTop: '30px',
					transform: 'translate(20px, 20px)',
					width: 'calc(100vw - 40px)',
					height: 'calc(100vh - 60px)',
					borderRadius: '10px'
				}"
			>
				<view class="popup-title">支付委托协议</view>
				<view class="popup-content">
					<view>
						根据《委托托管规则》，您在转拍前需支付委托托管佣金，支付前请
						确认如下信息：
					</view>
					<view style="padding:30upx">
						<view class="row b-b">
							<text class="tit">增长幅度</text>
							<view class="uni-uploader-title pickerbox input">
								<picker @change="bindPickerChange" :value="index" :range="zzblArray" range-key="name">
									<view class="uni-input">{{zzblArray[index].name}}</view>
								</picker>
							</view>
						</view>
						<view class="row b-b">
							<text class="tit">购买单价为</text>
							<text class="input">￥{{goodsPrice}}</text>
						</view>
						<view class="row b-b">
							<text class="tit">转卖单价为</text>
							<text class="input">￥{{weituoPrice}}</text>
						</view>
						<view class="row b-b">
							<text class="tit">您的委托托管费</text>
							<text class="input">￥{{sxfPrice}}</text>
						</view>
					</view>
					<view style="padding:0upx">
						<view style="text-align: center;color: #fa436a;font-size: 15px;">支付宝二维码</view>
						<view style="padding:20upx;text-align: center;color: #fa436a;font-size: 17px;" @tap="weituoOrder">点我打开支付宝支付</view>
						<view class="m-top10 text-center yaoqing">
							<img :src='sxfQrPay' mode="">
							<view style="padding:10upx;text-align: center;color: #fa436a;font-size: 14px;">(支付宝扫码,长按识别,或点击上方链接支付)</view>
						</view>
					</view>
				</view>
				<view class="popup-footer">
					<view class="btn" @tap="$refs.nofillPopup.close()">关闭</view>
				</view>
			</zwp-blowup-popup>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
    import {  
        mapState 
    } from 'vuex';  
	export default {

		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				domain: this.$api.defConfig().domain,
				userCode: '',
				index: 15,
				goodsPrice: 0,
				weituoPrice: 0,
				sxfPrice: 0,
				sxfQrPay: 0,
				weituoLogCode: '',
				zzblArray: [
					{index: -10, name: '-10%'}, 
					{index: -9, name: '-9%'}, 
					{index: -8, name: '-8%'}, 
					{index: -7, name: '-7%'}, 
					{index: -6, name: '-6%'}, 
					{index: -5, name: '-5%'},
					{index: -4, name: '-4%'},
					{index: -3, name: '-3%'},
					{index: -2, name: '-2%'},
					{index: -1, name: '-1%'},
					{index: 0, name: '持平'},
					{index: 1, name: '+1%'}, 
					{index: 2, name: '+2%'},
					{index: 3, name: '+3%'},
					{index: 4, name: '+4%'},
					{index: 5, name: '+5%'}
					// ,
					// {index: 6, name: '+6%'}
				],
				statusMap: {
					0: '已取消',
					1: '未付款',
					2: '待确认收款',
					3: '投诉处理中...',
					4: '交易完成',
					5: '已委托',
					6: '已提货'
				},
				buyStatusMap: {
					0: '您已取消订单',
					1: '您尚未付款，请及时付款',
					2: '待卖家确认收款',
					3: '卖家投诉您未付款...',
					4: '交易完成，请选择委托或提货',
					5: '交易完成，您选择委托',
					6: '交易完成，您选择提货'
				},
				sellerStatusMap: {
					0: '买方取消订单',
					1: '等待买家付款中...',
					2: '请您确认收款',
					3: '您的投诉正在处理中...',
					4: '已交易完成',
					5: '已交易完成',
					6: '已交易完成'
				},
				addressData: {
					weituoLogCode: '',
					name: '',
					phone: '',
					addr: '',
					isDefault: 0,
				},
				submiting: false,
				tabCurrentIndex: 0,
				navList: [{
						status: -1,
						text: '全部',
						loadingType: 'more',
						current: 1,
						orderList: []
					},
					{
						status: 1,
						text: '待付款',
						loadingType: 'more',
						current: 1,
						orderList: []
					},
					{
						status: 2,
						text: '待收款',
						loadingType: 'more',
						current: 1,
						orderList: []
					},
					{
						status: 3,
						text: '投诉',
						loadingType: 'more',
						current: 1,
						orderList: []
					},
					{
						status: 4,
						text: '仓库',
						loadingType: 'more',
						current: 1,
						orderList: []
					},
					{
						status: 5,
						text: '已委托',
						loadingType: 'more',
						current: 1,
						orderList: []
					},
					{
						status: 6,
						text: '已提货',
						loadingType: 'more',
						current: 1,
						orderList: []
					}
				],
			};
		},
        computed: {
			...mapState(['hasLogin','userInfo'])
		},
		onShow() {
			if (this.addressData.name) {
				this.extractOrder()
			}
		},
		onLoad(options) {
			this.userCode = this.userInfo.userCode
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.tabCurrentIndex = 0
			for (let i = 0; i < this.navList.length; i++) {
				if (this.navList[i].status === parseInt(options.status)) {
					this.tabCurrentIndex = i
				}
			}
			this.loadData()
		},

		methods: {
			//获取订单列表
			loadData(source) {
				const that = this
				//这里是将订单挂载到tab列表下
				let index = that.tabCurrentIndex;
				let navItem = that.navList[index];
				let status = navItem.status;
				if(source === 'refresh') {
					navItem.loaded === false
					navItem.loadingType === 'more'
				}
				if (source === 'tabChange' && navItem.loaded === true) {
					//tab切换只有第一次需要加载数据
					return;
				}
				if (navItem.loadingType === 'loading') {
					//防止重复加载
					return;
				}

				navItem.loadingType = 'loading';
				let orderList = that.$api.request('api/pk/order/myOrderList', {
					current: navItem.current,
					status: navItem.status
				}).then(res => {
					navItem.current = res.data.current + 1
					navItem.loadingType = res.data.current < res.data.totalPages ? 'more' : 'noMore'
					res.data.records.forEach(item => {
						navItem.orderList.push(item)
					})
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					that.$set(navItem, 'loaded', true);
				})
			},

			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//去付款
			payOrder(item) {
				uni.redirectTo({
					url: '/pages/order/pay?weituoLogCode=' + item.weituoLogCode
				})
			},
			//确认付款
			confirmPay(item) {
				const that = this
				if (that.submiting) {
					return
				}
				uni.showModal({
					title: '确认付款？',
					content: '您确定已付过款吗？',
					success : (e) => {
						if (e.confirm) {
							that.submiting = true
							that.$api.request('api/pk/order/confirmPay', {
								weituoLogCode: item.weituoLogCode
							},'PUT').then(prepayRes => {
								that.submiting = false
								item.status = 2
							}).catch(res => {
								that.submiting = false
								that.$api.msg(res.msg)
							})
						}
					}
				})
			},
			//确认收款
			collectedPay(item) {
				const that = this
				if (that.submiting) {
					return
				}
				uni.showModal({
					title: '确认收款？',
					content: '确定已收到款？',
					success : (e) => {
						if (e.confirm) {
							that.submiting = true
							that.$api.request('api/pk/order/collectedPay', {
								weituoLogCode: item.weituoLogCode
							},'PUT').then(prepayRes => {
								that.submiting = false
								item.status = 4
							}).catch(res => {
								that.submiting = false
								that.$api.msg(res.msg)
							})
						}
					}
				})
			},
			//取消投诉
			cancelComplaint(item) {
				const that = this
				if (that.submiting) {
					return
				}
				uni.showModal({
					title: '取消投诉？',
					content: '用户已付款？确认取消投诉',
					success : (e) => {
						if (e.confirm) {
							that.submiting = true
							that.$api.request('api/pk/order/cancelComplaint', {
								weituoLogCode: item.weituoLogCode
							},'PUT').then(prepayRes => {
								that.submiting = false
								item.status = 2
							}).catch(res => {
								that.submiting = false
								that.$api.msg(res.msg)
							})
						}
					}
				})
			},
			//投诉
			complaintOrder(item) {
				const that = this
				if (that.submiting) {
					return
				}
				uni.showModal({
					title: '投诉订单？',
					content: '未收到款？确认投诉',
					success : (e) => {
						if (e.confirm) {
							that.submiting = true
							that.$api.request('api/pk/order/complaintOrder', {
								weituoLogCode: item.weituoLogCode
							},'PUT').then(prepayRes => {
								that.submiting = false
								item.status = 3
							}).catch(res => {
								that.submiting = false
								that.$api.msg(res.msg)
							})
						}
					}
				})
			},
			//取消订单
			cancelOrder(item) {
				const that = this
				uni.showModal({
					title: '取消订单？',
					content: '您确定要取消此订单吗？',
					success : (e) => {
						if (e.confirm) {
							that.submiting = true
							that.$api.request('api/pk/order/cancelOrder', {
								weituoLogCode: item.weituoLogCode
							}, 'PUT').then(res => {
								that.submiting = false
								if (res.code === 200) {
									item.status = 0
								}
							}).catch(res => {
								that.submiting = false
							})
						}
					}
				})
			},
			weituoOrderView(item) {
				const that = this
				this.$api.request('api/pk/goodsweituolog/info/' + item.weituoLogCode, {
					weituoLogCode: item.weituoLogCode
				}).then(res => {
					if (res.code === 201) {
						that.$api.msg(res.msg)
						return false
					}
					this.weituoLogCode = item.weituoLogCode
					this.goodsPrice = item.goodsPrice
					this.weituoPrice = item.weituoPrice
					this.sxfPrice = res.sxfPrice
					this.sxfQrPay = res.qrPay
					// const obj = this.zzblArray[this.zzblArray.length-1]
					// this.goodsZmj = (that.goodsPrice + (that.goodsPrice * (obj.index / 100))).toFixed(2)
					that.$refs.nofillPopup.open()
				})
			},
			bindPickerChange: function(e) {
				this.index = e.target.value
				const obj = this.zzblArray[this.index]
				this.weituoPrice = (this.goodsPrice + (this.goodsPrice * (obj.index / 100))).toFixed(2)
				this.$api.request('api/pk/goodsweituolog/updateWeituoPrice', {
					weituoLogCode: this.weituoLogCode, weituoPrice: this.weituoPrice
				}, 'PUT', 'application/json').then(res => {
				}).catch(res => {
				})
			},
			weituoOrder() {
				window.location = '/pages/order/weituoSxfPay?userCode=' + this.userInfo.userCode + '&weituoLogCode=' + this.weituoLogCode
			},
			//委托订单
			/* weituoOrder(item) {
				const that = this
				uni.showModal({
					title: '委托订单？',
					content: '您确定要委托订单吗？',
					success : (e) => {
						if (e.confirm) {
							that.submiting = true
							that.$api.request('api/pk/order/weituoOrderConfirm', {
								weituoLogCode: item.weituoLogCode
							}, 'PUT').then(res => {
								that.submiting = false
								if (res.code === 200) {
									item.status = 0
								}
							}).catch(res => {
								that.submiting = false
							})
						}
					}
				})
			}, */
			//提取货物
			toExtractOrder(item) {
				uni.navigateTo({
					url: '/pagesA/address/list?source=1&weituoLogCode=' + item.weituoLogCode
				})
			},
			//提取货物
			extractOrder() {
				const that = this
				uni.showModal({
					title: '提取货物？',
					content: '您确定要提取货物吗？（收件人：' + this.addressData.name + '；电话：' + this.addressData.phone + '；收货地址：' + this.addressData.addr + '）',
					success : (e) => {
						if (e.confirm) {
							const payParam = {
								weituoLogCode: that.addressData.weituoLogCode,
								name: that.addressData.name,
								phone: that.addressData.phone,
								addr: that.addressData.addr
							}
							that.submiting = true
							that.$api.request('api/pk/order/extractOrder', {
								...payParam
							}, 'PUT').then(res => {
								that.$api.msg('提取成功，请耐心等待！')
								that.loadData()
								that.submiting = false
							}).catch(res => {
								that.submiting = false
							})
						} else {
							that.addressData = {
								weituoLogCode: '',
								name: '',
								phone: '',
								addr: ''
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.more-page {
	.content-item {
		height: 40px;
		line-height: 40px;
		text-align: center;
		font-size: 16px;
		margin: 20px;
		box-shadow: 0 0 6rpx rgba(0, 0, 0, 0.3);
		border-radius: 20px;
	}
	.popup-title {
		text-align: center;
		font-size: 18px;
	}
	.popup-content {
		text-align: left;
		margin: 20px;
		font-size: 15px;
		height: 80%;
	}
	.btn {
		height: 40px;
		line-height: 40px;
		text-align: center;
		margin: 20px;
		border-radius: 5px;
		color: #00b4ff;
		font-size: 15px;
	}
	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:30upx 30upx 30upx 0upx; 
		height: 80upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 70%;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			text-align: right;
			color: #fa436a;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	
	.yaoqing{
		text-align: center;
		img{
			width: 320upx;
			height: 320upx;
		}
	}
}
	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: 100%;
		padding-top:100rpx
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 100upx;
		background: #fff;
		box-shadow: 0 1upx 2upx rgba(0, 0, 0, 0.06);
		position: fixed;
		width: 100%;
		z-index: 10;
		margin-bottom: 20upx;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 28upx;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding: 0 20upx;
		background: #fff;
		margin-top: 16upx;

		.i-top {
			display: flex;
			align-items: center;
			padding: 20upx 0;
			font-size: $font-26;
			color: #999;
			position: relative;

			.time {
				flex: 1;
			}

			.status {
				color: $base-color;
			}

			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		/* 多条商品 */
		.goods-box {
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;

			.goods-item {
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}

			.goods-img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20upx 0;

			.goods-img {
				display: block;
				width: 120upx;
				height: 120upx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding-left:20upx;
				overflow: hidden;
				.attr-box {
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 5upx 0;
				}

				.price {
					margin: 10upx;
					font-size: $font-26;
					color: $base-color;

					&:before {
						content: '￥';
						font-size: $font-sm;
						margin-right: 2upx;
					}
				}
			}
		}

		.price-box {
			display: flex;
			//justify-content: flex-end;
			align-items: baseline;
			padding-bottom: 20upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.num {
				margin: 0 8upx;
				color: $font-color-dark;
			}

			.num2 {
				margin: 0 8upx;
				color: $font-color-dark;
			}
			
			.time {
				margin: 0 8upx 0 0;
				color: $font-color-dark;
			}
			
			.price {
				font-size: $font-lg;
				color: $base-color;

				&:before {
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			padding: 20upx 0;
			position: relative;
			
			.title {
				font-size: $font-base;
				color: $font-color-dark;
			}
		}

		.action-btn {
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;

			&:after {
				border-radius: 100px;
			}

			&.recom {
				background: #fff9f9;
				color: $base-color;

				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>
