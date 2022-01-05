<template>
	<view class="container">
		<view class="content">
			<view class="titlebox">
				<view class="title">用户须知</view>
			</view>
		</view>
		<view class="detail-desc">
			<view style="width: 100%;">
				尊敬的水墨云商用户:平台法务部门友情提示:本平台是一个实名制的在线委托代卖平台，建议平台所有的注册用户根据个人鉴赏能力和经济实力进行参与抢拍和消费。平台禁止使用信用卡、支付宝花呗等信用额度进行成功抢拍后的支付;线下收款时,不推荐您使用商家收款码收款,面临被第三方支付公司直接扣除收款手续费的风险;同时，平台禁止任何组织和个人假借平台的名义，进行平台以外的任何恶意代抢单、代投资、私下借贷款返息、合作抢单、代付款等行为。用户盲目听信和参与上述行为造成个人财产损失的，包括但不限于遭遇骗局，需自行承担责任并请及时报警。本平台仅提供友情提示告知，避免平台用户遭遇新型诈骗，以免个人合发财产受到损失。特此告知!
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {}
			}
		},
		onLoad(options) {
		},
		methods: {
		}
		
	}
</script>

<style lang="scss">
	.content{
		padding: 0 20upx;
		background-color: #fff;
	}
	.titlebox {
		border-bottom: 1upx solid #f5f5f5;
		padding: 20upx 0;
		
		.title {
			text-align: center;
			font-size: 50upx;
			color: #333;
			line-height: 44upx;
		}
		.daytime{
			text-align: center;
			font-size: 24upx;
			color: #999;
			margin-top: 10upx;
		}
	}
	
	/*  详情 */
	.detail-desc {
		background: #fff;
		padding: 20upx;
		width: 750upx;
	
		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
	
			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
	
			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}
	
	.rich-img {
		width: 100%;
		height: auto;
		margin: 0;
		padding: 0;
		line-height: 0px;
		image{
			max-width: 100%;
		}
	}
	
</style>
