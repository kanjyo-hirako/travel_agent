<template>
  <div class="map-card card" v-if="spots.length > 0">
    <div class="section-title">
      行程地图
    </div>
    <div class="map-container" ref="mapContainer"></div>
    <div class="map-legend">
      <div
        class="legend-item clickable"
        v-for="dayNum in totalDays"
        :key="dayNum"
        @click="flyToDay(dayNum - 1)"
      >
        <span class="legend-dot" :style="{ backgroundColor: getDayColor(dayNum - 1) }"></span>
        <span class="legend-text">第{{ dayNum }}天</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { amapConfig } from '../amap-config.js'

const props = defineProps({
  city: {
    type: String,
    default: ''
  },
  dailyItinerary: {
    type: Array,
    default: () => []
  }
})

const mapContainer = ref(null)
const spots = ref([])
const dayColors = [
  '#ee0a24',  // 第1天：红色
  '#1890ff',  // 第2天：蓝色
  '#52c41a',  // 第3天：绿色
  '#fa8c16',  // 第4天：橙色
  '#722ed1',  // 第5天：紫色
  '#13c2c2',  // 第6天：青色
  '#eb2f96',  // 第7天：粉色
]

// 计算实际天数
const totalDays = computed(() => {
  return props.dailyItinerary.length || 0
})

// 获取天数颜色
const getDayColor = (dayIndex) => {
  return dayColors[dayIndex % dayColors.length]
}

let map = null
let markers = []
let polylines = []
const dayMarkers = ref({}) // 按天分组的标记

// 提取景点数据
const extractSpots = () => {
  const allSpots = []
  props.dailyItinerary.forEach((day, dayIndex) => {
    const daySpots = []
    if (day.morning) {
      daySpots.push({ ...day.morning, dayIndex, period: '上午' })
    }
    if (day.afternoon) {
      daySpots.push({ ...day.afternoon, dayIndex, period: '下午' })
    }
    if (day.evening) {
      daySpots.push({ ...day.evening, dayIndex, period: '晚上' })
    }
    allSpots.push(...daySpots)
  })
  spots.value = allSpots
}

