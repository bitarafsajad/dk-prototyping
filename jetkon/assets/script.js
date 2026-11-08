(function(){
  var stage=document.getElementById('stage');
  var robot=document.getElementById('robot');
  var leader=document.getElementById('leader');
  var dot=document.getElementById('dot');
  var fade=document.getElementById('fade');
  var sh1=document.getElementById('sh1'), sh2=document.getElementById('sh2');
  var copies=[].slice.call(document.querySelectorAll('.copy'));
  var hint=document.getElementById('hint');
  var nav=document.getElementById('nav');
  var names=['intro','face','colors','display','shelves','cleaning'];

  /* Robot transform: [left, top, scale] in stage px. Anchors are points on the
     (mirrored) 1084×1451 robot image that each callout points to. */
  var LAND={W:1512,H:982,shadows:true,slides:[
    {robot:[48,88,602/1084],      hero:{top:253,right:80}, shadow:1, ad:true},
    {robot:[-156,100.35,978/1084],anchor:[770,207],  text:{top:173,right:61,descRight:69}, shadow:1},
    {robot:[-156,100.35,978/1084], anchor:[840,170], text:{top:173,right:61,descRight:69}, swatchTop:510, shadow:1, colors:true},
    {robot:[-485,-491,1.3],       anchor:[800,640],  text:{top:260,right:61,descRight:69}, shadow:0, ad:true},
    {robot:[-130,-313,1.05],      anchor:[300,640],  text:{top:173,right:61,descRight:69}, shadow:0},
    {robot:[-150,-584,1.05],      anchor:[885,1200], text:{top:560,right:61,descRight:69}, shadow:0}
  ]};
  var PORT={W:820,H:1560,slides:[
    {robot:[58,567,0.65],     heroP:true, shadow:1, ad:true},
    {robot:[-179,640,1.0],    anchor:[770,207],  textP:true, shadow:1},
    {robot:[-179,640,1.0],    anchor:[840,170], textP:true, swatchTop:380, shadow:1, colors:true},
    {robot:[-467,43,1.3],     anchor:[800,640],  textP:true, shadow:0, ad:true},
    {robot:[-34,100,1.25],    anchor:[300,640],  textP:true, shadow:0},
    {robot:[-144,-10,1.0],    anchor:[259,1205], textP:true, shadow:0}
  ]};

  var cfg=LAND, cur=0, busy=false;
  var startIdx=Math.max(0,names.indexOf(location.hash.replace('#','')));

  names.forEach(function(n,i){
    var b=document.createElement('button');
    b.setAttribute('aria-label',copies[i].getAttribute('aria-label'));
    b.addEventListener('click',function(){go(i)});
    nav.appendChild(b);
  });
  var dots=[].slice.call(nav.children);

  function set(el,props){for(var k in props) el.style[k]=props[k]}

  function layoutCopy(){
    var W=cfg.W, port=cfg===PORT;
    copies.forEach(function(c,i){
      var s=cfg.slides[i];
      var pre=c.querySelector('[data-k=pre]'), title=c.querySelector('[data-k=title]'),
          desc=c.querySelector('[data-k=desc]'), sw=c.querySelector('[data-k=sw]');
      if(!port){
        if(s.hero){
          if(pre) set(pre,{top:s.hero.top+'px',right:s.hero.right+'px'});
          set(title,{top:(s.hero.top+100)+'px',right:s.hero.right+'px'});
          set(desc,{top:(s.hero.top+238)+'px',right:s.hero.right+'px'});
          if(sw) set(sw,{top:s.swatchTop+'px',right:s.hero.right+'px'});
        }else{
          set(title,{top:s.text.top+'px',right:s.text.right+'px'});
          set(desc,{top:(s.text.top+126)+'px',right:s.text.descRight+'px'});
          if(sw) set(sw,{top:s.swatchTop+'px',right:s.text.descRight+'px'});
        }
      }else{
        if(s.heroP){
          if(pre) set(pre,{top:'90px',right:'50px'});
          set(title,{top:'170px',right:'50px'});
          set(desc,{top:'290px',right:'50px'});
          if(sw) set(sw,{top:'470px',right:'50px'});
        }else{
          set(title,{top:'110px',right:'50px'});
          set(desc,{top:'210px',right:'50px'});
          if(sw) set(sw,{top:s.swatchTop+'px',right:'50px'});
        }
      }
    });
  }

  function fit(){
    var vw=window.innerWidth, vh=window.innerHeight;
    var next=(vw/vh<0.9)?PORT:LAND;
    var changed=next!==cfg; cfg=next;
    document.body.classList.toggle('portrait',cfg===PORT);
    stage.style.width=cfg.W+'px'; stage.style.height=cfg.H+'px';
    var sc=Math.min(vw/cfg.W, vh/cfg.H);
    var x=(vw-cfg.W*sc)/2, y=(vh-cfg.H*sc)/2;
    stage.style.transform='translate('+x+'px,'+y+'px) scale('+sc+')';
    document.getElementById('lines').setAttribute('viewBox','0 0 '+cfg.W+' '+cfg.H);
    if(cfg===LAND){
      set(sh1,{left:'12px',top:'835px',width:'715px',height:'34px'});
      set(sh2,{left:'264px',top:'849px',width:'239px',height:'24px'});
    }else{
      set(sh1,{left:'60px',top:'1478px',width:'700px',height:'34px'});
      set(sh2,{left:'300px',top:'1490px',width:'240px',height:'24px'});
    }
    fade.style.height=(cfg===PORT?640:0)+'px';
    layoutCopy();
    apply(cur,false);
  }

  function robotXY(s,pt){return [s.robot[0]+pt[0]*s.robot[2], s.robot[1]+pt[1]*s.robot[2]]}

  function drawCallout(i,animate){
    var s=cfg.slides[i];
    leader.classList.remove('on'); dot.classList.remove('on');
    if(!s.anchor) return;
    var a=robotXY(s,s.anchor);
    if(cfg===PORT){
      dot.setAttribute('transform','translate('+a[0]+','+a[1]+')');
      setTimeout(function(){dot.classList.add('on')},animate?900:0);
      return;
    }
    var title=copies[i].querySelector('[data-k=title]');
    var titleLeft=cfg.W-s.text.right-title.offsetWidth;
    var end=[titleLeft-35, s.text.top+53.5];
    var dy=Math.abs(end[1]-a[1]);
    var dx=Math.min(Math.max(dy/0.433,60),(end[0]-a[0])*0.55);
    var d='M'+a[0]+' '+a[1]+' L'+(a[0]+dx)+' '+end[1]+' L'+end[0]+' '+end[1];
    leader.setAttribute('d',d);
    var len=leader.getTotalLength();
    leader.style.transition='none';
    leader.style.strokeDasharray=len;
    leader.style.strokeDashoffset=animate?len:0;
    leader.getBoundingClientRect();
    leader.classList.add('on');
    if(animate){
      leader.style.transition='stroke-dashoffset .8s cubic-bezier(.6,0,.2,1) .75s, opacity .3s';
      leader.style.strokeDashoffset=0;
    }
  }

  function apply(i,animate){
    var s=cfg.slides[i];
    if(!animate){robot.style.transition='none'}
    robot.style.transform='translate('+s.robot[0]+'px,'+s.robot[1]+'px) scale('+s.robot[2]+')';
    if(!animate){robot.getBoundingClientRect(); robot.style.transition=''}
    sh1.style.opacity=sh2.style.opacity=s.shadow?1:0;
    copies.forEach(function(c,k){
      var on=k===i; c.classList.toggle('on',on); c.setAttribute('aria-hidden',on?'false':'true');
      c.querySelectorAll('button').forEach(function(b){b.tabIndex=on?0:-1});
    });
    dots.forEach(function(d,k){d.setAttribute('aria-current',k===i?'true':'false')});
    drawCallout(i,animate);
    autoColors(!!s.colors);
    adImg.classList.toggle('on',!!s.ad);
  }

  function go(i){
    var n=cfg.slides.length; i=((i%n)+n)%n;
    if(i===cur||busy) return;
    busy=true; setTimeout(function(){busy=false},700);
    cur=i; apply(i,true);
    hint.classList.toggle('gone',i!==0);
    try{history.replaceState(null,'',i?'#'+names[i]:location.pathname+location.search)}catch(e){}
  }
  function next(){go(cur+1)} function prev(){go(cur-1)}

  /* RTL: left / down go forward, right / up go back */
  var fwdKey=null;
  document.addEventListener('keydown',function(e){
    var k=e.key;
    if(k==='ArrowLeft'||k==='ArrowRight'){
      e.preventDefault();
      /* On the first slide either arrow moves forward and becomes the "forward" key;
         the opposite arrow then goes back for the rest of the tour */
      if(cur===0||!fwdKey){fwdKey=k;next()}
      else if(k===fwdKey){next()} else {prev()}
    }
    else if(k==='ArrowDown'||k==='PageDown'||(k===' '&&e.target===document.body)){e.preventDefault();next()}
    else if(k==='ArrowUp'||k==='PageUp'){e.preventDefault();prev()}
    else if(k==='Home'){go(0)} else if(k==='End'){go(cfg.slides.length-1)}
  });

  /* No mouse-wheel / trackpad navigation: slides change only with the arrow keys (or a swipe on touch screens) */

  var tx=0,ty=0;
  window.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
  window.addEventListener('touchend',function(e){
    var dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty;
    if(Math.max(Math.abs(dx),Math.abs(dy))<40) return;
    if(Math.abs(dy)>Math.abs(dx)){dy<0?next():prev()} else {dx>0?next():prev()}
  },{passive:true});

  window.addEventListener('hashchange',function(){
    var i=names.indexOf(location.hash.replace('#','')); if(i>=0) go(i<0?0:i);
  });

  /* Color swatches */
  var imgs=[].slice.call(robot.querySelectorAll('img[data-color]'));
  var adImg=robot.querySelector('img.ad:not(.still)');
  var swatches=[].slice.call(document.querySelectorAll('.swatch'));
  function setColor(c){
    curColor=c;
    imgs.forEach(function(im){im.classList.toggle('on',im.dataset.color===c)});
    swatches.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.color===c?'true':'false')});
  }
  var order=['red','green','orange','purple'], curColor='red', cycle=null;
  var kick=null;
  function autoColors(on){
    clearInterval(cycle); clearTimeout(kick); cycle=null;
    if(!on){ setColor('red'); return; }
    var step=function(){setColor(order[(order.indexOf(curColor)+1)%order.length])};
    kick=setTimeout(function(){step(); cycle=setInterval(step,1500)},300);
  }
  swatches.forEach(function(b){b.addEventListener('click',function(){setColor(b.dataset.color);autoColors(true)})});

  window.addEventListener('resize',fit);
  cur=startIdx;
  hint.classList.toggle('gone',cur!==0);
  var start=function(){fit(); stage.classList.add('ready'); drawCallout(cur,true)};
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(start)} else {window.addEventListener('load',start)}
})();
