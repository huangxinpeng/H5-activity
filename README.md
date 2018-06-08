# City activity

> A Vue.js project based on mint-ui

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```


为方便解读及参与后续开发，本业务遵循以下：


1. rem 单位以 750px 手机屏基准为 100px ，根据实际屏幕尺寸计算，即 1rem = 100px，设计稿尺寸上 10px = 0.1rem, 用于设定容器宽高，字体等沿用px

2. 基于 MintUI + Less 开发

	--> MintUI 在入口引入后，单个文件需再次申明调用组件，具体查看官方文档

3. 请求接口 axios  

	路径：http/sdk 

4. reset.css   --> 样式重置

					box-sizing:border-box

					clearfix   --> 清除浮动

   custom.less --> 主题样式覆盖

5. 项目参与者安装依赖，慎用 -g ，请以--save-dev或--save代替

6. 	/     --> 底部tab  （重定向为 Home ）

	/Home --> 首页

	/User --> 我的活动

7. class 定义尽量遵循以下：

	模块 : (区块 - 功能) 方式命名 ， 如： top-banner , act-hot

	内部 : (功能 - 结构) 方式命名 ， 如： special-item

	避免嵌套多层 class 


8. 组件封装 : 
	@/components/

	内容滚动 -- marquee
	
	导航栏 -- topHeader

	活动列表 -- action

		|_ 倒计时 -- timeCount


9. 原生调用 : 
	toWap --> 调用原生方法 控制导航栏显隐 ，及关闭窗口