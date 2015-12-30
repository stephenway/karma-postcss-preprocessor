# karma-postcss-preprocessor
Karma preprocessor to compile CSS on the fly with PostCSS

## Install

```shell
npm install --save-dev karma-postcss-preprocessor
```

## Setup
Reference [PostCSS options](https://www.npmjs.com/package/postcss#options) for how this works.

```js
module.exports = function (config) {
  config.set({
	  preprocessors: {
			‘src/**/*.css’: [‘css’]
		},
		PostCSSPreprocessor: {
		  options: { map: true }
		}
	});
};
```

## License
This project is licensed under the [MIT license](LICENSE).

