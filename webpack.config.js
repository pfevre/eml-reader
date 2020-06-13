const path = require('path');
var I18nPlugin = require('i18n-webpack-plugin');
var languages = {
    en: null,
    de: require(path.resolve(__dirname, 'locales/de.json')),
    fr: require(path.resolve(__dirname, 'locales/fr.json'))
};

module.exports = Object.keys(languages).map(function(language) {
    return {
        entry: './public/src/app.js',
        output: {
            //path: path.resolve(__dirname, 'public/src'),
            path: path.resolve(__dirname, 'public/dist'),
            //filename: 'app.js'
            filename: 'app-'+language+'.js'
        },
        resolve: {
            alias: {
                jquery: "jquery/src/jquery"
            }
        },
        //plugins: [new I18nPlugin(languages['fr'])]
        plugins: [new I18nPlugin(languages[language])]
    };
});
