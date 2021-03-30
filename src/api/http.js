import axios from 'axios';

class HttpRequest {
    constructor() {
        this.instance = axios.create();
        this.interceptor();
    }

    // 单例模式
    static getInstance() {
        if (!this.httpRequest) {
            this.httpRequest = new HttpRequest();
        }
        return this.httpRequest;
    }

    // 拦截器
    interceptor() {
        // 请求拦截器
        this.instance.interceptors.request.use(config => {
            config.baseURL = 'http://127.0.0.1:8086/covid19';
            return config;
        }, error => {
            // do something
            return Promise.reject(error);
        });

        // 响应拦截器
        this.instance.interceptors.response.use(response => {

            return response;
        }, error => {
            console.log(error);
            // do something
            return Promise.reject(error);
        })
    }

    // 通用的GET
    get(url, data) {
        return this.instance({
            url: url,
            method: 'get',
            baseURL: this.baseURL,
            // data: QS.stringify(data),
            params: data,
            headers: {
                'Content-Type': "application/x-www-form-urlencoded",
            }
        })
    }

    // 通用的POST
    post(url, data) {
        return this.instance({
            url: url,
            method: 'post',
            // data: QS.stringify(data),
            data: data,
            baseURL: this.baseURL,
            headers: {
                'Content-Type': "application/json;charset=UTF-8",
            }
        })
    }

    postFile(url, data) {
        return this.instance({
            url: url,
            method: 'post',
            data: data,
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }


    put(url, data) {
        return this.instance({
            url: url,
            method: 'put',
            baseURL: this.baseURL,
            data: data,
            headers: {
                'Content-Type': "application/json;charset=UTF-8",
            }
        })

    }

    del(url, data) {
        return this.instance({
            url: url,
            method: 'delete',
            baseURL: this.baseURL,
            data: data,
            headers: {
                'Content-Type': "application/json;charset=UTF-8",
            }
        })

    }

}

export default HttpRequest;
