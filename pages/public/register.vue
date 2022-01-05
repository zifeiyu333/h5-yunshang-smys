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
				<view class="input-item">
					<text class="tit">验证码</text>
					<view class="verify-code">
						<input type="mobile" value="" placeholder="6位验证码" maxlength="6" data-key="captcha" @input="inputChange" style="width: 60%;" />
						<button style="width: 40%;" class="verify-btn" :disabled="sendDisabled" @click="doGetVerify">{{sendText}}</button>
					</view>
				</view>
				<view class="input-item">
					<text class="tit">所在地</text>
					<view class="areaname" @click="showMulLinkageThreePicker">
						<text>{{areaname}}</text>
					</view>
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
						<input type="mobile" value="" placeholder="6-20位数字、字母组合" placeholder-class="input-empty" maxlength="20"
						  data-key="password" @input="inputChange" @confirm="doRegister" />
				</view>
			</view>
			<button class="confirm-btn" @click="doRegister" :disabled="submiting">绑定手机号</button>
			
		</view>
		<view class="register-section">
			手机号已绑定？
			<text @click="toLogin">马上登录</text>
			<br/><br/>
			<checkbox-group @change="agreementChange">
				<checkbox color="#fa436a" :checked="agreement===1" />同意<text @click="navToDetailPage(1)">《用户须知》</text>
			</checkbox-group>
			<checkbox-group @change="agreementChange2">
				<checkbox color="#fa436a" :checked="agreement2===1" />同意<text @click="navToDetailPage(2)">《委托代卖协议》</text>
			</checkbox-group>
			<checkbox-group @change="agreementChange3">
				<checkbox color="#fa436a" :checked="agreement3===1" />同意<text @click="navToDetailPage(3)">《用户注册协议》</text>
			</checkbox-group>
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
				agreement: 0,
				agreement2: 0,
				agreement3: 0,
				wxMpOpenId: '',
				phone: '',
				password: '',
				captcha: '',
				nickName: '',
				inviter: '',
				submiting: false,
				sendText: '获取验证码',
				// 城市
				cityPickerValueDefault: [0, 0, 0],
				area_id: 0,
				areaname: '选择省/市/区',
				provinceCode: '',
				cityCode: '',
				countyCode: '',
				sendDisabled: false,
				wxMpUser: {}
			}
		},
		onLoad(options) {
			this.nickName = options.nickName
			this.inviter = options.inviter
			if (!this.inviter) {
				this.inviter = uni.getStorageSync('inviter')
			}
			this.wxMpOpenId = options.wxMpOpenId
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
			agreementChange(){
				this.agreement = this.agreement === 1 ? 0 : 1
			},
			agreementChange2(){
				this.agreement2 = this.agreement2 === 1 ? 0 : 1
			},
			agreementChange3(){
				this.agreement3 = this.agreement3 === 1 ? 0 : 1
			},
			navToDetailPage(i) {
				if (i === 1) {
					uni.navigateTo({
						url: `/pages/public/page2`
					})
				} else if (i === 2) {
					uni.navigateTo({
						url: `/pages/public/page1`
					})
				} else {
					uni.navigateTo({
						url: `/pages/public/page3`
					})
				}
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
			async doRegister() {
				const that = this
				if (this.agreement === 0) {
					this.$api.msg('请您确认用户须知！')
					return
				}
				if (this.agreement2 === 0) {
					this.$api.msg('请您确认委托代卖协议！')
					return
				}
				if (this.agreement3 === 0) {
					this.$api.msg('请您确认用户注册协议！')
					return
				}
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
				if(!that.captcha){
					this.$api.msg('请输入6位手机验证码');
					return;
				}
				if(!that.password){
					this.$api.msg('请输入登录密码');
					return;
				}
				if(that.password.length < 6){
					this.$api.msg('密码太短了，请设置长一点');
					return;
				}
				uni.showLoading({
					title: '提交中...'
				})
				that.submiting = true
				that.$api.request('api/pk/user/register', {
					phone: that.phone,
					password: that.password,
					nickName: that.nickName,
					countyCode: that.countyCode,
					provinceCode: that.provinceCode,
					cityCode: that.cityCode,
					areaname: that.areaname,
					inviter: that.inviter,
					wxMpOpenId: that.wxMpOpenId,
					wxMpUser: that.wxMpUser,
					captcha: that.captcha
				},'POST', "application/json").then(res => {
					that.submiting = false
					setTimeout(function(){
						uni.hideLoading()
					},500)
					
					that.$api.setUserInfo(res.userInfo)
					that.$api.setToken(res.token)
					that.$store.commit('login', res.userInfo)
					uni.setStorageSync('token', res.token)
					uni.setStorageSync('userInfo', res.userInfo)
					window.location = '/pages/index/index'
					//this.userInfo.phone = that.phone
					// that.$store.commit('login', this.userInfo)
					// uni.setStorageSync('userInfo', this.userInfo)
					// window.location = '/pages/user/user'
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
		padding-top: 10px;
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
		padding-bottom: 20upx;
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
		margin-top: 20upx;
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
