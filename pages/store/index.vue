<template>
	<view>
		<view class="head-box">
			<view class="navbar"></view>
			<view class="container">
				<view class="left">
					<view class="logo">
						<image src="https://kaipusi.cn/static/logo.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="right" >
					<view class="address-box">
						<i class="hxicon-locationfill"></i>
						<text>幸福花园</text>
						<i class="hxicon-right"></i>
					</view>
					<!-- <view class="notice">
						<i class="hxicon-notice"></i>
					</view> -->
				</view>
			</view>
		</view>
		<view class="search-box">
			<!-- <view class="navbar" ></view> -->
			<view class="mp-search-box">
				<view class="ser-input" @click="naviageToPage('/pages/product/search?type=2')">
					<text class="yticon">&#xe7ce;</text>
					<input type="text" value="输入关键字搜索" disabled />
				</view>
				<!-- <view class="hx-search-box" @click="goSearch">
				    <uni-icons type="search" size="22" color="#666666" />
				    <text>输入搜索关键词</text>
				</view> -->
			</view>
		</view>
		<!-- <view class="container">
			<view class="hot-box">
				<text class="item" v-for="(item,i) in hos_list" :key="i">{{item}}</text>
			</view>
		</view> -->

		<view class="container menu-box" >
			<view class="item-box" v-for="(item,i) in menuList" :key="i">
				<image :src="item.imageUrl" mode=""></image>
				<view class="tit">
					<text>{{item.name}}</text>
				</view>
			</view>
		</view>
		<view class=" bannerimg-box">
			<swiper  circular duration="400" interval="10000" autoplay >
				<swiper-item class="swiper-item bannerImg" v-for="(item,index) in bannerData" :key="index">
					<!-- 图片尺寸为 750*250 -->
					<image :src="item.imageUrl" class="loaded" mode="widthFix"></image>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="container margin-top sort-box">
			<view class="item-box" v-for="(item,i) in sortList" :key="i">
				<view class="tit" :class="{'active': sortIndex == i}">
					<text>{{item.tit}}</text>
				</view>
			</view>
		</view>
		<view class=" store-box" v-if="storeList">
			<view class=" item-box" v-for="(store,i) in storeList" :key="i">
				<view class="container top-box">
					<view class="left" @click="toStore(store,null)">
						<image :src="store.avatar" mode="aspectFill"></image>
					</view>
					<view class="right" @click="toStore(store,null)">
						
						<text class="tit" >{{store.name}}（{{store.community}}）</text>
						<view class="row justify-content">
							<view class="row-left">
								<i class="hxicon-favorfill "></i>
								<text class="t1">{{store.mark}}</text>
								<text class="t2">月售{{store.monthly_sales}}</text>
							</view>
							<view class="row-right">
								<i class="hxicon-locationfill"></i>
								<text>{{store.distance}}</text>
							</view>
						</view>
						<view class="row">
							<text >起送￥{{store.starting_price}}</text>
							<text class="t2" v-if="store.shipping_dees > 0">配送￥{{store.shipping_dees}} </text>
							<text class="t2" v-else>免费配送</text>
						</view>
						<!-- <view class="row">
							
						</view> -->
					</view>
				</view>
				<scroll-view scroll-x  class="bottom-box">
					<view class="bottom-box-container">
						<view class="goods-box" v-for="(goods,j) in store.goods" :key="j" @click="toStore(store,goods.id)">
							<view class="img-box">
								<image :src="goods.main_pic" mode="aspectFit"></image>
								<view class="tag">
									{{goods.tag}}
								</view>
							</view>
							<view class="tit">
								{{goods.name}}
							</view>
							<view class="price-box">
								<text class="txt1">￥</text>
								<text class="txt2">{{goods.price}}</text>
								<text class="txt3">￥{{goods.old_price}}</text>
							</view>
						</view>
					</view>
					
				</scroll-view>
			</view>
		</view>
		<view class="foot" v-if="showFoot">
			<text>更多商家加入中，敬请期待</text>
		</view>
		<view class="footzw"></view>
	</view>
	
</template>

