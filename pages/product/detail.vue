<template>
	<view class="container">
		<view class="carousel">
			<swiper-item class="swiper-item">
				<view class="image-wrapper">
					<image :src="goods.goodsImg" class="loaded" mode="aspectFill" @tap="_previewImage(goods.goodsImg)"/>
					<view class="yongJin" v-if="goods.stock === 0">已售完</view>
					<view class="yongJin" v-else-if="cateInfo.isStart === 1 && goods.isNoBuy === 1">已售完</view>
				</view>
			</swiper-item>
		</view>

		<view class="introduce-section">
			<view class="toptitle">
				<text class="title">{{goods.goodsName}}</text>
			</view>
			<view class="price-box">
				<view>
					<text class="price" v-if="goods.goodsPrice>0">¥{{ goods.goodsPrice }}</text>
				</view>
			</view>
		</view>
		
		<!-- 团购分享 -->
		<view class="share-section">
			<view class="tit">此商品归属人：
				<text v-if="goods.guishuNickname">{{goods.guishuNickname}}</text>
				<text v-else>平台</text>
			</view>
		</view>
		
		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<parser :html="goods.goodsDesc"></parser>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom" @click="buy">
			<view v-if="cateInfo.isStart === 1">
				立即购买
			</view>
			<view v-if="cateInfo.isStart === 0">
				<text>距离开始还有</text>
				<text class="price-tip"></text>
				<uni-countdown 
					color="#ffffff"
					splitor-color="#ffffff"
					background-color="#FA436A" 
					border-color="#FA436A" 
					:show-day="false"
					:hour="cateInfo.hour"
					:minute="cateInfo.minute" 
					:second="cateInfo.second"
					@timeup="start"
					:reset="reset">
				</uni-countdown>
			</view>
			<view v-if="cateInfo.isStart === -1">
				已经结束
			</view>
		</view>
		
		<!-- 规格-模态层弹窗 -->
		<view class="popup mask" :class="specFlag ? 'show' : 'none'" catchtouchmove="true">
			<!-- 遮罩层 -->
			<view class="mask" v-if="specFlag" @click="specFlag = false"></view>
			<view class="layer attr-content">
				<view class="a-t">
					<view class="title">
						委托代卖协议
					</view>
				</view>
				<view class="attr-list">
					<scroll-view class="list-scroll-content" scroll-y >
						<view style="width: 100%;">
							请务必认真阅读和理解本协议，平台将依据以下条件和条款为会员(下称“ 您”)提供服务。您在确认页面点击“同意并确认”按钮，将表示您完全同意并接受本协议的全部内容，并同意接受本协议的相应约束。欢迎阅读平台委托代卖协议(下称“本协议”)。本协议阐述之条款和条件适用于您使用平台所提供的代卖服务和收藏服务(下称“服务”)。
							
							一、定义
							1.代卖:平台接受您的委托，按照您指定的价格代为销售您收藏或者购买的艺术作品。
							
							二、代卖内容
							2.代卖场所:平台和平台线下实体店
							3.代卖艺术作品:艺术作品属于您已经在平台购买、不再收藏或者以其他方式所得的，且版权、所有权没有任何争议的合法资产。艺术作品的具体名称、作者、规格、数量等信息在平台相关环节另行确定。
							
							三、作品要求
							4.您应当确保您对您委托平台代卖的作品享有相应的权利，您不得在平台，上销售以下作品: 
							4.1国家禁止或限制的;
							4.2侵犯他人知识产权或其它合法权益的;
							4.3平台规则、公告、通知或各平台与您单独签署的协议中已明确说明不适合在平台上销售及/或提供的。
							5.您委托平台代卖的作品，不得包含如下内容和信息:
							5.1违反宪法所确定的基本原则的
							5.2危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的;
							5.3损害国家荣誉和利益的;
							5.4煽动民族仇恨、民族歧视、破坏民族团结的;
							5.5破坏国家宗教政策，宣扬邪教和封建迷信的;
							5.6散布谣言，扰乱社会秩序，破坏社会稳定的;
							5.7散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的;
							5.8侮辱或者诽谤他人，侵害他人合法权利的;
							5.9煽动非法集会、结社、游行、示威、聚众扰乱社会秩序的;
							5.10以非法民间组织名义活动的;
							5.11含有虚假、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容;
							5.12含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或杰止的其它内容的
							6.您违反本协议或相关的服务条款的规定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，应当由您承担赔偿责任。
							7.您有义务确保委托平台代卖的艺术品为真迹，并不存在瑕疵(在委托平台代卖时明确、详细、全面指出作品瑕疵的除外)。
							
							四、用户资格
							8.您确认，在您开始注册程序使用平台服务前，您应当具备中华人民共和国法律规定的与您行为相适应的民事行为能力。若您不具备前述与您行为相适应的民事行为能力，则您及您的监护人应依照法律规定承担因此而导致的一切后果。
							9.此外，您还需确保您不是任何国家、国际组织或者地域实施的贸易限制、制裁或其他法律、规则限制的对象，否则您可能无法正常注册及使用平台服务。
							
							五、代卖费用
							10.平台为您代卖作品，您需要支付的费用包括但不限于:托管费、保管费、保险费、第三方支付费用、邮递费等其他必要费用。
							11.托管费为代卖物品销售价格的百分之四。
							12..上述托管费为不含税价格。需要平台开具发票时需要在.上述托管费的价格.上加收相应税款。
							13.您通过第三方支付平台收取代卖费用时，根据第三方平台要求自行支付手续费。
							
							六、售后保障
							16.您应当对委托平台代卖的物品承担质量保障责任。物品售出后，若购买方因包括但不限于产品质量问题等原因，要求平台进行退、换货,或者要求平台承担其他法律责任的，则相关法律责任有您直接承担。
							17.若因您委托平台代卖的作品存在违法、违规导致他人损失，或者侵犯他人权益的，您将直接对外承担相关法律责任。
							
							七、双方权责义务
							18.您拥有委托平台代卖艺术品的所有权、定价权、处分权。
							19.您对委托代卖的艺术品价格要求调整时，应及时通知到平台，并按照平台的要求说明价格调整的原因。您在委托平台代卖次日起的任何时间，如不再委托平台代卖，或因您调价致使委托代卖的艺术品一定时间内销售不出去，平台将根据具体情况将被委托代卖的艺术品寄回给您，您将承担代管期间的保管费用和邮寄费。
							20.平台对合作期间您所提供的产品资料、商业信息等予以保密，如出现外漏情况，平台将承担全部责任。
							
							八、补充协议
							21.由于互联网高速发展，您与平台签署的本协议列明的条款并不能完整罗列并覆盖您与平台所有权利与义务，现有的约定也不能保证完全符合未来发展的需求。因此，平台法律声明及隐私权政策、平台规则均为本协议的补充协议，与本协议不可分割且具有同等法律效力。如您使用平台服务，视为您同意上述补充协议。
							.22.委托代卖时，售出的产品所有权发生转移，您同意本协议则视为产品可以暂由平台保管，您自己保管的需要在交易后一个工作日内联系工作人员进行交割。
							23.委托代卖的时效为十天，十天后平台将不再承担保管义务，由于收货地址错误或者非平台原因造成不能送达的责任由委托人承担，委托时效过后,平台将按照5元/天收取保管费用，保管费用将从委托代卖的金额中扣除。
							
							九、责任限制
							24.平台依照法律规定履行基础保障义务，但对于下述原因导致的合同履行障碍、履行瑕疵、履行延后或履行内容变更等情形，平台并不承担相应的违约责任:
							(一)因自然灾害、罢工、暴乱、战争、
							政府行为、司法行政命令等不可抗力因素; (二)因电力供应故障、通讯网络 故障等公共服务因素或第三人因素;
							(三)在平台已尽善意管理的情况
							下，因常规或紧急的设备与系统维护、设备与系统故障、网络信息与数据安全等因素。
							
							十、赔偿责任
							25.如您的行为使平台及或其关联公司遭受损失(包括自身的直接经济损失、商誉损失及对外支付的赔偿金、和解款、律师费、诉讼费等间接经济损失)，您应赔偿平台及/或其关联公司的上述全部损失。
							26.如您的行为使平台及或其关联公司遭受第三人主张权利，平台及/或其关联公司可在对第三人承担金钱给付等义务后就全部损失向您追偿。
							27.如因您的行为使得第三人遭受损失，平台及/或其关联公司出于社会公共利益保护或消费者权益保护目的，可自.行或者指示第三方支付公司自您的平台账户中划扣相应款项进行支付。如您的账户余额或保证金不足以支付相应款项的，您同意委托平台使用自有资金代您支付上述款项,您应当返还该部分费用并赔偿因此造成平台的全部损失。28.您同意平台指示自行或者指示第三方支付公司自您的平台账户中划扣相应款项支付上述赔偿款项。如您平台账户中的款项不足以支付上述赔偿款项的，平台及或关联公司可直接抵减您在平台及/或其关联公司其它协议项下的权益，并可继续追偿。
							
							十一、有效联系方式
							29您在注册成为平台用户，并接受平台服务时，您应该向平台提供真实有效的联系方式(包括您的电子邮件地址、联系电话、联系地址等)，对于联系方式发 生变更的，您有义务及时更新有关信息，并保持可被联系的状态。
							30.您在注册平台用户时生成的用于登陆平台接收站内信、系统消息和即时信息的会员账号(包括子账号)，也作为您的有效联系方式。
							31.平台将向您的上述联系方式的其中之一或其中若干向您送达各类通知，而此类通知的内容可能对您的权利义务产生重大的有利或不利影响，请您务必及时关注。
							
							十二、通知的送达
							32.平台通过上述联系方式向您发出通知，其中以电子的方式发出的书面通知，包括但不限于在平台公告，向您提供的联系电话发送手机短信，向您提供的电子邮件地址发送电子邮件，向您的账号发送信息、系统消息以及站内信信息，在发送成功后即视为送达;以纸质载体发出的书面通知，按照提供联系地址交邮后的第五个自然日即视为送达。
							33.对于在平台上因交易活动引起的任何纠纷，您同意司法机关(包括但不限于人民法院)可以通过手机短信、电子邮件等现代通讯方式或邮寄方式向您送达法律文书(包括但不限于诉讼文书)。您指定接收法律文书的手机号码、电子邮箱等联系方式为您在平台注册、更新时提供的手机号码、电子邮箱联系方式以及在注册平台用户时生成即时通讯账号，司法机关向.上述联系方式发出法律文书即视为送达。您指定的邮寄地址为您的法定联系地址或您提供的有效联系地址。
							34.您同意司法机关可采取以上一种或多种方式向您送达法律文书，送达时间以上述送达方式中最先送达的为准。35.您同意.上述送达方式适用于各个司法程序阶段。如进入诉讼程序的，包括但不限于一审、二审、再审、执行以及督促程序等。
							36.你应当保证所提供的联系方式是准确、有效的，并进行实时更新。如果因提供的联系方式不确切，或不及时告知变更后的联系方式，使法律文书无法送达或未及时送达，由您自行承担由此可能产生的法律后果。
							
							十三、法律适用、管辖与其他
							37.本协议之订立、生效、解释、修订、补充、终止、执行与争议解决均适用中华人民共和国大陆地区法律;如法律无相关规定的，参照商业惯例及/或行业惯例。
							38.您因使用平台服务所产生及与平台服务有关的争议,由平台与您协商解决。协商不成时，任何一-方均可向平台住所地有管辖权的人民法院提起诉讼。
							39本协议任一条款被视为废止、无效或不可执行，该条应视为可分的且并不影响本协议其余条款的有效性及可执行性。
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from '@/components/uni-number-box.vue'
	import parser from "@/components/jyf-parser/jyf-parser"
	import { mapState } from 'vuex'
	import share from '@/components/share'
	import uniCountdown from '@/components/uni-countdown/uni-countdown.vue'
	export default {
		components: {
			uniNumberBox,
			parser,
			share,
			uniCountdown
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		data() {
			return {
				goods: {
					freightTemplate: undefined,
					appraisePage: undefined,
				},
				domain: this.$api.defConfig().domain,
				cateInfo: {
					hour: 0,
					minute: 0,
					second: 0,
				},
				reset: true,
				level: 1,
				inviter: null,
				goodsId: 0,
				imageList: [],
				submiting: false,
				specFlag: false,
				canvasFlag: true,
				modalShow: false,
				posterBase64: '',
				posterData: {}
			};
		},
		onReady() {},
		onShow() {
			if (this.hasLogin) {
				this.submiting = false
			} else {
				uni.navigateTo({
					url: '/pages/public/login'
				})
			}
		},
		onLoad(options) {
			const that = this
			that.goodsId = options.id
			if (!that.goodsId) {
				this.$api.msg('未找到该商品！')
				return
			}
			that.inviter = options.inviter
			if (that.inviter) {
				uni.setStorageSync('inviter', that.inviter)
			}
			if (options.scene) {
				const scenes = decodeURIComponent(options.scene).split('&')
				that.goodsId = scenes[0]
				if (scenes.length > 1) {
					uni.setStorageSync('inviter', scenes[1])
				}
			}
			that.$api.request('api/pk/goods/info' + '/' + that.goodsId).then(res => {
				if (res.code === 200) {
					that.goods = res.data
					wx.setNavigationBarTitle({
					  title: that.goods.goodsName
					})
					that.cateInfo = res.cateInfo
				}
			}).catch(res => {
				that.$api.msg(res.msg)
			})
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			//点击图片显示大图
			_previewImage(image) {
				var imgArr = [];
				imgArr.push(image);
				//预览图片
				uni.previewImage({
					urls: imgArr,
					current: imgArr[0]
				});
			},
			start() {
				this.cateInfo.isStart = 1
			},
			buy() {
				if (this.cateInfo.isStart === 0) {
					this.$api.msg('还未开始！')
					return
				}
				if (this.cateInfo.isStart === -1) {
					this.$api.msg('已经结束！')
					return
				}
				if (this.goods.stock === 0) {
					this.$api.msg('商品已售完！')
					return
				}
				if (this.cateInfo.isStart === 1 && this.goods.isNoBuy === 1) {
					this.$api.msg('商品已售完！')
					return
				}
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/public/login'
					})
				} else {
					if (!this.goodsId) {
						this.$api.msg('未找到该商品！')
						return
					}
					const that = this
					if (that.submiting) {
						return
					}
					if (!this.specFlag) {
						this.specFlag = true
						return 
					}
					uni.showLoading({
						title: '数据校验中...'
					})
					that.submiting = true
					
					this.specFlag = false
					that.$api.request('api/pk/order/submitConfirm', {goodsId: that.goodsId}, 'POST', 'application/json').then(res => {
						setTimeout(function(){
							uni.hideLoading()
						},500)
						uni.navigateTo({
							url: `/pages/order/create?submitCode=` + res.submitCode + '&goodsId=' + that.goodsId
						})
					}).catch(res => {
						uni.hideLoading()
						that.submiting = false
						that.$api.msg(res.msg)
					})
					
				}
			}
		},

	}
