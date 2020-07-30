
import fly from 'flyio';
import { createHashHistory } from 'history';
import { message } from "antd";
// 哈希模式的跳转 forceRefresh 重新加载页面 const history = createHashHistory({ forceRefresh: true });
const history = createHashHistory();
fly.config.timeout = 10000;

let onLine = true;
let timeout: any;
let messageSendTime = 0
//添加请求拦截器
fly.interceptors.request.use((request:any) => {
    //终止请求
    if (!navigator.onLine) {
        if (onLine) {
            onLine = false;
            message.error('操作失败，请检查网络');
            timeout = setTimeout(() => {
                onLine = true;
                clearTimeout(timeout);
            }, 3000)
        }
        return Promise.reject();
    }
    clearTimeout(timeout);
})
fly.interceptors.response.use(
    response => {
        return Promise.reject(response);
    },
    (err: any) => {

        let now = new Date().getTime()
        if(now - messageSendTime > 3000){
            console.log(err);
            console.log(err.request.url);
            if(err.request.url.indexOf('.api')<=0){
                message.error('服务器错误!');
            }
            messageSendTime = now
        }
        return Promise.reject(err);
    }
);
export default fly;
