# Plato

This Web app shows master thesis information using Solid.
A live version is available [here](https://solid-plato.netlify.app/id).

## Usage
Install dependencies via
```shell
npm i
```
Run locally and watch for changes via
```shell
npm run watch
```
Browse to <http://localhost:8080>.

### Query parameters

## Custom resource location
Data is loaded by default from <https://pheyvaer.pod.knows.idlab.ugent.be/examples/master-thesis-students/1-public>.
You can set your own location by using the query parameter `location` where its value is the location.
An example is <http://localhost:8080?location=http://example.com/my-data>.

## Enable Client ID
You can enable the use of [Client ID](https://solid.github.io/solid-oidc/#clientids-document)
by using the query parameter `enable_client_id` with the value `true`.
The Client ID is disabled by default at the moment because
of a bug in Community Solid Servers with a version lower than 4.0.1.

## Client ID
The Client ID is served at `/id`.
You find the template for the Client ID in the `id-raw`.
You can add more information about your Web app to the template if you want to.
You generate the Client ID based on `id-raw` for development via
```shell
npm run build:id:dev
```
and for production via
```shell
npm run build:id:prod
```
You find the result in the file `id`.
We configured the Webpack dev server to set the Content-Type of `/id` to `application/ld+json`
in `webpack.dev.config.js`.

As a result, 
during development the Client ID is hosted on localhost and 
the information it contains all relates to localhost as well.
In production the actual production urls are used. 
You find the changes you need to do for production [here](#prepare-for-production).

## Prepare for production
You need to update the following to prepare the Web app for production.

- Update the `build:id:prod` script in `package.json` to use your production url of the Web app.
- Update the `CLIENT_ID` in `webpack.config.js` to use your production url of the Client ID of the Web app.

## License

This code is copyrighted by [Ghent University – imec](http://idlab.ugent.be/) and
released under the [MIT license](http://opensource.org/licenses/MIT).
