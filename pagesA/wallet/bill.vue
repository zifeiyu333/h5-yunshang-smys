<template>
	<view class="content">
		<!-- 头部 -->
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === index }" @click="tabClick(index)">
				{{ item.text }}
			</view>
		</view>
		
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<view class="mainbox">
						<!-- 空白页 -->
						<empty v-if="tabItem.loaded === true && tabItem.recordList.length === 0"></empty>
						
						<!-- 收益明细 -->
						<view v-for="(item,index) in tabItem.recordList" :key="index" class="listbox">
							<view class="namebox">
								<text class="title">{{item.content}}</text>
								<text class="number redcolor" v-if="item.logType === 1">-￥{{item.rmb}}</text>
								<text class="number greencolor" v-if="item.logType === 2">+￥{{item.rmb}}</text>
							</view>
							<view class="daybox">
								<text>创建日：{{(item.addTime * 1000) | dateFormat}}</text>
								<text>状态：{{item.isFafang===0?'待发放':(item.isFafang===2?'未通过':'已发放')}}</text>
							</view>
						</view>
			
						<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	export default {
		components: {
			uniLoadMore,
			empty,
			neilModal
		},
		data() {
			return {
				tabCurrentIndex: 0,
				navList: [
					// {
					// 	state: 0,
					// 	text: '全部',
					// 	loadingType: 'more',
					// 	current: 1,
					// 	recordList: []
					// },
					{
						state: 2,
						text: '收益明细',
						loadingType: 'more',
						current: 1,
						recordList: []
					},
					{
						state: 1,
						text: '提现明细',
						loadingType: 'more',
						current: 1,
						recordList: []
					}
				]
			}
		},
		onLoad(options) {
			// 页面显示是默认选中第一个
			this.tabCurrentIndex = 0
			for (let i = 0; i < this.navList.length; i++) {
				if (this.navList[i].state === parseInt(options.state)) {
					this.tabCurrentIndex = i
				}
			}
			this.loadData()
		},
		methods: {
			async loadData(source) {
				const that = this
				//这里是将订单挂载到tab列表下
				let index = that.tabCurrentIndex;
				let navItem = that.navList[index];
				if(source === 'refresh') {
					navItem.loaded === false
					navItem.loadingType === 'more'
				}
				if (source === 'tabChange' && navItem.loaded === true) {
					//tab切换只有第一次需要加载数据
					return;
				}
				if (navItem.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				
				navItem.loadingType = 'loading';
				
				that.$api.request('api/pk/userlog/query', {
					current: navItem.current,
					size: 20,
					logType: navItem.state
				}).then(res => {
					navItem.current = res.data.current + 1
					navItem.loadingType = res.data.current < res.data.totalPages ? 'more' : 'noMore'
					res.data.records.forEach(item => {
						navItem.recordList.push(item)
						// item.skuCount = 0
						// item.skuList.forEach(skuItem => {
						// 	item.skuCount += skuItem.num
						// })
					})
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					that.$set(navItem, 'loaded', true);
				})
			},
			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			}
		}
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	.swiper-box {
		padding-top: 100upx;
		height: 100%;
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
	.mainbox{
		margin-top: 20upx;
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
