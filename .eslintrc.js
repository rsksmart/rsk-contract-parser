module.exports = {
    "plugins": [
        "json"
    ],
    "extends": ["standard", "plugin:json/recommended"],
    "env": {
        "node": true,
        "mocha": true
    },
    "parser": "@babel/eslint-parser",
    "parserOptions": {
        "ecmaVersion": 2022,
    }
};
