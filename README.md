# Plato

Show master thesis information using Solid.

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

## License

This code is copyrighted by [Ghent University – imec](http://idlab.ugent.be/) and
released under the [MIT license](http://opensource.org/licenses/MIT).