</script>


<style lang='scss'>
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.list-scroll-content {
		height: 100%;
	}
	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}
	.yongJin{
		position: absolute;
		left: 37%;
		top: 40%;
		z-index: 1;
		width: 200upx;
		height: 200upx;
		line-height: 200upx;
		text-align: center;
		padding: 0 10upx;
		font-size: 40upx;
		color: #fff;
		border-radius: 100upx 100upx 100upx 100upx;
		background-color: rgba(60, 55, 55, 0.3);
	}
	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;


		.toptitle {
			display: flex;
			align-items: center;
			margin-right: -30upx;

			.title {
				display: inline-block;
				width: calc(100% - 145upx);
				font-size: 32upx;
				color: $font-color-dark;
				/* height: 50upx; */
				line-height: 50upx;
				margin-right: 15upx;
			}

			.sharebox {
				display: inline-block;
				width: 130upx;
				/* font-size: 24upx; */
				height: 52upx;
				line-height: 52upx;
				background-color: #f5f5f5;
				border-radius: 30rpx 0 0 30rpx;
				color: #999;
				text-align: center;

				button {
					color: #999;
					height: 52upx;
					line-height: 52upx;
					font-size: 26upx;

					text {
						margin-left: 10upx;
					}
				}

			}
		}


		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20upx 0;
			font-size: 26upx;
			color: $uni-color-primary;
		}

		.price {
			font-size: $font-lg + 2upx;
		}
		
		.exclusive{
			font-size: 26rpx;
			margin-right: 5upx
		}
		.upgrade{
			background-color: #fffce1;
			border-radius: 10upx;
			height: 50upx;
			font-size: 22upx;
			line-height: 50upx;
			padding: 0 20upx;
			margin-bottom: 10upx;
			text{
				color: #f00;
				margin-left: 5upx;
			}
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}
	}

	/* 分享 */
	.share-section {
		height: 60upx;
		display: flex;
		align-items: center;
		color: $font-color-base;
		padding: 12upx 30upx;

		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;

			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background: $uni-color-primary;
			}
		}

		.icon-xingxing {
			position: relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}

		.tit {
			font-size: 30upx;
			margin-left: 10upx;
			text{
				color: #f00;
			}
		}

		.icon-bangzhu1 {
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}

		.share-btn {
			flex: 1;
			text-align: right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}

		.icon-you {
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}

	.brokerage {
		font-size: $font-sm;
		color: $font-color-base;
	}
	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
				font-weight: 700;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;
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

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			text-align: center;
			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}

			.title {
				display: flex;
				flex-direction: column;
				padding-top: 24upx;
				font-size: $font-sm + 16upx;
				color: #000000;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
			height: 80%;
			bottom: 60upx;
		}

		.item-list {
			padding: 30upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 2;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 80upx;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 20upx;
			width: 100%;
			height: 80%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 20upx;
		z-index: 9;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background-color: $base-color;
		color: #fff;
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: #fff;
			width: 96upx;
			height: 80upx;

			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			margin-left: 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}


	/* 优惠券列表 */
	.coupon-item {
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;

		.con {
			display: flex;
			align-items: center;
			position: relative;
			height: 180upx;
			padding: 0 30upx;

			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}

		.left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}

		.title {
			font-size: $font-base;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}

		.time {
			font-size: 24upx;
			color: $font-color-light;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}

		.price {
			font-size: 44upx;
			color: $base-color;

			&:before {
				content: '￥';
				font-size: 34upx;
			}
		}

		.tips {
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}

		.circle {
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;

			&.r {
				left: auto;
				right: -6upx;
			}
		}
	}

	.rich-img {
		width: 100%;
		height: auto;
		margin: 0;
		padding: 0;
		line-height: 0px;
	}


	button::after {
		border: none;
	}

	/* 按钮去掉边框 */
	button::after {
		border: none;
	}

	button {
		margin-left: 0;
		margin-right: 0;
		padding-left: 0;
		padding-right: 0;
		line-height: 1;
		color: #1c1c1c;
		font-size: 28rpx;
		background: none;
	}

	.button-hover {
		color: #1c1c1c;
		background: none;
	}

	.share-pro {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex-direction: column;
		z-index: 99;
		line-height: 1;
		box-sizing: border-box;

		.share-pro-mask {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background: rgba(0, 0, 0, 0.5);
			z-index: 20;
		}

		.share-pro-dialog {
			width: 100%;
			padding: 60upx 0;
			overflow: hidden;
			background-color: #fff;
			border-radius: 24rpx 24rpx 0px 0px;
			position: relative;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
			z-index: 99;

			.close-btn {
				padding: 20rpx 15rpx;
				position: absolute;
				top: 0rpx;
				right: 29rpx;
			}

			.share-pro-body {
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				font-size: 28rpx;
				color: #1c1c1c;

				.share-item {
					height: 140upx;
					width: 200upx;
					text-align: center;

					.eosfont {
						font-size: 70rpx;
						margin-bottom: 30rpx;
						color: #42ae3c;
					}

					&:nth-child(2) {
						.eosfont {
							color: #ff5f33;
						}
					}
				}
			}
		}

		/* 显示或关闭内容时动画 */

		.open {
			transition: all 0.3s ease-out;
			transform: translateY(0);
		}

		.close {
			transition: all 0.3s ease-out;
			transform: translateY(310rpx);
		}

	}

	.canvas {
		position: fixed !important;
		top: 0 !important;
		left: 0 !important;
		display: block !important;
		width: 100% !important;
		height: 100% !important;
		z-index: 10;
	}
	.proxyBox{
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20upx 0 10upx;
		
		.proxyList{
			flex: 1;
			text-align: center;
			
			.eosfont{
				font-size: 46upx;
			}
			.eos-financial{
				font-weight: bold;
				color: $uni-color-blue;
			}
			.eos-redpacket{
				color: $uni-color-green;
			}
			.eos-reward{
				color: $uni-color-error;
			}
			.eos-gold{
				font-weight: bold;
				color: $uni-color-warning;
			}
			.proxyText{
				font-size: 24upx;
				color: #999;
				margin-top: 10upx;
			}
		}
	}
	
	.modal_wrap{
		width:100%;
		height:100%;
		position:fixed;
		top:0;
		left:0;
		z-index: 100;
		background:rgba($color: #000000, $alpha: 0.6);
		.modal_con{
			width:80%;
			height:90%;
			position:absolute;
			top:50%;
			left:50%;
			transform: translate(-50%, -50%);
			image{
				width:100%;
				height:90%;
			}
			.confirm-btn{
				margin:50upx auto 0;
				display: block;
				width:450upx;
				padding: 0 40upx;
				height: 60upx;
				line-height: 60upx;
				border-radius: 50upx;
				background: $uni-color-primary;
				color: #fff;
				font-size: 30upx;
			
				&:after {
					border-radius: 100px;
				}
			}
			.close{
				/* position:absolute;
				top:-25upx;
				right:-35upx;
				width:50upx;
				height:50upx;
				border-radius: 50%;
				 */
				position: absolute;
				top:-40upx;
				right:-50upx;
				z-index:99;
				font-size: 55upx;
				color: #fff;
				/* &:after{
					width:50upx;
					height:3px;
					background:#fff;
					content:'';
					display:block;
					position:absolute;
					left:0;
					top:24upx;
					transform: rotate(45deg);
				}
				&:before{
					width:50upx;
					height:3px;
					background:#fff;
					content:'';
					display:block;
					position:absolute;
					left:0;
					top:24upx;
					transform: rotate(-45deg);
				} */
			}
		}
	}
	
</style>
