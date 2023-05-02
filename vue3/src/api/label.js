import request from './request'


export const getLabel = ()=>{
    return request({
      url: "/label",
      method: "GET",
    });
}
export const createLabel = (data) => {
  return request({
    url: "/label",
    method: "POST",
    data,
  });
};
