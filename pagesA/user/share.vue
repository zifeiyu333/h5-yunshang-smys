<template>
	<view class="content">
		<view class="topbox">
			<view class="superior" v-if="!teamInfo.nickName">我的上级：无</view>
			<view class="superior" v-else>我的上级：{{teamInfo.nickName}}</view>
			<view class="myteam">
				<view class="title">我的团队</view>
				<!-- <view class="number">
					<view>团队人数：<text class="redcolor">{{teamInfo.totalNum}}</text> 人</view>
				</view> -->
			</view>
		</view>
		<view class="bottombox">
			<view class="bgbox">
				<view class="yaoqing">
					<img :src='qrCode' mode="">
					<view>
						<button class="confirm-btn" @click="openPoster">专享海报</button>
					</view>
				</view>
				
				<!-- 空白页 -->
				<empty v-if="list.length === 0"></empty>
				<view class="teamlist" v-for="(item,index) in list" :key="index">
					<image :src="item.headimgUrl" class="photoimg"></image>
					<view class="right">
						<view class="name">
							<view class="teamnum">{{item.nickName}}</view>
							<view v-if="item.level < 3">级别：{{item.level}}</view>
							<view>推荐人数：{{item.tuiNum}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="modal_wrap" v-if="modalShow">
			<view class="modal_con">
				<img :src='poster' mode="aspectFit">
				<button class="confirm-btn">长安保存到相册</button>
				<view class="close eosfont eos-delete canvas_close_btn" @click="close"></view>
			</view>
		</view>
	</view>
</template>
<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import { mapMutations, mapState } from 'vuex';
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				qrCode: '',
				poster: '',
				teamInfo: {totalNum: 0, oneNum: 0, twoNum: 0, threeNum: 0},
				list: [
					// {image:'../../static/missing-face.png',name:'18767678688','tuijian':'18787780987',team:45,agent:42},
					// {image:'../../static/missing-face.png',name:'18767678688','tuijian':'18787780987',team:45,agent:42},
					// {image:'../../static/missing-face.png',name:'18767678688','tuijian':'18787780987',team:45,agent:42},
					// {image:'../../static/missing-face.png',name:'18767678688','tuijian':'18787780987',team:45,agent:42},
					// {image:'../../static/missing-face.png',name:'18767678688','tuijian':'18787780987',team:45,agent:42},
				],
				current: 1,
				loadingType: 'more', //加载更多状态
				modalShow: false
			}
		},
		onLoad() {
			this.$api.request('api/pk/user/myQrCode', {
			}, "get").then(res => {
				this.qrCode = res.data
			})
			
			this.$api.request('api/pk/user/getMyTeamInfo', {
			}, "get").then(res => {
				this.teamInfo = res.data
			})
			
			this.loadData()
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
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
					this.current = 1
				}
				this.$api.request('api/pk/user/queryTermList', {
					current: this.current,
					size: 10
				}).then(res => {
					let tempList = res.data.records
					if (type === 'refresh') {
						this.list = [];
					}
					this.list = this.list.concat(tempList);
					this.current = res.data.current + 1
					this.loadingType = res.data.totalPages > res.data.current ? 'more' : 'nomore';
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
			},
			openPoster() {
				if (this.poster) return this.modalShow = true;
				uni.showLoading({
					title: '海报生成中'
				})
				this.$api.request('api/pk/user/myPoster', {
				}, "get").then(res => {
					uni.hideLoading();
					this.poster = res.data
					this.modalShow = true;
				}).catch((res) => {
					uni.hideLoading();
					this.$api.msg(res.msg)
				})
			},
			close () {
				this.modalShow = false;
			}
		}
	}
</script>
<style lang='scss'>
	page, .content{
		background: $page-color-base;
	}
	.topbox{
		background: url(../../static/teambg.png) center center no-repeat #50bdbd;
		position: relative;
		padding: 30upx 20upx;
		height: 220upx;
		
		.superior{
			font-size: 30upx;
			color: #fff;
			padding: 0 30upx;
			margin-top: 20upx;
		}
		.myteam{
			position: absolute;
			/*bottom: -100upx;*/
			bottom: -50upx;
			background-color: #fff;
			width: 710upx;
			margin: 0 auto;
			/*height: 200upx;*/
			padding-top: 30upx;
			padding-left: 30upx;
			border-radius: 10upx;
			
			.title{
				font-size: 30upx;
				line-height: 60upx;
				height: 60upx;
				color: #000;
				margin-bottom: 30upx;
			}
			.number{
				display: flex;
				align-items: center;
				justify-content: center;
				view{
					flex: 1;
					font-size: 28upx;
					height: 40upx;
					line-height: 40upx;
					color: #666;
				}
			}
		}
	}
	.bottombox{
		/*margin-top: 100upx;*/
		margin-top: 40upx;
		padding: 20upx;
	}
	.bgbox{
		border-radius: 10upx;
		background-color: #fff;
	}
	.yaoqing{
		text-align: center;
		padding: 30upx 0;
		image{
			width: 260upx;
			height: 260upx;
		}
		.confirm-btn {
			display: inline-block;
			padding: 0 40upx;
			height: 60upx;
			line-height: 60upx;
			border-radius: 50upx;
			/* margin: 20upx 30upx 0; */
			background: $uni-color-primary;
			color: #fff;
			font-size: 30upx;
		
			&:after {
				border-radius: 100px;
			}
		}
	}
	.teamlist{
		padding: 20upx;
		display: flex;
		align-items: center;
		border-top: 1upx solid #f5f5f5;
		.photoimg{
			width: 80upx;
			height: 80upx;
			border-radius: 50%;
			border:1upx solid #f5f5f5;
			margin-right: 20upx;
		}
		.right{
			width: calc(100% - 100upx);
			.name{
				display: flex;
				align-items: center;
				justify-content: flex-start;
				
				view{
					flex: 1;
					color: #999;
					font-size: 24upx;
					line-height: 50upx;
				}
				.teamnum{
					font-size: 26upx;
					color: #000;
				}
				
			}
		}
	}
	.redcolor{
		color: #f00;
	}
	.modal_wrap{
		width:100%;
		height:100%;
		position:fixed;
		top:0;
		left:0;
		background:rgba($color: #000000, $alpha: 0.6);
		.modal_con{
			width:80%;
			height:90%;
			position:absolute;
			top:50%;
			left:50%;
			transform: translate(-50%, -50%);
			img{
				margin:80upx auto 0;
				width:100%;
				height:80%;
			}
			.confirm-btn{
				margin:40upx auto 0;
				display: block;
				width:450upx;
				padding: 0 40upx;
				height: 60upx;
				line-height: 60upx;
				border-radius: 50upx;
				background: $uni-color-primary;
				color: #fff;
				font-size: 30upx;
			
				&:after {
					border-radius: 100px;
				}
			}
			.close{
				/* position:absolute;
				top:-25upx;
				right:-35upx;
				width:50upx;
				height:50upx;
				border-radius: 50%;
				 */
				position: absolute;
				top:30upx;
				right:-50upx;
				z-index:99;
				font-size: 55upx;
				color: #fff;
				/* &:after{
					width:50upx;
					height:3px;
					background:#fff;
					content:'';
					display:block;
					position:absolute;
					left:0;
					top:24upx;
					transform: rotate(45deg);
				}
				&:before{
					width:50upx;
					height:3px;
					background:#fff;
					content:'';
					display:block;
					position:absolute;
					left:0;
					top:24upx;
					transform: rotate(-45deg);
				} */
			}
		}
	}
	
</style>
