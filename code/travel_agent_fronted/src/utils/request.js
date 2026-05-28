import axios from 'axios'

const request = axios.create({
    baseURL:'http://127.0.0.1:3300/api/travel',
    timeout:60000,
    headers:{
        'Content-Type':'application/json'
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
