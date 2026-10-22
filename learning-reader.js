/* Shared learning resources and page-turn reading rules. */
(() => {
  'use strict';
  const manual = Object.freeze({
    revision:'manual-pdf-20261022', policy:'page-turn-v1', seconds:5,
    url:'assets/manual/installation-instructions-ap-cn.pdf',
    pages:Array.from({length:7},(_,i)=>`assets/manual/manual-${i+1}.webp`)
  });
  const videos = Array.from({length:4},(_,i)=>({
    title:`安装培训 · 第${i+1}节`,
    source:`assets/training/installation-part-${i}.mp4`,
    poster:`assets/training/installation-part-${i}.jpg`,
    range:['00:00–26:31','26:31–53:03','53:03–79:34','79:34–106:05'][i]
  }));
  function mountTraining(root) {
    let disposed=false;
    const stop=()=>root.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load()});
    const list=()=>{
      stop();root.innerHTML='<p class="lessonIntro">2025 美利肯安装培训，按原顺序分为四节。点击视频即可观看。</p><div class="lessonList"></div>';
      videos.forEach((item,i)=>{
        const button=document.createElement('button');button.type='button';button.className='lessonCard';button.dataset.lesson=i;
        button.innerHTML=`<span class="lessonCover"><img src="${item.poster}" alt="" loading="lazy"><span>▶</span></span><span class="lessonCopy"><b>${item.title}</b><small>原片 ${item.range} · 约26分钟</small><em>点击观看 ›</em></span>`;
        button.onclick=()=>{
          if(disposed)return;stop();root.innerHTML=`<button type="button" class="lessonBack">‹ 返回视频列表</button><h3 class="lessonTitle">${item.title}</h3><video class="lessonPlayer" controls playsinline preload="metadata" poster="${item.poster}" src="${item.source}"></video><p class="lessonIntro">支持暂停、拖动进度和全屏观看。观看视频不作为培训勾选的前置条件。</p><p class="lessonError" role="alert"></p>`;
          root.querySelector('.lessonBack').onclick=list;
          const video=root.querySelector('video');video.addEventListener('error',()=>{root.querySelector('.lessonError').textContent='视频加载失败，请检查网络后重试。'});
          video.play().catch(()=>{});
        };root.querySelector('.lessonList').append(button);
      });
    };list();
    return {destroy(){disposed=true;stop()}};
  }
  function mountManual(root,{url,pages,onProgress=()=>{},onError=()=>{}}) {
    let disposed=false,loading=true,index=0,total=pages?.length||0,seconds=0,timer=0,documentTask,pdfDocument,renderTask,pageUrl='',zoomed=false;
    root.innerHTML='<div class="bookToolbar"><span class="bookPageNumber" aria-live="polite">正在加载手册…</span><button type="button" class="bookZoom" disabled>放大查看</button></div><div class="bookViewport" tabindex="0" aria-label="安装手册翻书阅读，可用左右方向键翻页"><div class="bookSheet"><img class="bookImage" alt="" hidden><canvas class="bookCanvas" hidden></canvas><p class="bookLoading" role="status">正在加载手册…</p></div></div><nav class="bookNavigation" aria-label="手册翻页"><button type="button" class="bookPrev" disabled>‹ 上一页</button><button type="button" class="bookNext" disabled>下一页 ›</button></nav><div class="bookProgress"><span class="bookCountdown">待翻页 · 剩余5秒</span><progress max="5" value="0" aria-label="手册阅读计时"></progress></div><p class="bookHint">每次翻页后停留1秒，累计阅读5秒；不翻页暂停计时。可左右滑动或点击按钮翻页，放大后可滚动阅读。</p>';
    const q=s=>root.querySelector(s),viewport=q('.bookViewport'),sheet=q('.bookSheet'),img=q('img'),canvas=q('canvas');
    const cancel=()=>{clearTimeout(timer);timer=0};
    const status=text=>{q('.bookCountdown').textContent=text;q('progress').value=seconds;onProgress(seconds)};
    const controls=()=>{q('.bookPrev').disabled=loading||index===0;q('.bookNext').disabled=loading||(total>1&&index===total-1);q('.bookNext').textContent=total===1?'翻读本页 ›':'下一页 ›';q('.bookZoom').disabled=loading;q('.bookPageNumber').textContent=`第 ${index+1} / ${total} 页`;};
    const eligible=()=>{const r=viewport.getBoundingClientRect(),clip=viewport.closest('.phonebody')?.getBoundingClientRect();return !disposed&&!loading&&!document.hidden&&root.isConnected&&r.width>0&&r.bottom>Math.max(0,clip?.top||0)&&r.top<Math.min(innerHeight,clip?.bottom||innerHeight)};
    const credit=()=>{
      if(seconds>=manual.seconds)return;
      status(`翻页阅读中 · 剩余${manual.seconds-seconds}秒`);
      timer=setTimeout(()=>{
        timer=0;if(!eligible())return;
        seconds=Math.min(manual.seconds,seconds+1);
        status(seconds===manual.seconds?'计时完成 · 可确认已阅读':`已暂停 · 剩余${manual.seconds-seconds}秒，请继续翻页`);
      },1000);
    };
    const render=async(next,turned=false)=>{
      if(disposed||(!turned&&next!==index))return;
      cancel();loading=true;controls();index=next;viewport.scrollTop=0;viewport.scrollLeft=0;
      q('.bookLoading').hidden=false;img.hidden=true;canvas.hidden=true;sheet.classList.remove('bookTurn');
      try{
        if(pages){
          await new Promise((resolve,reject)=>{const pending=new Image();pending.onload=resolve;pending.onerror=reject;pending.src=pages[index]});
          if(disposed)return;img.src=pages[index];img.alt=`安装手册第${index+1}页，包含原PDF全部文字和图示`;img.hidden=false;pageUrl=pages[index];
        }else{
          const page=await pdfDocument.getPage(index+1);if(disposed)return;
          const v=page.getViewport({scale:2});canvas.width=Math.ceil(v.width);canvas.height=Math.ceil(v.height);
          renderTask=page.render({canvasContext:canvas.getContext('2d'),viewport:v});await renderTask.promise;if(disposed)return;
          canvas.hidden=false;pageUrl='';
        }
        loading=false;q('.bookLoading').hidden=true;controls();
        if(turned){void sheet.offsetWidth;sheet.classList.add('bookTurn');if(eligible())credit()}
      }catch(error){
        if(disposed)return;loading=true;controls();q('.bookLoading').textContent='手册加载失败，请返回后重新打开；如仍无法加载，请联系管理员。';status('加载失败 · 未计时');onError(error);
      }
    };
    const turn=delta=>{if(disposed||loading)return;const next=index+delta;if(total===1&&delta===1){render(0,true);return}if(next<0||next>=total)return;render(next,true)};
    q('.bookPrev').onclick=()=>turn(-1);q('.bookNext').onclick=()=>turn(1);
    q('.bookZoom').onclick=()=>{zoomed=!zoomed;viewport.classList.toggle('bookEnlarged',zoomed);q('.bookZoom').textContent=zoomed?'适应页面':'放大查看';viewport.focus()};
    viewport.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();turn(e.key==='ArrowRight'?1:-1)}});
    let touch=null;viewport.addEventListener('touchstart',e=>{if(!zoomed&&e.touches.length===1)touch={x:e.touches[0].clientX,y:e.touches[0].clientY};else touch=null},{passive:true});
    viewport.addEventListener('touchend',e=>{if(!touch||zoomed||!e.changedTouches[0])return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;touch=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)turn(dx<0?1:-1)},{passive:true});
    const visibility=()=>{if(document.hidden){cancel();if(seconds<manual.seconds)status(`已暂停 · 剩余${manual.seconds-seconds}秒，请继续翻页`)}};
    document.addEventListener('visibilitychange',visibility);
    const ready=(async()=>{
      try{
        if(!pages){const pdfjs=await import('./vendor/pdfjs/pdf.min.mjs');if(disposed)return;pdfjs.GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/pdf.worker.min.mjs',document.baseURI).href;documentTask=pdfjs.getDocument({url,useSystemFonts:true,isEvalSupported:false});pdfDocument=await documentTask.promise;if(disposed)return;total=pdfDocument.numPages}
        await render(0);
      }catch(e){if(disposed)return;q('.bookLoading').textContent='无法打开手册，请返回后重试或联系管理员上传有效PDF。';status('加载失败 · 未计时');onError(e)}
    })();
    return {ready,get seconds(){return seconds},get page(){return index+1},destroy(){disposed=true;cancel();document.removeEventListener('visibilitychange',visibility);renderTask?.cancel();documentTask?.destroy();if(pageUrl)pageUrl=''}};
  }
  window.MillikenLearning=Object.freeze({manual,videos,mountManual,mountTraining});
})();
