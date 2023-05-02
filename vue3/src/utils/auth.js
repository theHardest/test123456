import { TOKEN_TIME,TOKEN_TIME_VALUE } from "./constant";

//登入時設置時間
export const setTokenTime = ()=>{
    localStorage.setItem(TOKEN_TIME,Date.now())
}
//獲得
export const  getTokenTime=()=>{
    return localStorage.getItem(TOKEN_TIME)
}

//是否過期
export const diffTokenTime=()=>{
    const currentTime=Date.now()
    const tokenTime = getTokenTime()
    return currentTime - tokenTime > TOKEN_TIME_VALUE; 
}