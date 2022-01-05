<template>  
    <view class="container">  
		<view class="user-section">
			<image class="bg" src="/static/user-bg.jpg"></image>
			<view class="user-info-box">
				<view class="portrait-box">
					<image class="portrait" :src="userInfo.headimgUrl || '/static/missing-face.png'"></image>
				</view>
				<view class="info-box">
					<text @click="toLogin" class="username">{{ hasLogin ? (userInfo.nickName || '未设置昵称') : '立即登录' }}</text>
				</view><br/>
				<view class="info-box">
					<text @click="bindPhone" class="username">{{ hasLogin ? (userInfo.phone || '[设置手机号]') : '' }}</text>
				</view><br/>
				<view class="info-box" v-if="hasLogin && !userInfo.openid">
					<text @click="bindWeixin" class="username">[绑定微信]</text>
				</view>
			</view>
			<view class="vip-card-box">
				<view class="tit">
					<text class="yticon icon-iLinkapp-"></text>
					<text v-if="user.isVip===1">您好，VIP会员（到期日：{{user.vipDaoqiDate}}）</text>
					<text v-else-if="user.isVip===-1">您好，VIP{{user.vipDaoqiDate}}已到期</text>
					<text v-else-if="userInfo.nickName">您好，{{userInfo.nickName}}</text>
					<text v-else>尚未登录，请先登录</text>
				</view>
<!-- 				<text class="e-m">VIP权益</text>
				<text class="e-b">{{'会员专享VIP价'}}</text> -->
			</view>
			<!-- 钱包 -->
			<view class="wallet-box">
				<view class="wallet-section">
					<!-- <view class="wallet-item wallet-first" @click="navTo('/pagesA/user/share')" hover-class="none"  :hover-stay-time="50">
						<text class="income">{{countTermInfo.totalNum}}</text>
						<text>团队人数</text>
					</view> -->
					<view class="wallet-item wallet-first" @click="navTo('/pagesA/wallet/index')" hover-class="none"  :hover-stay-time="50">
						<text class="income">{{user.rmb}}</text>
						<text>账户余额</text>
					</view>
					<view class="wallet-item" @click="navTo('/pagesA/wallet/index')" hover-class="none"  :hover-stay-time="50">
						<text class="eosfont eos-redpacket"></text>
						<text>我的钱包</text>
					</view>
				</view>
			</view>
			
		</view>
		
		<view class="cover-container" :style="[{transform: coverTransform, transition: coverTransition}]">
			<!-- <image class="arc" src="/static/arc.png"></image>
			
			<view class="tj-sction">
				<view class="tj-item">
					<text class="num">128.8</text>
					<text>余额</text>
				</view>
				<view class="tj-item">
					<text class="num">0</text>
					<text>优惠券</text>
				</view>
				<view class="tj-item">
					<text class="num">20</text>
					<text>积分</text>
				</view>
			</view> -->
			
			<!-- 订单 -->
			<view class="order-section">
				<view class="order-item" @click="navTo('/pages/order/list?status=-1')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="eosfont eos-document_fill"></text>
					<text>全部订单</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/list?status=1')"  hover-class="common-hover" :hover-stay-time="50">
					<text class="orderNum" v-if="orderInfo.unpayNum > 0">{{orderInfo.unpayNum}}</text>
					<text class="eosfont eos-paying_fill"></text>
					<text>付款确认</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/list?status=2')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="orderNum" v-if="orderInfo.payedNum > 0">{{orderInfo.payedNum}}</text>
					<text class="eosfont eos-daifahuo_fill"></text>
					<text>收款确认</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/list?status=3')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="orderNum" v-if="orderInfo.complaintNum > 0">{{orderInfo.complaintNum}}</text>
					<text class="eosfont eos-clock_fill"></text>
					<text>投诉订单</text>
				</view>
			</view>
			
			<!-- 列表 -->
			 <view class="history-section icon">
				<!-- <list-cell icon="eos-mine" title="个人资料" @eventClick="navTo('/pagesA/user/profile')"></list-cell> -->
				<list-cell icon="eos-paying" title="收款设置" @eventClick="navTo('/pages/user/collectMoney')"></list-cell>
				<list-cell icon="eos-order" title="粉丝订单" @eventClick="navTo('/pages/order/termOrderList')"></list-cell>
				<list-cell icon="eos-praise" title="粉丝推广" @eventClick="navTo('/pagesA/user/share')"></list-cell>
				<list-cell icon="eos-map" title="地址管理" @eventClick="navTo('/pagesA/address/list')"></list-cell>
				<!-- <list-cell icon="eos-prompt" title="关于" @eventClick="navToPage('/pagesA/user/about')"></list-cell> -->
				<list-cell icon="eos-editor" title="修改密码" @eventClick="navTo('/pages/user/updatePassword')"></list-cell>
				<list-cell icon="eos-delete" title="退出登录" border="" @eventClick="logout()"></list-cell>
			</view> 
		</view>
    </view>  
