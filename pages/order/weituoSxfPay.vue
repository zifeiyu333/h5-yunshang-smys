<template>
	<view>
		<!-- <web-view :src="action" v-if="!weixin"></web-view> -->
		<button form-type="submit" class="confirm-btn" @click="weituoSxfPay">立即支付</button>
		<view class="wx" v-if="weixin">

		</view>
	</view>
</template>

<script>
	export default {
		filters: {
			priceFormat(price) {
				return price
			},
			dateFormat(time) {
				return 'temp'
				//return formatDate(new Date(time),'yyyy-MM-dd HH:mm')
			}
		},
		components: {
		},
		data() {
			return {
				action: this.$api.defConfig().baseUrl + '/api/pk/aliPay/weituoSxfPay',
				submiting: false,
				domain: this.$api.defConfig().domain,
				weituoLogCode: '',
				userInfo: {},
				reset: true,
				tabCurrentIndex: 0,
				weixin: false
			}
		},
		onLoad(option) {
			this.weituoLogCode = option.weituoLogCode
			this.userCode = option.userCode
			this.isWeixin()
		},
		methods: {
			weituoSxfPay() {
				this.submiting = true
				this.$api.request('api/pk/aliPay/weituoSxfPay', {
					weituoLogCode: this.weituoLogCode,
					userCode: this.userCode
				}, 'post', 'application/json').then(res => {
					this.submiting = false
					console.info(res)
					if (res.code === 200) {
						//将接口返回的Form表单显示到页面
						document.querySelector('body').innerHTML = res.data;
						//调用submit 方法
						document.forms[0].submit()
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(res => {
					this.submiting = false
				})
			},
			isWeixin() {
				let ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					this.weixin = true
				} else {
					this.weixin = false
					// let authUrl = 'alipays://platformapi/startapp?appId=20000067&url=' + 
					// encodeURIComponent(this.domain)
					/* &url=${encodeURIComponent(res.data)}
					if (uni.getSystemInfoSync().platform == "ios") {
					authUrl = `alipay://platformapi/startapp?appId=20000067&url=${encodeURIComponent(
					  res.data
					)}`;
					} */
					/* window.open(authUrl, function (res) {
						uni.showToast({
						  icon: "none",
						  title: "请安装支付宝之后再进行支付！",
						});
					}); */
				}
			},
			loadData() {
				
			}
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