// 初始化地图
const initMap = async () => {
  if (!mapContainer.value || spots.value.length === 0) return

  try {
    // 配置安全密钥
    window._AMapSecurityConfig = {
      securityJsCode: amapConfig.securityJsCode,
    }

    const AMap = await AMapLoader.load({
      key: amapConfig.key,
      version: '2.0',
      plugins: ['AMap.Geocoder', 'AMap.InfoWindow']
    })

    // 创建地图实例
    map = new AMap.Map(mapContainer.value, {
      zoom: 12,
      center: [116.397428, 39.90923], // 默认北京，会在地理编码后更新
      viewMode: '2D'
    })

    // 创建地理编码实例
    const geocoder = new AMap.Geocoder({
      city: props.city
    })

    // 先定位到城市中心
    if (props.city) {
      geocoder.getLocation(props.city, (status, result) => {
        if (status === 'complete' && result.geocodes.length > 0) {
          const location = result.geocodes[0].location
          map.setCenter([location.lng, location.lat])
        }
      })
    }

    // 批量地理编码
    const geocodePromises = spots.value.map(spot => {
      return new Promise((resolve) => {
        const address = spot.spot || spot.name
        geocoder.getLocation(address, (status, result) => {
          if (status === 'complete' && result.geocodes.length > 0) {
            const location = result.geocodes[0].location
            resolve({
              ...spot,
              lng: location.lng,
              lat: location.lat
            })
          } else {
            // 地理编码失败，使用默认坐标
            resolve({
              ...spot,
              lng: 116.397428 + Math.random() * 0.1,
              lat: 39.90923 + Math.random() * 0.1
            })
          }
        })
      })
    })

    const geocodedSpots = await Promise.all(geocodePromises)

    // 清除之前的标记和折线
    markers.forEach(marker => marker.setMap(null))
    polylines.forEach(polyline => polyline.setMap(null))
    markers = []
    polylines = []
    dayMarkers.value = {}

    // 按天分组
    const dayGroups = {}
    geocodedSpots.forEach(spot => {
      if (!dayGroups[spot.dayIndex]) {
        dayGroups[spot.dayIndex] = []
      }
      dayGroups[spot.dayIndex].push(spot)
    })

    // 绘制每天的路线和标记
    Object.keys(dayGroups).forEach(dayIndex => {
      const daySpots = dayGroups[dayIndex]
      const color = getDayColor(dayIndex)
      dayMarkers.value[dayIndex] = []

      // 绘制路线折线
      if (daySpots.length > 1) {
        const path = daySpots.map(spot => [spot.lng, spot.lat])
        const polyline = new AMap.Polyline({
          path: path,
          strokeColor: color,
          strokeWeight: 3,
          strokeOpacity: 0.8,
          lineJoin: 'round',
          lineCap: 'round'
        })
        map.add(polyline)
        polylines.push(polyline)
      }

      // 绘制标记
      daySpots.forEach(spot => {
        const markerContent = `
          <div style="position: relative;">
            <div style="width: 24px; height: 24px; background: ${color}; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
              <span style="color: #fff; font-size: 12px; font-weight: bold;">${spot.dayIndex + 1}</span>
            </div>
          </div>
        `
        const marker = new AMap.Marker({
          position: [spot.lng, spot.lat],
          content: markerContent,
          anchor: 'center',
          offset: new AMap.Pixel(0, 0)
        })

        // 创建信息窗
        const infoWindow = new AMap.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 150px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${spot.spot || spot.name}</div>
              <div style="font-size: 12px; color: #666;">${spot.period}</div>
              ${spot.duration ? `<div style="font-size: 12px; color: #999;">时长：${spot.duration}</div>` : ''}
              ${spot.ticket ? `<div style="font-size: 12px; color: #999;">门票：${spot.ticket}</div>` : ''}
            </div>
          `,
          offset: new AMap.Pixel(0, -12)
        })

        // 点击标记显示信息窗
        marker.on('click', () => {
          infoWindow.open(map, marker.getPosition())
        })

        map.add(marker)
        markers.push(marker)
        dayMarkers.value[dayIndex].push(marker)
      })
    })

    // 调整地图视野，显示所有标记
    if (markers.length > 0) {
      map.setFitView(markers)
    }

  } catch (error) {
    console.error('地图初始化失败：', error)
  }
}

// 点击天数跳转到对应景点
const flyToDay = (dayIndex) => {
  console.log('点击天数:', dayIndex)
  console.log('地图实例:', map)
  console.log('dayMarkers:', dayMarkers.value)

  if (!map) {
    console.error('地图未初始化')
    return
  }

  // 统一使用字符串类型查找
  const key = String(dayIndex)
  if (!dayMarkers.value[key] || dayMarkers.value[key].length === 0) {
    console.error('该天没有标记:', dayIndex)
    return
  }

  // 获取该天的所有标记
  const dayMarkerList = dayMarkers.value[key]
  console.log('该天标记数量:', dayMarkerList.length)

  // 调整地图视野，显示该天的所有标记
  map.setFitView(dayMarkerList)

  // 如果只有一个标记，放大到合适级别
  if (dayMarkerList.length === 1) {
    map.setZoom(15)
  }
}

// 监听数据变化
watch(() => props.dailyItinerary, () => {
  extractSpots()
  nextTick(() => {
    initMap()
  })
}, { deep: true })

onMounted(() => {
  extractSpots()
  nextTick(() => {
    initMap()
  })
})
</script>

<style scoped>
.map-card {
  margin-bottom: 16px;
}

.map-container {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.map-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-item.clickable {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.legend-item.clickable:hover {
  background-color: #f5f5f5;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-text {
  font-size: 12px;
  color: #666;
}
</style>
