<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in small_images" :key="index">
					<view class="image-wrapper">
						<image :src="item" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<view class="toptitle">
				<!-- <view class="kindbox"><image src="../../static/taobao.png" class="kindImg"></image><text class="kindTitle">{{goods.title}}</text></view> -->
				<view class="kindbox"><image src="../../static/tianmao.png" class="kindImg"></image><text class="kindTitle">{{goods.title}}</text></view>
				<view class="sharebox">
					<button class="eosfont eos-share_fill" @tap="shareEvn"><text>分享</text></button>
					<!--<button class='eosfont eos-share_fill' open-type="share" bindtap="set_share"><view class="dbtext">分享</view></button>-->
				</view>
			</view>
			<!-- <view class="kindTitle">{{goods.item_url}}</view> -->
			
			<view class="price-box">
				<view>
					<text class="price" v-if="goodsInfo.qh_final_price"><text class="exclusive">券后价</text> ¥{{goodsInfo.qh_final_price}}</text>
					<text class="price" v-if="!goodsInfo.qh_final_price"><text class="exclusive">折扣价</text> ¥{{goodsInfo.zk_final_price}}</text>
					<text class="m-price">¥{{goods.reserve_price}}</text>
					<text v-if="goodsInfo.qh_final_price" class="coupon-tip">{{parseInt(goodsInfo.qh_final_price / goodsInfo.reserve_price * 100) / 10 || '10'}}折</text>
					<text v-if="!goodsInfo.qh_final_price" class="coupon-tip">{{parseInt(goodsInfo.zk_final_price / goodsInfo.reserve_price * 100) / 10 || '10'}}折</text>
				</view>
				<text class="price" v-if="goodsInfo.commission_amount > 0"><text class="exclusive">返</text> ¥{{goodsInfo.commission_amount}}</text>
			</view>
			<view class="bot-row">
				<text>快递: {{goods.free_shipment || '免运费'}}</text>
				<text style="text-align: center;">已抢: {{goods.volume || '0'}}</text>
				<text style="text-align: right;">所在地: {{goods.provcity || '--'}}</text>
			</view>
		</view>
		<view class="detailbox">
			<view class="detail_coupon" @click="togglePopup('popup')">
				<view class="yuanleft"></view>
				<view class="yuanright"></view>
				<view class="leftcoupon" v-if="goodsInfo.coupon_amount">优惠券：<text>{{goodsInfo.coupon_amount || '0'}}</text> 元</view>
				<view class="rightcoupon" v-if="goodsInfo.coupon_amount">立即领取</view>
				<view class="rightcoupon" v-if="!goodsInfo.coupon_amount">返{{goodsInfo.commission_amount || '0'}}</view>
				<view class="rightcoupon" v-if="!goodsInfo.coupon_amount">立即购买</view>
			</view>
		</view>
		<view class="detailbox">
			<view class="shopTitle">{{goods.nick}}</view>
			<view class="detail_shop">
				<view>
					<text>卖家等级</text>
					<text>{{goods.ratesum || '--'}}</text>
				</view>
				<view>
					<text>店铺评分</text>
					<text>{{goods.shop_dsr || '--'}}</text>
				</view>
				<view>
					<text>好评率</text>
					<text>{{goods.h_good_rate || '--'}}</text>
				</view>
			</view>
		</view>
		
		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<parser :html="goods.content"></parser>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator open-type="switchTab" class="p-b-btn">
				<text></text>
			</navigator>
			<navigator open-type="switchTab" class="p-b-btn">
				<text></text>
			</navigator>

			<!-- <view class="p-b-btn" :class="{active: isFavorite===1}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view> -->
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="togglePopup('popup')">自购返利</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="shareEvn">分享赚钱</button>
			</view>
		</view>

		<!-- 分享弹窗-->
		<view class="share-pro mask" :class="deliveryFlag ? 'show' : 'none'" @click="shareEvn">
			<!-- <view class="mask-content" @click.stop.prevent="stopPrevent"> -->
			<!-- <view class="share-pro mask" @click="shareEvn"> -->
			<!-- <view class="share-pro-mask" v-if="deliveryFlag"></view> -->
			<view class="share-pro-dialog">
