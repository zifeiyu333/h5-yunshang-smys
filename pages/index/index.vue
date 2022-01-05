<template>
	<view class="container">
		<!-- 头部轮播 -->
		<view class="carousel-section" v-if="adList.length > 0">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background" :style="{backgroundColor: adList[swiperCurrent].diquName}"></view> 
			<swiper autoplay="true" interval="3000" duration="500" class="carousel" circular @change="swiperChange">
				<swiper-item v-for="(item, index) in adList" :key="index" class="carousel-item" @click="clickNews(item.adUrl)">
					<image :src='item.adImg'/>
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num">{{swiperLength}}</text>
			</view>
		</view>

		<!-- 公告 -->
		<view class="news-box m-t" v-if="hotNewsList.length > 0">
			<view class="eosfont eos-systemprompt"></view>
			<view class="newstext">
				<an-notice-bar :text="noticeMsg" :dataList="hotNewsList" @more="moreNews" @oclick="clickNews"></an-notice-bar>
			</view>
		</view>
		
		<block v-for="(item, index) in goodsCateList" :key="index">
			<view class="f-header m-t">
				<text class="tit-left">{{item.cateName}}</text>
			</view>
			<view class="favorite" @click="navToProductListPage(item)">
				<view class="ad-1" style="position: relative; ">
					<view class="toptips">
						<text v-if="item.isKaifang === 0">待开放</text>
						<text v-else>开抢时间：{{item.startStrTime}} - {{item.endStrTime}}</text>
					</view>
					<img :src="item.cateImg" mode="scaleToFill"></img>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import AnNoticeBar from '@/components/an-notice-bar/an-notice-bar.vue'
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			AnNoticeBar
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		data() {
			return {
				domain: this.$api.defConfig().domain,
				titleNViewBackground: '#CB573C',
				swiperCurrent: 0,
				swiperLength: 0,
				adList: [],
				hotNewsList: [],
				noticeMsg: '',
				goodsCateList: [],
				salesTop: []
			};
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
			  title: '水墨云商'
			})
			if (options.inviter) {
				uni.setStorageSync('inviter', options.inviter)
			}
			if (options.scene) {
				const scene = decodeURIComponent(options.scene)
				uni.setStorageSync('inviter', scene)
			}
		},
		onShow() {
			if (this.hasLogin) {
				this.loadData()
			} else {
				uni.navigateTo({
					url: '/pages/public/login'
				})
			}
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
				uni.showLoading({
					title: '正在加载'
				})
				that.$api.request('api/pk/index/load').then(res => {
					if (res.code === 200) {
						that.adList = res.adList
						that.swiperLength = that.adList.length
						that.hotNewsList = res.gonggaoList
						that.hotNewsList.forEach((item)=> {
							that.noticeMsg += (that.noticeMsg === '' ? '' : '|') + item.gonggaoName
						})
						that.goodsCateList = res.goodsCateList
					}
				}).catch(res => {
					// that.$api.msg(res.msg)
				})

				uni.hideLoading()
			},
			moreNews(){
				uni.switchTab({
					url: '/pages/news/news'
				})
			},
			clickNews(id){
				if (id) {
					uni.navigateTo({
						url: `/pages/news/detail?id=${id}`
					})
				}
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.titleNViewBackground = this.adList[index].content;//this.adList[index].color;
			},
			//详情页
			navToProductListPage(item) {
				if (item.isKaifang === 0) {
					this.$api.msg('该商品区暂未开放！')
					return
				}
				uni.navigateTo({
					url: `/pages/product/list?cateCode=${item.cateCode}`
				})
				// that.$api.request('api/pk/goodscate/check/'+item.cateCode).then(res => {
				// 	if (res.code === 200) {
						
				// 	} else {
				// 		this.$api.msg('该商品区暂未开始！')
				// 		return
				// 	}
				// }).catch(res => {
				// 	// that.$api.msg(res.msg)
				// })
			}
		}
	}
</script>

