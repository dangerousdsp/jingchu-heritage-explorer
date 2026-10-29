// Browser-side compatibility adapter for the legacy right-button camera gate.
// Only roaming look mode remaps left mouse events; other scenes keep native input.
export function attachCanvasInput(canvas,{isRoaming=()=>false,isLookMode=()=>true}={}) {
  const view=canvas.ownerDocument.defaultView;
  const doc=canvas.ownerDocument;
  const generated=new WeakSet();
  let dragging=false,last=null;
  const focus=()=>canvas.focus({preventScroll:true});
  const context=event=>event.preventDefault();
  const active=()=>isRoaming()&&isLookMode();
  const block=event=>{event.preventDefault();event.stopImmediatePropagation();};
  function send(type,source,buttons) {
    const event=new view.MouseEvent(type,{
      bubbles:true,cancelable:true,view,button:2,buttons,
      clientX:source?.clientX??0,clientY:source?.clientY??0,
      screenX:source?.screenX??0,screenY:source?.screenY??0,
      ctrlKey:source?.ctrlKey??false,shiftKey:source?.shiftKey??false,
      altKey:source?.altKey??false,metaKey:source?.metaKey??false
    });
    // Unity reads movementX/Y directly; MouseEvent's constructor does not set them.
    Object.defineProperties(event,{
      movementX:{value:type==='mousemove'?(source?.movementX??0):0},
      movementY:{value:type==='mousemove'?(source?.movementY??0):0}
    });
    generated.add(event);canvas.dispatchEvent(event);
  }
  function release() {
    if(!dragging)return;
    dragging=false;send('mouseup',last,0);last=null;
  }
  function down(event) {
    if(generated.has(event)||event.target!==canvas||event.button!==0||!active())return;
    focus();block(event);dragging=true;last=event;send('mousedown',event,2);
  }
  function move(event) {
    if(generated.has(event)||!dragging)return;
    if(!active()||!(event.buttons&1)){release();return;}
    last=event;block(event);send('mousemove',event,2);
  }
  function up(event) {
    if(generated.has(event)||!dragging||event.button!==0)return;
    last=event;block(event);release();
  }
  const click=event=>{if(event.target===canvas&&event.button===0&&active())block(event);};
  const visibility=()=>{if(doc.hidden)release();};
  const keyboard=event=>{
    if(isRoaming()&&doc.activeElement===canvas&&
      ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(event.key))event.preventDefault();
    if(event.key==='Escape')release();
  };
  // Install before Unity initializes so the original left event cannot reach it first.
  view.addEventListener('mousedown',down,{capture:true});
  view.addEventListener('mousemove',move,{capture:true});
  view.addEventListener('mouseup',up,{capture:true});
  view.addEventListener('click',click,{capture:true});
  view.addEventListener('blur',release);
  view.addEventListener('pointercancel',release);
  doc.addEventListener('visibilitychange',visibility);
  canvas.addEventListener('pointerdown',focus);
  canvas.addEventListener('contextmenu',context);
  canvas.addEventListener('keydown',keyboard);
  const detach=()=>{
    release();
    view.removeEventListener('mousedown',down,{capture:true});
    view.removeEventListener('mousemove',move,{capture:true});
    view.removeEventListener('mouseup',up,{capture:true});
    view.removeEventListener('click',click,{capture:true});
    view.removeEventListener('blur',release);
    view.removeEventListener('pointercancel',release);
    doc.removeEventListener('visibilitychange',visibility);
    canvas.removeEventListener('pointerdown',focus);
    canvas.removeEventListener('contextmenu',context);
    canvas.removeEventListener('keydown',keyboard);
  };
  detach.release=release;
  return detach;
}

