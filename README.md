# WebJarVer

This package is intended to be used in projects having a Java backend that use [Maven](http://maven.apache.org/) for build and [WebJars](http://www.webjars.org/) to handle Javascript libraries. WebJars pack Javascript libraries in paths which include the version number of the library like this:

```html
<script type="text/javascript" src="webjars/angularjs/1.3.14/angular.min.js"></script>
```

It's also necessary to have the version number in the pom dependency:

```xml
  <dependency>
    <groupId>org.webjars</groupId>
    <artifactId>angularjs</artifactId>
    <version>1.3.14</version>
  </dependency>
```

This setup allows to run a Grunt server with Livereload and a proxy during development, but requires to keep the version numbers in at least two diferent files.

To avoid problems with unsynchronized version numbers, I choose to let Maven handle it. Version numbers are written as properties in the pom and Maven resource filtering takes care of replacing their references in HTML files that reference the libraries.

Dependencies in pom.xml are written like this:

```xml
<properties>
  <angularjs.version>1.3.14</angular.version>
</properties>

<dependencies>
  <dependency>
    <groupId>org.webjars</groupId>
    <artifactId>angularjs</artifactId>
    <version>${angularjs.version}</version>
  </dependency>
</dependencies>
```

The Javascript library can be referenced as such:

```html
<script type="text/javascript" src="webjars/angularjs/${angularjs.version}/angular.min.js"></script>
```

It also necessary to include a filtering configuration in pom.xml. This example assumes that webapp static resources are at src/main/resources/public following one of Spring Boot's conventions:

```xml
<build>
	<resources>
		<resource>
			<directory>src/main/resources</directory>
			<filtering>false</filtering>
		</resource>
		<resource>
      <directory>src/main/resources/public</directory>
      <filtering>true</filtering>
      <includes>
        <include>**/*.html</include>
      </includes>
    </resource>
	</resources>
</build>
```

## Installation

Install like any other npm package:

```
npm install webjarver
```

## Usage

In Gruntfile. js, the middleware property of livereload middleware function should load pom.xml and insert WebJarVer in the middleware array. __It must be inserted after Livereload's livereloadSnippet.__

Here is an example:

```javascript
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
