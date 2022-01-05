<template>
	<view class="content">
		<view class="mp-search-box" style="position: fixed;">
			<view class="ser-input">
				开抢时间：{{kaiqiangTime}}
			</view>
		</view>
		<!-- <view class="navbar" :style="{position:headerPosition}">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">默认</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang"></text>
					<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang xia"></text>
				</view>
			</view>
		</view> -->
		<view class="navbar-20" :style="{position:headerPosition}" >
			<paging :total="total" :pageSize="size" v-model="current" :border-radius="5" :radius="5" @changes="load"></paging>
		</view>
			
		<view class="goods-list">
			<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.goodsImg" mode="aspectFill"></image>
					<view class="yongJin" v-if="item.stock === 0">已售完</view>
					<view class="yongJin" v-else-if="isStart === -1">已售完</view>
					<view class="yongJin" v-else-if="isStart === 1 && item.isNoBuy === 1">已售完</view>
				</view>
				<!-- view整行判断 -->
				<view class="kindbox"><text class="title">{{item.goodsName}}</text></view>
				<view class="price-box">
					<text class="price">￥{{ item.goodsPrice }}</text>
					<text class="m-price">查看</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import paging from '@/components/yang-paging/yang-paging.vue'
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			paging,
			uniLoadMore
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		data() {
			return {
				domain: this.$api.defConfig().domain,
				isKaifang: 0,
				headerPosition: "fixed",
				headerTop: "0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				goodsList: [],
				cateList: [],
				cateCode: undefined,
				current: 1,
				size: 10,
				total: 0,
				isStart: -1,
				kaiqiangTime: ''
			};
		},
		onShow() {
			
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
			  title: '商品列表'
			})
			this.cateCode = options.cateCode ? options.cateCode : null
			if (!this.cateCode) {
				this.$api.msg('该传入商品分类编号！')
				return
			}
			this.$api.request('api/pk/goodscate/info/' + this.cateCode, {
			}).then(res => {
				if (res.data.isKaifang === 0) {
					this.$api.msg('该商品区暂未开放！')
					return
				}
				this.isStart = res.data.isStart
				this.isKaifang = 1
				this.load(this.current)
				uni.setNavigationBarTitle({
				  title: res.data.cateName + '-商品列表'
				})
				this.kaiqiangTime = res.data.startStrTime + '-' + res.data.endStrTime
			})
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
/* 		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom() {
			this.loadData();
		}, */
		methods: {
			async load(current) {
				if (this.isKaifang === 0) {
					uni.hideLoading()
					this.$api.msg('该商品区暂未开放！')
					return
				}
				this.current = current
				let orderByInfo = {}
				if (this.filterIndex === 0) {
					//销量排序
					orderByInfo = {
						sort: 'paixu',
						order: 'asc'
					}
				}
				if (this.filterIndex === 1) {
					//销量排序
					orderByInfo = {
						sort: 'sales',
						order: 'desc'
					}
				}
				if (this.filterIndex === 2) {
					//价格排序 需要从新获取Page
					orderByInfo = {
						sort: 'goods_price',
						order: this.priceOrder === 1 ? 'asc' : 'desc'
					}
				}
				this.$api.request('api/pk/goods/query', {
					cateCode: this.cateCode,
					current : current,
					size: this.size,
					...orderByInfo
				}).then(res => {
					uni.hideLoading()
					this.total = res.data.total
					this.goodsList = res.data.records;
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
				this.load(1);
			},
			//详情
			navToDetailPage(item) {
				if (item.stock === 0) {
					this.$api.msg('已售完！')
					return
				}
				if (this.isStart === -1) {
					this.$api.msg('已售完！')
					return
				}
				if (this.isStart === 1 && item.isNoBuy === 1) {
					this.$api.msg('已售完！')
					return
				}
				let id = item.goodsId;
				uni.navigateTo({
					url: `/pages/product/detail?id=${id}`
				})
			},
			stopPrevent() {}
		},
	}
</script>

<style lang="scss">
	.mp-search-box {
		//position: fixed;
		left: 0;
		//top: 80upx;
		z-index: 3;
		//padding: 0 80upx;
		width: 100%;
		padding: 15upx 20upx;
		background-color: #FA436A;
		justify-content: space-between;
	
		.ser-input {
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			border-radius: 20px;
			// background: rgba(255, 255, 255, .6);
			//background-color: #f5f5f5;
			//padding: 0 20upx;
		}
	
	}
	page,
	.content {
		background: $page-color-base;
	}

	.content {
		padding-top: 0upx;
	}
	.navbar-20 {
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		top: 160upx;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		z-index: 10;
	}
	.navbar {
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		top: 80upx;
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
			font-size: 28upx;
			height: 80upx;
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
		padding: 260upx 30upx 0;
		background: #fff;

		.goods-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

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
			font-size: 14px;
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
			font-size: 26upx;
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
			color: $font-color-light;
			margin-left: 150upx;
		}
		.pro-box {
			display: flex;
			justify-content: space-between;
			margin-top: 10upx;
			padding-left: 10upx;
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
		height: 40upx;
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
		font-size: 16px;
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
		left: 20%;
		top: 20%;
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
	.toptips{
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		width: 100%;
		height: 60upx;
		font-size: 22upx;
		line-height: 60upx;
		padding: 0 15upx;
		background-color: rgba(255,255,255,.7);
		border-bottom: 1upx solid rgba(0,0,0,.5);
		color: #000;
		text{
			font-size: 28upx;
			color: #f00;
			margin-left: 5upx;
		}
	}
</style>
