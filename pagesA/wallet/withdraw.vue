<template>
	<view class="content">
		<view class='bg-white cont-box'>
			<view class='paytitle'>到账方式</view>
			<radio-group @change="radioChange">
				<view class="paybox" v-for="(item, index) in items" :key="item.value">
					<view :class="'payleft ' + item.color">
						<text :class="'eosfont eos-' + item.icon"></text>
						<text class="menus-item-name">{{item.value}}</text>
					</view>
					<label>
						<radio :value="item.value" :checked="index === current" />
						</radio>
					</label>
				</view>
			</radio-group>
		</view>
		<view class="row b-b">
			<text class="tit">姓名</text>
			<input class="input" type="text" v-model="realName" />
		</view>
		<view class="row b-b">
			<text class="tit">支付宝</text>
			<input class="input" type="text" v-model="alipayAccount" />
		</view>
		<view class='bg-white cont-box m-top20'>
			<view class='paytitle'>提现金额</view>
			<view class='recharge_input'>
				<text>￥</text>
				<input type="digit" v-model="amount" placeholder="请输入金额" placeholder-class="input-placeholder" maxlength="999999999"
				 confirm-type="done"></input>
			</view>
			<view class='costbox'>
				<text>可用余额 {{rmb}}元</text><text class="allbtn" @click="allmoney">全部提现</text>
			</view>
		</view>
		<view class="formalities">最少需要提现{{zuidiTixian}}元</view>
		<view class="formalities">手续费 {{fandlingFee}}元 （提现将收取{{tixianShouxufei}}‰的手续费）</view>
		<view class='cont-box m-top20 text-center'>
			<button class="confirm-btn" @click="submit">提现</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				items: [
					// {value: '微信', color: 'WeChat-pay', icon:'WeChat-square'},
					{
						value: '支付宝',
						key: 1,
						color: 'Alipay-pay',
						icon: 'alipay-square'
					}
				],
				zuidiTixian: 0,
				tixianShouxufei: 0.000,
				current: 0,
				amount: null,
				fandlingFee: 0,
				rmb: 0,
				realName: '',
				alipayAccount: '',
				accountType: 1,
				submiting: false
			}
		},
		watch: {
			amount(o, newval) {
				if (o <= 0) {
					this.fandlingFee = 0
					 return
				}
				this.fandlingFee = parseFloat(o * (this.tixianShouxufei / 1000)).toFixed(2)
				this.fandlingFee = this.fandlingFee <= 0 ? (this.tixianShouxufei / 100) : this.fandlingFee
				// if (newval > this.zuidiTixian) {
				// 	uni.showToast({title:'超过最大限额',duration:2000,icon:'none'});
				// 	return
				// }
			}
		},
		onLoad(options) {
			this.rmb = options.rmb
			this.$api.request('api/pk/appmy/info', {}).then(res => {
				if (res.code === 200) {
					this.zuidiTixian = res.data.zuidiTixian
					this.tixianShouxufei = res.data.tixianShouxufei
				}
			})
		},
		methods: {
			radioChange: function(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						this.accountType = this.items[i].key
						break;
					}
				}
			},
			allmoney() {
				this.amount = this.rmb
			},
			submit() {
				const that = this
				if (that.submiting) {
					return
				}
				if (!that.realName.trim()) {
					uni.showToast({
						title: '请输入真实姓名！',
						icon: 'none'
					})
					return
				}
				if (!that.alipayAccount.trim()) {
					uni.showToast({
						title: '请输入支付宝账号！',
						icon: 'none'
					})
					return
				}
				if (!that.amount.trim()) {
					uni.showToast({
						title: '请输入提现金额！',
						icon: 'none'
					})
					return
				}
				if (!that.rmb) {
					uni.showToast({
						title: '账户余额不足！',
						icon: 'none'
					})
				}
				if (that.amount * 1 > that.rmb * 1) {
					uni.showToast({
						title: '账户余额不足！',
						icon: 'none'
					})
					return
				}
				if (that.zuidiTixian * 1 > that.amount * 1) {
					uni.showToast({
						title: '最低' + that.zuidiTixian + '元可提现',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '提交中...'
				})
				that.submiting = true
				that.$api.request('api/pk/userlog/withdrawMoney', {
					realName: that.realName,
					alipayAccount: that.alipayAccount,
					amount: that.amount,
					accountType: that.accountType,
					remark: ''
				}, 'POST').then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '提现申请成功！',
							icon: 'success',
							duration: 2000,
							mask: true
						});
						setTimeout(function(){
							uni.redirectTo({
								url: '/pagesA/wallet/index'
							})
						},2000)
					} else {
						this.submiting = false
					}
				}).catch(res => {
					uni.hideLoading()
					that.submiting = false
				})
			}
		},

	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 160upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.attest-yes{
			font-size: 28upx;
			width: 100%;
			color: #999;
		}
		.attest-no{
			font-size: 28upx;
			width: 100%;
			color: #f00;
		}
		.icon-you{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.paytitle {
		font-size: $font-30;
		line-height: 50rpx;
		margin-bottom: 10px;
	}

	.recharge_input {
		font-size: $font-40;
		display: flex;
		align-items: center;
		margint-top: 20upx;

		input {
			width: 700upx;
			display: inline-block;
			margin-left: 10upx;
			font-size: $font-40;
			height: 120upx;
			line-height: 120upx;
		}
	}

	.paybox {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx;
		border-top: 1upx solid #eee;
	}

	.payleft {
		display: inline-block;
		display: flex;
		align-items: center;

		.eosfont {
			font-size: $font-42;
		}

		.menus-item-name {
			color: #666;
			margin-left: 20upx;
			font-size: $font-base;
		}
	}

	.WeChat-pay {
		color: $uni-color-green;
	}

	.Alipay-pay {
		color: $uni-color-blue;
	}

	.confirm-btn {
		width: 650upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 30upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.costbox {
		font-size: $font-26;
		color: $font-color-light;
		border-top: 1upx solid #eee;
		padding: 20upx 10upx 10upx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.allbtn {
			color: $font-color-spec;
		}
	}

	.formalities {
		font-size: $font-sm;
		color: $font-color-light;
		padding: 20upx 25upx;
	}
</style>
