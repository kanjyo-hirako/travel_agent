export const createStreamResponse = (res) => {
    // 设置响应头
    res.setHeader('Content-Type', 'text/event-stream');
    //确保客户端每次接收的都是最新的数据
    res.setHeader('Cache-Control', 'no-cache');
    // 保持长连接
    res.setHeader('Connection', 'keep-alive');
    return {
        send: (data) => {
            try {
                console.log(`data: ${JSON.stringify(data)}\n\n`)
                res.write(`data: ${JSON.stringify(data)}\n\n`)
            } catch (error) {
                console.error('发送数据到流失败:', error);
            }
        },
        end: () => {
            try {
                res.write('envet: end\ndata: {"done": true}\n\n')
                res.end()
            } catch (error) {
                console.error('发送结束信号到流失败:', error);
            }
        },
        error: (error) => {
            try {
                res.write(`data: ${JSON.stringify(message)}\n\n`)
                res.end()
            } catch (error) {
                console.error('发送错误信息到流失败:', error);
            }
        }
    }

}