<template>
  <div class="page-container">
    <van-nav-bar title="我的收藏" left-text="返回" left-arrow @click-left="router.back()" fixed />

    <div class="page-content" style="padding-top: 56px;">
      <van-tabs v-model:active="activeTab" sticky>
        <van-tab title="行程方案">
          <div v-if="favorites.trips.length === 0" class="empty-wrap">
            <van-empty description="暂无收藏的行程" />
          </div>
          <div v-else class="list-wrap">
            <van-swipe-cell v-for="trip in favorites.trips" :key="trip.id">
              <van-cell :title="trip.city + ' · ' + trip.days + '天行程'" is-link @click="goTripDetail(trip)">
                <template #label>
                  <div class="trip-meta">
                    <span>预算：{{ trip.totalBudget }}元</span>
                    <span>{{ formatTime(trip.createdAt) }}</span>
                  </div>
                </template>
                <template #value>
                  <span class="trip-days">{{ trip.days }}天</span>
                </template>
              </van-cell>
              <template #right>
                <van-button square type="danger" text="删除" class="delete-btn" @click="removeTrip(trip.id)" />
              </template>
            </van-swipe-cell>
          </div>
        </van-tab>

        <van-tab title="景点">
          <div v-if="favorites.spots.length === 0" class="empty-wrap">
            <van-empty description="暂无收藏的景点" />
          </div>
          <div v-else class="list-wrap">
            <van-swipe-cell v-for="spot in favorites.spots" :key="spot.id">
              <van-cell :title="spot.spot" is-link @click="goSpotDetail(spot)">
                <template #label>
                  <div class="spot-meta">
                    <span v-if="spot.city">{{ spot.city }}</span>
                    <span v-if="spot.duration">{{ spot.duration }}</span>
                    <span v-if="spot.ticket">{{ spot.ticket }}</span>
                  </div>
                </template>
              </van-cell>
              <template #right>
                <van-button square type="danger" text="删除" class="delete-btn" @click="removeSpot(spot.id)" />
              </template>
            </van-swipe-cell>
          </div>
        </van-tab>

        <van-tab title="对话">
          <div v-if="favorites.messages.length === 0" class="empty-wrap">
            <van-empty description="暂无收藏的对话" />
          </div>
          <div v-else class="list-wrap">
            <van-swipe-cell v-for="msg in favorites.messages" :key="msg.id">
              <van-cell :title="msg.question || '未记录问题'" is-link @click="openMsgDetail(msg)">
                <template #label>
                  <div class="msg-preview">{{ msg.content }}</div>
                </template>
              </van-cell>
              <template #right>
                <van-button square type="danger" text="删除" class="delete-btn" @click="removeMsg(msg.id)" />
              </template>
            </van-swipe-cell>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 对话详情弹窗 -->
    <van-popup v-model:show="showMsgPopup" position="bottom" round :style="{ maxHeight: '80%', padding: '20px' }">
      <div class="msg-detail-title">收藏详情</div>
      <div class="msg-detail-section">
        <div class="msg-detail-label">我的问题</div>
        <div class="msg-detail-content question-content">{{ currentMsg.question || '未记录' }}</div>
      </div>
      <div class="msg-detail-section">
        <div class="msg-detail-label">AI 回复</div>
        <div class="msg-detail-content answer-content">{{ currentMsg.content }}</div>
      </div>
      <div class="msg-detail-time">{{ formatTime(currentMsg.createdAt) }}</div>
    </van-popup>

    <!-- 景点详情弹窗 -->
    <van-popup v-model:show="showSpotPopup" position="bottom" round :style="{ maxHeight: '80%', padding: '20px' }">
      <div class="spot-detail-title">{{ currentSpot.spot || '景点详情' }}</div>
      <div class="spot-detail-city" v-if="currentSpot.city">
        <van-icon name="location-o" size="14" />
        <span>{{ currentSpot.city }}</span>
      </div>
      <div class="spot-detail-info">
        <div class="info-item" v-if="currentSpot.duration">
          <van-icon name="clock-o" size="16" />
          <span>游览时长：{{ currentSpot.duration }}</span>
        </div>
        <div class="info-item" v-if="currentSpot.ticket">
          <van-icon name="ticket-o" size="16" />
          <span>门票价格：{{ currentSpot.ticket }}</span>
        </div>
        <div class="info-item" v-if="currentSpot.transportation">
          <van-icon name="logistics" size="16" />
          <span>交通方式：{{ currentSpot.transportation }}</span>
        </div>
      </div>
      <div class="spot-detail-desc" v-if="currentSpot.description">
        <div class="desc-label">景点介绍</div>
        <div class="desc-content">{{ currentSpot.description }}</div>
      </div>
      <div class="spot-detail-time">收藏于 {{ formatTime(currentSpot.createdAt) }}</div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'
