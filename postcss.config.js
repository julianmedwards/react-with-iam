module.exports = {
    plugins: {
        autoprefixer: {},
        'postcss-nesting': {},
        'postcss-sorting': {
            order: [
                'custom-properties',
                'dollar-variables',
                'declarations',
                'at-rules',
                'rules',
            ],
            'properties-order': 'alphabetical',
            'unspecified-properties-position': 'bottom',
        },
    },
}