<script>
	
	//引入测试数据
	import testData from "@/common/testdata.js";
	export default {
		components:{
		},
		data() {
			return {
				//显示没有更多商户
				showFoot: 0, 
				downOption: {
					auto: false //是否在初始化后,自动执行downCallback; 默认true
				},
				menuList: [],
				bannerData:[],
				sortIndex: 0,
				sortList: [{tit:'附近商户'}, {tit:'销量'}, {tit:'速度'}, {tit:'配送费'}],
				//filterTagList: [{tit:'支持预定'}, {tit:'销量'}, {tit:'速度'}, {tit:'配送费'}] 
				storeList: [],
				hos_list:[
					'红烧排骨',
					'飞过肉',
					'野生大菠萝',
					'红烧排骨',
					'西红柿蛋汤'
				]
				
			}
		},
		onLoad() {
			let that = this;
			that.$api.request('id/api/ad/get/store_nav').then(res => {
				if (res.code === 200) {
					that.menuList = res.data
				}
			}).catch(res => {
				that.$api.msg(res.msg)
			})
			that.$api.request('id/api/ad/get/store_banner').then(res => {
				if (res.code === 200) {
					that.bannerData = res.data
				}
			}).catch(res => {
				that.$api.msg(res.msg)
			})
			this.upCallback()
		},
		mounted() {
			let that = this;
			
		},
		methods: {
			/*下拉刷新的回调 */
			downCallback() {
				let that = this;
				//联网成功的回调,隐藏下拉刷新的状态
				
				//联网失败的回调,隐藏下拉刷新的状态
				//this.mescroll.endErr();
				
			},
			upCallback() {
				let that = this;
				setTimeout(()=>{
					//加载门店数据
					that.storeList = testData.storeList;
					
					//无更多商家
					that.showFoot = true;
				},1500)
			},
			toStore(store,goodsId){
				let store_id = store.store_id
				let parameter = `?sid=${store_id}`
				
				if(goodsId != null){
					parameter += `&gid=${goodsId}`
				}
				uni.navigateTo({
					url: '/pagesA/store/home' + parameter
				})
			},
			naviageToPage(page) {
				uni.navigateTo({
					url: page
				})
			},
			//搜索
			goSearch(){
				uni.navigateTo({
					url: '/pages/search/search?type=home'
				})
			}
		}
	}
</script>

