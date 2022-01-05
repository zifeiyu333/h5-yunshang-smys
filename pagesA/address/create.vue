<template>
	<view class="content">
		
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.name" placeholder="收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.phone" placeholder="收货人手机号码" placeholder-class="placeholder" />
		</view>
		
		<view class="row b-b">
			<text class="tit">城市</text>
			<view class="tips_left" @click="showMulLinkageThreePicker">
				<text>{{addressData.areaname}}</text>
			</view>
			<text class="yticon icon-shouhuodizhi"></text>
		</view>
		<view class="row b-b"> 
			<text class="tit">地址</text>
			<input class="input" type="text" v-model="addressData.addr" placeholder="城市/街道、楼号、门牌" placeholder-class="placeholder" />
		</view>
		
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.isDefault" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
		<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	export default {
		data() {
			return {
				cityPickerValueDefault: [0, 0, 0],
				addressData: {
					userId: 0,
					addrCode: '',
					name: '',
					phone: '',
					areaname: '选择省/市/区',
					addr: '',
					isDefault: false
				},
				msg: '',
				lotusAddressData:{
					visible:false,
					provinceName:'',
					cityName:'',
					townName:'',
				},
			}
		},
		components: {
		    mpvueCityPicker
		},
		onLoad(option){
			let title = '新增收货地址';
			if(option.type==='edit'){
				title = '编辑收货地址'
				this.addressData = JSON.parse(option.data)
				this.addressData.isDefault = this.addressData.isDefault === 1
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			switchChange(e){
				this.addressData.isDefault = e.detail.value
			},
			onConfirm(e) {
				var label = e.label;
				this.pickerText = label;
				var labelArr = label.split('-');
				this.addressData.areaname = label
				this.addressData.addrCode = e.provinceCode + '-' + e.cityCode + '-' + e.countyCode
			},
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			//提交
			confirm(){
				const that = this
				let data = this.addressData;
				if(!data.name){
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if(!data.addrCode){
					this.$api.msg('请选择收获地址');
					return;
				}
				if(!/(^1[2|3|4|5|6|7|8|9][0-9]{9}$)/.test(data.phone)){
					that.$api.msg('请输入正确的手机号码');
					return
				}
				if(that.msg){
					that.$api.msg(that.msg);
					return
				}

				if(!data.addr){
					that.$api.msg('请输入详细地址');
					return
				}
				//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
				//this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
				data.isDefault = data.isDefault ? 1 : 0
				that.$api.request('api/pk/useraddr/saveOrUpdate', {
					...data,
				}, 'POST', "application/x-www-form-urlencoded").then(res => {
					if (that.$api.prePage()) {
						that.$api.prePage().refreshList(data, that.manageType)
					}
					uni.navigateBack()
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.tips_left{
		width: 94%;
		font-size: 28upx;
		color: #de7d67;
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
			width: 120upx;
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
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
