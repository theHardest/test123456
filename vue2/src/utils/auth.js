const TOKEN_TIME = "tokenTime";
const TOKEN_TIME_VALUE = 2 * 60 * 60 * 1000;
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


export const setLocalStorage = (tokenKey, token) => {
  return localStorage.setItem(tokenKey, token);
};
export const getLocalStorage = (tokenKey) => {
  return localStorage.getItem(tokenKey);
};
export const removeLocalStorage = (tokenKey) => {
  return localStorage.removeItem(tokenKey);
};