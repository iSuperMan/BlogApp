import { pick } from 'underscore'

/**
 * Создаем мидлвер, который возращает новый объект в req.body,
 * где будут значения только для ключей, указанных в allowedFields.
 * 
 * Тем самым мы очищаем req.body от нежелательных данных и делаем его более
 * безопасным для массового присвоения(mass assignment).
 * 
 * @param allowedFields
 */
module.exports = allowedFields => (req, res, next) => {
    req.body = pick(req.body, allowedFields)
    next();
}