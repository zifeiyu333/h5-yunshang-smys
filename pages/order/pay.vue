<template>
	<view>
		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">订单编号</text>
				<text class="cell-tip">￥{{orderDetail.weituoLogCode}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品名称</text>
				<text class="cell-tip">{{orderDetail.goodsName}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品价格</text>
				<text class="cell-tip red">￥{{orderDetail.goodsPrice}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">卖家昵称</text>
				<text class="cell-tip" v-if="orderDetail.sellerNickName">{{orderDetail.sellerNickName}}</text>
				<text class="cell-tip" v-else>平台</text>
			</view>
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">卖家电话</text>
				<text class="cell-tip" v-if="orderDetail.sellerTel">{{orderDetail.sellerTel}}</text>
				<text class="cell-tip" v-else>请联系平台</text>
			</view> -->
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">支付倒计时</text>
				<text class="cell-tip red">
					<uni-countdown 
						color="#FFFFFF" 
						background-color="#00B26A" 
						border-color="#00B26A" 
						:show-day="false"
						:hour="orderDetail.hour" 
						:minute="orderDetail.minute" 
						:second="orderDetail.second"
						:reset="reset">
					</uni-countdown>
				</text>
			</view> -->
		</view>
		
		<view v-if="orderDetail.isInvalid===0">
			<view class="yt-list">
				<!-- 头部 -->
				<view class="navbar">
					<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === item.state }" @click="tabClick(item.state)">
						{{ item.text }}
					</view>
				</view>
			</view>
			
			<view class="yt-list" v-if="tabCurrentIndex===0">
				<view class="cont-box m-top20 text-center yaoqing"  v-if="sellerUserInfo.alipayId">
					<view>
						<button class="confirm-btn" @click="toAlipay">立即打开支付宝支付</button>
					</view>
					<img :src='alipayQr' v-if="alipayQr"/>
				</view>
				<view class="cont-box m-top20 text-center yaoqing"  v-else>
					<view>
						该用户暂无此收款方式
					</view>
				</view>
			</view>

			<view class="yt-list" v-if="tabCurrentIndex===1">
				<view class="cont-box m-top20 text-center yaoqing"  v-if="sellerUserInfo.qrAlipay">
					<img :src='sellerUserInfo.qrAlipay' mode="" @tap="_previewImage(sellerUserInfo.qrAlipay)"/>
					<view>
						<button class="confirm-btn">长安保存到相册</button>
					</view>
				</view>
				<view class="cont-box m-top20 text-center yaoqing"  v-else>
					<view>
						该用户暂无此收款方式
					</view>
				</view>
			</view>
			<view class="yt-list" v-if="tabCurrentIndex===2">
				<view class="cont-box m-top20 text-center yaoqing"  v-if="sellerUserInfo.qrWeixin">
					<img :src='sellerUserInfo.qrWeixin' mode="" @tap="_previewImage(sellerUserInfo.qrWeixin)">
					<view>
						<button class="confirm-btn">长安保存到相册</button>
					</view>
				</view>
				<view class="cont-box m-top20 text-center yaoqing"  v-else>
					<view>
						该用户暂无此收款方式
					</view>
				</view>
			</view>
			<view class="yt-list" v-if="tabCurrentIndex===3">
				<view class="yt-list-cell b-b">
					<text class="cell-tit clamp">真实姓名</text>
					<text class="cell-tip">{{sellerUserInfo.bankName}}</text>
				</view>
				<view class="yt-list-cell b-b">
					<text class="cell-tit clamp">手机号码</text>
					<text class="cell-tip">{{sellerUserInfo.bankPhone}}</text>
				</view>
				<view class="yt-list-cell b-b">
					<text class="cell-tit clamp">银行卡号</text>
					<text class="cell-tip">{{sellerUserInfo.bankNum}}</text>
				</view>
				<view class="yt-list-cell b-b">
					<text class="cell-tit clamp">开户行</text>
					<text class="cell-tip">{{sellerUserInfo.bankKaihuhang}}</text>
				</view>
			</view>
		</view>
		<view class="yt-list">
			<view class="yt-news b-b">
				<text class="cell-tit clamp" >风险友情提示</text>
			</view>
			<view class="yt-news b-b">
				<view class="cell-tip black">
				尊敬的平台用户：
				平台法务部门友情提示：本平台是一个实名制的在线委托代卖平台，建议平台所有的注册用户 根据个人鉴赏能力和经济实力进行参与抢拍和消费。
				平台禁止使用信用卡、支付宝花呗等信用额度进行成功抢拍后的支付；线下收款时，不推荐您使用商家收款码收款，面临被第三方支付公司直接扣除收款手续费的风险；
				同时，平台禁止任何组织和个人假借平台的名义，进行平台以外的任何恶意代抢单、代投资、私下借贷款返息、合作抢拍、代付款等行为。
				用户盲目听信和参与上述行为造成个人财产损失的，包括但不限于遭遇骗局，需自行承担责任并请及时报警。
				本平台仅提供友情提示告知，避免平台用户遭遇新型诈骗，以免个人合法财产受到损失。
				特此告知!
				</view>
			</view>
		</view>
		
		<!-- 底部 -->
		<view class="footer">
			<text class="submit" @click="returnOrder">返回订单中心</text>
			<view class="price-content" v-if="orderDetail.isInvalid===0">
				<text>倒计时</text>
				<text class="price-tip"></text>
				<text class="price">
					<uni-countdown 
						color="#FFFFFF" 
						background-color="#00B26A" 
						border-color="#00B26A" 
						:show-day="false"
						:hour="orderDetail.hour"
						:minute="orderDetail.minute" 
						:second="orderDetail.second"
						@timeup="start"
						:reset="reset">
					</uni-countdown>
				</text>
			</view>
			<view class="price-content" v-else>
				<text>订单已过期</text>
			</view>
		</view>
		
		<view class="wx" v-if="weixin" @click="onWeixin">

		</view>
	</view>
</template>

<script>
	import uniCountdown from '@/components/uni-countdown/uni-countdown.vue'
    import {  
        mapState 
    } from 'vuex'
	export default {
		filters: {
			priceFormat(price) {
				return price
			},
			dateFormat(time) {
				return 'temp'
				//return formatDate(new Date(time),'yyyy-MM-dd HH:mm')
			}
		},
		components: {
			uniCountdown
		},
		data() {
			return {
				domain: this.$api.defConfig().domain,
				weituoLogCode: '',
				orderDetail: {
					isInvalid: 1,
					hour: 0,
					minute: 0,
					second: 0
				},
				alipayQr: '',
				sellerUserInfo: {},
				reset: true,
				tabCurrentIndex: 0,
				weixin: false, //是否为微信内浏览器打开
				navList: [
					{
						state: 0,
						text: '支付宝',
						loadingType: 'more',
						page: 1,
						recordList: []
					},
					{
						state: 1,
						text: '支付宝二维码',
						loadingType: 'more',
						page: 1,
						recordList: []
					},
					{
						state: 2,
						text: '微信二维码',
						loadingType: 'more',
						page: 1,
						recordList: []
					},
					{
						state: 3,
						text: '银行卡',
						loadingType: 'more',
						page: 1,
						recordList: []
					}
				]
			}
		},
		onLoad(option) {
			this.weituoLogCode = option.weituoLogCode
			this.loadData()
		},
        computed: {
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			loadData() {
				uni.showLoading({
					title: '正在加载'
				})
				const that = this
				that.$api.request('api/pk/order/myPayOrderInfoByLogCode', {
					weituoLogCode: that.weituoLogCode
				}).then(res => {
					uni.hideLoading()
					that.alipayQr = res.alipayQr
					that.orderDetail = res.data
					that.sellerUserInfo = res.sellerUserInfo
					that.reset = !that.reset
				})
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//点击图片显示大图
			_previewImage(image) {
				var imgArr = [];
				imgArr.push(image);
				//预览图片
				uni.previewImage({
					urls: imgArr,
					current: imgArr[0]
				});
			},
			onWeixin() {
				this.weixin = !this.weixin
			},
			start() {
				this.orderDetail.isInvalid = 1
			},
			toAlipay() {
				window.location = '/pages/order/alipay?weituoLogCode=' + this.weituoLogCode+'&goodsPrice='+this.orderDetail.goodsPrice+'&alipayId='+this.sellerUserInfo.alipayId
				/* let ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					this.weixin = true
				} else {
					window.location = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2016103100782384&scope=SCOPE&redirect_uri=' + this.$api.defConfig().baseUrl
				} */
			},
			//返回订单中心
			returnOrder(item) {
				uni.redirectTo({
					url: '/pages/order/list?status=' + 1
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
		
		.wx {
			position: fixed;
			left: -20upx;
			top: -90upx;
			background-color: rgba(0, 0, 0, .7);
			width: 100%;
			height: 100%;
			background-image: url(../../static/wx.png);
			background-size: 100%;
			background-position: center 100upx;
			background-repeat: no-repeat;
		}
	}

	.yaoqing{
		text-align: center;
		padding: 30upx 0;
		img{
			// width: 80%;
			height: 500upx;
		}
	}

	.confirm-btn {
		display: inline-block;
		padding: 0 40upx;
		height: 60upx;
		line-height: 60upx;
		border-radius: 50upx;
		margin: 20upx 20upx 0;
		background: #5A9EF7;
		color: #fff;
		font-size: 30upx;
	
		&:after {
			border-radius: 100px;
		}
	}
	
	.navbar {
		display: flex;
		height: 100upx;
		background: #fff;
		box-shadow: 0 1upx 2upx rgba(0, 0, 0, 0.06);
		//position: fixed;
		width: 100%;
		z-index: 10;
		margin-bottom: 10upx;
		
		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 28upx;
			color: $font-color-dark;
			position: relative;
			&.current {
				color: $base-color;
				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}
	
	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.action-box {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 100upx;
		position: relative;
		padding-right: 30upx;
	}
	.action-btn {
		width: 160upx;
		height: 60upx;
		margin: 0;
		margin-left: 24upx;
		padding: 0;
		text-align: center;
		line-height: 60upx;
		font-size: $font-sm + 2upx;
		color: $font-color-dark;
		background: #fff;
		border-radius: 100px;
		&:after {
			border-radius: 100px;
		}
		&.recom {
			background: #fff9f9;
			color: $base-color;
			&:after {
				border-color: #f7bcc8;
			}
		}
	}
	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding-bottom: 1px;

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			margin: 20upx 30upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 4upx;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				padding-top: 10upx;

				.price {
					margin-bottom: 4upx;
				}

				.number {
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-news {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 50upx;
		position: relative;
	
		.cell-tit {
			flex: 1;
			text-align: center;
			font-size: 40upx;
			margin-right: 10upx;
			&.red {
				color: $base-color;
			}
			&.black {
				color: #000000;
			}
		}
		
		.cell-tip {
			font-size: 26upx;
			&.disabled {
				color: $font-color-light;
			}
		
			&.active {
				color: $base-color;
			}
		
			&.red {
				color: $base-color;
			}
			
			&.black {
				color: #666666;
			}
		}
		
		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}
		
		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}
	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}

	/* 支付列表 */
	.pay-list {
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;

		.pay-item {
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;
			position: relative;
		}

		.icon-weixinzhifu {
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}

		.icon-alipay {
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}

		.icon-xuanzhong2 {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}

		.tit {
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.price-content {
			padding-left: 30upx;
		}

		.price-tip {
			color: $base-color;
			margin-left: 8upx;
		}

		.price {
			font-size: 36upx;
			color: $base-color;
		}

		.submit {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			font-size: 32upx;
			background-color: #ffffff;
		}
	}

	/* 优惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: .3s;

		.mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y: scroll;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.mask-content {
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item {
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;

		.con {
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;

			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}

		.left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}

		.time {
			font-size: 24upx;
			color: $font-color-light;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}

		.price {
			font-size: 44upx;
			color: $base-color;

			&:before {
				content: '￥';
				font-size: 34upx;
			}
		}

		.tips {
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}

		.circle {
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;

			&.r {
				left: auto;
				right: -6upx;
			}
		}
	}
</style>
