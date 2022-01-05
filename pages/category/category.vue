<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="(item,index) in flist" :key="item.id" class="f-item b-b" :class="{active: item.id === currentCategory.id}" @click="tabtap(index)">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" :scroll-top="tabScrollTop">
			<view v-for="(titem,index) in currentCategory.children" :key="titem.id">
				<view v-if="titem.children && titem.children.length > 0">
					<text class="s-item">{{titem.name}}</text>
					<view class="s-list" :id="'main-'+titem.id">
						<view class="t-list">
							<view @click="navToList(fitem.id)" class="t-item" v-for="fitem in titem.children" :key="fitem.id">
								<image :src="fitem.icon + '?x-oss-process=image/resize,m_fill,w_100,h_100'"></image>
								<text>{{fitem.name}}</text>
							</view>
						</view>
					</view>
				</view>
				<view v-if="currentCategory.findex[index] === 0">
					<view>{{change(index)}}</view>
					<text class="s-item">{{currentCategory.desc}}</text>
					<view class="s-list" :id="'main-'+currentCategory.id">
						<view class="t-list">
							<view @click="navToList(fitem.id)" v-for="(fitem, i) in currentCategory.children" :key="fitem.id" v-if="!fitem.children" class="t-item">
								<image :src="fitem.icon + '?x-oss-process=image/resize,m_fill,w_100,h_100'"></image>
								<text>{{fitem.name}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentCategory: {},
				flist: [],
				slist: []
			}
		},
		onLoad(){
			this.loadData();
		},
        watch: {
        },
		methods: {
			change(_index){
				const that = this
				that.currentCategory.findex[_index] = _index
			},
			loadData(){
				const that = this
				this.$api.request('mall/api/goods/findCategoryTree').then( res => {
					that.flist = res.data
					// debugger
					// for (var i = 0; i < that.flist.length; i++) {
					// 	that.flist[i].children.index = 0
					// 	if (that.flist[i].children && that.flist[i].children.length <= 0 && that.flist[i].children.index === 0) {
					// 		index = 1
					// 		that.flist[i].children.index = 1
					// 		break
					// 	}
					// }
					that.currentCategory = res.data[0]
					that.currentCategory.findex = []
				})
			},
			//一级分类点击
			tabtap(index){
				const that = this
				that.currentCategory = that.flist[index]
				that.currentCategory.findex = []
				this.tabScrollTop = this.tabScrollTop === 0 ? 1 : 0
			},
			navToList(tid){
				uni.navigateTo({
					url: `/pages/product/list?tid=${tid}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: $base-color;
			background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;
		
		image{
			width: 140upx;
			height: 140upx;
		}
	}
</style>