<!-- 				<view class="close-btn" @tap="shareEvn">
					<span class="font_family">&#xe6e6;</span>
				</view> -->
				<view class="share-pro-body">
					<button class="share-item" open-type="share">
						<view class="eosfont eos-WeChat"></view>
						<view>分享给好友</view>
					</button>
					<view class="share-item" @tap="createCanvasImageEvn">
						<view class="eosfont eos-picture_fill"></view>
						<view>生成海报</view>
					</view>
				</view>

			</view>
		</view>
		
		<view class="modal_wrap" v-if="modalShow">
			<view class="modal_con">
				<img :src='posterBase64' mode="aspectFit">
				<button class="confirm-btn" @click="save">保存相册，分享到朋友圈</button>
				<view class="close eosfont eos-delete canvas_close_btn" @click="close"></view>
			</view>
		</view>
		
		<!-- 领券-->
		<uni-popup ref="showpopup">
			<view class="popup-content">
				<view class="linkbox">{{tkl || ''}}</view>
				<button class="confirm-btn" @click='copyText'>一键复制</button>
				<view class="tipsbox">点击一键复制按钮，打开手机淘宝领券！</view>
				<view class="Precautions">
					<view class="PTitle"><text>注意事项</text></view>
					<view class="PText">① 付款不要使用红包抵扣(余额宝、花呗红包除外)。</view>
					<view class="PText">② 不要使用卖家给的其他链接链接下单，或者其他渠道下单。</view>
					<view class="PText">③ 如果加入购物车一定要把购物车之前的这件商品删除。</view>
					<view class="PText">④ 加入购物车后尽快下单，不要间隔时间太久。</view>
					<view class="PText">⑤ 同一家店购买多件不同商品，请逐一复制淘口令。</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniNumberBox from '@/components/uni-number-box.vue'
	import parser from "@/components/jyf-parser/jyf-parser"// 引入文件
	import h5Copy from '@/components/junyi-h5-copy.js'
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			uniNumberBox,
			parser,
			h5Copy
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		data() {
			return {
				goods: {
					zk_final_price: 0,
					reserve_price: 0
				},
				goodsInfo: {
				},
				small_images: [],
				inviter: null,
				numIid: '',
				isFavorite: 0,
				deliveryFlag: false,
				canvasFlag: true,
				modalShow: false,
				posterBase64: '',
				posterData: {},
				tkl: ''
			};
		},
		onReady() {},
		onShow() {
			const that = this
		},
		onLoad(options) {
			const that = this
			that.numIid = options.id
			that.inviter = options.inviter
			if (that.inviter) {
				uni.setStorageSync('inviter', that.inviter)
			}
			if (options.scene) {
				const scenes = decodeURIComponent(options.scene).split('&')
				that.numIid = scenes[0]
				if (scenes.length > 1) {
					uni.setStorageSync('inviter', scenes[1])
				}
			}
			// that.$api.request('tbk/api/item/info/get', {
			// 		numIid: that.numIid,
			// 		platform: 2
			// 	}).then(res => {
			// 		that.goods = res.data
			// 		let images = that.goods.small_images.string
			// 		that.goods.content = ''
			// 		for(let i = 0; i < images.length; i++) {
			// 			that.goods.content += '<img src="'+images[i]+'"/>'
			// 		}
			// 		wx.setNavigationBarTitle({
			// 		  title: that.goods.title
			// 		})
			// }).catch(res => {
			// 	that.$api.msg(res.msg)
			// })
			that.$api.request('tbk/api/ddx/item/info/get', {
					numIid: that.numIid
				}).then(res => {
					if(res.code === 200) {
						that.goodsInfo = res.data
						that.goods = res.goods[0]
						that.small_images = that.goods.small_images.string
						that.goods.content = ''
						for(let i = 0; i < that.small_images.length; i++) {
							that.goods.content += '<img src="'+that.small_images[i]+'"/>'
						}
						wx.setNavigationBarTitle({
						  title: that.goods.title
						})
					}
			}).catch(res => {
				that.$api.msg(res.msg)
			})
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			onShareAppMessage() {
				return {
					title: ('自购省钱,分享赚钱-') + this.goods.title,
					imageUrl: this.goods.pict_url,
					path: '/pagesA/tbk/detail?id=' + this.numIid + '&inviter=' + (this.userInfo.cardNo ? this.userInfo.cardNo : '')
				}
			},
			numFilter (value) {
				if (isNaN(value)) {
					return 0
				}
				// 截取当前数据到小数点后两位
				let realVal = parseFloat(value).toFixed(2)
				return realVal
			},
			copyText: function (e) {
				let that = this
				// #ifdef H5
				const result = h5Copy(this.tkl)
				if (result === false) {
					that.$api.msg('复制失败，请使用手机自带复制功能~');
				} else {
					that.$api.msg('复制成功，打开淘宝即可领券~');
				}
				// #endif
				// #ifdef MP
				uni.setClipboardData({
				  data: this.tkl,
				  success: function (res) {
					uni.getClipboardData({
					  success: function (res) {
						that.$api.msg('复制成功，打开淘宝即可领券~');
					  }
					})
				  }
				})
				// #endif
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
			createCanvasImageEvn() {
				if (this.posterBase64) return this.modalShow = true;
				uni.showLoading({
					title: '海报生成中'
				})
				const that = this
				let scene = that.goods.goodsId
				if (uni.getStorageSync('inviter')) {
					scene += '&' + uni.getStorageSync('inviter')
				}
				that.$api.request('mall/api/goods/getGoodsPoster', {
					scene: scene,
					url: "pagesA/tbk/detail",
					goodsUrl: this.goods.pict_url,
					goodsName: that.goods.title,
					price: that.goods.zk_final_price,
					sales: that.goods.volume,
					width: 100,
					height: 100
				}, "get").then(res => {
					that.posterBase64 = 'data:image/jpeg;base64,'+res.posterBase64.replace(/[\r\n]/g,"")
					this.modalShow = true
					uni.hideLoading()
					that.deliveryFlag = false;
				})
			},
			
			//保存图片到相册
			save(){
				uni.showLoading({
					title: '保存中...'
				})
				let that = this
				let save = uni.getFileSystemManager()
				let number = Math.random()
				let posterBase64 = that.posterBase64.slice(23)
				save.writeFile({
				  filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
				  data: posterBase64,
				  encoding: 'base64',
				  success: res => {
					uni.saveImageToPhotosAlbum({
						filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
						success: function (res) {
							wx.hideLoading();
							uni.showToast({title: '已保存相册，快去分享到您的圈子吧~', duration: 2000})
						},
						fail: function (err) {
							if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
							  // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
							  uni.showModal({
								title: '提示',
								content: '需要您授权保存相册',
								showCancel: false,
								success: modalSuccess => {
								  uni.openSetting({
									success(settingdata) {
									  if (settingdata.authSetting['scope.writePhotosAlbum']) {
										  uni.showToast({title: '获取权限成功，再次点击图片即可保存', duration: 2000})
									  } else {
										  uni.showToast({title: '获取权限失败，将无法保存到相册哦~', duration: 2000})
									  }
									},
									fail(failData) {
										uni.showToast({title: '保存失败，稍后再试', duration: 2000,icon:'none'})
									},
									complete(finishData) {
									}
								  })
								}
							  })
							}
						},
						complete: function (err) {
							uni.hideLoading()
						}
					})
				  }, complete: err => {
					uni.hideLoading()
				  },
				})
			},
			close () {
				this.modalShow = false;
			},
			// 打开分享弹窗
			shareEvn() {
				this.deliveryFlag = this.deliveryFlag ? false : true
			},
			// 取消海报
			canvasCancel(val) {
				this.canvasFlag = val
			},
			
			// 立即领券
			togglePopup(open) {
				let that = this
				uni.showLoading({
					title: '获取中...'
				})
				this.$nextTick(() => {
					if (this.tkl) {
						this.$refs['show' + open].open()
						uni.hideLoading()
						return
					}
					uni.hideLoading()
					this.$refs['show' + open].open()
					if(this.goodsInfo.coupon_tpwd) {
						that.tkl = this.goodsInfo.coupon_tpwd
					} else if(this.goodsInfo.item_tpwd) {
						that.tkl = this.goodsInfo.item_tpwd
					} else {
						that.$api.msg('来晚啦，优惠券已经领完~');
					}
					/* that.$api.request('tbk/api/taobao/tbk/tpwd/create', {
						text: that.goods.title,
						url: that.couponShareUrl,
						logo: this.goods.pict_url
					}, "get").then(res => {
						if (res.code === 200) {
							uni.hideLoading()
							that.tkl = res.data.tkl
							this.$refs['show' + open].open()
						} else {
							that.$api.msg('来晚啦，优惠券已经领完~');
						}
					}) */
				})
			},
			onBackPress() {
				this.$refs['showpopup'].close()
			},
		},

	}
