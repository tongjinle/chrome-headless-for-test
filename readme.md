# 测试demo
> 使用chrome-headless来进行e2e测试

## 安装
> 用以启动chrome
npm i chrome-launcher

> 基于chrome-headless的第三方库
npm i chrome-remote-interface

## 测试目标
1. .left下color为蓝色
2. .left>.title的color为红色
3. .right下id为change的button点击之后,.left>.title的color为绿色
3. .right下id为asyncGet的button点击之后,.right>.list出现异步请求的数个li标签