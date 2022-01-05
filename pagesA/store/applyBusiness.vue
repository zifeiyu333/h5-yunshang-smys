<template>
	<view class="content">
		<view class="mask" v-if="store.isCheck === 1">
			<cmd-result-page src="../../static/HWuSTipkjJRfTWekgTUG.svg" text="等待审核" subtext="已提交申请"></cmd-result-page>
		</view>
		<view class="box-cont" >
			<view class="row b-b">
				<text class="tit">LOGO</text>
				<view style="width:100%" @click="changeLogo">
					<cmd-avatar v-if="store.logoUrl" :src="store.logoUrl" ></cmd-avatar>
					<cmd-avatar v-else src="https://kaipusi.cn/static/shop.png"></cmd-avatar>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<view class="row b-b">
				<text class="tit">店铺名</text>
				<view class="name"><input v-if="store.isCheck === 0 || store.isCheck === 3" type="text" placeholder="店铺名" v-model="store.storeName" maxlength="50"/><text v-else>{{store.storeName}}</text></view>
			</view>
			<view class="row b-b">
				<text class="tit">店铺类型</text>
				<view class="tips_left">
					<picker @change="bindPickerChange" :value="index" :range="storeTypeArray" range-key="dictName">
						<view class="uni-input">{{storeTypeArray[index].dictName}}</view>
					</picker>
				</view>
				<view class="eosfont eos-enter jiantou"></view>
			</view>
			<view class="row b-b"> 
				<text class="tit">营业时间</text>
				<input class="input" type="text" v-model="store.businessHours" placeholder="营业时间(如:上午9:00 - 晚上12点)" placeholder-class="placeholder" maxlength="20"/>
			</view>
			<view class="row b-b">
				<text class="tit">人均价格</text>
				<input class="input" type="digit" v-model="store.averagePrice" placeholder="人均价格" placeholder-class="placeholder" confirm-type="done" maxlength="999999"/>
			</view>
			<view class="row b-b">
				<text class="tit">QQ</text>
				<input class="input" type="number" v-model="store.qq" placeholder="联系人QQ" placeholder-class="placeholder" maxlength="20"/>
			</view>
			<view class="row b-b">
				<text class="tit">微信</text>
				<input class="input" type="text" v-model="store.wx" placeholder="联系人微信号" placeholder-class="placeholder" maxlength="30"/>
			</view>
			<view class="row b-b"> 
				<text class="tit">姓名</text>
				<view class="name"><input v-if="store.isCheck === 0 || store.isCheck === 3" class="input" type="text" v-model="store.contactName" placeholder="联系人姓名" placeholder-class="placeholder" maxlength="10"/><text v-else>{{store.contactName}}</text></view>
			</view>
			<view class="row b-b"> 
				<text class="tit">手机号</text>
				<view class="name"><input v-if="store.isCheck === 0 || store.isCheck === 3" class="input" type="number" v-model="store.contactPhone" placeholder="联系人手机号" placeholder-class="placeholder" maxlength="12"/><text v-else>{{store.contactPhone}}</text></view>
			</view>
			<view class="row b-b">
				<text class="tit">城市</text>
				<view class="tips_left" @click="showMulLinkageThreePicker" v-if="store.isCheck === 0 || store.isCheck === 3">
					<text>{{store.locationAreaname}}</text>
				</view>
				<view class="tips_left" v-else>
					<text>{{store.locationAreaname}}</text>
				</view>
				<text class="yticon icon-shouhuodizhi"></text>
			</view>
			<view class="row b-b">
				<text class="tit">地址</text>
				<view class="tips_left" @click="goPage" v-if="store.isCheck === 0 || store.isCheck === 3">
					<text>{{store.locationDetail}}</text>
				</view>
				<view class="tips_left" v-else>
					<text>{{store.locationDetail}}</text>
				</view>
				<text class="yticon icon-shouhuodizhi"></text>
			</view>
			<view class="row b-b"> 
				<text class="tit">备注</text>
				<input class="input" type="text" v-model="store.remark" placeholder="请填写审核备注(该信息不展示)" placeholder-class="placeholder" maxlength="125"/>
			</view>
			<view class="appraise-body">
				<view class="textbox">
					<textarea placeholder="请输入介绍..." v-model="store.introduction" class="appraise-textare" />
				</view>
			</view>
			<view style="padding-left:30rpx;padding-top:30rpx;" v-if="store.isCheck === 3">
				<text style="color:#f00;">认证未通过原因：{{store.checkRemarks}}</text>
			</view>
			<view style="padding-left:30rpx;padding-top:30rpx;padding-bottom:30rpx" v-if="store.isCheck === 2">
				<text style="color:#00aa00;">已审核通过</text>
			</view>
			<button class="add-btn" @click="confirm" v-if="store.isCheck === 0 || store.isCheck === 3">提交</button>
			<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>
		</view>
	</view>
