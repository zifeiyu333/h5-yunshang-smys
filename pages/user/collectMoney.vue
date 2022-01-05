<template>
	<view class="content">
		<view class="topbox">
			<view class="superior">收款设置</view>
			<view class="myteam">
				<view class="title">风险提示</view>
				<view class="number">
					<view><text class="redcolor">委托托管属于C2C(顾客与顾客交易)，资金不经过平台，平台不会自动扣款，需要您手动自行转账给对方，对方才能收到款项。</text></view>
				</view>
			</view>
		</view>
		<view class="bottombox">
			<view class="bgbox">
				<!-- 头部 -->
				<view class="navbar">
					<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === item.state }" @click="tabClick(item.state)">
						{{ item.text }}
					</view>
				</view>
				
				<view class="mainbox" v-if="tabCurrentIndex===0">
					<view class="yt-list">
						<view class="text-center yaoqing">
							方式一
						</view>
						<view class="text-center yaoqing">
							<view v-if="userInfo.alipayId"><text class="redcolor">支付宝已绑定</text></view>
							<button class="confirm-btn" @click="toAlipay" v-else>打开支付宝绑定</button>
						</view>
					</view>
					<view class="yt-list">
						<view class="text-center">
							方式二
						</view>
						<view class="text-center yaoqing m-top20" v-if="userInfo.qrAlipay">
							<img :src="userInfo.qrAlipay"/>
							<view>
								<view>支付宝收款二维码已上传</view>
							</view>
						</view>
						<view class="text-center yaoqing m-top20" v-else>
							<img src='../../static/errorImage.jpg'/>
							<view>
								<button class="confirm-btn" @click="uploadImg(0)">上传支付宝收款二维码</button>
							</view>
							<view><text class="redcolor">只允许上传一次，请认证上传，禁止修改。</text></view>
						</view>
					</view>
				</view>
				
				<view class="mainbox" v-if="tabCurrentIndex===1">
					<view class="yt-list">
						<view class="text-center yaoqing m-top20" v-if="userInfo.qrWeixin">
							<img :src="userInfo.qrWeixin"/>
							<view class="m-top20">
								<view>微信收款二维码已上传</view>
							</view>
						</view>
						<view class="text-center yaoqing m-top20" v-else>
							<img src='../../static/errorImage.jpg'/>
							<view>
								<button class="confirm-btn" @click="uploadImg(1)">上传微信收款二维码</button>
							</view>
							<view><text class="redcolor">只允许上传一次，请认证上传，禁止修改。</text></view>
						</view>
					</view>
				</view>
				
				<view class="mainbox" v-if="tabCurrentIndex===2">
					<view class="yt-list">
						
						<view class="row b-b">
							<text class="tit">真实姓名</text>
							<input class="input" type="text" v-model="userInfo.bankName" :maxlength="4" placeholder="真实姓名" placeholder-class="placeholder" />
						</view>
						<view class="row b-b">
							<text class="tit">手机号码</text>
							<input class="input" type="number" v-model="userInfo.bankPhone" :maxlength="11" placeholder="绑定银行卡的手机号" placeholder-class="placeholder" />
						</view>
						<view class="row b-b">
							<text class="tit">银行卡号</text>
							<input class="input" type="number" v-model="userInfo.bankNum" :maxlength="22" placeholder="开户行银行卡号" placeholder-class="placeholder" />
						</view>
						<view class="row b-b">
							<text class="tit">开户行</text>
							<input class="input" v-model="userInfo.bankKaihuhang" placeholder="开户行" :maxlength="50" placeholder-class="placeholder" />
						</view>
						<button class="add-btn" @click="confirmBank">提交</button>
						<view class="yaoqing"><text class="redcolor">只允许保存一次，请认证填写，禁止修改。</text></view>
					</view>
				</view>
				
			</view>
		</view>
		<view class="wx" v-if="weixin" @click="onWeixin">

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
				domain: this.$api.defConfig().domain,
				weixin: false, //是否为微信内浏览器打开
				tabCurrentIndex: 0,
				navList: [
					{
						state: 0,
						text: '支付宝',
						loadingType: 'more',
						page: 1,
						recordList: []
					},
					{
						state: 1,
						text: '微信二维码',
						loadingType: 'more',
						page: 1,
						recordList: []
					},
					{
						state: 2,
						text: '银行卡',
						loadingType: 'more',
						page: 1,
						recordList: []
					}
				],
				userInfo: {alipayId: '', qrAlipay: '', qrWeixin: '', bankName: '', bankPhone: '', bankNum: '', bankKaihuhang: ''}
			}
		},
		onLoad() {
			this.$api.request('api/pk/user/myUserInfo', {
			}, "get").then(res => {
				this.userInfo = res.data
			})
			this.loadData()
		},
		computed: {
			...mapState(['hasLogin'])
		},
		
		methods: {
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			onWeixin() {
				this.weixin = !this.weixin
			},
			uploadImg(index) { //选择图片
				const that = this
			    that.$api.uploadImg({prefix: 'qr', type: index + ''},(res => {
					if (index === 0) {
						that.userInfo.qrAlipay = res.folder
					} else if (index === 1) {
						that.userInfo.qrWeixin = res.folder
					}
				}))
			},
			confirmBank() {
				const that = this
				let data = this.userInfo;
				if(!data.bankName){
					this.$api.msg('请填写真实姓名！');
					return;
				}
				if(!/(^1[2|3|4|5|6|7|8|9][0-9]{9}$)/.test(data.bankPhone)){
					that.$api.msg('请输入正确的手机号码');
					return
				}
				if(!data.bankNum){
					that.$api.msg('请输入开户行');
					return
				}
				if(!data.bankKaihuhang){
					that.$api.msg('请输入开户行');
					return
				}
				that.$api.request('api/pk/user/updateBank', {
					...data,
				}, 'POST', "application/x-www-form-urlencoded").then(res => {
					that.$api.msg(res.msg)
				})
			},
			toAlipay() {
				window.location = '/pages/user/bindAlipay?userCode=' + this.userInfo.userCode
			},
			async loadData(type = 'add', loading) {
				
			}
		}
	}
