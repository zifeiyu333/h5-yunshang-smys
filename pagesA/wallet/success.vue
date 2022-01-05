<template>
	<view class="content">
		<text class="success-icon yticon icon-xuanzhong2"></text>
		<text class="tit" v-if="success == 'true'">支付成功</text>
		<text class="tit" v-if="success == 'false'">支付失败</text>
		<view class="btn-group">
			<text :disabled="submiting" class="mix-btn" @click="submit" v-if="success == 'false'">重新支付</text>
			<navigator url="/pagesA/wallet/index" open-type="redirect" class="mix-btn" v-if="success == 'true'">查看钱包</navigator>
			<navigator url="/pages/index/index" open-type="switchTab" class="mix-btn hollow">返回首页</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				success: 'false',
				serialSn: '',
				submiting: false
			}
		},
		onLoad(options) {
			this.success = options.success=='true'? 'true' : 'false'
			this.serialSn = options.serialSn
		},
		methods: {
			submit() {
				const that = this
				if (that.submiting) {
					return
				}
				that.submiting = true
				that.$api.request('id/api/wallet/rechargeSubmit', {
					serialSn: that.serialSn,
					payType: 1,
					dataSources: 1
				},'POST').then(prepayRes => {
					const payParam = {
						appId: prepayRes.data.appId,
						nonceStr: prepayRes.data.nonceStr,
						package: prepayRes.data.packageValue,
						timeStamp: prepayRes.data.timeStamp,
						signType: prepayRes.data.signType,
						paySign: prepayRes.data.paySign,
					}
					uni.requestPayment({
						provider: 'wxpay',
						...payParam,
						success: function(res) {
							uni.redirectTo({
								url: '/pages/order/list?status=0'
							})
						},
						fail: function(res) {
							that.$api.msg('未支付成功,请您重新提交支付')
						},
						complete: function(res) {
							that.submiting = false
						}
					});
				}).catch(res => {
					that.submiting = false
					that.$api.msg(res.msg)
				})
			}
		}
	}
</script>

<style lang='scss'>
	.content{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.success-icon{
		font-size: 160upx;
		color: #fa436a;
		margin-top: 100upx;
	}
	.tit{
		font-size: 38upx;
		color: #303133;
	}
	.btn-group{
		padding-top: 100upx;
	}
	.mix-btn {
		margin-top: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600upx;
		height: 80upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		&.hollow{
			background: #fff;
			color: #303133;
			border: 1px solid #ccc;
		}
	}
</style>
