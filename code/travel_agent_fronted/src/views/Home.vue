<template>
    <div class="page-container">
        <div class="page-header">
            <van-nav-bar title="智能旅游助手" />
        </div>
        <div class="page-content">
            <van-notice-bar
                left-icon="info-o"
                text="基于AI的智能景点介绍与行程规划系统"
                style="margin-bottom: 16px;"
            />
            <div class="card search-card">
            <div class="section-title">
                规划你的旅程
            </div>
            <van-field
                @click="showCityPicker = true"
                is-link
                readonly
                v-model="formData.city"
                label="目的地"
                placeholder="请选择城市"
                style="background: #f7f8fa;border-radius: 8px;margin-bottom: 12px;"
            />
            <van-field
                v-model="formData.budget"
                type="number"
                label="预算（元）"
                placeholder="请输入预算金额"
                :border="false"
                style="background: #f7f8fa;border-radius: 8px;margin-bottom: 12px;"
            />
            <van-field
                v-model="formData.days"
                type="digit"
                label="行程时间（天）"
                placeholder="请输入行程时间（天）"
                :border="false"
                style="background: #f7f8fa;border-radius: 8px;margin-bottom: 12px;"
            />
            <van-button 
                type="primary" 
                round
                size="large"
                :loading="isloading"
                @click="handleSearch"
            >
                开始规划
            </van-button>
        </div>

        <div class="card quick-actions"></div>
        <div class="card"></div>
        </div>
        <!-- 城市选择器(弹窗) -->
        <van-popup
            round
            v-model:show="showCityPicker"
            position="bottom"
        >
            <van-picker
                title="请选择目的地"
                :columns="cityColumns"
                @confirm="handleCityConfirm"
                @cancel="showCityPicker = false"
            />
        </van-popup>
    </div>
</template>

<script setup>
    import {ref,reactive} from 'vue'
    const formData = reactive({
        city: '',
        budget: null,
        days: null,
    })
    // 城市选择器
    const showCityPicker = ref(false)

    const allCities =[
        '北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '重庆',
        '南京', '武汉', '苏州', '长沙', '天津', '郑州', '济南', '青岛',
        '大连', '沈阳', '哈尔滨', '长春', '福州', '厦门', '南昌', '合肥',
        '昆明', '贵阳', '南宁', '桂林', '海口', '三亚', '丽江', '大理',
        '西安', '兰州', '乌鲁木齐', '拉萨', '呼和浩特', '太原', '石家庄'
    ]

    const cityColumns = allCities.map(city => ({ text: city ,value: city}))

    // 城市选择器确认回调
    const handleCityConfirm = ({ selectedOptions }) => {
        //console.log(selectedOptions[0].value)
        formData.city = selectedOptions[0].value // 赋值给表单数据
        showCityPicker.value = false // 关闭弹窗
    }
    // 加载状态
    const isloading = ref(false) 
    //提交表单
    const handleSearch = () => {
        isloading.value = true
    }
</script>

<style scoped>
    .search-card {
        margin-bottom: 16px;
    }
</style>