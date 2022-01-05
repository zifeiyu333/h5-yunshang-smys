<template>
	<view class="content">
		<!-- 空白页 -->
		<empty v-if="list.length === 0"></empty>
		<block v-for="(item, index) in list" :key="index">
			<view class="news-item" @click="naviageToPage(item)">
				<view class="newsright">
					<view class="title">{{item.gonggaoName}}</view>
					<view class="time">{{(item.addTime * 1000) | dateFormat}}</view>
				</view>
				<!-- <view class="bot b-t">
					<text>查看详情</text>
					<text class="more-icon yticon icon-you"></text>
				</view> -->
			</view>
		</block>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			uniLoadMore,
			empty,
			neilModal
		},
		data() {
			return {
				current: 1,
				loadingType: 'more',
				list: []
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onShow(options) {
			if (this.hasLogin) {
				this.loadData()
			} else {
				uni.navigateTo({
					url: '/pages/public/login'
				})
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
		onLoad(options) {
		},
		methods: {
			loadData(type = 'add', loading) {
				//没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more'
				}
				if (type === 'refresh') {
					this.current = 1
				}
				this.$api.request('api/pk/gonggao/query', {
					current: this.current,
					size: 10
				}).then(res => {
					if (type === 'refresh') {
						this.list = [];
					}
					this.current = res.data.current + 1
					this.loadingType = res.data.current < res.data.totalPages ? 'more' : 'noMore'
					this.list = this.list.concat(res.data.records)
					if (type === 'refresh') {
						if (loading == 1) {
							uni.hideLoading()
						} else {
							uni.stopPullDownRefresh()
						}
					}
				})
			},
			//点击链接
			naviageToPage(item){
				let id = item.gonggaoId
				uni.navigateTo({  
					url: `/pages/news/detail?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	page,.content {
		background: $page-color-base;
		height: 100%;
	}
	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 100upx;
		background: #fff;
		box-shadow: 0 1upx 2upx rgba(0, 0, 0, 0.06);
		position: fixed;
		width: 100%;
		z-index: 10;
		margin-bottom: 20upx;
		
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
	.newsmain{
		padding-top: 120upx;
	}
	.news-item {
		background-color: #fff;
		padding: 30upx;
		border-bottom: 1upx solid #eee;
		display: flex;
		align-items: flex-start;
	}
	.img-wrapper {
		width: 180upx;
		height: 180upx;
		position: relative;
		margin-right: 20upx;
		border-radius: 6upx;
		overflow: hidden;
		border: 1upx solid  #f1f1f1;
		display: flex;
		align-items: center;
		
		image {
			display: block;
			width: 100%;
		}
	}
	.newsright{
		width: calc(100% - 200upx);
		
		.title {
			height: 50upx;
			line-height: 50upx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			color: #303133;
			font-size: 30upx;
		}
		.detail{
			line-height: 40upx;
			height: 80upx;
			overflow: hidden;
			font-size: 28upx;
			color: #999;
		}
		.time {
			margin-top: 10upx;
			font-size: 26upx;
			color: #999;
		}
	}

	.cover {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		font-size: 36upx;
		color: #fff;
	}

	.introduce {
		display: inline-block;
		padding: 16upx 0;
		font-size: 28upx;
		color: #606266;
		line-height: 38upx;
	}

	.bot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
		font-size: 24upx;
		color: #707070;
		position: relative;
	}

	.more-icon {
		font-size: 32upx;
	}
</style>
