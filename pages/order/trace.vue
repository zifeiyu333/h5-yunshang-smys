<template>
	<view class="content">
		<ali :state="data.traces.deliverystatus" :datas="data.traces.list" :ways="data.traces" :orderAddress = "data.orderAddress"></ali>
	</view>
</template>

<script>
import ali from '@/components/WuLiu-step.vue';
export default {
	components: {
		ali
	},
	data() {
		return {
			data: {
				traces: {},
				orderAddress: {}
			}
		};
	},
	onLoad(option) {
		const that = this
		uni.showLoading({
			title: '正在查询'
		})
		that.$api.request('mall/api/myOrder/delivery', {
			orderSn : option.ordersn
		}).then(res => {
			uni.hideLoading()
			that.data.orderAddress = res.orderAddress
			that.data.traces = res.data
		}).catch(res => {
			uni.hideLoading()
			that.$api.msg(res.msg)
		})
	},
	methods: {
		
	}
};
</script>

<style>
.content {
}
</style>
