<template>
	<view class="page">
		<view class="appraise-body appraise-uploader" style="margin-top: 16upx;">
			<view class="uni-uploader">
				<view class="uni-uploader-head">
					<view class="changetitle">选择分类</view>
					<view class="uni-uploader-title pickerbox">
						<picker @change="bindPickerChange" :value="index" :range="feedbackArray" range-key="dictName">
							<view class="uni-input">{{feedbackArray[index].dictName}}</view>
						</picker>
					</view>
					<view class="eosfont eos-enter jiantou"></view>
				</view>
				<view class="appraise-body">
					<view class="textbox">
						<textarea placeholder="请输入问题..." v-model="information" class="appraise-textare" />
					</view>
				</view>
			</view>
		</view>
		
		<view class="appraise-body appraise-uploader">
			<view class="uni-uploader">
				<view class="uni-uploader-head">
					<view class="uni-uploader-title">拍一下</view>
					<view class="uni-uploader-info">{{imgs.length}}/8</view>
				</view>
				<view class="uni-uploader-body">
					<view class="uni-uploader__files">
						<block v-for="(image,imgIndex) in imgs" :key="imgIndex">
							<view class="uni-uploader__file" style="position: relative;">
								<image class="uni-uploader__img" :src="image + '?x-oss-process'" @tap="previewImage"></image>
								<view class="close-view" @click="close(index, imgIndex)">x</view>
							</view>
						</block>
						<view class="uni-uploader__input-box" v-show="imgs.length < 8">
							<view class="uni-uploader__input" @tap="chooseImg(index)"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
        
        <button class="appraise-submit" @tap="send">提交</button>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                stars: [1, 2, 3, 4, 5],
                imageList: [],
				feedbackArray: [],
				index: 0,
				information: '',
				imgs: []
            }
        },
        onLoad(option) {
            const that = this
			uni.showLoading({
            	title: '正在加载'
            })
			that.$api.request('base/api/dict/getChildByCode/FEEDBACK', {
			}).then(res => {
				this.feedbackArray = res.data
				this.imgs = []
				uni.hideLoading()
			})
        },
        methods: {
            close(index, imgIndex){
                this.imgs.splice(imgIndex,1);
            },
			bindPickerChange: function(e) {
				this.index = e.target.value
			},
            chooseImg(index) { //选择图片
				const that = this
                that.$api.uploadImg((res => {
					this.imgs.push(res)
				}))
            },
            previewImage() { //预览图片
                uni.previewImage({
                    urls: this.imgs
                });
            },
            send() { //发送反馈
                const that = this
				if(!that.information){
					this.$api.msg('请填写反馈信息');
					return;
				}
				that.$api.request('id/api/feedback/save', {
					information: that.information,
					type : that.feedbackArray[that.index].dictId,
					imgUrl : that.imgs
				},'POST','application/json').then(res => {
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
            }
        }
    }
</script>

<style lang="scss">
    page, .content{
    	background: $page-color-base;
    	height: 100%;
    }
	@font-face {
    	font-family: uniicons;
    	font-weight: normal;
    	font-style: normal;
    	src: url('https://img-cdn-qiniu.dcloud.net.cn/fonts/uni.ttf') format('truetype');
    }
    view{
        font-size: 28upx;
    }
    .input-view {
        font-size: 28upx;
    }
    .close-view{
        text-align: center;line-height:14px;height: 16px;width: 16px;border-radius: 50%;background: #FF5053;color: #FFFFFF;position: absolute;top: -6px;right: -4px;font-size: 12px;
    }
    /* 上传 */
    .uni-uploader {
    	flex: 1;
    	flex-direction: column;
    }
    .uni-uploader-head {
    	display: flex;
    	flex-direction: row;
    	justify-content: space-between;
		align-items: center;
		padding: 20upx 0;
    }
	.uni-uploader-title{
		color: #333;
	}
	.changetitle{
		width: 130upx;
	}
	.pickerbox{
		width: calc(100% - 200upx);
		text-align: right;
	}
	.jiantou{
		color: #B2B2B2;
		font-size: 24upx;
	}
    .uni-uploader-info {
    	color: #B2B2B2;
    }
    .uni-uploader-body {
    	margin-top: 16upx;
    }
    .uni-uploader__files {
    	display: flex;
    	flex-direction: row;
    	flex-wrap: wrap;
    }
    .uni-uploader__file {
    	margin: 10upx;
    	width: 210upx;
    	height: 210upx;
    }
    .uni-uploader__img {
    	display: block;
    	width: 210upx;
    	height: 210upx;
    }
    .uni-uploader__input-box {
    	position: relative;
    	margin:10upx;
    	width: 208upx;
    	height: 208upx;
    	border: 2upx solid #D9D9D9;
    }
    .uni-uploader__input-box:before,
    .uni-uploader__input-box:after {
    	content: " ";
    	position: absolute;
    	top: 50%;
    	left: 50%;
    	-webkit-transform: translate(-50%, -50%);
    	transform: translate(-50%, -50%);
    	background-color: #D9D9D9;
    }
    .uni-uploader__input-box:before {
    	width: 4upx;
    	height: 79upx;
    }
    .uni-uploader__input-box:after {
    	width: 79upx;
    	height: 4upx;
    }
    .uni-uploader__input-box:active {
    	border-color: #999999;
    }
    .uni-uploader__input-box:active:before,
    .uni-uploader__input-box:active:after {
    	background-color: #999999;
    }
    .uni-uploader__input {
    	position: absolute;
    	z-index: 1;
    	top: 0;
    	left: 0;
    	width: 100%;
    	height: 100%;
    	opacity: 0;
    }
    
    /*问题反馈*/
    .appraise-title {
    	display: flex;
    	flex-direction: row;
    	justify-content: space-between;
    	align-items: center;
    	padding: 20upx;
    	color: #6f6f74;
		background-color: #FFFFFF;
    	font-size: 28upx;
    }
    .appraise-star-view.appraise-title {
    	justify-content: flex-start;
    	margin: 0;
    }
    .appraise-quick {
    	position: relative;
    	padding-right: 40upx;
    }
    .appraise-quick:after {
    	font-family: uniicons;
    	font-size: 40upx;
    	content: '\e581';
    	position: absolute;
    	right: 0;
    	top: 50%;
    	color: #bbb;
    	-webkit-transform: translateY(-50%);
    	transform: translateY(-50%);
    }
    .appraise-body {
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
    .appraise-input {
    	font-size: 34upx;
    	height: 50upx;
    	min-height: 50upx;
    	padding: 15upx 20upx;
    	line-height: 50upx;
    }
    .appraise-uploader {
    	padding: 0 20upx;
    }
    .appraise-star {
    	font-family: uniicons;
    	font-size: 40upx;
    	margin-left: 6upx;
    }
    .appraise-star-view {
    	margin-left: 20upx;
    }
    .appraise-star:after {
    	content: '\e408';
    }
    .appraise-star.active {
    	color: #FFB400;
    }
    .appraise-star.active:after {
    	content: '\e438';
    }
    .appraise-submit {
    	width: 670upx;
    	height: 76upx;
    	line-height: 76upx;
    	border-radius: 50px;
    	margin-top: 30upx;
    	background: $uni-color-primary;
    	color: #fff;
    	font-size: $font-lg;
    	
    	&:after {
    		border-radius: 100px;
    	}
    }
	/* 单条商品 */
	.goods-box-single {
		display: flex;
		padding: 20upx;

		.goods-img {
			display: block;
			width: 120upx;
			height: 120upx;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 0 30upx 0 24upx;
			overflow: hidden;

			.title {
				font-size: $font-base;
				color: $font-color-dark;
				line-height: 1;
			}

			.attr-box {
				font-size: $font-sm;
				color: $font-color-light;
				padding: 10upx 12upx;
			}

			.price {
				font-size: $font-base;
				color: $font-color-dark;

				&:before {
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
	}
</style>
