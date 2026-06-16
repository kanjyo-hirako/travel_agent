<template>
  <div class="login-container">
    <div class="login-header">
      <h1 class="login-title">智能旅游助手</h1>
      <p class="login-subtitle">登录以使用完整功能</p>
    </div>

    <div class="login-form-wrapper">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="form.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入用户名' }]"
          />
          <van-field
            v-model="form.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[
              { required: true, message: '请输入密码' },
              { validator: v => v.length >= 6, message: '密码至少6位' }
            ]"
          />
        </van-cell-group>

        <div class="login-actions">
          <van-button
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            loading-text="登录中..."
          >
            登录
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { setUser } from '../utils/auth'

const router = useRouter()
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const onSubmit = async () => {
  loading.value = true
  try {
    // 登录逻辑后续接入，暂时直接本地存储
    setUser({ username: form.username })
    showToast('登录成功')
    router.push('/profile')
  } catch {
    showToast('登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1989fa 0%, #36cbcb 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  opacity: 0.9;
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  padding: 20px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-actions {
  padding: 20px 16px 0;
}
</style>
