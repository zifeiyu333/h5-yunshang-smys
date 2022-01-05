<template>
	<view class="container">
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="input-content">
				<view class="input-item">
					<text class="tit">昵称</text>
					<input v-model="nickName" placeholder="请输入您的昵称" maxlength="11" @input="inputChange" />
				</view>
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" :value="phone" placeholder="请输入手机号码" maxlength="11" data-key="phone" @input="inputChange" />
				</view>
				<!-- <view class="input-item">
					<text class="tit">验证码</text>
					<view class="verify-code">
						<input type="mobile" value="" placeholder="6位验证码" maxlength="6" data-key="captcha" @input="inputChange" style="width: 60%;" />
						<button style="width: 40%;" class="verify-btn" :disabled="sendDisabled" @click="doGetVerify">{{sendText}}</button>
					</view>
				</view> -->
				<view class="input-item">
					<text class="tit">所在地</text>
					<view class="areaname" @click="showMulLinkageThreePicker">
						<text>{{areaname}}</text>
					</view>
				</view>
			</view>
			<button class="confirm-btn" @click="doBindPhone" :disabled="submiting">修改资料</button>
			
		</view>
		<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import {
		mapMutations, mapState
	} from 'vuex';
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	export default {
		data() {
			return {
				wxMpOpenId: '',
				phone: '',
				captcha: '',
				nickName: '',
				submiting: false,
				sendText: '获取验证码',
				// 城市
				cityPickerValueDefault: [0, 0, 0],
				area_id: 0,
				areaname: '选择省/市/区',
				provinceCode: '',
				cityCode: '',
				countyCode: '',
				sendDisabled: false
			}
		},
		onLoad() {
			this.nickName = this.userInfo.nickName
			this.phone = this.userInfo.phone
		},
        computed: {
			...mapState(['hasLogin','userInfo'])
		},
		components: {
		    mpvueCityPicker
		},
		methods: {
			...mapMutations(['login']),
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			toLogin() {
				uni.redirectTo({
					url: "/pages/public/login"
				})
			},
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				var label = e.label;
				this.pickerText = label;
				var labelArr = label.split('-');
				this.areaname = label
				this.provinceCode = e.provinceCode
				this.cityCode = e.cityCode
				this.countyCode = e.countyCode
			},
			doGetVerify() {
				const that = this
				if(!/(^1[2|3|4|5|6|7|8|9][0-9]{9}$)/.test(that.phone)){
					that.$api.msg('请输入正确的手机号码');
					return
				}
				that.$api.request('api/pk/user/sendPhoneCaptcha', {
					phone: that.phone
				},'POST', "application/json").then(res => {
					
					if (res.code !== 200) {
						that.$api.msg(res.msg)
					}
					// that.$api.msg('测试环境展示====' + res.captcha)
					that.sendDisabled = true
					let sec = 60
					let interval = setInterval(() => {
						sec--;
						that.sendText = sec + 's后重发'
						if (sec <= 0) {
							that.sendDisabled = false
							that.sendText = "获取验证码"
							clearInterval(interval)
						}
					}, 1000)
				})
				
			},
			async doBindPhone() {
				const that = this
				if(!that.nickName){
					this.$api.msg('请输入昵称');
					return;
				}
				if(!/(^1[2|3|4|5|6|7|8|9][0-9]{9}$)/.test(that.phone)){
					that.$api.msg('请输入正确的手机号码');
					return
				}
				if(!that.countyCode){
					this.$api.msg('请选择所在地');
					return;
				}
				// if(!that.captcha){
				// 	this.$api.msg('请输入6位手机验证码');
				// 	return;
				// }
				uni.showLoading({
					title: '提交中...'
				})
				that.submiting = true
				that.$api.request('api/pk/user/bindPhone', {
					phone: that.phone,
					nickName: that.nickName,
					countyCode: that.countyCode,
					provinceCode: that.provinceCode,
					cityCode: that.cityCode,
					areaname: that.areaname,
					captcha: ''//that.captcha
				},'POST', "application/json").then(res => {
					that.submiting = false
					setTimeout(function(){
						uni.hideLoading()
					},500)
					this.userInfo.phone = that.phone
					that.$store.commit('login', this.userInfo)
					uni.setStorageSync('userInfo', this.userInfo)
					window.location = '/pages/user/user'
				}).catch(res => {
					uni.hideLoading()
					that.submiting = false
				})
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 60px;
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
		height: 140upx;
		border-radius: 4px;
		margin-bottom: 10upx;

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
		
		.areaname {
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
		/*bottom: 50upx;*/
		width: 100%;
		height: 0px;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
