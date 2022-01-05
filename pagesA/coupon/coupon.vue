<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === item.state }" @click="tabClick(item.state)">
				{{ item.text }}
			</view>
		</view>
		
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<view class="coupon">
						<!-- 空白页 -->
						<empty v-if="tabItem.loaded === true && tabItem.recordList.length === 0"></empty>
						<view v-for="(item,index) in tabItem.recordList" :key="index" :class="tabCurrentIndex===1 ? 'listbox expire' : 'listbox'">
							<view class="boxleft">
								<view class="number" v-if="item.type===1">￥<text>{{item.disPrice}}</text></view>
								<view class="number" v-if="item.type===2"><text>{{item.disRate}}</text>折</view>
								<view v-if="item.useCondition===1">无门槛</view>
								<view v-if="item.useCondition===2">满{{item.minConsumptionPrice}}可用</view>
							</view>
							<view class="boxright">
								<view class="title">{{item.name}}</view>
								<text v-if="item.expirationType===1" class="daytime time">领取后{{item.validDay}}天内有效。限领{{item.personTakeNum}}张</text>
								<text v-if="item.expirationType===2" class="daytime time">{{item.endTime}}前有效，限领{{item.personTakeNum}}张</text>
								<view>
									<text v-if="item.grantNum>-1" class="daytime time">共{{item.grantNum}}张，剩余{{item.grantNum - item.usedNum}}张</text>
								</view>
								<view>
									<text class="daytime time">{{item.useType===0 ? '全场通用' : item.msg}}</text>
								</view>
								<view class="gouse" v-if="tabCurrentIndex == 0">
									<text v-if="item.isUse===0" class="usebtn" @click="obtainCoupon(index)">立即领取</text>
									<text v-if="item.isUse===1" class="usebtn" @click="naviageToPage(item)">去使用</text>
									<text v-if="item.isUse===2">已使用</text>
								</view>
								<view class="guoqi" v-if="tabCurrentIndex == 1">
									<text v-if="item.isUse===2">已使用</text>
									<text v-if="item.isUse===1">已过期</text>
								</view>
							</view>
						</view>
			
						<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- <view class="coupon">
			<view class="listbox">
				<view class="boxleft">
					<view class="number">￥<text>100</text></view>
					<view>满￥10000使用</view>
				</view>
				<view class="boxright">
					<view class="title">新用户满减</view>
					<view class="daytime">2020/02/23~2020/12/23</view>
					<view class="gouse">
						<text class="usebtn">去使用</text>
					</view>
				</view>
			</view>
			<view class="listbox expire">
				<view class="boxleft">
					<view class="number">￥<text>100</text></view>
					<view>满￥10000使用</view>
				</view>
				<view class="boxright">
					<view class="title">新用户满减</view>
					<view class="daytime">2020/02/23~2020/12/23</view>
					<view class="guoqi">已使用</view>
				</view>
			</view>
			<view class="listbox expire">
				<view class="boxleft">
					<view class="number">￥<text>100</text></view>
					<view>满￥10000使用</view>
				</view>
				<view class="boxright">
					<view class="title">新用户满减</view>
					<view class="daytime">2020/02/23~2020/12/23</view>
					<view class="guoqi">已过期</view>
				</view>
			</view>
		</view> -->
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
					{
						state: 0,
						text: '可用',
						loadingType: 'more',
						page: 1,
						recordList: []
					},
					{
						state: 1,
						text: '已失效',
						loadingType: 'more',
						page: 1,
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
				
				if (source === 'tabChange' && navItem.loaded === true) {
					//tab切换只有第一次需要加载数据
					return;
				}
				if (navItem.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				
				navItem.loadingType = 'loading';
				
				let recordList = that.$api.request('mall/api/coupon/queryList', {
					page: navItem.page,
					limit: 10,
					isUse: navItem.state === 0 ? 0 : 2 
				}).then(res => {
					navItem.page = res.page.page + 1
					navItem.loadingType = res.page.page < res.page.totalPages ? 'more' : 'noMore'
					res.page.records.forEach(item => {
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
			},
			//领取优惠券
			obtainCoupon(index) {
				const that = this
				let couponItem = that.navList[0].recordList[index]
				if (couponItem.isUse === 0) {
					that.$api.request('mall/api/coupon/receive', {
						couponId: couponItem.couponId
					}, 'POST').then(res => {
						that.navList[0].recordList[index].isUse = 1
						that.$api.msg('领取成功')
					})
				}
			},
			naviageToPage(item) {
				let url = '/pages/product/list?tid=0'
				if (item.useType === 2) {
					url = '/pages/product/list?tid=' + item.categoryId
				} else if (item.useType === 3) {
					url = '/pages/product/detail?id=' + item.goodsId
				}
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>
<style lang='scss'>
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	.swiper-box {
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
					border-bottom: 4upx solid $base-color;
				}
			}
		}
	}
	.coupon{
		padding: 120upx 20upx 20upx;
	}
	.listbox{
		position: relative;
		display: flex;
		margin-bottom: 20upx;
		
		.boxleft{
			flex: 1;
			background-color: #fcefef;
			border: 1upx solid #f4bdbc;
			border-right: 1upx dashed #f4bdbc;
			border-radius: 10upx;
			padding: 20upx;
			text-align: center;
			color: #e93323;
			font-size: 28upx;
			line-height: 50upx;
			
			.number{
				margin-top: 10upx;
				height: 80upx;
				line-height: 80upx;
				text{
					font-size: 50upx;
				}
			}
		}
		.boxright{
			flex: 2;
			background-color: #fefafa;
			border: 1upx solid #f4bdbc;
			border-left: none;
			border-radius: 10upx;
			padding: 20upx;
			color: #333;
			line-height: 50upx;
			.title{
				font-size: 28upx;
			}
			.daytime{
				font-size: 24upx;
				color: #999;
			}
			.gouse{
				margin-top: 5upx;
				.usebtn{
					display: inline-block;
					font-size: 24upx;
					color: #fff;
					background-color: #ea4053;
					border-radius: 40upx;
					height: 46upx;
					line-height: 46upx;
					padding: 0 30upx;
				}
			}
		}
	}
	.expire{
		.boxleft{
			background-color: #f3f3f3;
			border: 1upx solid #ddd;
			border-right: 1upx dashed #ddd;
			color: #333333;
		}
		.boxright{
			background-color: #f7f7f7;
			border: 1upx solid #ddd;
			border-left: none;
			
			.guoqi{
				margin-top: 5upx;
				font-size: 26upx;
				height: 46upx;
				line-height: 46upx;
				color: #999;
			}
		}
	}
	
</style>
