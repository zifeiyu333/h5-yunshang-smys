<template>
	<!-- 打卡日历页面 -->
	<view class='all'>
		<view class="bar">
			<!-- 上一个月 -->
			<view class="previous" @click="handleCalendar(0)">
				<button class="barbtn" v-if="langType=='ch'">上一月</button>
				<button class="barbtn" v-else>Last</button>
			</view>
			<!-- 显示年月 -->
			<view class="date">{{cur_year || "--"}} 年 {{cur_month || "--"}} 月</view>
			<!-- 下一个月 -->
			<view class="next" @click="handleCalendar(1)">
				<button class="barbtn" v-if="langType=='ch'">下一月</button>
				<button class="barbtn" v-else>Next</button>
			</view>
		</view>
		<!-- 显示星期 -->
		<view class="week" v-if="langType=='ch'">
			<view v-for="(item,index) in weeks_ch" :key="index">{{item}}</view>
		</view>
		<view class="week" v-else>
			<view v-for="(item,index) in weeks_en" :key="index">{{item}}</view>
		</view>
		<view  class="myDateTable">
			<view v-for="(item,j) in days" :key="j" class='dateCell'>
				<view v-if="item.date==undefined||item.date == null" class='cell'>
					<text :decode="true">&nbsp;&nbsp;</text>
				</view>
				<view v-else>
					<!-- 已签到日期 -->
					<view v-if="item.isSign == true" class='cell greenColor bgWhite  '>
						<text>{{item.date}}</text>
					</view>
					<!-- 漏签 -->
					<view class="cell redColor bgGray" v-else-if="cur_year<toYear||(cur_year==toYear&&cur_month<toMonth)||(cur_year==toYear&&cur_month==toMonth&&item.date<today)">
						<!-- 小程序不兼容这个 v-else-if="(new Date(cur_year+'-'+cur_month+'-'+item.date))<(new Date())"> -->
						<text>{{item.date}}</text>
					</view>
					<!-- 今日未签到-->
					<view @click="clickSignUp(item.date,1)" class="cell whiteColor bgBlue" v-else-if="item.date==today&&cur_month==toMonth&&cur_year==toYear">
						<text>签到</text>
					</view>
					<!-- 当前日期之后 -->
					<view class="whiteColor cell" v-else>
						<text>{{item.date}}</text>
					</view>
				</view>

			</view>
		</view>
		<view class="TipArea ">
			<p>
				<u-parse className="rich-img" :content="description"></u-parse>
			</p>
		</view>
		
		<view class='count'>
			<text>截至目前，已坚持打卡</text>
			<view class='daynumber'>
				<text class='number'>{{sumCount}}</text>
				<text class='day'>天</text>
			</view>
		
			<view>本月累积打卡<text class="monthSum">{{SignUp.length}}</text>天</view>
			<text>请再接再厉，继续努力!</text>
		</view>
	</view>
</template>

