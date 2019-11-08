const $siteList = $('.siteList')//先找到siteList
const $listLi = $siteList.find('li.last')//声明一个listLi，在siteList里找到li的last（li）
const x = localStorage.getItem('x')//从localStorage里把x读出来，目前x还是字符串[先尝试读取当前网站下的x]
const xObject = JSON.parse(x)//把字符串x变成对象

const hashMap = xObject || [//（使用数据结构）创建一个哈希组成的数组，来保存网址[如果x成功的变成对象，就把x放到哈希map里。如果不能变成对象，我就把哈希初始化成含有2项的数组]
    { logo: 'A', logoType: 'text', url: 'https://www.acfun.cn' },//logo的类型是文本
    { logo: 'B', logoType: 'text', url: 'https://www.bilibili.com' }
];

//simplify简化Url
const simplifyUrl = (url) => {  //接收一个以http开头的url，需要返回一个没有http，没有www的
    return url.replace('https://', '')  //把https://删掉，变成一个空字符串
        .replace('http://', '')  //如果还有，就把http://删掉，变成空字符串
        .replace('www.', '')     //如果还有，就把www.删掉
        .replace(/\/.*/, '')     //正则，删除/开头的内容， .*表示/后面的任何东西都需要匹配到
}   //replace 会把url变成新的字符串，原本的字符串不变，所以不能return url

const render = () => {
    $siteList.find('li:not(.last)').remove()//找到所有siteList里的所有li，唯独不找最后一个li（.list），然后删除
    hashMap.forEach((node, index) => { //forEach会给你2个参数，一个是node，一个是下标
        const $li = $(`<li>
            <div class="site">
                <div class="logo">${node.logo}</div>
                <div class="link">${simplifyUrl(node.url)}</div>
                <div class='close'>
                   <svg class="icon">
                      <use xlink:href="#icon-close"></use>
                   </svg>
                </div>
            </div>
        </li>`).insertBefore($listLi)//现在使用hashmap，新增网站时只需把hashmap增加一项，然后在从新渲染hashmap
        //用js实现a标签功能，因为使用a标签时，不能点击关闭按钮
        $li.on('click', () => {  //当点击li的click（click自己，不需要click里面）
            window.open(node.url) //window.open（打开一个新窗口），地址是node.url
        })
        $li.on('click', '.close', (e) => { //当点击li里面的close时，得到事件e，然后调用e.stopPropagation()
            e.stopPropagation()//阻止冒泡，就是点击关闭按钮，不跳转页面
            hashMap.splice(index, 1)  //在哈希map里（数组里删除使用splice），在index处，删掉1个
            render() //从新渲染哈希map
        })
    })
}

render()

$('.addButton')
    //监听addButton的点击事件
    .on('click', () => {
        let url = window.prompt('请问你要添加的网址是什么？')//弹出一个对话框让用户输入网址
        //声明一个url 等于用户输入的网站
        if (url.indexOf('http') !== 0) {//如果url的第一个字符不等于0，说明不是http开头
            url = 'https://' + url//就帮用户自动加上https
        }
        console.log(url)
        /*const $li = $(`
        < li >
        <a href="${url}">
            <div class="site">
                <div class="logo">${url[8]}</div>
                <div class="link">${url}</div>
            </div>
        </a>
        </li >
        `).insertBefore($listLi)//创建一个div，把变量url作为logo和网址，通过inserBefore API 把新创建的div插到listLi前面*/
        hashMap.push({
            logo: simplifyUrl(url)[0].toUpperCase(),//JS方式toUpperCase()把一个字母变成大写，还有css方法
            //调用简化url函数，删除https，留下首字母
            logoType: 'text',
            url: url
        });//点击添加按钮时，在哈希变上添加新的网址
        render()
    });

window.onbeforeunload = () => {//用户关闭页面之前触发的api，等于一个函数[在你关闭网页是，会被哈希存到x里]
    const string = JSON.stringify(hashMap)//把哈希表变成字符串（JSON是api），因为localStorage只能存字符串
    localStorage.setItem('x', string)//在本地存储里，设置一个x，它的值是刚才存储的字符串
}

//监听        //键盘按下事件
$(document).on('keypress', (e) => {
    const { key } = e    //是 const key = e.key 的简写
    for (let i = 0; i < hashMap.length; i++) { //遍历哈希，看谁的logo 等于 key（输入的字母）
        if (hashMap[i].logo.toLowerCase() === key) { //toLowerCase() 把字母变成小写
            window.open(hashMap[i].url)   //打开哈希 第i个的 url
        }
    }
})