</script>
<style lang='scss'>
	page, .content{
		background: $page-color-base;
		.wx {
			position: fixed;
			left: -20upx;
			top: -90upx;
			background-color: rgba(0, 0, 0, .7);
			width: 100%;
			height: 100%;
			z-index: 999;
			background-image: url(../../static/wx.png);
			background-size: 100%;
			background-position: center 100upx;
			background-repeat: no-repeat;
		}
	}
	.topbox{
		background: url(../../static/teambg.png) center center no-repeat #000303;
		position: relative;
		padding: 30upx 20upx;
		height: 280upx;
		
		.superior{
			font-size: 40upx;
			color: #fff;
			padding: 0 30upx;
			text-align: center;
			margin-top: 0upx;
		}
		.myteam{
			position: absolute;
			bottom: -100upx;
			background-color: #fff;
			width: 710upx;
			margin: 0 auto;
			height: 270upx;
			padding: 20upx;
			border-radius: 10upx;
			
			.title{
				font-size: 30upx;
				line-height: 60upx;
				height: 60upx;
				color: #000;
				margin-bottom: 10upx;
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
	.navbar {
		display: flex;
		height: 100upx;
		background: #fff;
		box-shadow: 0 1upx 2upx rgba(0, 0, 0, 0.06);
		position: fixed;
		width: 100%;
		z-index: 10;
		margin-bottom: 20upx;
		margin-top: 0upx;
		
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
	
	.bottombox{
		margin-top: 50upx;
	}
	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}
	.mainbox{
		padding-top: 100upx;
	}
	.bgbox{
		border-radius: 10upx;
		background-color: #fff;
	}
	.yaoqing{
		text-align: center;
		img{
			width: 500upx;
			height: 500upx;
		}
		.redcolor {
			color: #f00;
			font-size: 28upx;
		}
		.confirm-btn {
			display: inline-block;
			padding: 0 40upx;
			height: 60upx;
			line-height: 60upx;
			border-radius: 50upx;
			margin: 20upx 20upx 0;
			background: $uni-color-primary;
			color: #fff;
			font-size: 30upx;
		
			&:after {
				border-radius: 100px;
			}
		}
	}
	
	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 180upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 40upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
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
		position: fixed;
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
