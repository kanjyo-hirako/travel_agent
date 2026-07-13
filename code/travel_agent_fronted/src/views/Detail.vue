<template>
    <div class="page-container">
        <div class="page-header">
            <van-nav-bar
            fixed
            left-text="返回"
            left-arrow
            @click-left="onBack"
            :title="formData.city + '行程规划'"
            >
            <template #right>
                <van-icon
                :name="tripFavorited ? 'star' : 'star-o'"
                :color="tripFavorited ? '#ff976a' : '#323233'"
                size="22"
                @click="toggleTripFavorite"
                />
            </template>
            </van-nav-bar>
        </div>
        <div class="page-content">
            <div v-if="isloading" class="loading-container">
                <van-loading size="36px" type="spinner" vertical>
                    AI 正在为你规划行程...
                </van-loading>
                <div v-if="streamingText" class="streaming-preview">
                    <div class="streaming-text">{{ streamingText }}</div>
                </div>
            </div>
            <div v-else-if="errorMsg">
                <van-empty :description="errorMsg">
                    <van-button type="primary" @click="fetchTripData">重试</van-button>
                </van-empty>
            </div>

            <template v-else-if="tripData && tripData.success !==false">
                <div class="card overview-card">
                    <div class="trip-header">
                        <h2>{{tripData.city}} · {{tripData.days}}天行程</h2>
                        <div class="trip-budget">预算：{{tripData.totalBudget}}元</div>
                    </div>
                </div>

                <van-collapse v-model="activeDays" class="trip-collapse">
                    <van-collapse-item 
                    v-for="day in tripData.dailyItinerary" 
                    :key="day.days" 
                    :title="'第'+day.day+'天'"
                    :name="day.days"
                    >

                    <div class="day-schedule">
                        <div class="schedule-section">
                            <div class="section-label morning">上午</div>
                            <SpotItem :data="day.morning" :city="formData.city" />
                        </div>
                        <div class="schedule-section">
                            <div class="section-label afternoon">下午</div>
                            <SpotItem :data="day.afternoon" :city="formData.city" />
                        </div>
                        <div class="schedule-section">
                            <div class="section-label evening">晚上</div>
                            <SpotItem :data="day.evening" :city="formData.city" />
                        </div>
                        <MapView
                            :city="formData.city"
                            :day="day"
                            :day-index="day.day - 1"
                        />
                    </div>
                    </van-collapse-item>
                </van-collapse>

                <div class="card budget-card" v-if="tripData.budgetBreakdown">
                    <div class="section-title">
                        预算明细
                    </div>
                    <BudgetTable :data="tripData.budgetBreakdown" :total="tripData.totalBudget" />
                </div>

                <div class="card tips-card" v-if="tripData.tips && tripData.tips.length">
                    <div class="section-title">
                        温馨提示
                    </div>
                    <ul class="tips-list">
                        <li v-for="(tip,index) in tripData.tips" :key="index">{{tip}}</li>
                    </ul>
                </div>

                <div class="card warnings-card" v-if="tripData.warnings && tripData.warnings.length">
                    <div class="section-title">
                        注意事项
                    </div>
                    <ul class="warnings-list">
                        <li v-for="(warning,index) in tripData.warnings" :key="index">{{warning}}</li>
                    </ul>
                </div>
            </template>

        </div>
        <div class="detail-footer" v-if="tripData && tripData.success !==false">
            <van-button type="primary" size="large" round @click="goToChat" class="primary-button">
                咨询AI助手
            </van-button>
        </div>
    </div>
</template>

