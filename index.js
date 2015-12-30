var postcss = require('postcss');
var path = require('path');
var chalk = require('chalk');

function formattedPostCSSMessage(error) {
  var relativePath = '',
      filePath = error.file === 'stdin' ? file.path : error.file,
      message = '';

  filePath = filePath ? filePath : file.path;
  relativePath = path.relative(process.cwd(), filePath);

  message += chalk.underline(relativePath) + '\n';
  message += chalk.gray('  ' + error.line + ':' + error.column) + '  ';
  message += error.message
    .replace(/: "([^"]*)"\.$/, ': $1')
    .replace(/: (.*)/, ': ' + chalk.yellow('$1'));

  return message;
}

/**
 * Preprocessor factory
 * @param args   {Object} Config object of custom preprocessor.
 * @param config {Object} Config object of PostCSS Preprocessor.
 * @param logger {Object} Karma's logger.
 * @param helper {Object} Karma's helper functions.
 */
function createPostCSSPreprocessor(args, config, logger, helper) {
  config = config || {};

  var log = logger.create('preprocessor.css');

  // Options. See https://www.npmjs.com/package/postcss#options
  var options = helper.merge({
    map: { inline: false }
  }, args.options || {}, config.options || {});

  return function (content, file, done) {
    var result = null;

    log.debug('Processing "%s".', file.originalPath);

    // Clone the options because we need to mutate them
    var opts = helper._.clone(options);

    // Inline maps
    if (opts.map) {
      opts.map: { inline: true };
      opts.annotation = false;
    }

    // Process
    try {
      opts.from = file.originalPath;
      result = postcss.process(css, { opts });
    }
    catch (error) {
      var message = formattedPostCSSMessage(error);
      log.error('%s\n  at %s:%d', message, file.originalPath, error.line);
      error.message = chalk.stripColor(message);
      return done(error, null);
    }

    done(null, result.css || result);
  }
}

// Dependencies
createPostCSSPreprocessor.$inject = ['args', 'config.PostCSSPreprocessor', 'logger', 'helper'];

// Export
module.exports = {
  'preprocessor:css': ['factory', createPostCSSPreprocessor]
}
