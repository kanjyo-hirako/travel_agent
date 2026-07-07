<template>
  <div class="map-wrapper" v-if="spots.length > 0">
    <div class="map-container" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { showDialog } from 'vant'
import { amapConfig } from '../amap-config.js'

// 检测是否为移动端
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 生成高德地图导航链接（统一使用网页版，兼容所有设备）
const getAmapNavUrl = (fromLng, fromLat, fromName, toLng, toLat, toName) => {
  // 如果起点是"我的位置"，不传 from 参数，高德会自动定位当前位置
  if (fromName === '我的位置') {
    return `https://uri.amap.com/navigation?to=${toLng},${toLat},${encodeURIComponent(toName)}&mode=car&coordinate=gaode`
  }
  return `https://uri.amap.com/navigation?from=${fromLng},${fromLat},${encodeURIComponent(fromName)}&to=${toLng},${toLat},${encodeURIComponent(toName)}&mode=car&coordinate=gaode`
}

const props = defineProps({
  city: {
    type: String,
    default: ''
  },
  day: {
    type: Object,
    default: () => ({})
  },
  dayIndex: {
    type: Number,
    default: 0
  }
})

const dayColors = ['#ee0a24', '#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96']

const mapContainer = ref(null)
const spots = ref([])
let map = null
let markers = []
let polylines = []

// 提取当天景点
const extractSpots = () => {
  const result = []
  const day = props.day
  if (day.morning) result.push({ ...day.morning, period: '上午' })
  if (day.afternoon) result.push({ ...day.afternoon, period: '下午' })
  if (day.evening) result.push({ ...day.evening, period: '晚上' })
  spots.value = result
}

// 初始化地图
const initMap = async () => {
  if (!mapContainer.value || spots.value.length === 0) return

  try {
    window._AMapSecurityConfig = {
      securityJsCode: amapConfig.securityJsCode,
    }

    const AMap = await AMapLoader.load({
      key: amapConfig.key,
      version: '2.0',
      plugins: ['AMap.Geocoder', 'AMap.InfoWindow']
    })

    map = new AMap.Map(mapContainer.value, {
      zoom: 13,
      viewMode: '2D'
    })

    const geocoder = new AMap.Geocoder({ city: props.city })

    // 定位到城市中心
    if (props.city) {
      geocoder.getLocation(props.city, (status, result) => {
        if (status === 'complete' && result.geocodes.length > 0) {
          const location = result.geocodes[0].location
          map.setCenter([location.lng, location.lat])
        }
      })
    }

    // 地理编码（带超时）
    const geocodeWithTimeout = (spot) => {
      return new Promise((resolve) => {
        const spotName = spot.spot || spot.name
        // 添加城市前缀提高定位精度
        const address = props.city ? `${props.city}${spotName}` : spotName
        let resolved = false

        const timer = setTimeout(() => {
          if (!resolved) {
            resolved = true
            console.warn(`[MapView] 地理编码超时: ${address}`)
            resolve(null)
          }
        }, 5000)

        geocoder.getLocation(address, (status, result) => {
          if (resolved) return
          resolved = true
          clearTimeout(timer)
          if (status === 'complete' && result.geocodes.length > 0) {
            const location = result.geocodes[0].location
            resolve({ ...spot, lng: location.lng, lat: location.lat })
          } else {
            console.warn(`[MapView] 地理编码失败: ${address}`)
            resolve(null)
          }
        })
      })
    }

    // 过滤掉定位失败的景点
    const geocodedResults = await Promise.all(spots.value.map(geocodeWithTimeout))
    const geocodedSpots = geocodedResults.filter(spot => spot !== null)
    const color = dayColors[props.dayIndex % dayColors.length]

    // 绘制路线（支持点击导航）
    if (geocodedSpots.length > 1) {
      for (let i = 0; i < geocodedSpots.length - 1; i++) {
        const from = geocodedSpots[i]
        const to = geocodedSpots[i + 1]
        const path = [[from.lng, from.lat], [to.lng, to.lat]]

        const polyline = new AMap.Polyline({
          path,
          strokeColor: color,
          strokeWeight: 4,
          strokeOpacity: 0.8,
          lineJoin: 'round',
          lineCap: 'round',
          strokeStyle: 'dashed',
          cursor: 'pointer'
        })

        polyline.on('click', () => {
          const fromName = from.spot || from.name
          const toName = to.spot || to.name
          showDialog({
            title: '路线导航',
            message: `是否导航从「${fromName}」到「${toName}」？`,
            showCancelButton: true,
            confirmButtonText: '开始导航',
            cancelButtonText: '取消'
          }).then(() => {
            const url = getAmapNavUrl(from.lng, from.lat, fromName, to.lng, to.lat, toName)
            window.open(url, '_blank')
          }).catch(() => {})
        })

        map.add(polyline)
        polylines.push(polyline)
      }
    }

    // 注册全局导航函数
    window.__navigateToSpot = (lng, lat, name) => {
      showDialog({
        title: '导航到景点',
        message: `是否导航到「${name}」？`,
        showCancelButton: true,
        confirmButtonText: '开始导航',
        cancelButtonText: '取消'
      }).then(() => {
        const url = getAmapNavUrl(0, 0, '我的位置', lng, lat, name)
        window.open(url, '_blank')
      }).catch(() => {})
    }

    // 绘制标记
    geocodedSpots.forEach((spot, i) => {
      const spotName = spot.spot || spot.name
      const markerContent = `
        <div style="position: relative;">
          <div style="width: 26px; height: 26px; background: ${color}; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <span style="color: #fff; font-size: 12px; font-weight: bold;">${i + 1}</span>
          </div>
        </div>
      `
      const marker = new AMap.Marker({
        position: [spot.lng, spot.lat],
        content: markerContent,
        anchor: 'center'
      })

      const infoWindow = new AMap.InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 160px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${spotName}</div>
            <div style="font-size: 12px; color: #666;">${spot.period}</div>
            ${spot.duration ? `<div style="font-size: 12px; color: #999;">时长：${spot.duration}</div>` : ''}
            ${spot.ticket ? `<div style="font-size: 12px; color: #999;">门票：${spot.ticket}</div>` : ''}
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
              <a href="javascript:void(0)" onclick="window.__navigateToSpot(${spot.lng}, ${spot.lat}, '${spotName.replace(/'/g, "\\'")}')" style="color: #1890ff; font-size: 13px; text-decoration: none;">
                🧭 导航到此处
              </a>
            </div>
          </div>
        `,
        offset: new AMap.Pixel(0, -13)
      })

      marker.on('click', () => infoWindow.open(map, marker.getPosition()))
      map.add(marker)
      markers.push(marker)
    })

    if (markers.length > 0) {
      map.setFitView(markers)
    }

  } catch (error) {
    console.error('[MapView] initMap error:', error)
  }
}

// 清理地图资源
const destroyMap = () => {
  if (map) {
    map.destroy()
    map = null
  }
  markers = []
  polylines = []
  delete window.__navigateToSpot
}

watch(() => props.day, () => {
  destroyMap()
  extractSpots()
  nextTick(() => initMap())
}, { deep: true })

onMounted(() => {
  extractSpots()
  nextTick(() => initMap())
})

onBeforeUnmount(() => {
  destroyMap()
})
</script>

<style scoped>
.map-wrapper {
  margin: 12px 0;
}

.map-container {
  width: 100%;
  height: 220px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
