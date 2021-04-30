
class GetCoords
{          
      constructor(elem)
      {
          this.l=elem.offsetLeft;
          this.t=elem.offsetTop;
          this.w=elem.offsetWidth;
          this.h=elem.offsetHeight;
          this.r=this.l+this.w;
          this.b=this.t+this.h
      }
}
// Parameters -->
// container [string] Default body
// selector [string] Default div
// callback [function] Default empty
// options [JSON] -->

// Options -->
// tolerance [integer] Default 10
// magnet [Boolean] Default true
// linesColor [string] Default orange
// centerLinesColor [string] Default orange
class Snap
{        
        constructor(container='body',selector='div',callback=(data)=>{},options=null){
            this.container=container;
            this.callback=callback;
            this.magnet=true;
            this.tolerance=10;
            this.linesColor='orange';
            this.centerLinesColor='orange';
            if(options!=null)
            {
                for(let option in options)
                {
                    this[option]=options[option];
                }
            }
            this.activateSnapping(container,selector);
        }
        activateSnapping=(container,selector)=>{
            let elems=document.querySelectorAll(selector);
                elems.forEach(elem=>{
                    elem.addEventListener('mousedown',(evt)=>this.moveElement(evt,elem));
                    elem.classList.add('snap-target');
                }); 
            this.createLines(container);
        }
        moveElement=(evt,elem)=>
        {
            let top,left,difx,dify,coords;
            coords=elem.getBoundingClientRect();
            difx=evt.clientX-elem.offsetLeft;
            dify=evt.clientY-elem.offsetTop;
            const handleMove=(evt)=>{   
              top=evt.clientY-dify;
              left=evt.clientX-difx;
              elem.style.top=top;
              elem.style.left=left;
              this.snapDetect(elem);
              let v=new GetCoords(elem)                  
              this.callback({elemId:elem.id,top:v.t,left:v.l,state:'onmove'});
            }
            const stopMove=()=>{
              document.removeEventListener('mousemove',handleMove,true);
              document.removeEventListener('mouseup',stopMove,true);
              this.stopSnapDetect(elem);
            }
            document.addEventListener('mouseup',stopMove,true);
            document.addEventListener('mousemove',handleMove,true);
        }
        createLines=(container)=>
        {
            let styleTag=document.createElement('style');
            document.querySelector(container).appendChild(styleTag);
            let styles=`
                        .snap-line 
                        {
                                position: absolute; z-index:99999999; 
                                display:none; box-sizing: content-box;
                        }
                        .snap-line-hor {width:100%; height:0; border-top: 1px dashed ${this.linesColor};}
                        .snap-line-vert {height:100%; width:0; border-left: 1px dashed ${this.linesColor};}
                        .snap-line-r {left:10vw; top:0;}
                        .snap-line-l {left:20vw; top:0;}
                        .snap-line-t {left:0; top:10vw;}
                        .snap-line-b {left:0; top:20vw;}
                        .snap-line-c {left:50vw; top:0;  border-left: 1px solid ${this.centerLinesColor};}
                        .snap-line-m {left:0; top:30vw;  border-top: 1px solid ${this.centerLinesColor};}`;
            styleTag.append(styles);
            let arrLines=[
                'snap-line-r snap-line-vert',
                'snap-line-l snap-line-vert',
                'snap-line-t snap-line-hor',
                'snap-line-b snap-line-hor',
                'snap-line-c snap-line-vert',
                'snap-line-m snap-line-hor'
            ];
            arrLines.map(lineClass=>{
                let line=document.createElement('span');
                line.className='snap-line '+lineClass;
                document.querySelector(container).appendChild(line);
            })
        }
        snapDetect=(elem)=>
        {
              elem.classList.remove('snap-target');              
              let eC=new GetCoords(elem);  // eC => elem coords   (top,right,left,bottom,width,height)          
              let tC,snapResult;  // tC => target coords   (top,right,left,bottom,width,height) 
              let to=this.tolerance; // change this.tolerance for "to" for simplify the code
              let targets=document.querySelectorAll('.snap-target');
              document.querySelectorAll('.snap-line').forEach((line)=>line.style.display='none');
              // {pos:'left',posElem:tC.l-eC.w,line:'.snap-line-r',valLine:tC.l}
              // pos = position to change [top|left]
              // valElem = value of new element position 
              // line = class name of line to show
              // valLine = value of new line position
              targets.forEach(target=>{
                      tC= new GetCoords(target);
                      // the code below handle the elem's snap-right-line respect to target left,center and right
                      snapResult={line:'.snap-line-r',pos:'left'}
                      snapResult=(eC.r>tC.l-to && eC.r<tC.l+to) ?
                      {...snapResult,posElem:tC.l-eC.w,valLine:tC.l} :
                      (eC.r>tC.r-to && eC.r<tC.r+to) ?
                      {...snapResult,posElem:tC.r-eC.w,valLine:tC.r} :
                      (eC.r>tC.l+(tC.w/2)-to && eC.r<tC.l+(tC.w/2)+to) ?
                      {...snapResult,posElem:tC.l+(tC.w/2)-eC.w,valLine:tC.l+(tC.w/2)} : 
                      null;  
                      this.makeSnap(snapResult,elem);
                      // the code below handle the elem's snap-left-line respect to target left,center and right
                      snapResult={line:'.snap-line-l',pos:'left'}
                      snapResult=(eC.l>tC.r-to && eC.l<tC.r+to) ?
                      {...snapResult,posElem:tC.r,valLine:tC.r} :
                      (eC.l>tC.l-to && eC.l<tC.l+to) ?
                      {...snapResult,posElem:tC.l,valLine:tC.l} :
                      (eC.l>tC.l+(tC.w/2)-to && eC.l<tC.l+(tC.w/2)+to) ?
                      {...snapResult,posElem:tC.l+(tC.w/2),valLine:tC.l+(tC.w/2)} :
                      null;
                      this.makeSnap(snapResult,elem);
                      // the code below handle the elem's snap-top-line respect to target left,center and right
                      snapResult={line:'.snap-line-t',pos:'top'}
                      snapResult=(eC.t>tC.b-to && eC.t<tC.b+to) ?
                      {...snapResult,posElem:tC.b,valLine:tC.b} :
                      (eC.t>tC.t-to && eC.t<tC.t+to) ?
                      {...snapResult,posElem:tC.t,valLine:tC.t} :
                      (eC.t>tC.b-(tC.h/2)-to && eC.t<tC.b-(tC.h/2)+to) ?
                      {...snapResult,posElem:tC.b-(tC.h/2),valLine:tC.b-(tC.h/2)} :
                      null;
                      this.makeSnap(snapResult,elem);
                      // the code below handle the elem's snap-bottom-line respect to target left,center and right
                      snapResult={line:'.snap-line-b',pos:'top'}
                      snapResult=(eC.b>tC.t-to && eC.b<tC.t+to) ?
                      {...snapResult,posElem:tC.t-eC.h,valLine:tC.t} :
                      (eC.b>tC.b-to && eC.b<tC.b+to) ?
                      {...snapResult,posElem:tC.b-eC.h,valLine:tC.b} :
                      (eC.b>tC.b-(tC.h/2)-to && eC.b<tC.b-(tC.h/2)+to) ?
                      {...snapResult,posElem:tC.b-(tC.h/2)-eC.h,valLine:tC.b-(tC.h/2)} :
                      null;
                      this.makeSnap(snapResult,elem);
                      // the code below handle the elem's snap-center-line respect to target center
                      snapResult={line:'.snap-line-c',pos:'left'}
                      snapResult=(eC.l>(tC.r-(tC.w/2))-(eC.w/2)-to && eC.l<(tC.r-(tC.w/2))-(eC.w/2)+to) ?
                      {...snapResult,posElem:(tC.r-(tC.w/2))-(eC.w/2),valLine:tC.l+(tC.w/2)} :
                      null;
                      this.makeSnap(snapResult,elem);
                      // the code below handle the elem's snap-middle-line respect to target middle
                      snapResult={line:'.snap-line-m',pos:'top'}
                      snapResult=(eC.t>(tC.b-(tC.h/2))-(eC.h/2)-to && eC.t<(tC.b-(tC.h/2))-(eC.h/2)+to) ?
                      {...snapResult,posElem:(tC.b-(tC.h/2))-(eC.h/2),valLine:tC.t+(tC.h/2)} :
                      null;
                      this.makeSnap(snapResult,elem); 
              });
        }
        makeSnap=(snapResult,elem)=>
        {
              if(snapResult!=null)
              {
                    document.querySelector(snapResult.line).style.display='block';
                    document.querySelector(snapResult.line).style[snapResult.pos]=snapResult.valLine;
                    if(this.magnet==true)elem.style[snapResult.pos]=snapResult.posElem;  
              }
        }
        stopSnapDetect=(elem)=>
        {
              elem.classList.add('snap-target');
              document.querySelectorAll('.snap-line').forEach((line)=>line.style.display='none');              
              let v=new GetCoords(elem)                  
              this.callback({elemId:elem.id,top:v.t,left:v.l,state:'stoped'});
        }      
}
export default Snap;