<script setup>
    import {onMounted, reactive, ref, computed} from 'vue'
    import {useRouter, useRoute} from 'vue-router'
    import {showToast} from 'vant'
    import {fetchStream} from '../utils/request'
    import SpotItem from '../components/SpotItem.vue'
    import BudgetTable from '../components/BudgetTable.vue'
    import MapView from '../components/MapView.vue'
    import { addTripFavorite, removeTripFavorite, isTripFavorited, getTripFavoriteId, checkLogin, addTripHistory } from '../utils/auth'
    
    const isloading = ref(true)
    const streamingText = ref('')

    const activeDays = ref([])

    const router = useRouter()
    // 获取当前路由参数
    const route = useRoute()
    // 旅游规划数据
    const tripData = ref(null)

    const errorMsg = ref('')

    // 行程收藏状态
    const favVersion = ref(0)
    const tripFavorited = computed(() => {
        favVersion.value
        if (!tripData.value) return false
        return isTripFavorited(tripData.value.city, tripData.value.days)
    })

    function toggleTripFavorite() {
        if (!checkLogin(router)) return
        if (tripFavorited.value) {
            const id = getTripFavoriteId(tripData.value.city, tripData.value.days)
            if (id) removeTripFavorite(id)
            showToast('已取消收藏')
        } else {
            addTripFavorite(tripData.value)
            showToast('已收藏')
        }
        favVersion.value++
    }

    // 返回上一页
    function onBack() {
        router.back()
    }

    // 跳转对话页
    function goToChat() {
        router.push({
            path:'/chat',
            query:{
                scene:'detail',
                city: formData.city
            }
        })
    }

    const formData = reactive({
        city: '',
        budget: null,
        days: null
    })
    
    // 获取旅游规划数据（流式）
    const fetchTripData = async() => {
        isloading.value = true
        errorMsg.value = ''
        tripData.value = null
        streamingText.value = ''

        await fetchStream('recommend',{
            city: formData.city,
            budget: formData.budget,
            days: formData.days
        },
        // onChunk - 实时显示生成内容
        (chunk) => {
            streamingText.value += chunk
        },
        // onComplete - 收到最终结果
        (result) => {
            isloading.value = false
            if(result && result.success !== false){
                tripData.value = result
                addTripHistory(result)
            }else{
                errorMsg.value = result?.error || '生成失败，请重试'
            }
        },
        // onError
        (err) => {
            isloading.value = false
            errorMsg.value = typeof err === 'string' ? err : '请求失败，请重试'
        })
    }

    onMounted(() => {
        formData.city = route.query.city
        formData.budget = route.query.budget
        formData.days = route.query.days

        // 从收藏页或历史记录页跳转时优先使用缓存数据
        if (route.query.fromFavorites === '1' || route.query.fromHistory === '1') {
            const cacheKey = 'trip_cache_' + formData.city + '_' + formData.days
            const cached = sessionStorage.getItem(cacheKey)
            if (cached) {
                tripData.value = JSON.parse(cached)
                isloading.value = false
                sessionStorage.removeItem(cacheKey)
                return
            }
        }

        if(formData.city &&formData.budget &&formData.days){
            fetchTripData()
        }
    })
</script>

<style scoped>
    .page-header {
        height: 46px;
    }
    .overview-card {
         margin-bottom: 16px;
    }

    .trip-header {
        display: flex;
        justify-content: space-between;
        align-items: center;    
    }

    .trip-header h2 {
        font-size: 20px;
        color: #323233;
        margin: 0;
    }

    .trip-budget {
        font-size: 16px;
        color: #ee0a24;
        font-weight: 600;
    }

    .trip-collapse {
        margin-bottom: 16px;
    }

    .day-schedule {
        padding: 8px 0;
    }   

    .schedule-section {
        margin-bottom: 16px;
    }

    .schedule-section:last-child {
        margin-bottom: 0;
    }

    .section-label {
        font-size: 14px;    
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 4px;
        display: inline-block;
        margin-bottom: 8px;
    }

    .section-label.morning {
        background: #fff7e6;
        color: #fa8c16;
    }

    .section-label.afternoon {
        background: #e6f7ff;
        color: #1890ff;
    }

    .section-label.evening {
        background: #f6ffed;
        color: #52c41a;
    }

    .budget-card,
    .tips-card,
    .warnings-card {
        margin-bottom: 16px;
    }

    .tips-list,
    .warnings-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .tips-list li,
    .warnings-list li {
        padding: 8px 0;
        color: #666;
        font-size: 14px;
        border-bottom: 1px solid #f5f5f5;
    }

    .tips-list li:last-child,
    .warnings-list li:last-child {
        border-bottom: none;
    }

    .detail-footer {
        position: fixed;    
        bottom: 0;
        left: 0;
        right: 0;
        padding: 12px 16px;
        background: #fff;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
        max-width: 750px;
        margin: 0 auto; 
    }

    .error-card {
        text-align: center;
        padding: 40px 16px;
    }

    .streaming-preview {
        margin-top: 20px;
        padding: 12px 16px;
        background: #f7f8fa;
        border-radius: 8px;
        max-height: 300px;
        overflow-y: auto;
        width: 100%;
        max-width: 500px;
    }

    .streaming-text {
        font-size: 12px;
        color: #999;
        line-height: 1.6;
        word-break: break-all;
        white-space: pre-wrap;
    }
</style>
