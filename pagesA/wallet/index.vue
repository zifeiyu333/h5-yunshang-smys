<template>
	<view class="content">
		<view class="wallet-details" @click="navTo('/pagesA/wallet/bill')" hover-class="none"  :hover-stay-time="50">账单</view>
		<view class="bg-white">
			<view class="topimg">
				<image src="../../static/wallet.png"></image>
			</view>
			<view class="wallet_text">
				<view class="number">余额：￥<text>{{wallet.rmb}}</text></view>
			</view>
			<view class="incomebox">
				<text>已提佣金：￥{{numFilter(parseFloat(wallet.totalRmb - wallet.rmb))}}</text>
				<text class="text-right">累计佣金：￥{{wallet.totalRmb}}</text>
			</view>
		</view>
		
		<view class="wallet-section">
			<!-- <view class="wallet-item">
				<button class="rechargebtn"  @click="navTo('/pagesA/wallet/recharge')" hover-class="none"  :hover-stay-time="50">充值</button>
			</view> -->
			<view class="wallet-item">
				<button class="withdrawbtn"  @click="navTxTo('/pagesA/wallet/withdraw')" hover-class="none"  :hover-stay-time="50">提现</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wallet: {rmb: '0.00', totalRmb: '0.00', income: '0.00'}
			}
		},
		onShow() {
			this.loadData()
		},
		methods: {
			numFilter (value) {
				if (isNaN(value)) {
					return 0
				}
				// 截取当前数据到小数点后两位
				let realVal = parseFloat(value).toFixed(2)
				return realVal
			},
			async loadData() {
				const that = this
				that.$api.request('api/pk/user/getWallet').then(res => {
					if (res.code === 200) {
						that.wallet = res.data
					}
				}).catch(res => {
					that.$api.msg(res.msg)
				})
			},
			navTxTo(url){
				url = url + '?rmb=' + this.wallet.rmb
				uni.navigateTo({
					url
				})
			}, 
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url){
				url = url + '?state=2'
				uni.navigateTo({
					url
				})
			}
		},
		
	}
</script>

<style lang="scss">
	%flex-center {
	 display:flex;
	 flex-direction: column;
	 justify-content: center;
	 align-items: center;
	}
	%section {
	  display:flex;
	  justify-content: space-around;
	  align-content: center;
	  background: #fff;
	}
	
	page{
		background: $page-color-base;
	}
	.topimg{
		text-align: center;
		padding-top: 50upx;
		image{
			width: 400upx;
			height: 200upx;
		}
	}
	.wallet_text{
		margin: 60upx 0;
		text-align: center;
		
		.number{
			color: #444;
			font-size: 30upx;
			
			text{
				color: #000;
				font-size: 50upx;
			}
		}
		.title{
			font-size: 26upx;
			color: #888;
			margin-top: 20upx;
		}
	}
	.incomebox{
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 1upx solid #f5f5f5;
		padding: 30upx 40upx;
		
		text{
			flex: 1;
			color: #666;
			font-size: 26upx;
		}
	}
	
	.wallet-section{
		display:flex;
		justify-content: center;
		align-content: center;
		margin-top: 50upx;
		padding: 0 50upx;
		
		.wallet-item{
			flex: 1;
			padding: 0 20upx;
			button{
				width: 100%;
				height: 70upx;
				line-height: 70upx;
				border-radius: 50px;
				font-size: $font-base;
			}
			.rechargebtn {
				background: $uni-color-primary;
				color: #fff;
			}
			.withdrawbtn{
				border: 1upx solid $uni-color-primary;
				color: $uni-color-primary;
			}
		}
	}
	.wallet-details{
		position: absolute;
		right: 0;
		top: 0;
		padding: 30upx;
		font-size: 28upx;
		color: #4399fc;
	}

</style>
