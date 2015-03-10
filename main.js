'use strict';

(function () {

  /*
   * Required libraries.
   */
  var fs = require('fs');
  var xml2js = require('xml2js');
  var path = require('path');

  /*
   * Object to map version numbers names to values.
   */ 
  var versionMap = {};

  /*
    Parse pom.xml and load version numbers in an object.
  */
  exports.loadPom = function(pomFile) {

    var parser = new xml2js.Parser();
    var xml = fs.readFileSync(pomFile);
 
    parser.parseString(xml, function (err, result) {
      //console.dir(result);
      //console.dir(result.project.properties);
      var props = result.project.properties[0];
      Object.keys(props).forEach(function(value) {
        // console.log(value);
        if (value.indexOf('.version') > 0) {
          // console.log('version ' + value + ' = ' + props[value][0]);
          versionMap[value] = props[value][0];
        }
      });
    });
  };

  exports.connectMiddleware = function(req, res, next) {

    // Only scans html files
    if (path.extname( req.url ) === '.html') {

      var write = res.write;

      res.write = function (string, encoding) {
        var body = string instanceof Buffer ? string.toString() : string;

        body = body.replace(/\$\{(\w[\w|-]*\.version)\}/g, function (w, f1) {
          return versionMap[f1] || w;
        });

        if (string instanceof Buffer) {
          string = new Buffer(body);
        } else {
          string = body;
        }

        write.call(res, string, encoding);
      };
    };

    next();
  };
})();
