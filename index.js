const extend = require('extend')
const Boom = require('boom')
const parser = require('./parser')
const parseLanguage = Symbol('parseLanguage')
const setLanguage = Symbol('setLanguage')
class Common {
  get Boom () {
    return Boom
  }
  t (key) {
    const { locale = {} } = this
    return locale[key] || ''
  }
  error (key) {
    const { locale = {} } = this
    const message = locale[key]
    return new Boom(message, {
      statusCode: parseInt(key) || 500
    })
  }
  boom (message, options) {
    let boomOptions = options
    if (typeof options === 'number') {
      boomOptions = {
        statusCode: options
      }
    } else {
      boomOptions = extend({
        statusCode: 500
      }, options)
    }
    return new Boom(message, boomOptions)
  }
}

class Child extends Common {
  constructor (locales) {
    super()
    this.locales = locales
  }
  get locale () {
    return this.locales[this.language] || {}
  }
  [parseLanguage] (request, config, language) {
    this.language = parser(this.locales, request, config) || language
    return this
  }
  [setLanguage] (language) {
    this.language = language
    return this
  }
}
class I18n extends Common {
  constructor (locales = {}) {
    super()
    this.parserConfig = {}
    this.locales = locales
    this.code = 500
    this.language = 'zh'
  }
  get locale () {
    return this.locales[this.language]
  }
  addLocale (lang, locale) {
    return this.addLocales({
      [lang]: locale
    })
  }
  addLocales (locales) {
    extend(this.locales, locales, true)
    return this
  }
  config (config) {
    extend(this.parserConfig, config, true)
    return this
  }
  parse (request, config) {
    const child = new Child(this.locales)
    let options = this.parserConfig
    if (config) {
      options = extend({}, this.parserConfig, config)
    }
    return child[parseLanguage](request, options, this.language)
  }
  child (lang) {
    const child = new Child(this.locales)
    return child[setLanguage](lang)
  }
  language (language) {
    this.language = language
    return this
  }
  code (code) {
    this.code = code
  }
}
module.exports = I18n