</template>  
<script>  
	import listCell from '@/components/mix-list-cell';
    import {  
        mapState 
    } from 'vuex';  
	let startY = 0, moveY = 0, pageAtTop = true;
    export default {
		components: {
			listCell
		},
		data(){
			return {
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				footprintList: [],
				orderInfo: {unpayNum: 0, complaintNum: 0, complaintNum: 0},
				consignment: 0,
				countTermInfo: {totalNum: 0},
				user: {isVip: 0, rmb: '0.00', totalRmb: '0.00'},
				personExtend: {integral: 0, freezeIntegral: 0, apple: '0.00', freezeIntegral: '0.00'}
			}
		},
		onShow() {
			if (this.hasLogin) {
				const that = this
				that.$api.request('api/pk/order/myOrderCount', {
				}).then(res => {
					if (res.code === 200) {
						that.orderInfo = res.data
					}
				}).catch(res => {
				})
				that.$api.request('api/pk/user/myInfo').then(res => {
					if (res.code === 200) {
						that.user = res.userInfo
						that.countTermInfo = res.countTermInfo
					}
				}).catch(res => {
					that.$api.msg(res.msg)
				})
			} else {
				uni.showModal({
					title: '登录提示',
					content: '您尚未登录，是否立即登录？',
					showCancel: true,
					confirmText: '登录',
					success: (e) => {
						if (e.confirm) {
							uni.navigateTo({
								url: '/pages/public/login'
							})
						}
					},
					fail: () => {},
					complete: () => {
					}
				})
			}
		},
		onLoad(){
		},
        computed: {
			...mapState(['hasLogin','userInfo'])
		},
        methods: {
			onShareAppMessage() {
				return {
					title: '水墨云商',
					imageUrl: 'https://kaipusi.cn/static/logo.png',
					path: '/pages/index/index?inviter=' + (this.userInfo.cardNo ? this.userInfo.cardNo : '')
				}
			},
			
			toLogin() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/public/login'
					})
				}
			},
			bindPhone() {
				if (!this.userInfo.phone) {
					uni.navigateTo({
						url: '/pages/public/updateinfo?nickName=' + this.userInfo.nickName
					})
				}
			},
			bindWeixin() {
				const that = this
				let href = window.location.origin+'/pages/user/bindWeixin'
				let page = that.$api.prePage()
				let prePath = '/pages/user/user'
				if (page) {
					prePath = page.__page__.path
				}
				window.location = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
					'appid=' + that.$api.defConfig().h5Appid + '&redirect_uri=' + escape(href) +
					'&response_type=code&scope=snsapi_userinfo&state=' + escape(prePath) + '#wechat_redirect'
			},
			logout() {
				const that = this
				uni.showModal({
					title: '询问',
					content: '您确定要退出吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: (e) => {
						if (e.confirm) {
							that.$store.commit('logout')
							that.$api.logout()
						}
					}
				})
			},

			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url){
				if(!this.hasLogin){
					url = '/pages/public/login';
				}
				uni.navigateTo({  
					url
				})
			}, 
	
			navToPage(url){
				uni.navigateTo({  
					url
				})
			}, 
			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e){
				if(pageAtTop === false){
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e){
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if(moveDistance < 0){
					this.moving = false;
					return;
				}
				this.moving = true;
				if(moveDistance >= 80 && moveDistance < 100){
					moveDistance = 80;
				}
		
				if(moveDistance > 0 && moveDistance <= 80){
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend(){
				if(this.moving === false){
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			}
        }  
    }  
</script>  
<style lang='scss'>
	%flex-center {
	 display:flex;
	 flex-direction: column;
	 justify-content: center;
	 align-items: center;
	}
	%section {
	  display:flex;
	  justify-content: space-around;
	  align-content: center;
	  background: #fff;
	  border-radius: 10upx;
	}

	.user-section{
		/* #ifdef H5 */
		height: 478upx;
		padding: 60upx 30upx 0;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		height: 520upx;
		padding: 100upx 30upx 0;
		/* #endif */
		position:relative;
		.bg{
			position:absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(1px);
			opacity: .7;
		}
	}
	.user-info-box{
		height: 180upx;
		display:flex;
		align-items:center;
		position:relative;
		z-index: 1;
		.portrait{
			width: 130upx;
			height: 130upx;
			border:5upx solid #fff;
			border-radius: 50%;
		}
		.username{
			font-size: $font-lg + 2upx;
			color: $font-color-dark;
			margin-left: 20upx;
		}
	}
	.SignIn{
		position: absolute;
		right: -30upx;
		border-radius: 30upx 0 0 30upx;
		padding: 10upx 20upx 10upx 25upx;
		background-color: #fa436a;
		font-size: 26upx;
		z-index: 2;
		color: #fff;
		
		.eos-task{
			margin-right: 10upx;
			font-size: 28upx;
		}
	}
	.vip-card-box{
		display:flex;
		flex-direction: column;
		color: #f7d680;
		height: 240upx;
		background: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.7), rgba(210, 169, 169, 0.8));
		border-radius: 16upx 16upx 0 0;
		overflow: hidden;
		position: relative;
		padding: 20upx 30upx;
		
		.card-bg{
			position:absolute;
			top: 20upx;
			right: 0;
			width: 380upx;
			height: 260upx;
		}
		.b-btn{
			position: absolute;
			right: 20upx;
			top: 16upx;
			width: 132upx;
			height: 40upx;
			text-align: center;
			line-height: 40upx;
			font-size: 22upx;
			color: #36343c;
			border-radius: 20px;
			background: linear-gradient(left, #f9e6af, #ffd465);
			z-index: 1;
		}
		.tit{
			font-size: $font-base+2upx;
			color: #f780c0;
			margin-bottom: 28upx;
			.yticon{
				color: #f6e5a3;
				margin-right: 16upx;
			}
		}
		.e-b{
			font-size: $font-sm;
			color: #d8cba9;
			margin-top: 10upx;
		}
	}
	.cover-container{
		background: $page-color-base;
		margin-top: -20upx;
		padding: 0 30upx;
		position:relative;
		background: #f5f5f5;
		padding-bottom: 20upx;
		.arc{
			position:absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}
	.tj-sction{
		@extend %section;
		.tj-item{
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: #75787d;
		}
		.num{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 8upx;
		}
	}
	.order-section{
		@extend %section;
		padding: 28upx 0;
		margin-top: 20upx;
		.order-item{
			@extend %flex-center;
			width: 120upx;
			height: 120upx;
			border-radius: 10upx;
			font-size: $font-sm;
			color: $font-color-dark;
			position: relative;
		}
		.orderNum{
			position: absolute;
			right: 10upx;
			top: 0;
			width: 40upx;
			height: 40upx;
			border-radius: 50%;
			border: 2upx solid #fa436a;
			background-color: #fff;
			text-align: center;
			line-height: 37upx;
			font-size: 22upx;
			color: #fa436a;
		}
		.eosfont{
			font-size: 48upx;
			margin-bottom: 14upx;
			color: #eb7b97;
		}
		.eos-deliver_fill, .eos-financial_fill{
			font-size: 52upx;
		}
	}
	.wallet-box{
		padding: 0 30upx;
		background-color: #f5f5f5;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 4;
		height: 98upx;
	}
	.wallet-section{
		display:flex;
		justify-content: space-around;
		align-content: center;
		background: #fff;
		border-radius: 0 0 10upx 10upx;
		padding: 25upx 0;
		margin-top: -62upx;
		
		.wallet-item{
			@extend %flex-center;
			flex:1;
			font-size: $font-sm;
			color: $font-color-dark;
		}
		.wallet-first{
			border-right: 1upx solid #eee;
		}
		.eosfont{
			font-size: 40upx;
			margin-bottom: 18upx;
			color: #f780c0;
		}
		.income{
			color: #f780c0;
			margin-bottom: 18upx;
			font-size: 34upx;
		}
	}
	.history-section{
		padding: 30upx 0 0;
		margin-top: 16upx;
		background: #fff;
		border-radius:10upx;
		.sec-header{
			display:flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;
			.eosfont{
				font-size: 38upx;
				color: #909399;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}
		.h-list{
			white-space: nowrap;
			padding: 30upx 30upx 0;
			image{
				display:inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}
	
</style>