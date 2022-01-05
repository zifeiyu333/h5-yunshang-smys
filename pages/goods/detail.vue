<template>
	<view class="container">
		<view class="carousel">
			<swiper-item class="swiper-item">
				<view class="image-wrapper">
					<image :src="goods.goodsImg" class="loaded" mode="aspectFill" @tap="_previewImage(goods.goodsImg)"/>
					<view class="yongJin" v-if="goods.stock === 0">已售完</view>
					<view class="yongJin" v-else-if="cateInfo.isStart === 1 && goods.isNoBuy === 1">已售完</view>
				</view>
			</swiper-item>
		</view>

		<view class="introduce-section">
			<view class="toptitle">
				<text class="title">{{goods.goodsName}}</text>
			</view>
			<view class="price-box">
				<view>
					<text class="price" v-if="goods.goodsPrice>0">¥{{ goods.goodsPrice }}</text>
				</view>
			</view>
		</view>
		
		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<parser :html="goods.goodsDesc"></parser>
		</view>

		<!-- 底部操作菜单 @click="buy" -->
		<view class="page-bottom" >
			咨询客服购买
		</view>
		
		<!-- 规格-模态层弹窗 -->
		<view class="popup mask" :class="specFlag ? 'show' : 'none'" catchtouchmove="true">
			<!-- 遮罩层 -->
			<view class="mask" v-if="specFlag" @click="specFlag = false"></view>
			<view class="layer attr-content">
				<view class="a-t">
					<view class="title">
						委托托管协议
					</view>
				</view>
				<view class="attr-list">
					<scroll-view class="list-scroll-content" scroll-y >
						<view style="width: 100%;">
							
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from '@/components/uni-number-box.vue'
	import parser from "@/components/jyf-parser/jyf-parser"
	import { mapState } from 'vuex'
	import share from '@/components/share'
	import uniCountdown from '@/components/uni-countdown/uni-countdown.vue'
	export default {
		components: {
			uniNumberBox,
			parser,
			share,
			uniCountdown
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		data() {
			return {
				goods: {
					freightTemplate: undefined,
					appraisePage: undefined,
				},
				domain: this.$api.defConfig().domain,
				cateInfo: {
					hour: 0,
					minute: 0,
					second: 0,
				},
				reset: true,
				level: 1,
				inviter: null,
				goodsId: 0,
				imageList: [],
				submiting: false,
				specFlag: false,
				canvasFlag: true,
				modalShow: false,
				posterBase64: '',
				posterData: {}
			};
		},
		onReady() {},
		onShow() {
			if (this.hasLogin) {
				this.submiting = false
			} else {
				uni.navigateTo({
					url: '/pages/public/login'
				})
			}
		},
		onLoad(options) {
			const that = this
			that.goodsId = options.id
			if (!that.goodsId) {
				this.$api.msg('未找到该商品！')
				return
			}
			that.inviter = options.inviter
			if (that.inviter) {
				uni.setStorageSync('inviter', that.inviter)
			}
			if (options.scene) {
				const scenes = decodeURIComponent(options.scene).split('&')
				that.goodsId = scenes[0]
				if (scenes.length > 1) {
					uni.setStorageSync('inviter', scenes[1])
				}
			}
			that.$api.request('api/pk/goods/info' + '/' + that.goodsId).then(res => {
				if (res.code === 200) {
					that.goods = res.data
					wx.setNavigationBarTitle({
					  title: that.goods.goodsName
					})
					that.cateInfo = res.cateInfo
				}
			}).catch(res => {
				that.$api.msg(res.msg)
			})
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
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
			start() {
				this.cateInfo.isStart = 1
			},
			buy() {
				var imgArr = [];
				imgArr.push('../../static/kefu.png');
				//预览图片
				uni.previewImage({
					urls: imgArr,
					current: imgArr[0]
				});
			}
		},

	}
</script>


<style lang='scss'>
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.list-scroll-content {
		height: 100%;
	}
	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}
	.yongJin{
		position: absolute;
		left: 37%;
		top: 40%;
		z-index: 1;
		width: 200upx;
		height: 200upx;
		line-height: 200upx;
		text-align: center;
		padding: 0 10upx;
		font-size: 40upx;
		color: #fff;
		border-radius: 100upx 100upx 100upx 100upx;
		background-color: rgba(60, 55, 55, 0.3);
	}
	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;


		.toptitle {
			display: flex;
			align-items: center;
			margin-right: -30upx;

			.title {
				display: inline-block;
				width: calc(100% - 145upx);
				font-size: 32upx;
				color: $font-color-dark;
				/* height: 50upx; */
				line-height: 50upx;
				margin-right: 15upx;
			}

			.sharebox {
				display: inline-block;
				width: 130upx;
				/* font-size: 24upx; */
				height: 52upx;
				line-height: 52upx;
				background-color: #f5f5f5;
				border-radius: 30rpx 0 0 30rpx;
				color: #999;
				text-align: center;

				button {
					color: #999;
					height: 52upx;
					line-height: 52upx;
					font-size: 26upx;

					text {
						margin-left: 10upx;
					}
				}

			}
		}


		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20upx 0;
			font-size: 26upx;
			color: $uni-color-primary;
		}

		.price {
			font-size: $font-lg + 2upx;
		}
		
		.exclusive{
			font-size: 26rpx;
			margin-right: 5upx
		}
		.upgrade{
			background-color: #fffce1;
			border-radius: 10upx;
			height: 50upx;
			font-size: 22upx;
			line-height: 50upx;
			padding: 0 20upx;
			margin-bottom: 10upx;
			text{
				color: #f00;
				margin-left: 5upx;
			}
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}
	}

	/* 分享 */
	.share-section {
		height: 60upx;
		display: flex;
		align-items: center;
		color: $font-color-base;
		padding: 12upx 30upx;

		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;

			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background: $uni-color-primary;
			}
		}

		.icon-xingxing {
			position: relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}

		.tit {
			font-size: 30upx;
			margin-left: 10upx;
			text{
				color: #f00;
			}
		}

		.icon-bangzhu1 {
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}

		.share-btn {
			flex: 1;
			text-align: right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}

		.icon-you {
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}

	.brokerage {
		font-size: $font-sm;
		color: $font-color-base;
	}
	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
				font-weight: 700;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;
		width: 750upx;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			text-align: center;
			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}

			.title {
				display: flex;
				flex-direction: column;
				padding-top: 24upx;
				font-size: $font-sm + 16upx;
				color: #000000;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
			height: 80%;
			bottom: 60upx;
		}

		.item-list {
			padding: 30upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 2;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 80upx;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 20upx;
			width: 100%;
			height: 80%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 20upx;
		z-index: 9;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background-color: $base-color;
		color: #fff;
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: #fff;
			width: 96upx;
			height: 80upx;

			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			margin-left: 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
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
			height: 180upx;
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
			font-size: $font-base;
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

	.rich-img {
		width: 100%;
		height: auto;
		margin: 0;
		padding: 0;
		line-height: 0px;
	}


	button::after {
		border: none;
	}

	/* 按钮去掉边框 */
	button::after {
		border: none;
	}

	button {
		margin-left: 0;
		margin-right: 0;
		padding-left: 0;
		padding-right: 0;
		line-height: 1;
		color: #1c1c1c;
		font-size: 28rpx;
		background: none;
	}

	.button-hover {
		color: #1c1c1c;
		background: none;
	}

	.share-pro {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex-direction: column;
		z-index: 99;
		line-height: 1;
		box-sizing: border-box;

		.share-pro-mask {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background: rgba(0, 0, 0, 0.5);
			z-index: 20;
		}

		.share-pro-dialog {
			width: 100%;
			padding: 60upx 0;
			overflow: hidden;
			background-color: #fff;
			border-radius: 24rpx 24rpx 0px 0px;
			position: relative;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
			z-index: 99;

			.close-btn {
				padding: 20rpx 15rpx;
				position: absolute;
				top: 0rpx;
				right: 29rpx;
			}

			.share-pro-body {
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				font-size: 28rpx;
				color: #1c1c1c;

				.share-item {
					height: 140upx;
					width: 200upx;
					text-align: center;

					.eosfont {
						font-size: 70rpx;
						margin-bottom: 30rpx;
						color: #42ae3c;
					}

					&:nth-child(2) {
						.eosfont {
							color: #ff5f33;
						}
					}
				}
			}
		}

		/* 显示或关闭内容时动画 */

		.open {
			transition: all 0.3s ease-out;
			transform: translateY(0);
		}

		.close {
			transition: all 0.3s ease-out;
			transform: translateY(310rpx);
		}

	}

	.canvas {
		position: fixed !important;
		top: 0 !important;
		left: 0 !important;
		display: block !important;
		width: 100% !important;
		height: 100% !important;
		z-index: 10;
	}
	.proxyBox{
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20upx 0 10upx;
		
		.proxyList{
			flex: 1;
			text-align: center;
			
			.eosfont{
				font-size: 46upx;
			}
			.eos-financial{
				font-weight: bold;
				color: $uni-color-blue;
			}
			.eos-redpacket{
				color: $uni-color-green;
			}
			.eos-reward{
				color: $uni-color-error;
			}
			.eos-gold{
				font-weight: bold;
				color: $uni-color-warning;
			}
			.proxyText{
				font-size: 24upx;
				color: #999;
				margin-top: 10upx;
			}
		}
	}
	
	.modal_wrap{
		width:100%;
		height:100%;
		position:fixed;
		top:0;
		left:0;
		z-index: 100;
		background:rgba($color: #000000, $alpha: 0.6);
		.modal_con{
			width:80%;
			height:90%;
			position:absolute;
			top:50%;
			left:50%;
			transform: translate(-50%, -50%);
			image{
				width:100%;
				height:90%;
			}
			.confirm-btn{
				margin:50upx auto 0;
				display: block;
				width:450upx;
				padding: 0 40upx;
				height: 60upx;
				line-height: 60upx;
				border-radius: 50upx;
				background: $uni-color-primary;
				color: #fff;
				font-size: 30upx;
			
				&:after {
					border-radius: 100px;
				}
			}
			.close{
				/* position:absolute;
				top:-25upx;
				right:-35upx;
				width:50upx;
				height:50upx;
				border-radius: 50%;
				 */
				position: absolute;
				top:-40upx;
				right:-50upx;
				z-index:99;
				font-size: 55upx;
				color: #fff;
				/* &:after{
					width:50upx;
					height:3px;
					background:#fff;
					content:'';
					display:block;
					position:absolute;
					left:0;
					top:24upx;
					transform: rotate(45deg);
				}
				&:before{
					width:50upx;
					height:3px;
					background:#fff;
					content:'';
					display:block;
					position:absolute;
					left:0;
					top:24upx;
					transform: rotate(-45deg);
				} */
			}
		}
	}
	
</style>
