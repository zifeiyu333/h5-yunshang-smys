<template>
	<view class="container">
		<view class="content">
			<view class="titlebox">
				<view class="title">{{detail.gonggaoName}}</view>
				<view class="daytime">{{(detail.addTime * 1000) | dateFormat}}</view>
			</view>
		</view>
		<view class="detail-desc">
			<rich-text :nodes="detail.gonggaoDesc"></rich-text>
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
			this.$api.request(`api/pk/gonggao/info/${options.id}`, {
			}).then(res => {
				res.data.gonggaoDesc = res.data.gonggaoDesc.replace(/\<img/gi, '<img style="max-width:100%;height:auto"')
				this.detail = res.data
			})
		},
		methods: {
			onShareAppMessage() {
				return {
					title: '水墨云商-' + this.detail.title,
					imageUrl: this.detail.adImg,
					path: `/pages/news/detail?id=${this.detail.id}`
				}
			}
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
