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
					title: '正在绑定中...'
				})
				that.$api.request('api/pk/user/bindWeixin', {
					'code': options.code
				}, 'POST', "application/json").then(res => {
					uni.hideLoading()
					if (res.code === 200) {
						that.$api.setUserInfo(res.userInfo)
						that.$api.setToken(res.token)
						that.$store.commit('login', res.userInfo)
						uni.setStorageSync('token', res.token)
						uni.setStorageSync('userInfo', res.userInfo)
						window.location = options.state
					} else {
						that.msg = res.msg
						that.$api.msg(res.msg)
						window.location = '/pages/user/user'
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
