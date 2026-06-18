<template>
  <div class="chat-bubble" :class="messageClass">
    <div class="bubble-content">
      <div class="message-text" v-if="message.role === 'user'">{{ message.content }}</div>
      <div class="message-text ai-message" v-else>
        <template v-if="message.content">{{ message.content }}</template>
      </div>
    </div>
    <div class="bubble-footer">
      <span class="message-time" v-if="showTime">{{ formatTime }}</span>
      <van-icon
        v-if="message.role === 'ai' && message.content"
        :name="favorited ? 'star' : 'star-o'"
        :color="favorited ? '#ff976a' : '#c8c9cc'"
        size="16"
        class="fav-icon"
        @click.stop="toggleFavorite"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { showToast } from 'vant'
import { isLoggedIn, addMessageFavorite, removeMessageFavorite, isMessageFavorited, getMessageFavoriteId } from '../utils/auth'

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  question: {
    type: String,
    default: ''
  }
})

const favVersion = ref(0)

const messageClass = computed(() => {
  return props.message.role === 'user' ? 'user-message' : 'ai-message'
})

const showTime = computed(() => {
  return props.message.timestamp && props.message.content
})

const formatTime = computed(() => {
  if (!props.message.timestamp) return ''
  const date = new Date(props.message.timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
})

const favorited = computed(() => {
  favVersion.value // 触发依赖
  if (!props.message.content || props.message.role !== 'ai') return false
  return isMessageFavorited(props.message.content)
})

function toggleFavorite() {
  if (!isLoggedIn()) {
    showToast('请先登录')
    return
  }
  if (favorited.value) {
    const id = getMessageFavoriteId(props.message.content)
    if (id) removeMessageFavorite(id)
    showToast('已取消收藏')
  } else {
    addMessageFavorite(props.question, props.message.content)
    showToast('已收藏')
  }
  favVersion.value++
}
</script>

<style scoped>
.chat-bubble {
  display: flex;
  flex-direction: column;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  align-items: flex-end;
}

.ai-message {
  align-self: flex-start;
  align-items: flex-start;
}

.bubble-content {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
}

.user-message .bubble-content {
  background: #1989fa;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.ai-message .bubble-content {
  background: #f5f5f5;
  color: #323233;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 11px;
  color: #999;
  padding: 0 4px;
}

.bubble-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  padding: 0 4px;
}

.fav-icon {
  cursor: pointer;
}

.typing {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>