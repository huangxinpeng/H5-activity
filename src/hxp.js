import URL from '@/http/com.js'
export function userInfo(url,data) {
    var _href = window.location.href;
    var ADTAGTYPE = ''
    _href.indexOf('ADTAG') > -1 ? ADTAGTYPE = getUrlParam('ADTAG') : ADTAGTYPE=''
    if (localStorage.getItem('ADTAGTYPE')){
        ADTAGTYPE = localStorage.getItem('ADTAGTYPE')
    }
    console.log(ADTAGTYPE)
    //去F7页面传递参数
    // url---页面  data    有值须&开头、字符串 空值为：'' 
    // 列如：url:detail data:&id=32 或者data:''
    let user_info = ''
    let home_url = URL.homeUrl || ''
    if (localStorage.getItem('mobile')){
        var mobile = localStorage.getItem('mobile')||''
        var userId = localStorage.getItem('userId')||''
        var userName = localStorage.getItem('userName')||''
        user_info = '&mobile=' + mobile + '&userId=' + userId + '&name=' + userName + '&ADTAG=' + ADTAGTYPE
        window.location.href = home_url + url + data + user_info
    }else{
        window.location.href = home_url + url + data + '&islogin=N' + '&ADTAG=' + ADTAGTYPE
    }
}
export function getUrlParam(name){
    //截取URL值
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var usefulInfo = window.location.href.split('?')[1];
    if (usefulInfo) {
        var r = usefulInfo.match(reg);
    }
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}