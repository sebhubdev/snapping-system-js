import Snap from './modules/snap.js';

// Arguments -->
// container [string] Default body
// selector [string] Default div
// callback [function] Default empty
// options [JSON] -->

// Options -->
// tolerance [integer] Default 10
// magnet [Boolean] Default true
// linesColor [string] Default orange
// centerLinesColor [string] Default orange

new Snap('#main','.mov',
(data)=>{showValues(data)},
{
    magnet:true,
    tolerance:10,
    linesColor:'black',
    centerLinesColor:'black'
});
const showValues=(values)=>
{
        document.getElementById('show-id').innerHTML=values.elemId;
        document.getElementById('show-top').innerHTML=values.top;
        document.getElementById('show-left').innerHTML=values.left;
        document.getElementById('show-state').innerHTML=values.state;
}