<template>
	<view class="content">
		<!-- 空白页 -->
		<empty v-if="integralList.length === 0"></empty>
		<!-- 积分记录 -->
		<view class="listbox" v-for="(item, index) in integralList" :key="index">
			<view class="namebox">
				<text class="title">{{item.title}}</text>
				<text class="number greencolor" v-if="item.ixType === 1">+{{item.amount}}积分</text>
				<text class="number redcolor" v-if="item.ixType === 2">-{{item.amount}}积分</text>
			</view>
			<view class="daybox">
				<text>{{item.crtTime}}</text>
				<text>支付状态：{{item.payStatus===0?'未支付':(item.payStatus===-1?'失败':'成功')}}</text>
			</view>
		</view>

		<uni-load-more :status="tabItem.loadingType"></uni-load-more>
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
				headerPosition: "fixed",
				loadingType: 'more', //加载更多状态
				page: 1,
				integralList:[]
			}
		},
        computed: {
			...mapState(['hasLogin','userInfo'])
		},
		onLoad(options) {
			if (this.hasLogin) {
				this.loadData()
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom() {
			this.loadData()
		},
		methods: {
			async loadData(type = 'add', loading) {
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
					this.page = 1
				}
				this.$api.request('id/api/integral/record/listIntegralRecord', {
					page: this.page,
					limit: 10
				}).then(res => {
					let tempList = res.page.records
					if (type === 'refresh') {
						this.integralList = [];
					}
					this.integralList = this.integralList.concat(tempList);
					this.page = res.page.page + 1
					this.loadingType = res.page.totalPages > res.page.page ? 'more' : 'nomore';
					if (type === 'refresh') {
						if (loading == 1) {
							uni.hideLoading()
						} else {
							uni.stopPullDownRefresh()
						}
					}
				}).catch(res => {
					this.$api.msg(res.msg)
				})
			}
		}
		
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
	}
	
	.navbar {
		display: flex;
		height: 100upx;
		background: #fff;
		box-shadow: 0 1upx 2upx rgba(0, 0, 0, 0.06);
		position: relative;
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
			}
		}
	}
	.listbox{
		background-color: #fff;
		padding: 20upx;
		border-bottom: 1upx solid #eee;
	}
	.namebox{
		display: flex;
		line-height: 60upx;
		justify-content: space-between;
		
		.title{
			font-size: 26upx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			flex: 1.5;
			margin-right: 10upx;
		}
		.number{
			font-size: 30upx;
		}
		.greencolor{
			color: #00cc00;
		}
		.redcolor{
			color: #f00;
		}
	}
	.daybox{
		display: flex;
		line-height: 50upx;
		justify-content: space-between;
		
		text{
			color: #999;
			flex: 1;
			font-size: 24upx;
		}
	}
</style>
