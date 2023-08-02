const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '') || 5000,
    jwtOptions: {
        issuer: process.env.VITE_API_URL,
        audience: process.env.CLIENT_URL || 'localhost',
    },
}

export default config
