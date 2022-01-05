<template>
	<view class="container">
		<view v-if="msg">
			{{msg}}
			<button @click="navBack">回到首页</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msg: ''
			}
		},
		onLoad(options) {
			let that = this
			if(options.code && options.state) {
				uni.showLoading({
					title: '正在登录中...'
				})
				that.$api.request('api/pk/user/wechatH5Login', {
					'code': options.code,
					'inviter': uni.getStorageSync('inviter')
				}, 'POST', "application/json").then(res => {
					uni.hideLoading()
					if (res.code === 200) {
						that.$api.setUserInfo(res.userInfo)
						that.$api.setToken(res.token)
						that.$store.commit('login', res.userInfo)
						uni.setStorageSync('token', res.token)
						uni.setStorageSync('userInfo', res.userInfo)
						window.location = options.state
					} else if(res.code === 201){
						window.location = '/pages/public/register?wxMpOpenId=' + res.wxMpOpenId + '&inviter='+res.inviter + '&nickName=' + res.nickName
					} else {
						that.msg = res.msg
						that.$api.msg(res.msg)
					}
				})
			} else {
				window.location = '/pages/index/index'
			}
		},
		methods: {
			
			navBack() {
				window.location = '/pages/index/index'
			}
		}
	}
</script>

<style>
</style>
