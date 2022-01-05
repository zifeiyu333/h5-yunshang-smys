<template>
	<view>
		<view class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>({{total}})</text>
			</view>
			
			<view v-for="(item,index) in appraiseList" :key="index" class="eva-box">
				<image class="portrait" :src="item.avatar ? item.avatar : '/static/missing-face.png'" mode="aspectFill"></image>
				<view class="right">
					<text class="name">{{item.nickName}}</text>
					<text class="con">{{item.content}}</text>
					<view v-if="item.imgUrl && item.imgUrl.length > 0" class="imgs">
						<image @click="previewImg(item.imgUrl, imgIndex)" v-for="(imgItem, imgIndex) in item.imgUrl" :key="imgIndex" class="ig" :src="imgItem + '?x-oss-process'"></image>
					</view>
					<view class="bot">
						<text class="attr">购买类型：{{item.skuName}}</text>
						<text class="time">{{item.crtTime}}</text>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				page: 1,
				total: 0,
				appraiseList: [],
				goodsId: '',
				loadingType: 'more'
			}
		},
		onLoad(option) {
			this.goodsId = option.goodsId
			this.loadData()
		},
		onReachBottom(e) {
			this.loadData()
		},
		methods: {
			async loadData(type = 'add', loading) {
				const that = this
				if (that.loadingType === 'more') {
					that.loadingType = 'loading'
					that.$api.request('mall/api/appraise/list', {
						goodsId: that.goodsId,
						page : this.page,
						limit: 10
					}).then(res => {
						let tempList = res.page.records
						that.appraiseList = that.appraiseList.concat(tempList)
						that.page = res.page.page + 1
						that.total = res.page.total
						that.loadingType = res.page.totalPages > res.page.page ? 'more' : 'nomore';
					})
				}
			},
			previewImg(imgs,index) {
				uni.previewImage({
					current: index,
					urls: imgs
				})
			}
		}
	}
</script>

<style lang="scss">
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
			
			.imgs {
				padding: 20upx 0;
				
				.ig {
					width: 190upx;
					height: 190upx;
					padding:4upx;
				}
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}
</style>
