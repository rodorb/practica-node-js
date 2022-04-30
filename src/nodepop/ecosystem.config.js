module.exports = {
    apps: [{
        name: 'nodepop',
        script: './bin/www',
        watch: '.',
        env_development: {
            NODE_ENV: 'development',
            DEBUG: 'nodeapp:*',
            PORT: 3000
        },
        log_date_format: "YYYY-MM-DD HH:mm"
    }, {
        name: 'thumbnailsService',
        script: './lib/imageResizingService.js',
        watch: ['./lib']
    }]
};