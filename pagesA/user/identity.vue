<template>
	<view class="content">
		<view class="mask" v-if="identityCheckStatus === 1">
			<cmd-result-page src="../../static/HWuSTipkjJRfTWekgTUG.svg" text="等待审核" subtext="已提交申请"></cmd-result-page>
		</view>
		<view class="box-cont" >
			<view class="row b-b">
				<view class="name"><input type="text" v-if="identityCheckStatus === 0 || identityCheckStatus === 3" placeholder="请输入姓名" v-model="realName" maxlength="50"/><text v-else>{{realName}}</text></view>
			</view>
			<view class="row b-b">
				<view class="name"><input type="text" v-if="identityCheckStatus === 0 || identityCheckStatus === 3" placeholder="请输入身份证号码" v-model="idCardNo" maxlength="50"/><text v-else>{{idCardNo}}</text></view>
			</view>
			<view class="idbox">
				<view class="idboxTitle">身份证照片(正面)</view>
				<view class="idboxConten">
					<view class="idboxConten_left" @click="uploadIdentityImg('front')" v-if="identityCheckStatus === 0 || identityCheckStatus === 3">
						<image src="/static/camera.png"></image>
						<view class="idboxConten_left_text">选择身份证照片</view>
					</view>
					<view class="idboxConten_right">
						<image v-if="idCardFront" :src="idCardFront" mode="aspectFill" />
						<image v-else src="/static/idcard1.png"></image>
					</view>
				</view>
				<view class="idboxTitle">身份证照片(背面)</view>
				<view class="idboxConten">
					<view class="idboxConten_left" @click="uploadIdentityImg('reverse')" v-if="identityCheckStatus === 0 || identityCheckStatus === 3">
						<image src="/static/camera.png"></image>
						<view class="idboxConten_left_text">选择身份证照片</view>
					</view>
					<view class="idboxConten_right">
						<image v-if="idCardReverse" :src="idCardReverse" mode="aspectFill" />
						<image v-else src="/static/idcard2.png"></image>
					</view>
				</view>
			</view>
			<view style="padding-left:30rpx;padding-top:30rpx;" v-if="identityCheckStatus === 3">
				<text style="color:#f00;">认证未通过原因：{{identityCheckRemarks}}</text>
			</view>
			<button class="add-btn" @click="confirm" v-if="identityCheckStatus === 0 || identityCheckStatus === 3">提交</button>
		</view>
	</view>
</template>

<script>
import cmdResultPage from '@/components/cmd-result-page/cmd-result-page.vue';
export default {
	data() {
		return {
			realName: '',
			idCardNo: '',
			idCardFront: '',
			idCardReverse: '',
			identityCheckStatus: 0,
			identityCheckRemarks: '',
			numberError: false,
			time: ''
		};
	},
	onLoad(options) {
		this.realName = options.realName === undefined ? '' : options.realName
		this.idCardNo = options.idCardNo === undefined ? '' : options.idCardNo
		this.idCardFront = options.idCardFront === undefined ? '' : options.idCardFront
		this.idCardReverse = options.idCardReverse === undefined ? '' : options.idCardReverse
		this.identityCheckStatus = options.identityCheckStatus === undefined ? 0 : (options.identityCheckStatus * 1)
		this.identityCheckRemarks = options.identityCheckRemarks === undefined ? '' : options.identityCheckRemarks
	},
	onShow() {
		
	},
	components: {
		cmdResultPage
	},
	methods: {
		//提交
		confirm(){
			const that = this
			if(!that.realName){
				this.$api.msg('请填写真实姓名');
				return;
			}
			if(!that.idCardNo){
				this.$api.msg('请填写身份证号码');
				return;
			}
			if ((!/[0-9]{18}/.test(that.idCardNo))) {
				this.$api.msg('身份证号码格式不正确');
				return;
			}
			if(!that.idCardFront){
				this.$api.msg('请上传身份证正面');
				return;
			}
			if(!that.idCardReverse){
				this.$api.msg('请上传身份证反面');
				return;
			}
			uni.showLoading({
				title: '提交中...',
				mask: true
			})
			that.$api.request('id/api/person/identity', {
				realName: that.realName,
				idCardNo: that.idCardNo,
				idCardFront: that.idCardFront,
				idCardReverse: that.idCardReverse
			}, 'PUT', "application/x-www-form-urlencoded").then(res => {
				uni.hideLoading()
				uni.showToast({
					title: '等待审核中！',
					success() {
						setTimeout(function() {
							uni.redirectTo({
								url: '/pages/user/user'
							})
						}, 2000);
					}
				});
			}).catch(res => {
				this.$api.msg(res.msg)
			})
		},
		uploadIdentityImg(type){
			const that = this
			that.$api.uploadImg((res => {
				that.avatar = res
				// 判断图片类型
				if (type === 'front') {
					that.idCardFront  = res
				} else {
					that.idCardReverse  = res
				}
			}))
		}
	}
};
</script>

<style lang="scss">
page{
	background: $page-color-base;
	padding-top: 16upx;
}
.row{
	display: flex;
	align-items: center;
	position: relative;
	padding:0 30upx;
	height: 110upx;
	background: #fff;
	.input{
		flex: 1;
		font-size: 50upx;
		color: $font-color-dark;
	}
	.icon-shouhuodizhi{
		font-size: 36upx;
		color: $font-color-light;
	}
}
.homeRight{
	width: 100%;
	height:100%;
}
.content{
	font-size: 28upx
}

.add-btn{
	display: flex;
	align-items: center;
	justify-content: center;
	width: 690upx;
	height: 80upx;
	margin: 30upx auto;
	font-size: $font-lg;
	color: #fff;
	background-color: $base-color;
	border-radius: 10upx;
	box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
}
.name input{
	width: 100%;
	height:40upx;
	line-height: 40upx;
	float:left;
	font-size: 28upx;
}
 textarea{
	font-size: 28upx;
}

.idboxTitle{
	background-color: #FFFFFF;
	padding-left: 30upx;
	width: 100%;
	height: 80upx;
	line-height: 80upx;
	color: #333333;
}
.idboxConten{
	width: 100%;
	/* height: 230upx; */
	background-color: #FFFFFF;
	border-radius: 10upx;
	padding: 26upx 0;
	display: flex;
}
.idboxConten_left{
	width: 200upx;
	height: 200upx;
	margin-left: 30upx;
}
.idboxConten_left image{
	width: 120upx;
	height: 100upx;
	margin-left: 40upx;
	margin-top: 20upx;
}
.idboxConten_left_text{
	width: 100%;
	height: 40upx;
	margin-top: 20upx;
	text-align: center;
	color: #333333;
}
.idboxConten_right{
	width: 320upx;
	height: 200upx;
	margin-left: 90upx;
}
.idboxConten_right image{
	width: 100%;
	height: 100%;
}
/* .mask{
	top: 0;
	left: 0;
	background: #F5F5F5;
	width: 100%;
	height: 100vh;
	position: absolute;
	z-index: 1000;
} */
</style>
