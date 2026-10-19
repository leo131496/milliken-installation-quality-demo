/* Local PDF export. Canvas preserves Chinese glyphs without a network font dependency. */
(() => {
  'use strict';
  const WIDTH=1240,HEIGHT=1754,MARGIN=90;
  const encode=new TextEncoder();
  const bytes=text=>encode.encode(text);
  function buildPdf(images){
    const parts=[bytes('%PDF-1.4\n%Milliken\n')],offsets=[0];let length=parts[0].length;
    const append=part=>{parts.push(part);length+=part.length};
    const object=(id,body)=>{offsets[id]=length;append(bytes(id+' 0 obj\n'));if(Array.isArray(body))body.forEach(append);else append(bytes(body));append(bytes('\nendobj\n'))};
    object(1,'<< /Type /Catalog /Pages 2 0 R >>');
    object(2,'<< /Type /Pages /Count '+images.length+' /Kids ['+images.map((_,i)=>(3+i*3)+' 0 R').join(' ')+'] >>');
    images.forEach((image,index)=>{
      const page=3+index*3,img=page+1,content=page+2,command=bytes('q 595.28 0 0 841.89 0 0 cm /Im0 Do Q');
      object(page,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 '+img+' 0 R >> >> /Contents '+content+' 0 R >>');
      object(img,[bytes('<< /Type /XObject /Subtype /Image /Width '+WIDTH+' /Height '+HEIGHT+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+image.length+' >>\nstream\n'),image,bytes('\nendstream')]);
      object(content,[bytes('<< /Length '+command.length+' >>\nstream\n'),command,bytes('\nendstream')]);
    });
    const start=length;append(bytes('xref\n0 '+offsets.length+'\n0000000000 65535 f \n'+offsets.slice(1).map(offset=>String(offset).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size '+offsets.length+' /Root 1 0 R >>\nstartxref\n'+start+'\n%%EOF'));
    return new Blob(parts,{type:'application/pdf'});
  }
  const loadImage=src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src});
  async function create(payload){
    await document.fonts.ready;
    const pages=[];let canvas,context,y;
    const font=(size=25,weight='normal')=>context.font=weight+' '+size+'px "PingFang SC","Microsoft YaHei",Arial,sans-serif';
    const newPage=()=>{canvas=document.createElement('canvas');canvas.width=WIDTH;canvas.height=HEIGHT;context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,WIDTH,HEIGHT);context.fillStyle='#103d73';context.fillRect(0,0,WIDTH,20);font(22);context.fillText('MILLIKEN  /  美利肯安装项目档案',MARGIN,75);context.fillStyle='#a4b1bc';context.fillRect(MARGIN,98,WIDTH-2*MARGIN,1);y=150;pages.push(canvas)};
    const room=height=>{if(y+height>HEIGHT-115)newPage()};
    const wrap=(value,width,size=25)=>{font(size);const lines=[];let line='';for(const char of String(value)){if(char==='\n'){lines.push(line);line='';continue}if(context.measureText(line+char).width>width&&line){lines.push(line);line=char}else line+=char}lines.push(line);return lines};
    const text=(value,{size=25,bold=false,color='#294452',after=15}={})=>{const lines=wrap(value,WIDTH-2*MARGIN,size);for(const line of lines){room(size+15);font(size,bold?'600':'normal');context.fillStyle=color;context.fillText(line,MARGIN,y);y+=size+14}y+=after};
    const row=(label,value)=>{
      const left=wrap(label,310,23),right=wrap(value,WIDTH-2*MARGIN-350,25),height=Math.max(left.length,right.length)*38+24;
      if(height>HEIGHT-280){text(label,{size:23,bold:true});text(value);return}
      room(height);context.fillStyle='#f4f7fa';context.fillRect(MARGIN,y-25,WIDTH-2*MARGIN,height);context.fillStyle='#6e8294';font(23);left.forEach((line,i)=>context.fillText(line,MARGIN+18,y+i*38));context.fillStyle='#233f50';font(25);right.forEach((line,i)=>context.fillText(line,MARGIN+350,y+i*38));y+=height+3;
    };
    newPage();text(payload.name||'未命名项目',{size:37,bold:true,color:'#103d73',after:25});
    for(const [label,value] of [['项目编号',payload.id],['项目经理',payload.owner],['项目区域',payload.region],['项目状态',payload.status],['计划周期',payload.time||'未填写'],['首次提交完工',payload.completedAt?new Date(payload.completedAt).toLocaleString('zh-CN',{hour12:false}):'未提交或无历史时间'],['导出时间',new Date().toLocaleString('zh-CN',{hour12:false})]])row(label,value||'未填写');
    text('本档案按当前已保存的信息导出；未保存或未接入的信息标记为未填写。',{size:21,color:'#7b8c99',after:30});
    for(const [index,stage] of payload.stages.entries()){
      room(130);y+=25;text(String(index+1).padStart(2,'0')+'  '+stage.name,{size:31,bold:true,color:'#103d73',after:20});
      for(const [label,value] of stage.rows)row(label,String(value??'未填写'));
      if(index>0&&!stage.photos.length)row('现场照片','暂无已保存照片');
      for(const photo of stage.photos){
        if(!photo.data){row('照片',photo.name+'（图片内容未保存）');continue}
        try{
          const image=await loadImage(photo.data),width=WIDTH-2*MARGIN,height=Math.min(570,width*image.height/image.width),drawWidth=height*image.width/image.height;
          room(height+125);text(photo.name||'现场照片',{size:23,bold:true,after:4});context.drawImage(image,MARGIN+(width-drawWidth)/2,y,drawWidth,height);y+=height+35;
          if(photo.uploadedBy||photo.uploadedAt)text('上传人：'+(photo.uploadedBy||'未记录')+'  上传时间：'+(photo.uploadedAt?new Date(photo.uploadedAt).toLocaleString('zh-CN',{hour12:false}):'未记录'),{size:19,color:'#7b8c99'});
        }catch{row('照片',photo.name+'（图片读取失败）')}
      }
    }
    if(payload.history?.length){room(110);text('负责人交接记录',{size:31,bold:true});for(const item of payload.history)row(item.time,item.from+' → '+item.to+'  '+(item.note||''))}
    const images=pages.map((page,index)=>{const ctx=page.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(MARGIN,HEIGHT-90,WIDTH-2*MARGIN,65);ctx.fillStyle='#8193a0';ctx.font='20px "PingFang SC",Arial';ctx.fillText('美利肯安装质量中心',MARGIN,HEIGHT-50);ctx.textAlign='right';ctx.fillText((index+1)+' / '+pages.length,WIDTH-MARGIN,HEIGHT-50);ctx.textAlign='left';const binary=atob(page.toDataURL('image/jpeg',.92).split(',')[1]);return Uint8Array.from(binary,char=>char.charCodeAt(0))});
    return buildPdf(images);
  }
  window.MillikenProjectPdf={create,async download(payload){const blob=await create(payload),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=(payload.name||'项目档案').replace(/[\\/:*?"<>|]/g,'_')+'-项目档案.pdf';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)}};
})();
