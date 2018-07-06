const acceptParser = require('accept-language-parser')
const extend = require('extend')
// const { parseOptions: parserConfig } = require('./configs')
const parserConfig = {
  order: ['query', 'cookie', 'headers'],
  param: 'language',
  cookie: 'language',
  query: 'language',
  header: 'accept-language',
  dash: '-'
}
module.exports = (locales = {}, request, options = {}) => {
  const config = extend({}, parserConfig, options)
  const parseQuery = (request) => {
    const { query } = config
    const lang = request.query[query]
    if (lang && typeof lang === 'string') {
      return lang.split(',')
    }
    return []
  }
  const parseCookie = (request) => {
    if (!config.cookie) {
      return []
    }
    const lang = request.state[config.cookie]
    if (lang) {
      return lang.split(',')
    }
    return []
  }
  const parseHeader = (request) => {
    try {
      const header = request.headers[config.header]
      const raw = acceptParser.parse(header)
      return raw.map(item => {
        return item.region ? [item.code, item.region].join(config.dash) : item.code
      })
    } catch (error) {
      return []
    }
  }
  const queryLanguages = parseQuery(request)
  const cookieLanguages = parseCookie(request)
  const headerLanguages = parseHeader(request)
  const arr = queryLanguages.concat(cookieLanguages, headerLanguages, config.default).filter(item => item)
  const languages = [...new Set(arr)]
  let language = null
  for (let lang of languages) {
    if (locales[lang]) {
      language = lang
      break
    }
  }
  return language
}
