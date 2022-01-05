<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<!-- <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view> -->
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				欢迎回来！
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" :value="phone" placeholder="请输入手机号码" maxlength="11" data-key="phone" @input="inputChange" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="password" value="" data-key="password" placeholder="账户密码" @input="inputChange" />
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="submiting">登录</button>
			
			<button class="confirm-btn" v-if="weixin" @click="wechatH5Login" :disabled="submiting">微信登录</button>
			<button class="confirm-btn" @click="toRegist" :disabled="submiting">注册</button>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				weixin: false,
				inviter: '',
				phone: '',
				password: '',
				sendText: '获取验证码',
				agreement: 1,
				sendDisabled: false,
				submiting: false
			}
		},
		onShow() {
			// this.$api.logout()
		},
		onLoad(options) {
			// #ifdef H5
			let ua = navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i) == "micromessenger") {
				this.weixin = true
			}
			// #endif
			this.inviter = options.inviter
			if (this.inviter) {
				uni.setStorageSync('inviter', this.inviter)
			}
		},
		methods: {
			...mapMutations(['login']),
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				window.location = '/pages/index/index'
			},
			toRegist() {
				uni.redirectTo({
					url: '/pages/public/register'
				})
			},
			async toLogin() {
				const that = this
				if (that.phone.length !== 11) {
					that.$api.msg('请输入11位手机号')
				} else if (!that.password) {
					that.$api.msg('请输入密码')
				} else {
					uni.showLoading({
						title: '登录中...'
					})
					that.submiting = true
					that.$api.request('api/pk/user/login', {
						'phone': that.phone,
						'password': that.password
					}, 'POST', "application/json").then(res => {
						that.submiting = false
						setTimeout(function(){
							uni.hideLoading()
						},500)
						if (res.code === 201) { //用户未注册过 ，跳转至注册页面
							that.$api.msg('尚未注册，请您先注册！')
							return  
						}
						that.$api.setUserInfo(res.userInfo)
						that.$api.setToken(res.token)
						that.$store.commit('login', res.userInfo)
						uni.setStorageSync('token', res.token)
						if (that.$api.prePage()) {
							if (that.$api.prePage().lodaData) {
								that.$api.prePage().loadData()
							}
							uni.navigateBack()
						} else {
							window.location = '/pages/index/index'
						}
					}).catch(res => {
						uni.hideLoading()
						that.submiting = false
						that.$api.msg(res.msg)
					})
				}
			},
			getPhoneNumber(e) {
				const that = this
				that.miniWechatLogin(e.detail)
			},
			wechatH5Login() {
				const that = this
				let href = window.location.origin+'/pages/public/load'
				let page = that.$api.prePage()
				let prePath = '/pages/index/index'
				if (page) {
					prePath = page.__page__.path
				}
				window.location = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
					'appid=' + that.$api.defConfig().h5Appid + '&redirect_uri=' + escape(href) +
					'&response_type=code&scope=snsapi_userinfo&state=' + escape(prePath) + '#wechat_redirect'
			}
		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 160upx;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 100upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
		.verify-code {
			flex-direction: row;
			display: flex;
			justify-content:end; 
			flex-wrap: wrap
		}
	}

	.verify-btn {
		width: 100upx;
		height: 60upx;
		line-height: 60upx;
		border-radius: 50px;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-sm;

		&:after {
			border-radius: 100px;
		}
	}
	
	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
