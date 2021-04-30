Demo at https://www.demos.sebastianneumann.fr/snapping-system-javascript/

Config :

Arguments -->
container [string] Default body
selector [string] Default div
callback [function] Default empty
options [JSON] -->

Options -->
tolerance [integer] Default 10
magnet [Boolean] Default true
linesColor [string] Default orange
centerLinesColor [string] Default orange


import Snap from './snap.js';
new Snap(container,selector,callback,{options});
