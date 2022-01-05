<template>
	<view>
		<view class="wx" v-if="weixin">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				weituoLogCode: '',
				alipayId: '',
				goodsPrice: '',
				weixin: false
			}
		},
		onLoad(option) {
			this.weituoLogCode = option.weituoLogCode
			this.alipayId = option.alipayId
			this.goodsPrice = option.goodsPrice
			this.isWeixin()
		},
		methods: {
			isWeixin() {
				let ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					this.weixin = true
				} else {
					this.weixin = false
					let openURL="alipays://platformapi/startapp?appId=20000067&url="+encodeURIComponent(this.$api.defConfig().domain + '/pages/order/alipayto?alipayId='+this.alipayId+'&goodsPrice='+this.goodsPrice+'&weituoLogCode='+this.weituoLogCode);
					window.location = openURL
				}
			}
			/* ,
			loadData() {
				uni.showLoading({
					title: '正在加载'
				})
				const that = this
				that.$api.request('api/pk/order/payOrderInfo', {
					weituoLogCode: that.weituoLogCode,
					userCode: that.userCode
				}).then(res => {
					uni.hideLoading()
					let alipayId = res.alipayId
					let goodsPrice = res.data.goodsPrice
					let weituoLogCode = res.data.weituoLogCode
					//let authUrl = 'alipays://platformapi/startapp?appId=20000123&actionType=scan&biz_data={"s": "money","u":"2088412753796701","a":"12","m":"委托订单编号:25452254123"}'
					//let authUrl = 'alipays://platformapi/startapp?appId=20000123&actionType=scan&biz_data={"s": "money","u": "2088422470318885","a": "1.1","m":"备注"}'
					//let authUrl = 'alipays://platformapi/startapp?appId=09999988&actionType=toAccount&goBack=NO&amount=100&userId=2088022703882150&memo=委托订单编号:2545225444221'
					//window.location.href = authUrl
					//authUrl = 'alipayqr://platformapi/startapp?appId=20000123&actionType=scan&biz_data={\"s\": \"money\",\"u\": \"2088412753796701\",\"a\": \"12\",\"m\": \"备注\"}'
					//authUrl = 'alipays://platformapi/startapp?appId=09999988&actionType=toAccount&goBack=NO&amount=1&userId=2088412753796701&memo=备注'
					
					// let authUrl = 'alipays://platformapi/startapp?appId=20000123&actionType=scan&biz_data={"s": "money","u": "'+alipayId+'","a": "'+goodsPrice+'","m":"委托订单编号:'+weituoLogCode+'"}'
					let openURL="alipays://platformapi/startapp?appId=20000067&url="+encodeURIComponent(this.$api.defConfig().domain + '/pages/order/alipayto?alipayId='+alipayId+'&goodsPrice='+goodsPrice+'&weituoLogCode='+weituoLogCode);
					window.location = openURL
				}).catch(res => {
					that.$api.msg(res.msg)
				})
			} */
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
		
		.wx {
			position: fixed;
			left: -20upx;
			top: -90upx;
			background-color: rgba(0, 0, 0, .7);
			width: 100%;
			height: 100%;
			background-image: url(../../static/wx.png);
			background-size: 100%;
			background-position: center 100upx;
			background-repeat: no-repeat;
		}
	}
	
	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 300upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
	
		&:after {
			border-radius: 100px;
		}
	}
</style>
