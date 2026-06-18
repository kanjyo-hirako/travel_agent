<template>
  <div class="spot-item" v-if="data">
    <div class="spot-name-row">
      <span class="spot-name">{{ data.spot || data.name || '待定' }}</span>
      <van-icon
        :name="favorited ? 'like' : 'like-o'"
        :color="favorited ? '#ee0a24' : '#c8c9cc'"
        size="18"
        @click.stop="toggleFavorite"
      />
    </div>
    <div class="spot-details" v-if="data.duration || data.ticket || data.transportation">
      <div class="detail-row" v-if="data.duration">
        <van-icon name="clock-o" size="14" />
        <span>{{ data.duration }}</span>
      </div>
      <div class="detail-row" v-if="data.ticket">
        <van-icon name="ticket-o" size="14" />
        <span>{{ data.ticket }}</span>
      </div>
      <div class="detail-row" v-if="data.transportation">
        <van-icon name="logistics" size="14" />
        <span>{{ data.transportation }}</span>
      </div>
    </div>
    <div class="spot-desc" v-if="data.description">{{ data.description }}</div>
  </div>
  <div class="spot-item empty" v-else>
    <van-empty description="暂无安排" :image-size="40" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { showToast } from 'vant'
import { isLoggedIn, addSpotFavorite, removeSpotFavorite, isSpotFavorited, getSpotFavoriteId } from '../utils/auth'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  city: {
    type: String,
    default: ''
  }
})

const favVersion = ref(0)

const spotName = computed(() => props.data?.spot || props.data?.name || '')
const favorited = computed(() => {
  favVersion.value
  if (!spotName.value || !props.city) return false
  return isSpotFavorited(spotName.value, props.city)
})

function toggleFavorite() {
  if (!isLoggedIn()) {
    showToast('请先登录')
    return
  }
  if (favorited.value) {
    const id = getSpotFavoriteId(spotName.value, props.city)
    if (id) removeSpotFavorite(id)
    showToast('已取消收藏')
  } else {
    addSpotFavorite(props.data, props.city)
    showToast('已收藏')
  }
  favVersion.value++
}
</script>

<style scoped>
.spot-item {
  padding: 8px 0;
}

.spot-item.empty {
  padding: 16px 0;
}

.spot-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.spot-name {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

.spot-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
}

.spot-desc {
  font-size: 14px;
  color: #969799;
  line-height: 1.5;
}
</style>