import request from "@/utils/request";

export const getAllCus = () => {
  return request({
    url: "/cus",
    method: "GET",
  });
};
export const getAllCus2 = () => {
  return request({
    url: "/cus/2",
    method: "GET",
  });
};
export const createCus = (data) => {
  return request({
    url: "/cus",
    method: "POST",
    data,
  });
};

export const editCus = (data) => {
  return request({
    url: `/cus/${data.id}`,
    method: "PATCH",
    data,
  });
};

export const deleteCus = (data) => {
  return request({
    url: `/cus/${data.cus_id}`,
    method: "DELETE",
    data,
  });
};
