<template>
	<view class="container">
		<!-- 标题栏和状态栏占位符 -->
		<view class="titleNview-placing">
			<view class="horizonal-tab" v-if="cateList.length>0">
				<scroll-view scroll-x="true" scroll-with-animation class="scroll-tab">
					<block>
						<view class="scroll-tab-item" :class="{'active': materialId===0}" @tap="toggleTab(0)">
							首页<view class="scroll-tab-line"></view>
						</view>
					</block>
					<block v-for="(item,index) in cateList" :key="index">
						<view class="scroll-tab-item" :class="{'active': item.dictCode===materialId}" 
						@tap="toggleTab(item.dictCode)">
							{{item.dictName}}
							<view class="scroll-tab-line"></view>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
		<view class="navbar" :style="{position:headerPosition,top:headerTop}">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				综合排序
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				销量优先
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang"></text>
					<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang xia"></text>
				</view>
			</view>
		</view>
		<view class="content"> 
			<view class="goods-list">
				<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item.item_id)">
					<view class="image-wrapper">
						<image :src="item.pict_url + '?x-oss-process=image/resize,w_500,h_500'" mode="aspectFill"></image>
						<view class="yongQuan" v-if="item.coupon_amount > 0">{{item.coupon_amount}}元券</view>
						<view class="yongJin" v-if="item.commission_amount > 0">返{{item.commission_amount || '0'}}元</view>
					</view>
					<!-- view整行判断 -->
					<view class="kindbox">
						<image src="../../static/taobao.png" class="kindImg" v-if="item.user_type===0"></image>
						<image src="../../static/tianmao.png" class="kindImg" v-if="item.user_type===1"></image>
						<text class="kindTitle">{{item.title}}</text>
					</view>
					<!-- <view class="kindbox"><image src="../../static/tianmao.png" class="kindImg"></image><text class="title">{{item.goods_name}}</text></view> -->
					<view class="price-box">
						<text class="exclusive" v-if="item.coupon_amount > 0">券后价</text>
						<text class="price" v-if="item.coupon_amount > 0">{{numFilter(parseFloat(item.zk_final_price-item.coupon_amount))}}</text>
						<text class="exclusive" v-if="item.coupon_amount <= 0">折扣价</text>
						<text class="price" v-if="item.coupon_amount <= 0">{{numFilter(parseFloat(item.zk_final_price))}}</text>
						<text class="m-price" v-if="item.reserve_price">￥{{item.reserve_price}}</text>
					</view>
					<view class="pro-box">
						<text class="salebox">销量：{{item.volume?item.volume:0}}</text>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>

		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			uniLoadMore,
			empty
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		data() {
			return {
				cateMaskState: 0, //分类面板展开状态
				headerPosition: "fixed",
				headerTop: "80upx",
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				goodsList: [],
				cateList: [],
				keywords: '',
				page: 1,
				isVip: false,
				materialId: 0,
				tabBars:[]
			};
		},
		onShow() {
			this.isVip = this.$api.isVip()
		},
		onLoad(options) {
			// #ifdef H5
			// this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight + 'px';
			// #endif
			this.materialId = options.materialId ? options.materialId : this.materialId;
			this.keywords = options.keywords ? options.keywords : ''
			this.$api.request('base/api/dict/getChildByCode/TBK_MATERIALS', {
			}).then(res => {
				this.cateList = res.data
			})
			this.loadData();
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom() {
			this.loadData();
		},
		methods: {
			onShareAppMessage() {
				return {
					title: (this.userInfo.nickName===undefined ? '德易物' : this.userInfo.nickName) + '邀请你使用“能赚能省”的小程序，快快体验吧！',
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
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = 'add', loading) {
				//没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return
					}
					this.loadingType = 'loading'
				} else {
					this.loadingType = 'more'
				}

				let orderByInfo = ''
				if (this.filterIndex === 0) {
					//销量排序
					orderByInfo = ''
				}
				if (this.filterIndex === 1) {
					//销量排序
					orderByInfo = 'total_sales_des'
				}
				if (this.filterIndex === 2) {
					if (this.priceOrder === 1) {
						orderByInfo = 'price_asc'
					}
					if (this.priceOrder === 2) {
						orderByInfo = 'price_des'
					}
				}
				if (type === 'refresh') {
					this.page = 1
				}
				if (!this.keywords) {
					this.optimusMaterial(orderByInfo, type, loading)
				} else {
					this.materialOptional(orderByInfo, type, loading)
				}
			},
			// 物料精选
			async optimusMaterial(orderByInfo, type, loading) {
				this.$api.request('tbk/api/dg/optimus/material', {
					adzoneId: 110329000270,
					materialId: this.materialId,
					page : this.page,
					limit: 20
				}).then(res => {
					if (type === 'refresh') {
						this.goodsList = [];
					}
					if (!res.page.records) {
						uni.hideLoading()
						return
					}
					let tempList = res.page.records
					this.goodsList = this.goodsList.concat(tempList);
					this.page = res.page.page + 1
					this.loadingType = res.page.totalPages > res.page.page ? 'more' : 'nomore';
					if (type === 'refresh') {
						if (loading == 1) {
							uni.hideLoading()
						} else {
							uni.stopPullDownRefresh();
						}
					}
				})
			},
			// 物料搜索
			async materialOptional(orderByInfo, type, loading) {
				this.$api.request('tbk/api/dg/material/optional', {
					adzoneId: 110329000270,
					materialId: this.materialId,
					platform: 2,
					keywords: this.keywords,
					sort: orderByInfo,
					page : this.page,
					limit: 20
				}).then(res => {
					if (type === 'refresh') {
						this.goodsList = [];
					}
					if (!res.page.records) {
						uni.hideLoading()
						return
					}
					let tempList = res.page.records
					this.goodsList = this.goodsList.concat(tempList);
					this.page = res.page.page + 1
					this.loadingType = res.page.totalPages > res.page.page ? 'more' : 'nomore';
					if (type === 'refresh') {
						if (loading == 1) {
							uni.hideLoading()
						} else {
							uni.stopPullDownRefresh();
						}
					}
				})
			},
			//筛选点击
			tabClick(index) {
				if (this.filterIndex === index && index !== 2) {
					return;
				}
				this.filterIndex = index;
				if (index === 2) {
					this.priceOrder = this.priceOrder === 1 ? 2 : 1;
				} else {
					this.priceOrder = 0;
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//切换选项卡
			toggleTab (materialId) {
				this.materialId=materialId;
				if (materialId === 0){
					uni.switchTab({
						url: `/pages/tbk/index`
					})
				} else {
					uni.pageScrollTo({
						duration: 300,
						scrollTop: 0
					})
					this.page = 1
					this.loadData('refresh');
				}
			},
			//详情
			navToDetailPage(id) {
				uni.navigateTo({
					url: `/pagesA/tbk/detail?id=${id}`
				})
			},
			naviageToPage(page) {
				uni.navigateTo({
					url: page
				})
			},
			stopPrevent() {}
		},
	}
</script>

<style lang="scss">
	
	.titleNview-placing {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
		width: 100%;
		height: 80upx;
		box-sizing: content-box;
		background-color: $base-color;
		color: #fff;
		// border-bottom: 1upx solid #f8f8f8;
	}
	
	.scroll-tab{
		white-space: nowrap; /* 必要，导航栏才能横向*/
		text-align: center;
	}
	.scroll-tab-item{
		display: inline-block; /* 必要，导航栏才能横向*/
		padding: 0 15rpx;
		font-size: 28upx;
		line-height: 80upx;
	}
	.horizonal-tab .active{
		color: #ff0;
		border-bottom: 5upx solid #ff0;
	}
	.mp-search-box {
		position: fixed;
		left: 0;
		top: 80upx;
		z-index: 3;
		// padding: 0 80upx;
		width: 100%;
		padding: 15upx 20upx;
		background-color: #fff;
		border-top: 1upx solid #f6f6f6;
		border-bottom: 1upx solid #f6f6f6;
		display: flex;
		justify-content: space-between;
	
		.ser-input {
			display: flex;
			flex: 1;
			height: 56upx;
			line-height: 56upx;
			color: $font-color-base;
			border-radius: 20px;
			// background: rgba(255, 255, 255, .6);
			background-color: #f5f5f5;
			padding: 0 20upx;
		}
	
		.ser-input text {
			font-size: 32upx;
			margin-right: 10upx;
		}
	
		.ser-input input {
			height: 56upx;
			line-height: 56upx;
			font-size: 28upx;
		}
	
	}
	page,
	.content {
		background: $page-color-base;
	}

	.content {
		padding-top: 160upx;
	}

	.navbar {
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		z-index: 10;
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
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;

				&.active {
					color: $base-color;
				}
			}

			.xia {
				transform: scaleY(-1);
			}
		}

		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 分类 */
	.cate-mask {
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 95;
		transition: .3s;

		.cate-content {
			width: 400upx;
			height: 100%;
			background: #fff;
			float: right;
			transform: translateX(100%);
			transition: .3s;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.cate-content {
				transform: translateX(0);
			}
		}
	}

	.cate-list {
		display: flex;
		flex-direction: column;
		height: 100%;

		.cate-item {
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
			font-size: 28upx;
			color: #555;
			position: relative;
		}

		.two {
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}

		.active {
			color: $base-color;
		}
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 20upx 30upx 0;
		background: #fff;

		.goods-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 20upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			position: relative;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
			.goodslabel{
				position: absolute;
				left: 0;
				bottom: 0;
				z-index: 1;
				width: 90upx;
				height: 90upx;
				border: none;
			}
		}

		.title {
			font-size: $font-24;
			color: $font-color-dark;
			line-height: 36upx;
			height: 72upx;
			overflow: hidden;
			margin-top: 10upx;
		}
		.price {
			font-size: $font-base;
			color: $uni-color-primary;
			line-height: 1;
			&:before {
				content: '￥';
				font-size: 26upx;
			}
		}
		.price-box{
			display: flex;
			align-items: center;
			line-height: 38upx;
		}
		.exclusive{
			color: #fa436a;
			font-size: 26rpx;
		}
		.m-price {
			font-size: $font-sm+2upx;
			text-decoration: line-through;
			color: $font-color-light;
			margin-left: 8upx;
		}
		.pro-box {
			display: flex;
			justify-content: space-between;
			margin-top: 10upx;
			padding-left: 0upx;
			padding-right: 10upx;
		}
		.brokerage {
			font-size: $font-sm;
			color: $font-color-base;
		}
		
		.salebox {
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	.kindbox{
		line-height: 36upx;
		height: 80upx;
		overflow: hidden;
		margin: 10upx 0;
	}
	.kindImg{
		width: 40upx;
		height: 40upx;
		margin-right: 10upx;
		vertical-align: middle;
	}
	.kindTitle{
		font-size: $font-24;
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
		height: 60upx;
		line-height: 34px;
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
		height: 60upx;
		line-height: 34px;
		text-align: center;
		padding: 0 10upx;
		font-size: 26upx;
		background-color: #fa0;
		color: #fff;
		border-radius: 0 15upx 0 15upx;
	}
</style>
