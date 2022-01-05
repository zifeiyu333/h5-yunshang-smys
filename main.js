import Vue from 'vue'
import store from './store'
import App from './App'

import * as filters from './filters'
import * as config from './config'

Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

//#ifdef H5
let jweixin = require('./components/jweixin-module')
let jwx = require('./components/jweixin-module/jwx')
Vue.mixin({
	onShow() {
		jwx.configWeiXin(jwx => {})
	}
})
//#endif

const defConfig = config.def

const msg = (title, duration = 2000, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

let userInfo = undefined
let token = undefined

const logout = () => {
	userInfo = undefined
	uni.removeStorage({
		key: 'userInfo'
	})
}

const setUserInfo = (i) => {
	userInfo = i
}

const setToken = (i) => {
	token = i
}

const isVip = () => {
	return userInfo && userInfo.level
}

const level = () => {
	const level = uni.getStorageSync('level')
	return level
}
let loginLock = false

const request = (url, data = {}, method = "GET", contentType = "application/x-www-form-urlencoded", failCallback = false) => {
	//异步请求数据
	return new Promise(function (resolve, reject) {
		if (!token) {
			token = uni.getStorageSync('token')
		}
		let accessToken = token ? token : ''
		let baseUrl = config.def().baseUrl
		uni.request({
			url: baseUrl + '/' + url,
			data: data,
			method: method,
			header: {
				'Content-Type': contentType,
				'appid': '468037329685057536',
				'Authorization': accessToken
			},
			success: (res) => {
				if (res.statusCode === 200) {
					if (res.data.code === 200) {
						resolve(res.data)
					} else if (res.data.code === 201){
						resolve(res.data)
					} else if (res.data.code === 401) {
						logout()
						if (!loginLock) {
							loginLock = true
							uni.showModal({
								title: '登录提示',
								content: '您尚未登录，是否立即登录？',
								showCancel: true,
								confirmText: '登录',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: '/pages/public/login'
										})
									}
								},
								fail: () => {},
								complete: () => {
									loginLock = false
								}
							})
						}

					} else {
						uni.hideLoading()
						if (failCallback) {
							reject(res.data)
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							reject(res.data.msg)
						}
					}
				}
			}
		})
	})
}

const uploadImg = (formData = {}, successCallback) => {
	let baseUrl = config.def().baseUrl
	if (!token) {
		token = uni.getStorageSync('token')
	}
	let accessToken = token ? token : ''
	uni.chooseImage({
		sizeType: ['compressed'],
		success: function(res) {
			for (let i = 0; i < res.tempFilePaths.length; i++) {
				uni.showLoading({
					title: '图片上传中',
				})
				let fileName = ('imgs/' + random_string(15) + get_suffix(res.tempFilePaths[i]))
				uni.uploadFile({
					url: baseUrl + '/api/pk/file/upload',
					filePath: res.tempFilePaths[i],
					name: 'file',
					header: {
						'appid': '468037329685057536',
						'Authorization': accessToken
					},
					formData: formData,
					success: function(uploadRes) {
						uni.hideLoading()
						if (uploadRes.statusCode === 200) {
							if (successCallback) {
								successCallback(JSON.parse(uploadRes.data))
							} else {
								uni.showToast({
									title: '上传成功',
									icon: 'none'
								})
							}
						} else {
							uni.hideLoading()
							uni.showToast({
								title: '网络错误 code=' + uploadRes.statusCode,
								icon: 'none'
							})
						}
					}
				})
			}
		}
	})
}

function get_suffix(filename) {
	var pos = filename.lastIndexOf('.')
	var suffix = ''
	if (pos != -1) {
		suffix = filename.substring(pos)
	}
	return suffix;
}

function random_string(len) {
	len = len || 32;
	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	var maxPos = chars.length;
	var pwd = '';
	for (var i = 0; i < len; i++) {
		pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

const globalData = {}

Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {
	msg,
	prePage,
	request,
	uploadImg,
	logout,
	isVip,
	level,
	setUserInfo,
	setToken,
	defConfig,
	globalData
};
//#ifdef H5
Vue.prototype.$jweixin = jweixin;
//#endif

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
