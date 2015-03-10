# WebJarVer

A npm package to automate webjar version handling when using livereload.

## Installation

Install like any other npm package:

```
npm install webjarver
```

## Usage

In the middleware property of livereload middleware function load pom.xml and insert WebJarVer in the middleware array. __It must be inserted after Livereload's livereloadSnippet.__

Here is an example:

```
		connect : {
			options : {
				port : 9000,
				hostname : "0.0.0.0"
			},
			livereload : {
				options : {
					middleware : function(connect) {

						var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

						// Require webjarver library
						var webjarver = require('webjarver');

						// Load pom.xml passing its location
						webjarver.loadPom(__dirname + '/pom.xml');

						return [
							proxySnippet,
							require('grunt-contrib-livereload/lib/utils').livereloadSnippet,

							// Load WebJarVer middleware
							webjarver.connectMiddleware
						];
					}
				}
			}
```

## Roadmap

1. Convert into a Grunt task to reload version numbers when watch detects a pom.xml change.
1. Add a task to integrate into Grunt build.

## Change Log

* 1.0.0 - initial release. Connect middleware to be used with LiveReload.
