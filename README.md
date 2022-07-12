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

## Custom resource location
Data is loaded by default from <https://pheyvaer.pod.knows.idlab.ugent.be/examples/master-thesis-students/1-public>.
You can set your own location by using the query parameter `location` where its value is the location.
An example is <http://localhost:8080?location=http://example.com/my-data>.

## License

This code is copyrighted by [Ghent University – imec](http://idlab.ugent.be/) and
released under the [MIT license](http://opensource.org/licenses/MIT).
