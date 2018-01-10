// 断言库-jasmine
// 在terminal中使用 jasmine test/test.js 进行测试    
const Jasmine = require('jasmine');
const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

// 自定义的延迟函数,默认延迟200ms
const delay = require('./delay');

let chromeFlags = [];
// 是否需要chrome开启headless模式
let isHeadless = false;
isHeadless && chromeFlags.push('--headless');


async function main() {
    const option = {
        port: 9222,
        chromeFlags,
    };

    // 启动浏览器
    // ** 确保chrome在环境路径中
    let chrome = await chromeLauncher.launch(option);
    let client = await CDP(option);
    let {
        Runtime,
        Network,
        Page,
    } = client;

    

    await Promise.all([Network.enable(), Page.enable(), ]);


    // 打开页面
    let url = 'http://127.0.0.1:8080/';
    await Page.navigate({
        url
    });
    await Page.loadEventFired();

    
    // 测试函数,最后要当成字符串传入sandbox
    // ** 函数体的内容必须要"干净",不能向外有依赖
    let testMethod = async function() {
        console.log('testMethod');
        let ret = [];



        // 断言
        // 1. .left下color为蓝色
        {
            let left = document.querySelector('.left');
            let item = {
                name: '.left下color为蓝色',
                expect: 'rgb(0,0,255)',
                result: getComputedStyle(left).color.replace(/\s/g, ''),
            };
            ret.push(item);
        }
        // 2. .left>.title的color为红色
        {
            let left = document.querySelector('.left');
            let title = left.querySelector('.title');
            let item = {
                name: '.left>.title的color为红色',
                expect: 'rgb(255,0,0)',
                result: getComputedStyle(title).color.replace(/\s/g, ''),
            }
            ret.push(item);
        }
        // 3. .right下id为change的button点击之后,.left>.title的color为绿色
        {
            let change = document.querySelector('#change');
            change.click();
            await __delay__();
            let left = document.querySelector('.left');
            let title = left.querySelector('.title');
            let item = {
                name: '.left>.title的color为绿色',
                expect: 'rgb(0,128,0)',
                result: getComputedStyle(title).color.replace(/\s/g, ''),
            };
            ret.push(item);
        }
        // 4. .right下id为asyncGet的button点击之后,.right>.list出现异步请求的数个li标签
        {
            let asyncGet = document.querySelector('#asyncGet');
            asyncGet.click();
            await __delay__(2000); // 很重要
            let lis = document.querySelectorAll('.right>.list li');
            let item = {
                name: '.right下id为asyncGet的button点击之后,.right>.list出现异步请求的数个li标签',
                expect: true,
                result: !!(lis && lis.length),
            };
            ret.push(item);
        }

        // 这个数据可以在chrome的控制台看到,而不是在nodejs的terminal看到
        // 当然前提是你要取消headless
        console.log({
            ret: JSON.stringify(ret)
        });

        // 必须序列化的把数据从sandbox返回回来
        return JSON.stringify(ret);
    };

    // inject delay function;
    // 为了方便的等待一些异步回调
    await Runtime.evaluate({
        expression: `window.__delay__=${delay};`
    });

    // test bundle
    let expression = `(${testMethod})()`;
    let {
        result: {
            value,
        }
    } = await Runtime.evaluate({
        expression,
        // 如果传入的函数是个async函数,请加上这个标记
        // ** 使用async可以方便的使用前面注入的__delay__函数
        awaitPromise: true
    });


    // 关闭页面
    await client.close();
    // 关闭chrome浏览器
    await chrome.kill();
    return JSON.parse(value);
};

main();


// describe('test index.html', () => {
//     it('subTitle', (done/*异步测试需要回调*/) => {
//         main().then(ret => {
//             ret.forEach(item => {
//                 expect(item.expect).toBe(item.result);
//             });
//             done();/*回调被调用,通知jasmine*/
//         });
//     },10000/*某些测试中,回调的时间会比较长,那这里可以显式的确定最大等待时间[默认是5秒]*/);
// });