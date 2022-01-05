<template>
	<view>
		<view class="an-notice-box" :style="'background-color: #fff'">
			<scroll-view class="an-notice-content">
				<swiper v-if="show" class="swiper" :autoplay="true" :interval="switchTime*1000" :duration="1500" :circular="true" :vertical="true">
					<swiper-item v-for="(item, index) in dataList" :key="index" class="an-notice-content-item">
						<view class="swiper-item">
							<text class="an-notice-content-item-text" :style="'color: '+color+';'" @click="oclick(item.gonggaoId)">
								{{item.gonggaoName}}
							</text>
						</view>
					</swiper-item>
				</swiper>
			</scroll-view>
			<!-- <view class="an-notice-content">
				<view v-for="(text, index) in list" :key="index" v-if="number == index" class="an-notice-content-item" :style="'animation: anotice '+switchTime+'s linear;'">
					<text class="an-notice-content-item-text" :style="'color: '+color+';'">
						<text v-if="showSerial">{{index+1+'. '}}</text>
						{{text}}
					</text>
				</view>
			</view> -->
			<view class="an-notice-more" @click="more">
				<text>更多 &gt;</text>
				<!-- <uni-icons type="arrowright" color="#999" size="12" /> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			text: {
				type: String,
				default: '暂无公告新闻'
			}, 
			dataList: {
				type: Array
			}, 
			color: {
				type: String,
				default: '#de8c17'
			},
			bgColor: {
				type: String,
				default: '#fffbe8'
			},
			switchTime: {
				type: Number,
				default: 3
			},
			showSerial: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				number: 0,
				copyText: '',
				show: '',
			};
		},
		mounted() {
			this.dataList = this.dataList
			this.show = true;
			/* this.number = 0;
			this.startMove(); */
		},
		watch: {
			list: function () {
				// this.show = true;
				// if(this.text != this.copyText){
				// 	this.copyText = this.text
				// 	this.list = this.text.split('|')
				// }
				/* this.number = 0;
				this.startMove(); */
			}
		},
		methods: {			
			/* startMove () {
			  // eslint-disable-next-line
			  let timer = setTimeout(() => {
				if (this.number === this.list.length-1) {
				  this.number = 0;
				} else {
				  this.number += 1;
				}
				this.startMove();
			  }, this.switchTime*1000);
			}, */
			more(){
				this.$emit('more')
			},
			oclick(id){
				this.$emit('oclick',id)
			}
		}
	}
</script>

<style>
	.swiper{
		height: 60upx!important;
	}
	.an-notice-box{
		width: 100%; 
		height: 60upx; 
		padding: 0 10upx; 
		overflow: hidden; 
		margin: 0upx 0; 
		display: flex; 
		justify-content: flex-start;
	}
	.an-notice-icon{
		width: 60upx; 
		height: 60upx; 
		line-height: 50upx; 
		text-align: center; 
		position: relative;
	}
	.an-notice-content{
		position: relative; 
		font-size: 28upx;
	}
	.an-notice-content-item{
		width: 100%; 
		height: 72upx; 
		text-align: left; 
		line-height: 72upx;
	}
	.an-notice-content-item-text{
		display: block; 
		white-space: nowrap; 
		text-overflow: ellipsis; 
		overflow: hidden;
		font-size: 28upx;
		line-height: 72upx; 
	}
	.an-notice-more{
		width: 80upx; 
		height: 72upx; 
		font-size: 24upx; 
		line-height: 72upx; 
		text-align: right; 
		color: #999;
	}
	
	@keyframes anotice {
		 0%  {transform: translateY(100%);}
	    30%  {transform: translateY(0);}
	    70%  {transform: translateY(0);}
	   100%  {transform: translateY(-100%);}
	}
</style>
