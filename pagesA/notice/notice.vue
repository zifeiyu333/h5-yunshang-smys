<template>
	<view class="content">
		<!-- 空白页 -->
		<empty v-if="loadingType === 'nomore' && noticeList.length === 0"></empty>
		<block v-for="(item, index) in noticeList" :key="index">			
			<view class="newsList">
				<view class="newstime">{{item.crt_time}}</view>
				<view class="newsbox">
					<view class="title">{{item.title}}</view>
					<!-- <view class="number">
						<view class="paytype">退还金额</view>
						<view class="money">￥<text>498.90</text></view>
					</view> -->
					<view class="number">
						<view class="paytype">{{item.content}}</view>
					</view>
					<view class="mainbox" v-for="(nitem, ind) in item.list" :key="ind">
						<view class="left">{{nitem.key}}</view>
						<view class="right">{{nitem.value}}</view>
					</view>
					<view class="mainbox" v-if="item.remark">
						<view class="left">备注：</view>
						<view class="right">{{item.remark}}</view>
					</view>
				</view>
			</view>
		</block>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				page: 1,
				loadingType: 'more',
				noticeList: []
			}
		},
		onShow() {
			this.loadData()
			this.$api.request('id/api/notify/updateReadAll', {
			}, 'PUT').then(res => {
			})
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
			loadData(source) {
				const that = this
				if (source === 'refresh') {
					that.page = 1
					that.favoriteList = []
					that.loadingType = 'more'
				}
				if (that.loadingType === 'more') {
					that.loadingType = 'loading'
					that.$api.request('id/api/notify/getNotifyList', {
						page: that.page,
						limit: 10
					}).then(res => {
						that.page = res.page.page + 1
						that.loadingType = res.page.page < res.totalPages ? 'more' : 'nomore'
						res.page.records.forEach(item => {
							that.noticeList.push(item);
							if (source === 'refresh') {
								uni.stopPullDownRefresh();
							}
						})
					})
				}
			}
		}
		
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
	}
	.newsList{
		padding: 20upx;
		margin-bottom: 10upx;
	}
	.newstime{
		color: $font-color-light;
		font-size: 24upx;
		text-align: center;
		line-height: 40upx;
	}
	.newsbox{
		border-radius: 10upx;
		border: 1upx solid #eee;
		padding: 20upx 30upx;
		background-color: #fff;
		margin-top: 20upx;
		
		.title{
			font-size: 30upx;
			color: #000;
			// margin-top: 20upx;
		}
		.number{
			margin: 40upx 0;
			.paytype{
				color: $font-base;
				font-size: 26upx;
				line-height: 46upx;
			}
			.money{
				color: #000;
				font-size: 40upx;
				font-weight: bold;
				margin-top: 10upx;
				
				text{
					font-size: 60upx;
				}
			}
		}
		.mainbox{
			font-size: 26upx;
			line-height: 40upx;
			margin-bottom: 20upx;
			display: flex;
			align-items: flex-start;
			justify-content: flex-start;
			.left{
				color: $font-color-light;
				width: 200upx;
				margin-right: 20upx;
			}
			.right{
				color: #666;
				width: calc(100% - 200upx);
			}
		}
		.detailbtn{
			border-top: 1upx solid #eee;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20upx 0;
			color: #000;
			font-size: 30upx;
			
			.cell-more {
				color: $font-color-light;
			}
		}
	}
	
</style>
