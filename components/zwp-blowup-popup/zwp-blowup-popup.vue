<template>
	<view v-if="isRender" @touchmove.stop.prevent="$event.stopPropagation()">
		<view :class="['zwp-blowup-popup-mask', isShow ? 'zwp-blowup-popup-show' : '']" :style="maskComStyles" @tap="$emit('maskClick')" />
		<view ref="main" :class="['zwp-blowup-popup-main', isShow ? 'zwp-blowup-popup-show' : '']" :style="mainComStyles"><slot /></view>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation')
const { windowWidth, windowHeight } = uni.getSystemInfoSync()
// #endif

/**
 * zwp-blowup-popup 类似手机app打开动画的popup（从app的位置开始，由小变大）
 * @link https://ext.dcloud.net.cn/plugin?id=3255
 * @property {String} selector 绑定元素的id，必填
 * @property {Boolean} everyTimeQuery 是否每次显示都重新获取节点信息
 * @property {Object} maskStyles 为蒙层添加样式
 * @property {Object} aniBeforeStyles 为弹出层的内容部分添加样式
 * @property {Object} aniAfterStyles 为弹出层的内容部分添加样式，在显示之后、放大之前添加到元素上
 * @property {Number} duration 单位ms，popup过渡动画时间
 * @property {String} timingFn popup过渡动画速度曲线
 * @event {Function} change 当popup显示/隐藏时触发，注意，是动画结束之后才触发的，event.detail = { value }
 * @event {Function} maskClick 点击蒙层触发事件
 */

export default {
	name: 'zwp-blowup-popup',

	props: {
		selector: {
			type: String,
			required: true
		},
		everyTimeQuery: {
			type: Boolean,
			default: false
		},
		maskStyles: {
			type: Object,
			default: () => ({})
		},
		aniBeforeStyles: {
			type: Object,
			default: () => ({})
		},
		aniAfterStyles: {
			type: Object,
			default: () => ({})
		},
		duration: {
			type: Number,
			default: 300
		},
		timingFn: {
			type: String,
			default: 'ease-in-out'
		}
	},

	data() {
		return {
			isRender: false,
			isShow: false,
			initStyles: {},
			completeStyles: {}
		}
	},

	computed: {
		maskComStyles() {
			return {
				position: 'fixed',
				bottom: 0,
				top: 0,
				left: 0,
				right: 0,
				backgroundColor: 'rgba(0, 0, 0, 0.3)',
				zIndex: 998,
				...this.maskStyles
			}
		},
		mainComStyles() {
			return {
				// #ifndef APP-NVUE
				transitionDuration: this.duration + 'ms',
				transitionTimingFunction: this.timingFn,
				// #endif
				...this.aniBeforeStyles,
				...this.initStyles,
				...this.completeStyles
			}
		}
	},

	methods: {
		getNodeInfo(selector) {
			return new Promise(resolve => {
				uni.createSelectorQuery()
					.select(selector)
					.boundingClientRect(nodeRef => resolve(nodeRef))
					.exec()
			})
		},
		setAnimation(refName, styles) {
			return new Promise(resolve => {
				animation.transition(
					this.$refs[refName].ref,
					{
						styles,
						duration: this.duration,
						timingFunction: this.timingFn
					},
					resolve
				)
			})
		},
		async open() {
			if (!this.initStyles.width || this.everyTimeQuery) {
				const { top, left, width, height } = await this.getNodeInfo(`#${this.selector}`)
				const { windowTop } = uni.getSystemInfoSync()
				this.initStyles = {
					transform: `translate(${left}px, ${top + windowTop}px)`,
					width: width + 'px',
					height: height + 'px'
				}
			}
			this.isRender = true
			this.$nextTick(() => {
				setTimeout(() => {
					this.isShow = true
					// #ifndef APP-NVUE
					this.completeStyles = {
						transform: `translate(0, 0)`,
						width: '100vw',
						height: '100vh',
						...this.aniAfterStyles
					}
					setTimeout(() => {
						this.$emit('change', {
							detail: {
								value: true
							}
						})
					}, this.duration)
					// #endif
					// #ifdef APP-NVUE
					this.setAnimation('main', {
						transform: `translate(0, 0)`,
						width: windowWidth + 'px',
						height: windowHeight + 'px',
						...this.aniAfterStyles
					}).then(() => {
						this.$emit('change', {
							detail: {
								value: true
							}
						})
					})
					// #endif
				}, 50)
			})
		},
		close() {
			const handleClose = () => {
				this.isShow = false
				setTimeout(() => {
					this.isRender = false
					this.$emit('change', {
						detail: {
							value: false
						}
					})
				}, 300)
			}
			// #ifndef APP-NVUE
			this.completeStyles = {}
			setTimeout(handleClose, this.duration)
			// #endif
			// #ifdef APP-NVUE
			this.setAnimation('main', this.initStyles).then(handleClose)
			// #endif
		}
	}
}
</script>

<style scoped>
.zwp-blowup-popup-mask,
.zwp-blowup-popup-main {
	transition-property: opacity;
	transition-duration: 0.3s;
	transition-timing-function: ease-in-out;
	opacity: 0;
}

.zwp-blowup-popup-show {
	opacity: 1;
}

.zwp-blowup-popup-main {
	position: fixed;
	top: 0;
	left: 0;
	background-color: #fff;
	overflow: hidden;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	z-index: 999;
	transition-property: all;
	/* #endif */
}
</style>
