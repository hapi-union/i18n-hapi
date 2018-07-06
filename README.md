# i18n-hapi
hapi服务端多语言解决方案

## 安装
```
npm install i18n-hapi --save
```
## 参数及默认配置
```
// 默认parseOptions
{
  // 从request中获取语言参数的顺序
  order: ['query', 'cookie', 'headers'],
  // query参数中语言字段名
  query: 'language',
  // cookie参数中语言字段名
  cookie: 'language',
  // headers中语言字段名
  header: 'accept-language',
  // 从header中获取到的code和region之间的连接符
  dash: '_'
}
// 默认语言为 `zh`
// 默认错误代码为 500
// locales参数格式如下
{
  'zh': {
    key: 'zh message',
    404: '不存在'
  },
  'en': {
    key: 'en message',
    404: 'not found'
  }
}
```

## 模块级实例获取及实例方法
```
// common.js
const I18n = require('i18n-hapi')
const i18n = new I18n(locales)
module.exports = i18n
  // 设置默认语言
  .language(lang)
  // 设置boom的默认错误代码
  .code(code)
  // 从request解析语言选项的公共配置
  .config(parseOptions)
  // 带语言键合并locales,可合并多种语言
  .addLocales({ 'zh': { key: 'value' } })
  // 单独设置语言,每次只可合并一种语言
  .addLocale('zh', { key: 'value' })

  // 其他方法
  const message = i18n.t('key')
  i18n.error(404)                  // new Boom(i18n.t(404), { statusCode: 404 })
  i18n.boom(message, code)         // new Boom(message, { statusCode: code })
  i18n.boom(message)               // new Boom(message, { statusCode: defaultCode || 500 })
  i18n.boom(message, options)      // new Boom(message, options})
  i18n.Boom === require('boom')
```

## request级实例获取及实例方法
```
  const i18n = require('./common.js')
  const ins = i18n.parse(request[,parseConfig])  // parseConfig配置只影响当前request
  // const ins = i18n.child('en')                // 直接指定语言进行翻译
  ins.t('key')  // 翻译对应的key
  ins.error     // 用法通 locales.error
  ins.boom      // 用法通 locales.boom
  ins.Boom === require('boom')
```