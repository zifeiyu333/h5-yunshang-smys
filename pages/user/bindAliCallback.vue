<template>
	<view>
		<button class="confirm-btn" @click="back">回到首页</button>
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
			}
		},
		components: {
		},
		data() {
			return {
				userCode: '',
				submiting: false,
				domain: this.$api.defConfig().domain,
				weituoLogCode: '',
				auth_code: '',
				options: {},
				reset: true,
				tabCurrentIndex: 0,
				weixin: false
			}
		},
		onLoad(option) {
			this.userCode = option.userCode
			this.auth_code = option.auth_code
			this.options = option
			this.auth()
		},
		methods: {
			auth() {
				if (!this.auth_code) {
					this.$api.msg('未获取到有效参数')
				}
				if (!this.userCode) {
					this.$api.msg('未获取到有效参数')
				}
				uni.showLoading({
					title: '正在授权中...'
				})
				this.$api.request('api/pk/aliPay/openAuthTokenAppToResponse', {...this.options}, 'POST').then(res => {
					
				}).catch(res => {
					uni.hideLoading()
				})
			},
			back() {
				window.location = '/pages/index/index'
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