<style lang="scss">
	/* #ifdef MP */
	.mp-search-box {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 9999;
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
			flex: 1.7;
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

		.newsbtn {
			flex: 0.3;
			text-align: right;
			height: 56upx;
			position: relative;
			
			.yticon{
				font-size: 46upx;
				color: $font-color-dark;
				line-height: 56upx;
				margin-right: 10upx;
			}
			.newsNum{
				width: 40upx;
				height: 40upx;
				line-height: 40upx;
				border-radius: 50%;
				border: 1upx solid #fff;
				text-align: center;
				position: absolute;
				right: -10upx;
				top: -10upx;
				font-size: 22upx;
				color: #fff;
				background-color: #fa436a;
			}
		}
	}

	page {
		.cate-section {
			position: relative;
			z-index: 5;
			border-radius: 16upx 16upx 0 0;
			margin-top: -20upx;
		}

		.carousel-section {
			padding: 0;
			/* #ifdef MP-WEIXIN */
			padding-top: 60upx;
			/* #endif */
			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}

			.carousel {
				.carousel-item {
					padding: 0;
				}
			}

			.swiper-dots {
				left: 45upx;
				bottom: 40upx;
			}
		}
	}

	/* #endif */


	page {
		background: #f5f5f5;
	}

	.m-t {
		margin-top: 10upx;
	}

	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		/* #ifdef H5 */
		padding-top: 10px;
		/* #endif */
		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 22px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 380upx;
			border-radius: 0 0 50upx 50upx;
			transition: .4s;
		}
	}

	.carousel {
		width: 100%;
		height: 350upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	/* 公告 */
	.news-box {
		background-color: #fff;
		padding: 10upx 20upx;
		font-size: 28upx;

		.eosfont {
			width: 70upx;
			display: inline-block;
			font-size: 40upx;
			color: $font-color-base;
			margin-right: 20upx;
			border-right: 2upx solid #eee;
		}

		.newstext {
			display: inline-block;
			width: calc(100% - 90upx);
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			line-height: 30rpx;
			margin-bottom: -5px;
		}
	}

	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 20upx;
		background: #fff;

		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm;
			color: $font-color-dark;
		}

		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 65upx;
			height: 65upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: .7;
			box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}

	.ad-1 {
		width: 100%;
		height: 310upx;
		padding: 0 0;
		background: #fff;

		img {
			border-radius: 30upx;
			width: 100%;
			height: 100%;
		}
	}
	/* 淘宝客分类 */
	.taoBox{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.taolist{
		flex: 1;
		padding: 10upx 20upx;
		.taoTitle{
			width: 98upx;
			height: 28upx;
		}
		.taoText{
			font-size: 20upx;
			margin-bottom: 20upx;
		}
		.taoimg{
			text-align: center;
			height: 100upx;
			
			image{
				width: 128upx;
				height: 100%;
			}
		}
	}
	.taolist:first-child{
		background-color: #fcf0e4;
		.taoText{
			color: #ea7900;
		}
	}
	.taolist:nth-child(2){
		background-color: #e5fdfe;
		.taoText{
			color: #3d88bb;
		}
	}
	.taolist:nth-child(3){
		background-color: #e4ebfd;
		.taoText{
			color: #5818f5;
		}
	}

	/* 秒杀专区 */
	.seckill-section {
		padding: 4upx 30upx 24upx;
		background: #fff;

		.s-header {
			display: flex;
			align-items: center;
			height: 92upx;
			line-height: 1;

			.s-img {
				width: 140upx;
				height: 30upx;
			}

			.tip {
				font-size: $font-base;
				color: $font-color-light;
				margin: 0 20upx 0 40upx;
			}

			.timer {
				display: inline-block;
				width: 40upx;
				height: 36upx;
				text-align: center;
				line-height: 36upx;
				margin-right: 14upx;
				font-size: $font-sm;
				color: #fff;
				border-radius: 2px;
				background: rgba(0, 0, 0, .8);
			}

			.icon-you {
				font-size: $font-lg;
				color: $font-color-light;
				flex: 1;
				text-align: right;
			}
		}

		.floor-list {
			white-space: nowrap;
		}

		.scoll-wrapper {
			display: flex;
			align-items: flex-start;
		}

		.floor-item {
			width: 150upx;
			margin-right: 20upx;
			font-size: $font-sm;
			color: $font-color-dark;
			line-height: 1.8;

			image {
				width: 150upx;
				height: 150upx;
				border-radius: 6upx;
			}

			.price {
				color: $uni-color-primary;
			}
		}
	}

	.f-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20upx;
		background: #fff;
		line-height: 1.3;

		.tit-left{
			border-left: 6upx solid $base-color;
			padding-left: 20upx;
			font-size: 30upx;
			color: #000;
		}
		.tit-right{
			font-size: 24upx;
			color: #999;
		}
		
		.icon-you {
			font-size: $font-lg;
			color: $font-color-light;
		}
	}

	.m-price {
		font-size: $font-sm;
		text-decoration: line-through;
		color: $font-color-light;
		margin-left: 8upx;
	}
	
	.brokerage {
		font-size: $font-sm;
		color: $font-color-base;
	}


	/* 团购楼层 */
	.group-section {
		background: #fff;

		.g-swiper {
			height: 510upx;
			padding-bottom: 20upx;
		}

		.g-swiper-item {
			width: 100%;
			padding: 0 30upx;
			display: flex;
		}
		
		image {
			width: 100%;
			height: 360upx;
			border-radius: 4px;
			border: 1upx solid #f6f6f6;
		}

		.g-item {
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}

		.left {
			flex: 1;
			margin-right: 24upx;
		}
		.right {
			flex: 1;
			// flex-direction: column-reverse;

			.t-box {
				padding-bottom: 20upx;
			}
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
		.t-box {
			height: 160upx;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 1.6;
		}

		.price {
			color: $uni-color-primary;
		}

		.pro-box {
			display:flex;
			align-items:center;
			margin-top: 10upx;
			font-size: $font-sm;
			color: $font-base;
			padding-right: 10upx;
		}

		.salebox {
			font-size: $font-sm;
			color: $font-color-light;
		}

		.progress-box {
			flex: 1;
			border-radius: 10px;
			overflow: hidden;
			margin-right: 8upx;
		}
	}

	/* 分类推荐楼层 */
	.hot-floor {
		width: 100%;
		overflow: hidden;
		// margin-bottom: 20upx;

		.floor-img-box {
			width: 100%;
			// height: 320upx;
			height: 100upx;
			position: relative;
			text-align: center;
			background-color: #fff;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(rgba(255, 255, 255, .06) 30%, #f8f8f8);
			}
		}

		.floor-title {
			display: inline-block;
			width: 60%;
			line-height: 100upx;
			background: url(../../static/titlebg.png) left center no-repeat, url(../../static/titlebg.png) right center no-repeat;
		}

		.floor-img {
			width: 100%;
			height: 100%;
		}

		.floor-list {
			white-space: nowrap;
			padding: 20upx;
			// padding-right: 50upx;
			border-radius: 6upx;
			// margin-top: -140upx;
			// margin-left: 30upx;
			background: #fff;
			// box-shadow: 1px 1px 5px rgba(0, 0, 0, .2);
			position: relative;
			z-index: 1;
		}

		.scoll-wrapper {
			display: flex;
			align-items: flex-start;
		}

		.floor-item {
			width: 180upx;
			margin-right: 20upx;
			font-size: $font-sm;
			color: $font-color-dark;
			line-height: 1.8;

			image {
				width: 180upx;
				height: 180upx;
				border-radius: 6upx;
			}

			.price {
				color: $uni-color-primary;
			}
		}

		.more {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			flex-shrink: 0;
			width: 180upx;
			height: 180upx;
			border-radius: 6upx;
			background: #f3f3f3;
			font-size: $font-base;
			color: $font-color-light;

			text:first-child {
				margin-bottom: 4upx;
			}
		}
	}

	/* 猜你喜欢 */
	.favorite {
		padding: 0 30upx 30upx 30upx;
		background: #fff;
		
		.favorite-item {
			display: flex;
			justify-content: flex-start;
			width: 100%;
			padding-bottom: 20upx;
			margin-bottom: 20upx;
			border-bottom: 1upx solid $border-color-light;
		}
		
		.pro-box {
			display: flex;
			justify-content: space-between;
			margin-top: 10upx;
			padding-left: 10upx;
			padding-right: 10upx;
		}
		
		.salebox {
			font-size: $font-sm;
			color: $font-color-light;
		}
		.favorite-image {
			width: 260upx;
			height: 260upx;
			border-radius: 3px;
			overflow: hidden;
			position: relative;
			margin-right: 20upx;
			float: left;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.favorite-box{
			width: calc(100% - 280upx);
		}
		.favorite-bottom{
			height: 80upx;
			position: relative;
		}
	}
	/* 热销宝贝 */
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;
	
		.guess-item {
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
				right: 0;
				bottom: 0;
				z-index: 1;
				width: 90upx;
				height: 90upx;
				border: none;
			}
		}
	}
	.title-box {
		line-height: 36upx;
		height: 72upx;
		overflow: hidden;
		margin-top: 10upx;
		margin-bottom: 10upx;
	}
	.title {
		font-size: $font-24;
		color: $font-color-dark;
		overflow: hidden;
	}
	.price {
		font-size: $font-base;
		color: $uni-color-primary;
		line-height: 1;
	}
	.price-box{
		display: flex;
		align-items: center;
		line-height: 40upx;
	}
	.exclusive{
		color: #fa436a;
		font-size: 26rpx;
	}
	.ruleBox{
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 15upx 0;
		background-color: #fff;
		.ruleList{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24upx;
			color: #777;
			.eosfont{
				margin-right: 10upx;
				color: $uni-color-primary;
				font-size: 40upx;
			}
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
		background-color: rgba(255,255,255,.3);
		//border-bottom: 1upx solid rgba(0,0,0,.5);
		color: #000;
		text{
			font-size: 28upx;
			color: #f00;
			margin-left: 5upx;
		}
	}
</style>