<style lang="scss">
	
	.mp-search-box {
		border-top-left-radius:50upx;
		border-top-right-radius:50upx;
		//position: fixed;
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
	
	padding: 15px 15px 12px;
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
page{
	background-color: #f8f8f8;
}
.b-b{
	position: relative;
}
 .b-b:after,
 .b-t:after {
 	position: absolute;
 	z-index: 3;
 	left: 0;
 	right: 0;
 	height: 0;
 	content: '';
 	transform: scaleY(.5);
 	border-bottom: 1px solid #E4E7ED;
 }
 
 .b-b:after {
 	bottom: 0;
 }
 .b-t:after {
 	top: 0;
 }
.container{
	margin: 0 15px;
}
.margin-top{
	margin-top: 12px;
}
.head-box{
	// padding: 14px 0;
	/* #ifdef MP */
	padding-top:2px;
	/* #endif */
	background: linear-gradient(100deg, #FFEB3B, #FFC107);
	position: relative;
	z-index: 3;
	.navbar{
		position: sticky;
		top: 0;
		//height: var(--status-bar-height);
	}
	
	.container{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 32px;
		align-items: center;
		.left{
			.logo{
				width: 32px;
				height: 32px;
				
				image{
					width: 32px;
					height: 32px;
					border-radius: 50%;
				}
			}
		}
		.con {
			width: 100%;
			position: fixed;
		}
		.right{
			display: flex;
			flex-direction: row;
			color: #333333;
			align-items: center;
			
			.address-box{
				font-size: 14px;
				//margin-right: 16px;
				display: flex;
				flex-direction: row;
				align-items: center;
				text{
					margin-left: 2px;
					margin-right: 4px;
				}
				.icon-right{
					position: relative;
					top: 2px;
				}
			}
			
			.notice{
				font-weight: bold;
				font-size: 18px;
			}
		}
		
	}
	
}
.search-box{
	position: sticky;
	top: 0;
	z-index: 2;
	background: linear-gradient(100deg, #FFEB3B, #FFC107);
	padding-top: var(--status-bar-height);
	margin-top: calc(var(--status-bar-height) * -1);
	.ctn{
		border-top-left-radius:50upx;
		border-top-right-radius:50upx;
		background: #f8f8f8;
		padding: 15px 15px 12px;
		
		.hx-search-box{
			border-radius: 40px;
			padding: 0 15px;
			height: 34px;
			display: flex;
			align-items: center;
			line-height: 44rpx;
			background-color: #eeeeee;
			flex:1;
			color: #888888;
			font-size: 14px;
		}
	}	
}
.QZBG{
	background:#ffffff;
	box-shadow: 0 1px 6px #ccc;
	.navbar{
		height: var(--status-bar-height);
	}
	.ctn{
		background:#ffffff;
		/* #ifdef MP */
		padding-top:0px;
		/* #endif */
	}
}
.hot-box{
	
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-start;
	.item{
		margin-right: 12px;
		background-color: #EEEEEE;
		color: #666666;
		font-size: 12px;
		border-radius: 20px;
		padding: 2px 6px;
		margin-bottom: 8px;
	}
	.item:last-child{
		margin-right: 0;
	}
}
.bannerimg-box{
	border-bottom-left-radius:10upx;
	border-bottom-right-radius:10upx;
	padding: 24rpx;
	swiper{
		height: 233rpx;
		width: 699rpx;
	}
	.swiper-item {
		
		display: flex;
		justify-content: center;
		align-content: center;
		overflow: hidden;
		
		width: 100%;
		height: 100%;
		image {
			border-radius: 8px;
			width: 100%;
			
		}
	}
	
}

.menu-box{
	
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 10px;
	border-radius: 8px;
	background: #ffffff;
	padding: 12px 8px;
	.item-box{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		image{
			width: 40px;
			height: 40px;
		}
		.tit{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 12px;
			margin-top: 6px;
			color: #333333;
			padding: 2px 0;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.active{
			color: #ffffff;
			background-color: #999999;
			border-radius: 60px;
		}
	}
}
.sort-box{
	display: flex;
	flex-direction: row;
	margin-top: 12px;
	.item-box{
		
		margin-right: 16px;
		.tit{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 12px;
			color: #333333;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.active{
			//color: #111111;
			font-weight: bold;
		}
	}
}
.store-box{
	margin-top: 20px;
	
	.item-box{
		display: flex;
		flex-direction: column;
		margin-bottom: 14px;
		padding-bottom: 18px;
		padding-top: 18px;
		background-color: #ffffff;
		.top-box{
			display: flex;
			flex-direction: row;
			.left{
				margin-right: 10px;
				
				
				image{
					width: 72px;
					height: 54px;
					border-radius: 6px;
				}
			}
			.right{
				flex: 1;
				.tit{
					font-size: 16px;
					font-weight: bold;
					color: #333333;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.justify-content{
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}
				.row{
					font-size: 12px;
					color: #999999;
					margin-top: 4px;
					.row-left{
						display: flex;
						flex-direction: row;
						.t1,i{
							color: #ffca3e;
						}
						
					}
					.t2{
						margin-left: 12px;
					}
					.row-right{
						display: flex;
						flex-direction: row;
						i{
							margin-right: 4px;
						}
					}
					
				}
			}
		}
		.bottom-box{
			&-container{
				margin: 12px 0 0;
				//padding-left: 82px;
				
				white-space: nowrap;
				.goods-box{
					width: 80px;
					margin-left: 12px;
					display: inline-block;
					.img-box{
						position: relative;
						width: 80px;
						height: 60px;
						background-color: #f1f1f1;
						border-radius: 4px;
						image{
							width: 100%;
							height: 60px;
						}
						.tag{
							position: absolute;
							bottom: 0;
							left: 0;
							background-color: #FF5722;
							color: #ffffff;
							padding: 2px 4px;
							font-size: 12px;
							border-radius: 4px;
						}
					}
					.tit{
						font-size: 14px;
						margin-top: 4px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.price-box{
						margin-top: 4px;
						.txt1{
							font-size: 10px;
							color: #FF5722;
						}
						.txt2{
							font-size: 16px;
							color: #FF5722;
						}
						.txt3{
							margin-left: 6px;
							font-size: 10px;
							color: #bbbbbb;
							text-decoration: line-through;
						}
					}
				}
				.goods-box:last-child{
					margin-right: 12px;
				}
				
			}
			
		}
	}
	.item-box:last-child{
		border-bottom: 0;
	}
}
.foot{
	position: relative;
	display: flex;
	justify-content: center;
	margin-top: 36px;
	margin-bottom: 50px;
	text{
		font-size: 14px;
		position: relative;
		z-index: 2;
		height: 20px;
		line-height: 20px;
		background-color: #f8f8f8;
		color: #cccccc;
		padding: 0 12px;
	}
}
.foot::before{
	content: "";
	z-index: 1;
	display: block;
	position: absolute;
	top: 50%;
	height: 0;
	width: 100%;
	transform: scaleY(0.5);
	border-bottom: 1px solid #E4E7ED;
}
.footzw{
	/* #ifdef H5*/
	height: 50px;
	/* #endif */
}

</style>
