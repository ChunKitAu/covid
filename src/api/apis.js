import HttpRequest from "./http";
import { urls } from "./urls";
const http = HttpRequest.getInstance();

// 获取疫情城市
export const GetCity= () => {
    return http.get(urls.GetCity);
}

// 获取全部用户某天定位
export const GetPositionByDate= (data) => {
    return http.get(urls.GetPositionByDate,data);
}

// 主键获取用户信息
export const GetUser= (data) => {
    return http.get(urls.GetUser,data);
}