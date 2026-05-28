<template>
    <div class="page-container chat-page">
        <div class="page-header">
            <van-nav-bar 
                title="智能旅游助手" 
                left-arrow
                fixed
                left-text="返回"
                @click-left="onBack"
            />
        </div>
        <div class="chat-container">
            <div v-if="messages.length === 0" class="chat-empty">
                <van-empty
                    description="开始和AI助手对话吧!"
                />
                <div class="quick-questions">
                    <div class="quick-title">常见问题</div>
                    <van-tag @click="handleClickTag(q)" v-for="q in quickQuestions" :key="q" size="large" mark class="quick-tag">
                        {{ q }}
                    </van-tag>
                </div>
            </div>
        </div>
        <div class="chat-input-area">
            <van-field
                v-model="inputMessage"
                placeholder="输入您的问题"
                :disabled="!inputMessage.trim()"
                @keyup.enter="sendMessage"
            >
                <template #button>
                    <van-button @click="sendMessage" type="primary" round size="small" :disabled="!inputMessage.trim()">发送</van-button>
                </template>
            </van-field>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const quickQuestions = ref([
  '北京有哪些必去的景点？',
  '上海美食推荐',
  '成都三日游攻略',
  '如何选择旅行保险？'
])
//点击标签问题
const handleClickTag = (q) => {}

//会话数据
const messages = ref([])

const inputMessage = ref('')

const sendMessage = () => {}

const onBack = () => {
    router.back()
}
</script>



<style scoped>
    .chat-page {
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding-bottom: 50px;
    }

    .chat-container {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        padding-bottom: 60px;
    }

    .chat-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .quick-questions {
        margin-top: 32px;
        text-align: center;
    }

    .quick-title {
        font-size: 14px;
        color: #999;
        margin-bottom: 16px;
    }

    .quick-tag {
        margin: 8px;
        cursor: pointer;
    }

    .message-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .streaming-indicator {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        color: #999;
        font-size: 14px;
    }

    .chat-input-area {
        position: fixed;
        bottom: 50px;
        left: 0;
        right: 0;
        background: #fff;
        padding: 8px 16px;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
        max-width: 750px;
        margin: 0 auto;
    }

    .chat-input-area :deep(.van-field) {
        background: #f7f8fa;
        border-radius: 20px;
        padding: 8px 16px;
    }
</style>
