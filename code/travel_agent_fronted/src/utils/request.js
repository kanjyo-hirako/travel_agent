import axios from 'axios'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '') + '/api/travel'

const request = axios.create({
    baseURL: API_BASE,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json'
    }
})

//封装拦截器
request.interceptors.request.use(
    config=>{
        return config
    },
    error=>{
        return Promise.reject(error)
    }
)

//封装响应拦截器
request.interceptors.response.use(
    response=>{
        return response.data
    },
    error=>{
        return Promise.reject(error)
    }
)

export function post(url,data){
    return request.post(url,data)
}

export function get(url,params){
    return request.get(url,{params})
}

//处理流式接口
export async function fetchStream(url,data,onChunk,onComplete,onError){
    const controller = new AbortController()

    try{
        const response = await fetch(`${API_BASE}/${url}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data),
            signal:controller.signal
        })

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while(true){
            const {done,value}=await reader.read()
            if(done) break

            buffer += decoder.decode(value,{stream:true})
            const events = buffer.split('\n\n')
            buffer = events.pop() // 保留未完成的部分

            for(const event of events){
                const lines = event.split('\n').filter(line=>line.trim())
                for(const line of lines){
                    if(!line.startsWith('data:')) continue
                    try{
                        const jsonData = JSON.parse(line.substring(5).trim())
                        if(jsonData.type === 'chunk'){
                            onChunk(jsonData.content)
                        }else if(jsonData.type === 'complete'){
                            onComplete(jsonData.data)
                        }else if(jsonData.done){
                            // 流结束信号，不做处理
                        }else if(jsonData.error){
                            onError(jsonData.error)
                        }
                    }catch(e){
                        // 忽略解析失败的行
                    }
                }
            }
        }
        controller.abort()
    }catch(error){
        onError(error.message || '请求失败')
    }
}