</script>


<style lang='scss'>
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
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

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;


		.toptitle {
			display: flex;
			align-items: center;
			margin-right: -30upx;

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
			
			.price {
				font-size: $font-lg + 2upx;
			}
		}
		.exclusive{
			font-size: 26rpx;
			margin-right: 5upx;
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
	/* 领取优惠券 */
	.popup-content {
		background-color: #fff;
		padding: 30upx;
		width: 90%;
		margin: 0 auto;
		border-radius: 10upx;
		
		.linkbox{
			border: 3upx dashed $uni-color-primary;
			padding: 10upx 20upx;
			line-height: 50upx;
			font-size: 24upx;
			text-align: center;
		}
		.confirm-btn{
			margin: 30upx auto;
			display: block;
			width:100%;
			text-align: center;
			height: 70upx;
			line-height:70upx;
			border-radius: 100px;
			background: $uni-color-primary;
			color: #fff;
			font-size: 28upx;
		}
		.tipsbox{
			font-size: 24upx;
			color: #666;
			text-align: center;
		}
		.Precautions{
			margin-top: 80upx;
			position: relative;
			background-color: #fff9eb;
			padding: 50upx 20upx 20upx;
			
			.PTitle{
				position: absolute;
				left: 0;
				top: -20upx;
				text-align: center;
				width: 100%;
				
				text{
					padding: 10upx 30upx;
					color: #333;
					background-color: #ffc857;
					border: 1upx solid #c14b0e;
					font-size: 26upx;
					border-radius: 10upx;
				}
			}
			.PText{
				line-height: 50upx;
				font-size: 24upx;
				color: #333;
			}
		}
	}
	/* 分享 */
	.share-section {
		display: flex;
		align-items: center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
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
			font-size: $font-base;
			margin-left: 10upx;
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
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
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
		z-index: 99;

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
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
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
		bottom: 30upx;
		z-index: 9;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
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
				color: #fff;
			}
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
	
	.kindbox{
		line-height: 40upx;
		margin: 10upx 0;
		width: calc(100% - 145upx);
		margin-right: 15upx;
	}
	.kindImg{
		width: 40upx;
		height: 40upx;
		margin-right: 10upx;
		vertical-align: middle;
	}
	.kindTitle{
		font-size: $font-26;
		color: $font-color-dark;
	}
	.ziying{
		width: 60upx;
		height: 40upx;
		line-height: 40upx;
		margin-right: 10upx;
		text-align: center;
		border-radius: 8upx;
		font-size: 20upx;
		background-color: #fa436a;
		color: #fff;
		display: inline-block;
	}
	.yongQuan{
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: 1;
		height: 70upx;
		line-height: 35px;
		text-align: center;
		padding: 0 10upx;
		font-size: 26upx;
		background-color: #f00;
		color: #fff;
		border-radius: 15upx 0 15upx 0;
	}
	.yongJin{
		position: absolute;
		right: 0;
		bottom: 0;
		z-index: 1;
		height: 70upx;
		line-height: 35px;
		text-align: center;
		padding: 0 10upx;
		font-size: 26upx;
		background-color: #fa0;
		color: #fff;
		border-radius: 0 15upx 0 15upx;
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
	.detailbox{
		padding: 20upx 30upx;
		background-color: #fff;
		margin-top: 16upx;
	}
	.detail_coupon{
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20upx 0;
		font-size: 32upx;
		background: -webkit-gradient(linear, left top, right top, from(#F56C6C), to(#fa436a));
		background: -o-linear-gradient(left, #F56C6C, #fa436a);  
		background: linear-gradient(to right,#F56C6C,#fa436a);
		position: relative;
		
		.yuanleft, .yuanright{
			position: absolute;
			width: 40upx;
			height: 40upx;
			border-radius: 50%;
			top:50%;
			margin-top: -20upx;
			background-color: #fff;
		}
		.yuanleft{
			left: -20upx;
		}
		.yuanright{
			right: -20upx;
		}
		.leftcoupon{
			flex: 1;
			border-right: 1upx dashed #fff;
			text-align: center;
			line-height: 60upx;
			text{
				color: #ff0;
				font-size: 40upx;
				font-weight: bold;
			}
		}
		.rightcoupon{
			flex: 1;
			text-align: center;
			line-height: 60upx;
		}
	}
	.shopTitle{
		font-size: 30upx;
	}
	.detail_shop{
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20upx;
		font-size: 24upx;
		color: #999;
		view{
			flex: 1;
			text-align: center;
			line-height: 40upx;
			
			text{
				display: block;
			}
		}
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
