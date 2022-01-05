<template>
	<view class="container">
		<view class="row b-b">
			<text class="tit">头像</text>
			<view style="width:100%" @click="changeAvatar">
				<cmd-avatar v-if="avatar" :src="avatar" ></cmd-avatar>
				<cmd-avatar v-else src="/static/missing-face.png"></cmd-avatar>
			</view>
			<text class="yticon icon-you"></text>
		</view>
		<view class="row b-b">
			<text class="tit">昵称</text>
			<input class="input" type="text" v-model="nickName" />
		</view>
		<view class="row b-b">
			<text class="tit">性别</text>
			<view>
			    <radio-group style="text-align:center" @change="genderRadioChange">
			    <label v-for="(item, index) in genders" :key="item.value">
			        <radio :value="item.value + ''" :checked="index === gender" style="margin:10upx"/>{{item.name}}
			    </label>
			</radio-group>
			</view>
		</view>
		<view class="row b-b">
			<text class="tit">联系电话</text>
			<text class="attest-yes">{{phone}}</text>
			<text class="yticon icon-you"></text>
		</view>
		
		<view class="row b-b m-top20">
			<text class="tit">支付宝</text>
			<input class="input" type="text" v-model="alipayCode" />
		</view>
		<view class="row b-b">
			<text class="tit">银行卡</text>
			<input class="input" type="text" v-model="bankCode" />
		</view>
		<view class="row b-b">
			<text class="tit">开户行</text>
			<input class="input" type="text" v-model="bank" />
		</view>
		
		<view class="row b-b m-top20" @click="navTo('/pagesA/user/identity')">
			<text class="tit">实名认证</text>
			<text class="attest-no" v-if="identityCheckStatus === 0 ">未认证</text>
			<text class="attest-no" v-if="identityCheckStatus === 1 ">待审核</text>
			<text class="attest-yes" v-if="identityCheckStatus === 2 ">已通过</text>
			<text class="attest-no" v-if="identityCheckStatus === 3 ">认证未通过</text>
			<text class="yticon icon-you"></text>
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import cmdAvatar from '@/components/cmd-avatar/cmd-avatar.vue';
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import {  
	    mapState,  
	    mapMutations  
	} from 'vuex';  
	export default {
		components: {
			neilModal,
			cmdAvatar
		},
		data() {
			return {
				avatar: '',
				nickName: '',
				phone: '',
				gender: 0,
				alipayCode: '',
				bankCode: '',
				bank: '',
				idCardNo: '',
				idCardFront: '',
				idCardReverse: '',
				identityCheckStatus: 0,
				identityCheckRemarks: '',
				genders: [{name: '保密', value: 0 },{name: '男', value: 1}, {name: '女', value: 2}]
			};
		},
		computed:{
			...mapState(['userInfo']),
		},
		onLoad() {
			this.$api.request('id/api/person/getPersonInfo', {}).then(res => {
				if (res.code === 200) {
					const data = res.data
					this.avatar = data.avatar
					this.nickName = data.nickName
					this.phone = data.phone
					this.gender = data.gender
					this.alipayCode = data.alipayCode
					this.bankCode = data.bankCode
					this.bank = data.bank
					this.realName = data.realName === undefined ? '' : data.realName
					this.idCardNo = data.idCardNo === undefined ? '' : data.idCardNo
					this.idCardFront = data.idCardFront === undefined ? '' : data.idCardFront
					this.idCardReverse = data.idCardReverse === undefined ? '' : data.idCardReverse
					this.identityCheckStatus = data.identityCheckStatus === undefined ? 0 : data.identityCheckStatus
					this.identityCheckRemarks = data.identityCheckRemarks === undefined ? '' : data.identityCheckRemarks
				}
			})
		},
		methods: {
			changeAvatar(){
				const that = this
				that.$api.uploadImg((res => {
					that.avatar = res
				}))
			},
			//提交
			confirm(){
				const that = this
				if(!that.nickName){
					this.$api.msg('请填写昵称');
					return;
				}
				uni.showLoading({
					title: '提交中...',
					mask: true
				})
				that.$api.request('id/api/person/updatePersonInfo', {
					avatar: that.avatar === undefined ? '' : that.avatar,
					nickName: that.nickName === undefined ? '' : that.nickName,
					gender: that.gender === undefined ? 0 : that.gender,
					alipayCode: that.alipayCode === undefined ? '' : that.alipayCode,
					bankCode: that.bankCode === undefined ? '' : that.bankCode,
					bank: that.bank === undefined ? '' : that.bank
				}, 'PUT', "application/x-www-form-urlencoded").then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '保存成功！',
						icon: 'success',
						duration: 2000,
						mask: true
					});
				})
			},
			genderRadioChange(e) {
				this.gender = parseInt(e.detail.value)
			},
			// confirmGender() {
			// 	const that = this
			// 	if (that.gender === undefined) {
			// 		that.$api.msg('请选择性别')
			// 		return
			// 	}
			// 	let obj = {
			// 		gender: that.gender
			// 	}
			// 	that.$api.request('user', 'syncUserInfo', obj).then(res => {
			// 		that.userInfo.gender = that.gender
			// 	})
			// },
			navTo(url){
				url = url + '?realName='+this.realName + '&idCardNo=' + this.idCardNo + '&idCardFront=' + this.idCardFront + '&idCardReverse=' + this.idCardReverse
				 + '&identityCheckStatus=' + this.identityCheckStatus + '&identityCheckRemarks=' + this.identityCheckRemarks
				uni.navigateTo({  
					url
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
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
			width: 160upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.attest-yes{
			font-size: 28upx;
			width: 100%;
			color: #999;
		}
		.attest-no{
			font-size: 28upx;
			width: 100%;
			color: #f00;
		}
		.icon-you{
			font-size: 36upx;
			color: $font-color-light;
		}
	}

	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

</style>
