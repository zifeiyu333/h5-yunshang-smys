<template>
	<view>
	</view>
</template>

<script>
	export default {
		onLoad(option) {
			if (option.alipayId && option.goodsPrice && option.weituoLogCode) {
				const authUrl = 'alipays://platformapi/startapp?appId=20000123&actionType=scan&biz_data={"s": "money","u": "'+option.alipayId+'","a": "'+option.goodsPrice+'","m":"委托订单编号:'+option.weituoLogCode+'"}'
				window.location = authUrl
			} else {
				window.location = '/pages/index/index'
			}
		},
		methods: {
		}
	}
</script>