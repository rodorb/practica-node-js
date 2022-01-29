function isAPIRequest(request) {
    return request.originalUrl.startsWith('/api/')
}


module.exports = {
    isAPIRequest
}