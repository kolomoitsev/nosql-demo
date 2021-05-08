const config = {
    PORT: 3001,
    MONGOOSE_LINK:
        'mongodb+srv://kolomoitsev:HVZD4EdjqXNV6ihQ@cluster0.hnn0k.mongodb.net/nosql-rest-api?retryWrites=true&w=majority&ssl=true',
    jwt: {
        secret: 'sigmatestkey',
        tokens: {
            access: {
                type: 'access',
                expiresIn: '2m',
            },
            refresh: {
                type: 'refresh',
                expiresIn: '5m',
            },
        },
    },
};

module.exports = config;