<script>
	import uParse from '@/components/u-parse/u-parse.vue';
	export default {
		components: {
			uParse
		},
		data() {
			return {
				days: [],
				SignUp: [],
				cur_year: 0, //当前选的年
				cur_month: 0, //当前选的月
				toYear: parseInt(new Date().getFullYear()), //本年
				toMonth: parseInt(new Date().getMonth() + 1), //本月
				today: parseInt(new Date().getDate()), //本日
				weeks_ch: ['日', '一', '二', '三', '四', '五', '六'],
				weeks_en: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'],
				sumCount: 0,
				signData: [],
				submiting: false,
				description: ''
			};
		},
		props: {
			sendYear: {
				type: Number,
				default: new Date().getFullYear()
			},
			sendMonth: {
				type: Number,
				default: new Date().getMonth() + 1
			},
			langType: { //只是示例一个翻译而已，要想所有都翻译自己可以再加加
				type: String,
				default: "ch"
			},
		},
		created() {
			this.cur_year = this.sendYear;
			this.cur_month = this.sendMonth;

			this.calculateEmptyGrids(this.cur_year, this.cur_month);
			this.calculateDays(this.cur_year, this.cur_month);
			//获取当前用户当前任务的签到状态
			this.getData(this.toYear+"-"+this.toMonth);
			this.$api.request('id/api/signed/countSignedNum', {
			}).then(res => {
				this.sumCount = res.data
			}).catch(res => {
				this.$api.msg(res.msg)
			})
			this.$api.request('id/api/signed/getSignedRuleInfo', {
			}).then(res => {
				this.description = res.data
			}).catch(res => {
			})
		},
		watch: {
		},
		methods: {
			// 获取当月共多少天
			getThisMonthDays(year, month) {
				return new Date(year, month, 0).getDate()
			},
			// 获取当月第一天星期几
			getFirstDayOfWeek(year, month) {
				return new Date(Date.UTC(year, month - 1, 1)).getDay();
			},
			// 计算当月1号前空了几个格子，把它填充在days数组的前面
			calculateEmptyGrids(year, month) {
				//计算每个月时要清零
				this.days = [];
				const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
				if (firstDayOfWeek > 0) {
					for (let i = 0; i < firstDayOfWeek; i++) {
						var obj = {
							date: null,
							isSign: false
						}
						this.days.push(obj);
					}
				}
			},
			//获取当前用户该任务的签到数组
			getData(val) {
				this.$api.request('id/api/signed/getSignedListByYearMonth', {
					yearMonth: val
				}).then(res => {
					this.SignUp = res.data
					this.onJudgeSign();
				}).catch(res => {
					this.$api.msg(res.msg)
				})
			},
			// 绘制当月天数占的格子，并把它放到days数组中
			calculateDays(year, month) {

				const thisMonthDays = this.getThisMonthDays(year, month);
				// this.columnsLen=Math.ceil(thisMonthDays/7);
				// console.log(this.columnsLen);
				for (let i = 1; i <= thisMonthDays; i++) {
					var obj = {
						date: i,
						isSign: false
					}
					this.days.push(obj);
				}
				//console.log(this.days);

			},

			//匹配判断当月与当月哪些日子签到打卡
			onJudgeSign() {
				var signs = this.SignUp;
				var daysArr = this.days;
				for (var i = 0; i < signs.length; i++) {
					var signsJson = signs[i];
					var current = new Date(signsJson.signedDate.replace(/-/g, "/"));
					var year = current.getFullYear();
					var month = current.getMonth() + 1;
					var day = current.getDate();
					day = parseInt(day);
					for (var j = 0; j < daysArr.length; j++) {
						//年月日相同则打卡成功   						
						if (year == this.cur_year && month == this.cur_month && daysArr[j].date == day) { //&& signs[i].isSign == "今日已打卡"
							// console.log(daysArr[j].date, day);
							daysArr[j].isSign = true;
						}
					}
				}
				this.days = daysArr;
			},

			// 切换控制年月，上一个月，下一个月
			handleCalendar(type) {
				const cur_year = parseInt(this.cur_year);
				const cur_month = parseInt(this.cur_month);
				var newMonth;
				var newYear = cur_year;
				if (type === 0) { //上个月
					newMonth = cur_month - 1;
					if (newMonth < 1) {
						newYear = cur_year - 1;
						newMonth = 12;
					}
				} else {
					newMonth = cur_month + 1;
					if (newMonth > 12) {
						newYear = cur_year + 1;
						newMonth = 1;
					}
				}
				this.calculateEmptyGrids(newYear, newMonth);
				this.calculateDays(newYear, newMonth);

				this.cur_year = newYear;
				this.cur_month = newMonth;

				this.SignUp = []; //先清空
				getData(this.cur_year+"-"+this.cur_month)		
			},

			clickSignUp(date, type) { //0补签，1当日签到
				if(this.submiting) {
					return
				}
				this.submiting = true
				var str = "签到";
				if (type == 0) {//如果不需要补签功能直接在这阻止不执行后面的代码就行。
					str = "补签";
				}
				uni.showLoading({
					title: '提交中...'
				})
				var day = this.cur_year + "-" + this.cur_month + "-" + date;
				this.$api.request('id/api/signed/saveSignedRecord', {
				}, 'POST').then(res => {
					uni.hideLoading()
					if (res.code === 200) {
						this.SignUp.push({signedDate: day});
						this.sumCount++
						if (res.data.rewardType === 1){
							uni.showToast({
								title: '获得'+ res.data.integral +'积分！',
								icon: 'success',
								duration: 2000
							});
						} else {
							uni.showToast({
								title: '神秘大奖出现了，立即领取！',
								icon: 'success',
								duration: 2000
							});
						}
						//refresh
						this.onJudgeSign();
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style>
	

	.all {
		margin-top: 20rpx;
	}

	.all .bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 30rpx 20rpx;
		padding: 10rpx;
	}

	.bar .barbtn {
		height: 30px;
		line-height: 30px;
		font-size: 12px;
	}

	.all .week {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 20rpx;
		padding-left: 40rpx;
		padding-right: 40rpx;
		margin: 20rpx;
		border-radius: 10px;
		background-color: #fff;
	}
	.myDateTable {
		margin: 2.5vw;
		padding: 2vw;
		border-radius: 10px;
		background: linear-gradient(#74AADA, #94db98);
	}
	.myDateTable .dateCell {
			width: 13vw;
			padding: 1.5vw;
			display: inline-block;
			text-align: center;
			font-size: 16px;
		}

	.dateCell .cell {
			display: flex;
			border-radius: 50%;
			height: 10vw;
			justify-content: center;
			align-items: center;
		}
	

	.whiteColor {
		color: #fff;
	}

	.greenColor {
		color: #01b90b;
		font-weight: bold;
	}

	.bgWhite {
		background-color: #fff;
	}

	.bgGray {
		background-color: rgba(255, 255, 255, 0.42);
	}

	.bgBlue {
		font-size: 14px;
		background-color: #4b95e6;
	}

	.redColor {
		color: #ff0000;
	}
	
	.TipArea{
		word-break:break-all;
		word-wrap:break-word;
		
		font-size: 14px;
		padding: 10px;
	}
	.impTip{
		display: inline-block;
		color: #ff0000;
	}
	.count .daynumber {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.count .daynumber .day {
		margin-top: 50rpx;
	}

	.count {
		margin: 20rpx;
		padding: 30rpx;
		display: flex;
		text-align: center;
		border-radius: 10px;
		flex-direction: column;
		justify-content: center;
		background-color: #fff;
		align-items: center;
	}

	.count .number {
		color: #fff;
		font-size: 60rpx;
		background-color: #94db98;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 20rpx;
	}

	.monthSum {
		color: red;
		font-size: 40rpx;
	}

	.count text {
		margin: 10rpx;
	}
</style>
