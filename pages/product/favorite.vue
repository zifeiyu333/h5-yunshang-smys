<template>
	<view class="content">
		<!-- 空白页 -->
		<empty v-if="loadingType === 'nomore' && favoriteList.length === 0"></empty>
		<view class="favorite-list">
			<block v-for="(item, index) in favoriteList" :key="index">
				<navigator :url="'/pages/product/detail?id=' + item.goodsId">
					<view class="favorite-item" :class="{'b-b': index!==favoriteList.length-1}">
						<view class="image-wrapper">
							<image :src="item.picUrl + '?x-oss-process'" :class="[item.loaded]" mode="aspectFill" lazy-load @load="onImageLoad('favoriteList', index)"
							 @error="onImageError('favoriteList', index)"></image>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.goodsName}}</text>
							<text class="attr">{{item.sellingPoint}}</text>
							<text class="attr">累计销售{{item.sales}}件</text>
							<text class="price"><text style="color:#fa436a;">¥{{item.price}}</text><text v-if="item.oriPrice > item.price" style="text-decoration:line-through;color: #999;font-size: 24rpx;margin-left: 8rpx;">¥{{item.oriPrice}}</text></text>
						</view>
						<text class="eosfont eos-trash del-btn" @click="deleteFavorite(item.dataId)"></text>
					</view>
				</navigator>
			</block>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				favoriteList: [],
				pageNo: 1,
				loadingType: 'more'
			};
		},
		onShow() {
		},
		onLoad(options) {
			this.loadData()
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
			//获取收藏列表
			loadData(type) {
				const that = this
				if (type === 'refresh') {
					that.pageNo = 1
					that.favoriteList = []
					that.loadingType = 'more'
				}
				if (that.loadingType === 'more') {
					that.loadingType = 'loading'
					that.$api.request('id/api/favorite/listFavoriteRecord', {
						page:that.pageNo, limit: 20, type: 1
					}).then(res => {
						that.pageNo = res.page.page + 1
						that.loadingType = res.page.page < res.totalPages ? 'more' : 'nomore'
						res.page.records.forEach(item => {
							that.favoriteList.push(item);
							if (type === 'refresh') {
								uni.stopPullDownRefresh();
							}
						})
					})
				}
			},
			deleteFavorite(dataId) {
				const that = this
				that.$api.request('id/api/favorite/saveOrCancel', {
					type: 1, dataId: dataId
				},'POST').then(res => {
					that.loadData('refresh')
				})
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
	}
	/* 空白页 */
	.empty {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		padding-bottom: 100upx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		background: #fff;

		image {
			width: 240upx;
			height: 160upx;
			margin-bottom: 30upx;
		}

		.empty-tips {
			display: flex;
			font-size: $font-sm+2upx;
			color: $font-color-disabled;

			.navigator {
				color: $uni-color-primary;
				margin-left: 16upx;
			}
		}
	}

	/* 收藏列表项 */
	.favorite-item {
		display: flex;
		position: relative;
		padding: 20upx;
		background-color: #fff;

		.image-wrapper {
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position: relative;

			image {
				border-radius: 8upx;
			}
		}

		.checkbox {
			position: absolute;
			left: -16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background: #fff;
			border-radius: 50px;
		}

		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position: relative;
			padding-left: 30upx;

			.title,
			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}

			.attr {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}

			.price {
				height: 50upx;
				line-height: 50upx;
			}
		}
		.del-btn{
			color: #999;
			margin-top: 5upx;
			margin-left: 5upx;
		}
	}
	
</style>