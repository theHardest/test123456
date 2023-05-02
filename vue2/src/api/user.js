import request from '@/utils/request'

export const login = (data)=>{
    return request({
        url:"/user/login",
        method:"POST",
        data
    })
}
export const getUserInfo=()=>{
    return request({
        url:'/user/userinfo'
    })
}
export const lineLogin=(data)=>{
    return request({
        url:"/user/lineLogin",
        method:"POST",
        data
    })
}