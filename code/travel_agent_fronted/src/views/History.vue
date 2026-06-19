<template>
  <div class="page-container">
    <van-nav-bar title="历史记录" left-text="返回" left-arrow @click-left="router.back()" fixed />

    <div class="page-content" style="padding-top: 56px;">
      <van-tabs v-model:active="activeTab" sticky>
        <van-tab title="行程规划">
          <div v-if="history.trips.length === 0" class="empty-wrap">
            <van-empty description="暂无行程规划记录" />
          </div>
          <div v-else class="list-wrap">
            <van-swipe-cell v-for="trip in history.trips" :key="trip.id">
              <van-cell :title="trip.city + ' · ' + trip.days + '天行程'" is-link @click="goTripDetail(trip)">
                <template #label>
                  <div class="trip-meta">
                    <span>预算：{{ trip.budget }}元</span>
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

        <van-tab title="对话记录">
          <div v-if="history.chats.length === 0" class="empty-wrap">
            <van-empty description="暂无对话记录" />
          </div>
          <div v-else class="list-wrap">
            <van-swipe-cell v-for="chat in history.chats" :key="chat.id">
              <van-cell :title="chat.city || '对话记录'" is-link @click="openChatDetail(chat)">
                <template #label>
                  <div class="chat-meta">
                    <span>{{ chat.messageCount }}条消息</span>
                    <span>{{ formatTime(chat.createdAt) }}</span>
                  </div>
                </template>
              </van-cell>
              <template #right>
                <van-button square type="danger" text="删除" class="delete-btn" @click="removeChat(chat.id)" />
              </template>
            </van-swipe-cell>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 对话详情弹窗 -->
    <van-popup v-model:show="showChatPopup" position="bottom" round :style="{ maxHeight: '80%', padding: '20px' }">
      <div class="chat-detail-title">对话详情</div>
      <div class="chat-detail-header">
        <span v-if="currentChat.city">城市：{{ currentChat.city }}</span>
        <span>{{ currentChat.messageCount }}条消息</span>
      </div>
      <div class="chat-messages">
        <div v-for="msg in currentChat.messages" :key="msg.id" class="chat-msg" :class="msg.role">
          <div class="msg-role">{{ msg.role === 'user' ? '我' : 'AI' }}</div>
          <div class="msg-content">{{ msg.content }}</div>
        </div>
      </div>
      <div class="chat-detail-time">{{ formatTime(currentChat.createdAt) }}</div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'
import { getHistory, removeTripHistory, removeChatHistory } from '../utils/auth'

const router = useRouter()
const activeTab = ref(0)
const showChatPopup = ref(false)
const currentChat = ref({})

const history = reactive({
  trips: [],
  chats: []
})

function loadHistory() {
  const data = getHistory()
  history.trips = data.trips || []
  history.chats = data.chats || []
}

onMounted(() => {
  loadHistory()
})

function removeTrip(id) {
  showDialog({
    title: '提示',
    message: '确定删除该行程记录吗？',
    showCancelButton: true
  }).then(() => {
    removeTripHistory(id)
    loadHistory()
    showToast('已删除')
  }).catch(() => {})
}

function removeChat(id) {
  showDialog({
    title: '提示',
    message: '确定删除该对话记录吗？',
    showCancelButton: true
  }).then(() => {
    removeChatHistory(id)
    loadHistory()
    showToast('已删除')
  }).catch(() => {})
}

function goTripDetail(trip) {
  // 存入临时数据供 Detail 页面使用，避免重新请求 API
  sessionStorage.setItem('trip_cache_' + trip.city + '_' + trip.days, JSON.stringify(trip))
  router.push({
    path: '/detail',
    query: {
      city: trip.city,
      budget: trip.totalBudget || trip.budget,
      days: trip.days,
      fromHistory: '1'
    }
  })
}

function openChatDetail(chat) {
  currentChat.value = chat
  showChatPopup.value = true
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

.chat-meta {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #969799;
}

.delete-btn {
  height: 100%;
}

.chat-detail-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}

.chat-detail-section {
  margin-bottom: 16px;
}

.chat-detail-label {
  font-size: 13px;
  color: #969799;
  margin-bottom: 6px;
}

.chat-detail-content {
  font-size: 15px;
  color: #323233;
  line-height: 1.6;
  padding: 12px;
  border-radius: 8px;
  background: #f5f5f5;
}

.chat-detail-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #969799;
  margin-bottom: 16px;
}

.chat-messages {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.chat-msg {
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 8px;
}

.chat-msg.user {
  background: #e8f0fe;
}

.chat-msg.ai {
  background: #f5f5f5;
}

.msg-role {
  font-size: 12px;
  color: #969799;
  margin-bottom: 4px;
}

.msg-content {
  font-size: 14px;
  color: #323233;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-detail-time {
  text-align: right;
  font-size: 12px;
  color: #c8c9cc;
  margin-top: 8px;
}
</style>
