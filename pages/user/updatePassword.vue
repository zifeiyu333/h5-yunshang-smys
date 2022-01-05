<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">UPDATE PASSWORD</view>
			<view class="welcome">
				修改密码！
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">新密码</text>
					<input v-model="password" placeholder="请输入密码" maxlength="20" />
				</view>
				<view class="input-item">
					<text class="tit">确认密码</text>
					<input type="mobile" v-model="confirmPassword" placeholder="请确认密码" maxlength="20" placeholder-class="input-empty" @confirm="doSubmit" />
				</view>
			</view>
			<button class="confirm-btn" @click="doSubmit" :disabled="submiting">修改密码</button>
			
		</view>
	</view>
</template>

<script>
	import {
		mapMutations, mapState
	} from 'vuex';
	export default {
		data() {
			return {
				password: '',
				confirmPassword: '',
				submiting: false
			}
		},
		onLoad() {
			// this.inviter = options.inviter
		},
		methods: {
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			async doSubmit() {
				const that = this
				if(!that.password){
					this.$api.msg('请输入新密码！');
					return;
				}
				if(that.password.length < 6){
					this.$api.msg('密码太短了，请设置长一点');
					return;
				}
				if(!that.confirmPassword){
					this.$api.msg('请确认密码！');
					return;
				}
				if(that.password !== that.confirmPassword){
					this.$api.msg('新密码和确认密码不一致！');
					return;
				}
				uni.showLoading({
					title: '提交中...'
				})
				that.submiting = true
				that.$api.request('api/pk/user/updatePassword', {
					password: that.password
				},'POST', "application/json").then(res => {
					uni.hideLoading()
					this.$api.msg(res.msg)
					setTimeout(function(){
						that.submiting = false
						window.location = '/pages/user/user'
					},1500)
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