import { getFavorites, removeTripFavorite, removeSpotFavorite, removeMessageFavorite } from '../utils/auth'

const router = useRouter()
const activeTab = ref(0)
const showMsgPopup = ref(false)
const currentMsg = ref({})
const showSpotPopup = ref(false)
const currentSpot = ref({})

const favorites = reactive({
  trips: [],
  spots: [],
  messages: []
})

function loadFavorites() {
  const data = getFavorites()
  favorites.trips = data.trips || []
  favorites.spots = data.spots || []
  favorites.messages = data.messages || []
}

onMounted(() => {
  loadFavorites()
})

function removeTrip(id) {
  showDialog({
    title: '提示',
    message: '确定取消收藏该行程吗？',
    showCancelButton: true
  }).then(() => {
    removeTripFavorite(id)
    loadFavorites()
    showToast('已取消收藏')
  }).catch(() => {})
}

function removeSpot(id) {
  showDialog({
    title: '提示',
    message: '确定取消收藏该景点吗？',
    showCancelButton: true
  }).then(() => {
    removeSpotFavorite(id)
    loadFavorites()
    showToast('已取消收藏')
  }).catch(() => {})
}

function removeMsg(id) {
  showDialog({
    title: '提示',
    message: '确定取消收藏该对话吗？',
    showCancelButton: true
  }).then(() => {
    removeMessageFavorite(id)
    loadFavorites()
    showToast('已取消收藏')
  }).catch(() => {})
}

function goTripDetail(trip) {
  // 存入临时数据供 Detail 页面使用，避免重新请求 API
  sessionStorage.setItem('trip_cache_' + trip.city + '_' + trip.days, JSON.stringify(trip))
  router.push({
    path: '/detail',
    query: {
      city: trip.city,
      budget: trip.totalBudget,
      days: trip.days,
      fromFavorites: '1'
    }
  })
}

function openMsgDetail(msg) {
  currentMsg.value = msg
  showMsgPopup.value = true
}

function goSpotDetail(spot) {
  currentSpot.value = spot
  showSpotPopup.value = true
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const m = d.getMonth() + 1
  const day = d.getDate()
  const h = d.getHours().toString().padStart(2, '0')
  const min = d.getMinutes().toString().padStart(2, '0')
  return `${m}月${day}日 ${h}:${min}`
}
</script>

<style scoped>
.page-content {
  padding-left: 0;
  padding-right: 0;
}

.empty-wrap {
  padding-top: 60px;
}

.list-wrap {
  padding: 8px 0;
}

.trip-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #969799;
}

.trip-days {
  font-size: 14px;
  color: #1989fa;
  font-weight: 600;
}

.spot-meta {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #969799;
}

.delete-btn {
  height: 100%;
}

.msg-preview {
  font-size: 14px;
  color: #323233;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-time {
  font-size: 12px;
  color: #969799;
}

.msg-detail-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}

.msg-detail-section {
  margin-bottom: 16px;
}

.msg-detail-label {
  font-size: 13px;
  color: #969799;
  margin-bottom: 6px;
}

.msg-detail-content {
  font-size: 15px;
  color: #323233;
  line-height: 1.6;
  padding: 12px;
  border-radius: 8px;
}

.question-content {
  background: #e8f0fe;
}

.answer-content {
  background: #f5f5f5;
  white-space: pre-wrap;
  word-break: break-word;
}

.msg-detail-time {
  text-align: right;
  font-size: 12px;
  color: #c8c9cc;
  margin-top: 8px;
}

.spot-detail-title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
  color: #323233;
}

.spot-detail-city {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
  color: #969799;
  margin-bottom: 20px;
}

.spot-detail-info {
  background: #f7f8fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #323233;
  padding: 8px 0;
}

.info-item:not(:last-child) {
  border-bottom: 1px solid #ebedf0;
}

.spot-detail-desc {
  margin-bottom: 16px;
}

.desc-label {
  font-size: 14px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 8px;
}

.desc-content {
  font-size: 14px;
  color: #646566;
  line-height: 1.6;
  background: #f7f8fa;
  padding: 12px;
  border-radius: 8px;
}

.spot-detail-time {
  text-align: right;
  font-size: 12px;
  color: #c8c9cc;
  margin-top: 8px;
}
</style>
