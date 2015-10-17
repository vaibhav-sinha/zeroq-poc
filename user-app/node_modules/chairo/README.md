#chairo

**chairo** ("happy" in ancient Greek: χαίρω) is a [**Seneca**](http://senecajs.org/) micro-services plugin
for [hapi](https://github.com/hapijs/hapi). The plugin integrates the **Seneca** functionality into
**hapi** and provide tools to map its actions to server methods and views for easy access.

[![Build Status](https://secure.travis-ci.org/hapijs/chairo.png)](http://travis-ci.org/hapijs/chairo)

Lead Maintainer - [Wyatt Preul](https://github.com/geek)

### Usage

#### Plugin Registration

**chairo** is registered with a **hapi** server using the `server.register()` method. Once
registered it decorates the `server` object with a reference to the `seneca` object initialized
using the provided plugin options:

```js
var Chairo = require('chairo');
var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection();

// Pass options to the Seneca constructor

var senecaOptions = { log: 'silent' };

// Register plugin

server.register({ register: Chairo, options: senecaOptions }, function (err) {

	// Add a Seneca action

    var id = 0;
    server.seneca.add({ generate: 'id' }, function (message, next) {

        return next(null, { id: ++id });
    });

	// Invoke a Seneca action

    server.seneca.act({ generate: 'id' }, function (err, result) {

        // result: { id: 1 }
    });
});
```

In addition, the **hapi** request object is decorated with a reference to the `seneca` object for
easy access:

```js
server.route({
	method: 'POST',
	path: '/id',
	handler: function (request, reply) {

		// Invoke a Seneca action using the request decoration

		request.seneca.act({ generate: 'id' }, function (err, result) {

			if (err) {
				return reply(err);
			}

			return reply(result);
		});
	}
});
```

#### `server.action(name, pattern, [options])`

Maps a **Seneca** action pattern to a **hapi**
[server method](https://github.com/hapijs/hapi/blob/master/API.md#servermethodname-method-options)
 where:
- `name` - the server method name (same as the name used in `server.method()`).
- `pattern` - the **Seneca** action pattern (e.g. `'generate:id'` or `{ generate: 'id' }`) to map.
- `options` - optional settings options where:
    - `cache` - method caching options (same as the name used in `server.method()`).

```js
var Chairo = require('chairo');
var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection();
server.register(Chairo, function (err) {

	// Set up a Seneca action

    var id = 0;
    server.seneca.add({ generate: 'id' }, function (message, next) {

        return next(null, { id: ++id });
    });

	// Map action to a hapi server method

    server.action('generate', 'generate:id', { cache: { expiresIn: 1000, generateTimeout: 3000 } });

	// Start hapi server (starts cache)

    server.start(function () {

		// Invoke server method

        server.methods.generate(function (err, result1) {

			// Invoke the same server method

            server.methods.generate(function (err, result2) {

				// result1 === result2 (cached)
            });
        });
    });
});
```

#### `reply.act(pattern)`

Sends back a handler response using the result of a **Seneca** action where:
- `pattern` - the **Seneca** action called to generate the response.

```js
var Chairo = require('chairo');
var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection();
server.register(Chairo, function (err) {

	// Set up a Seneca action

    var id = 0;
    server.seneca.add({ generate: 'id' }, function (message, next) {

        return next(null, { id: ++id });
    });

	// Add route

    server.route({
		method: 'POST',
		path: '/id',
		handler: function (request, reply) {

			// Reply using a Seneca action

			return reply.act({ generate: 'id' });
		}
	});
});
```

In addition, the `act` handler shortcut is also provided:

```js
server.route({
	method: 'POST',
	path: '/id',
	handler: { act: 'generate:id' }
});
```

#### `reply.compose(template, context, [options])`

Renders a template view using the provided template and context where:
- `template` - the view engine template (same as the name used in
  [`reply.view()`](https://github.com/hapijs/hapi/blob/master/API.md#replyviewtemplate-context-options)).
- `context` - the context object used to render the template where each top level key with a `$`
  suffix is assigned the corresponding **Seneca** action matching the key's value pattern.
- `options` - optionals settings passed to `reply.view()`.

```js
var Chairo = require('chairo');
var Handlebars = require('handlebars');
var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection();
server.register(Chairo, function (err) {

	// set up a few Seneca actions

    server.seneca.add({ lookup: 'date' }, function (message, next) {

        return next(null, { date: (new Date()).toString() });
    });

    server.seneca.add({ load: 'user' }, function (message, next) {

        return next(null, { name: message.name });
    });

	// Set up a hapi view engine

    server.views({
        engines: { html: Handlebars },
        path: __dirname + '/templates'
    });

	// Add route

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {

			// Setup context with both Seneca actions and simple keys

            var context = {
                today$: 'lookup:date',							// Using string pattern
                user$: { load: 'user', name: 'john' },			// Using object pattern
                general: {
                    message: 'hello!'
                }
            };

			// Reply with rendered view

            return reply.compose('example', context);
        }
    });
});
```

Using the template `./templates/example.html`:

```html
<div>
    <h1>{{today$.date}}</h1>
    <h2>{{user$.name}}</h2>
    <h3>{{general.message}}</h3>
</div>
```

In addition, the `compose` handler shortcut is also provided:

```js
server.route({
	method: 'POST',
	path: '/id',
    handler: {
        compose: {
            template: 'example',
            context: {
                today$: 'lookup:date',
                user$: { load: 'user', name: 'john' },
                general: {
                    message: 'hello!'
                }
            }
        }
    }
});
```
