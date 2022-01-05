
    export default class LastMayday {
      palette() {
        return ({
		  "width": "750rpx",
		  "height": "1100rpx",
		  "background": "rgba(0,0,0,0)",
		  "views": [
			{
				"type": "image",
				"url": "https://kaipusi.cn/person-poster.jpg?x-oss-process=image/resize,lfit,h_1200,w_1200/format,src",
				"css": {
				"width": "690rpx",
				"height": "450rpx",
				"top": "30rpx",
				"left": "30rpx",
				"rotate": "0",
				"borderRadius": "",
				"borderWidth": "",
				"borderColor": "#000000",
				"shadow": "",
				"mode": "scaleToFill"
				}
			},
			{
			  "type": "text",
			  "text": "1. 分享耗油忌食辛辣刺激食物\n2. 忌运动量过大\n3. 戒烟戒酒，忌暴饮暴食",
			  "css": {
				"color": "#C87756",
				"background": "rgba(0,0,0,0)",
				"width": "690rpx",
				// "height": "200rpx",
				"top": "520rpx",
				"left": "30rpx",
				"rotate": "0",
				"borderRadius": "",
				"borderWidth": "",
				"borderColor": "#000000",
				"color": "#444",
				"shadow": "",
				"padding": "0rpx",
				"fontSize": "30rpx",
				"fontWeight": "normal",
				"maxLines": "6",
				"lineHeight": "40rpx",
				"textStyle": "fill",
				"textDecoration": "none",
				"fontFamily": "",
				"textAlign": "left"
			  }
			},
			{
			  "type": "qrcode",
			  "content": "哈哈哈",
			  "css": {
				"color": "#000000",
				"background": "#ffffff",
				"width": "350rpx",
				"height": "350rpx",
				"top": "670rpx",
				"left": "200rpx",
				"rotate": "0",
				"borderRadius": "10rpx"
			  }
			},
			{
			  "type": "text",
			  "text": "扫码关注",
			  "css": {
				"color": "#C87756",
				"background": "rgba(0,0,0,0)",
				"width": "690rpx",
				"height": "40rpx",
				"top": "1050rpx",
				"right": "30rpx",
				"rotate": "0",
				"borderRadius": "",
				"borderWidth": "",
				"borderColor": "#000000",
				"color": "#333",
				"shadow": "",
				"padding": "0px",
				"fontSize": "32rpx",
				"fontWeight": "normal",
				"maxLines": "5",
				"lineHeight": "40rpx",
				"textStyle": "fill",
				"textDecoration": "none",
				"fontFamily": "",
				"textAlign": "center"
			  }
			},
		  ]
		});
      }
    }
    