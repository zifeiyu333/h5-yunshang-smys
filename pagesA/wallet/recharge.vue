<!-- <template>
	<view class="content">
		<view class='bg-white cont-box'>
			<view class='paytitle'>充值金额</view>
			<view class='recharge_input'>
			  <text>￥</text>
			  <input type="digit" v-model="amount" placeholder="请输入金额" placeholder-class="input-placeholder" confirm-type="done"></input>
			</view>
		</view>
		
		<view class='bg-white cont-box m-top20'>
			<view class='paytitle'>支付方式</view>
			
			<radio-group @change="radioChange">
				<view class="paybox" v-for="(item, index) in items" :key="item.value">
					<view :class="'payleft ' + item.color">
						<text :class="'eosfont eos-' + item.icon"></text>
						<text class="menus-item-name">{{item.value}}</text>
					</view>
					<label>
						<radio :value="item.value" :checked="index === current" /></radio>
					</label>
				</view>
			</radio-group>
		</view>

		<view class='cont-box m-top20 text-center'>
			<button class="confirm-btn"  @click="submit">下一步</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				items: [
					{value: '微信', color: 'WeChat-pay', icon:'WeChat-square'}
				],
				current: 0,
				amount: null,
				submiting: false
			}
		},
		methods: {
			radioChange: function(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
			submit() {
				const that = this
				if (that.submiting) {
					return
				}
				if (that.amount < 0.01) {
					that.$api.msg('充值金额需要大于0元哦~')
					return
				}
				if (that.amount > 999999) {
					that.$api.msg('充值金额不能大于999,999元哦~')
					return
				}
				uni.showLoading({
					title: '提交中...'
				})
				that.submiting = true
				that.$api.request('id/api/wallet/rechargeConfirm', {
						amount: that.amount,
						payType: 1,
						dataSources: 1
					}, 'POST').then(res => {
					if (res.code === 200) {
						const serialSn = res.serialSn
						that.$api.request('id/api/wallet/rechargeSubmit', {
							serialSn: serialSn,
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
										url: '/pagesA/wallet/success?success=true'
									})
								},
								fail: function(res) {
									uni.redirectTo({
										url: '/pagesA/wallet/success?success=false&serialSn='+serialSn
									})
								},
								complete: function(res) {
									uni.hideLoading()
									that.submiting = false
								}
							});
						}).catch(res => {
							uni.hideLoading()
							that.submiting = false
							that.$api.msg(res.msg)
						})
					} else {
						uni.hideLoading()
						that.submiting = false
						that.$api.msg(res.msg)
					}
				})
			}
		},
		
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}
	.paytitle{
		font-size: $font-30;
		line-height: 50rpx;
		margin-bottom: 10px;
	}
	.recharge_input{
		font-size: $font-40;
		display: flex;
		align-items: center;
		margint-top: 20upx;
		
		input{
		  width: 700upx;
		  display: inline-block;
		  margin-left: 10upx;
		  font-size: $font-40;
		  height: 120upx;
		  line-height: 120upx;
		}
	}
	.paybox{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx;
		border-top: 1upx solid #eee;
	}
	.payleft{
		display: inline-block;
		display: flex;
		align-items: center;
	
		.eosfont{
			font-size: $font-42;
		}
		.menus-item-name {
		  color: #666;
		  margin-left: 20upx;
		  font-size: $font-base;
		}
	}
	.WeChat-pay{
		color: $uni-color-green;
	}
	.Alipay-pay{
		color: $uni-color-blue;
	}
	.confirm-btn {
		width: 650upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 50upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
	
		&:after {
			border-radius: 100px;
		}
	}
	

</style>
 -->