</template>

<script>
	import cmdAvatar from '@/components/cmd-avatar/cmd-avatar.vue';
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	import cmdResultPage from '@/components/cmd-result-page/cmd-result-page.vue';
	export default {
		data() {
			return {
				cityPickerValueDefault: [0, 0, 1],
				store: {
					isCheck: 0,
					id: '',
					logoUrl:'',
					contactName: '',
					contactPhone: '',
					businessHours: '',
					averagePrice: '',
					locationProvinceId: '',
					locationCityId: '',
					locationCountyId: '',
					locationAreaname: '选择省/市/区',
					locationDetail: '请选择详细地址',
					lng:'',
					lat:'',
					introduction: '',
					remark: '',
				},
				storeTypeArray: [],
				msg: '',
				index: 0
			}
		},
		components: {
		    mpvueCityPicker,
			cmdAvatar,
			cmdResultPage
		},
		onLoad(option){
			uni.showLoading({
            	title: '正在加载'
            })
			this.$api.request('base/api/dict/getChildByCode/STORE_TYPE', {
			}).then(res => {
				this.storeTypeArray = res.data
				this.imgs = []
			})
			this.$api.request('mall/api/store/getMyStoreInfo', {
			}).then(res => {
				if (res.code === 200) {
					this.store = res.data
					uni.hideLoading()
				}
			})
		},
		methods: {
			changeLogo(){
				const that = this
				that.$api.uploadImg((res => {
					that.store.logoUrl = res
				}))
			},
			bindPickerChange: function(e) {
				this.index = e.target.value
			},
			goPage(){
				var _this = this
				uni.chooseLocation({
					success: function (res) {
						console.log('res',res)
						console.log('位置名称：' + res.name);
						_this.store.locationDetail = res.address +res.name
						_this.store.lng=res.longitude
						_this.store.lat=res.latitude
						console.log('经度：' + res.longitude);
						console.log('纬度：' + res.latitude);
						console.log('详细地址：' + _this.store.locationDetail);
					}
				});
			},
			onConfirm(e) {
				var label=e.label
				this.store.locationAreaname = label
				this.store.locationProvinceId = e.value[0]
				this.store.locationCityId = e.value[1]
				this.store.locationCountyId = e.value[2]
				// var labelArr=label.split('-');
				// this.store.addressProvince=labelArr[0];
				// this.store.addressCity=labelArr[1];
				// this.store.addressArea=labelArr[2];
			},
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			//提交
			confirm(){
				const that = this
				if(!that.store.storeName){
					this.$api.msg('请填写店铺名称');
					return;
				}
				if(!that.store.businessHours){
					this.$api.msg('请填写店铺营业时间');
					return;
				}
				if(!that.store.averagePrice){
					this.$api.msg('请填写人均价格');
					return;
				}
				if(that.store.averagePrice <= 0){
					this.$api.msg('人均价格必须大于0');
					return;
				}
				if(!that.store.contactName){
					this.$api.msg('请填写联系人姓名');
					return;
				}
				if(!that.store.qq){
					this.$api.msg('请填写联系人qq');
					return;
				}
				if(!that.store.wx){
					this.$api.msg('请填写联系人微信');
					return;
				}
				if(!/(^1[2|3|4|5|6|7|8|9][0-9]{9}$)/.test(that.store.contactPhone)){
					that.$api.msg('请输入正确的手机号码');
					return
				}
				if(that.store.locationAreaname === '选择省/市/区'){
					this.$api.msg('请选择省/市/区');
					return;
				}
				if(that.store.locationDetail === '请选择详细地址'){
					that.$api.msg('请选择详细地址');
					return
				}
				that.store.storeType = that.storeTypeArray[that.index].dictCode
				that.$api.request('mall/api/store/apply', {
					...that.store,
				}, 'POST', "application/json").then(res => {
					uni.showToast({
						title: '提交成功！',
						icon: 'success',
						duration: 2000,
						mask: true
					});
					setTimeout(function(){
						uni.navigateBack()
					},2000)
				})
			},
		},
	}
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
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.appraise-body {
		padding: 0 30rpx;
		background: #fff;
	}
	.textbox{
		border-bottom: 1upx solid #f8f8f8;
		border-top: 1upx solid #f8f8f8;
		padding: 20upx 0;
	}
    .appraise-textare {
    	height: 200upx;
    	font-size: 28upx;
    	line-height: 34upx;
    	width: 100%;
    	box-sizing: border-box;
    }
	.tips_left{
		width: 94%;
		font-size: 28upx;
		color: #de7d67;
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
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
