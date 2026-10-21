// Browser-side XLSX export. ExcelJS 4.4.0 is bundled locally under the MIT license.
(() => {
  'use strict';
  const validDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(String(value||''))&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
  const date=value=>validDate(value)?new Date(value+'T00:00:00Z'):null;
  const timestamp=value=>value&&Number.isFinite(new Date(value).getTime())?new Date(value):null;
  const number=value=>value!==''&&value!=null&&Number.isFinite(Number(value))?Number(value):null;
  const cnDate=value=>new Date(value).toLocaleString('zh-CN',{hour12:false});
  const choice=value=>typeof value==='boolean'?(value?'是':'否'):'未填写';
  function typed(label,value){
    if(label.includes('日期')&&validDate(value))return date(value);
    if(/温度|面积|用量|人数/.test(label)){
      const clean=String(value).replace(/\s*(℃|m²|kg|人)\s*$/,'').replaceAll(',','');
      if(clean.trim()!==''&&Number.isFinite(Number(clean)))return Number(clean);
    }
    return String(value??'未填写');
  }
  const textWidth=value=>Array.from(String(value??'')).reduce((n,char)=>n+(char.charCodeAt(0)>255?2:1),0);
  function formatRows(sheet){
    sheet.eachRow((row,index)=>{
      if(index<=3)return;
      let lines=1;
      row.eachCell({includeEmpty:true},(cell,col)=>{
        cell.font={name:'Microsoft YaHei',size:11,color:{argb:'FF233D52'}};
        cell.alignment={vertical:'top',wrapText:true};
        cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:index%2?'FFF4F7FB':'FFFFFFFF'}};
        cell.border={bottom:{style:'hair',color:{argb:'FFE1E8F0'}}};
        if(cell.value instanceof Date)cell.numFmt=/首次|最近|截止|时间/.test(String(sheet.getRow(3).getCell(col).value))?'yyyy-mm-dd hh:mm:ss':'yyyy-mm-dd';
        else if(typeof cell.value==='number')cell.numFmt=Number.isInteger(cell.value)?'#,##0':'#,##0.##';
        else lines=Math.max(lines,...String(cell.value??'').split('\n').map(line=>Math.ceil(textWidth(line)/Math.max(8,(sheet.getColumn(col).width||18)-2))));
      });
      row.height=Math.max(32,lines*16+8);
    });
  }
  async function imageForExcel(photo){
    const source=photo.data;
    if(!source)return null;
    const img=await new Promise((resolve,reject)=>{
      const node=new Image();node.onload=()=>resolve(node);node.onerror=()=>reject(new Error('照片“'+photo.name+'”读取失败，请检查图片后重新导出'));node.src=source;
    });
    if(!img.naturalWidth||!img.naturalHeight)throw new Error('照片“'+photo.name+'”没有有效图片内容');
    let base64=source,extension=source.startsWith('data:image/png;base64,')?'png':/^data:image\/jpe?g;base64,/.test(source)?'jpeg':'';
    if(!extension){const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;canvas.getContext('2d').drawImage(img,0,0);base64=canvas.toDataURL('image/png');extension='png'}
    const scale=Math.min(320/img.naturalWidth,175/img.naturalHeight,1);
    return {base64,extension,width:img.naturalWidth*scale,height:img.naturalHeight*scale};
  }
  async function download({projects,scope}){
    if(!window.ExcelJS)throw new Error('Excel组件未加载，请刷新后重试');
    const book=new window.ExcelJS.Workbook();book.creator='美利肯安装质量中心';book.created=new Date();book.modified=new Date();
    const labels={query:'项目名称',region:'区域',owner:'负责人',status:'状态',dateFrom:'起始日期',dateTo:'截止日期'};
    const kind={start:'计划开始日期',end:'计划结束日期',actual:'实际完成日期'}[scope.dateKind||'start'];
    const filters=Object.entries(scope).filter(([key,value])=>value&&labels[key]).map(([key,value])=>labels[key]+'：'+value);
    const context='导出时间：'+cnDate(new Date())+'；项目数：'+projects.length+'；筛选：'+(filters.join('，')||'全部项目')+((scope.dateFrom||scope.dateTo)?'；时间类型：'+kind:'');
    function sheet(name,columns){
      const ws=book.addWorksheet(name,{views:[{state:'frozen',ySplit:3}],properties:{defaultRowHeight:30}});
      ws.columns=columns.map(([header,width])=>({width}));
      ws.mergeCells(1,1,1,columns.length);ws.getCell(1,1).value='美利肯安装质量中心 · '+name;ws.getRow(1).height=34;
      ws.getCell(1,1).font={name:'Microsoft YaHei',size:16,bold:true,color:{argb:'FFFFFFFF'}};ws.getCell(1,1).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF153F70'}};
      ws.mergeCells(2,1,2,columns.length);ws.getCell(2,1).value=context;ws.getCell(2,1).font={name:'Microsoft YaHei',size:10,color:{argb:'FF62778B'}};ws.getCell(2,1).alignment={wrapText:true,vertical:'middle'};ws.getRow(2).height=44;
      const head=ws.getRow(3);columns.forEach(([label],i)=>{const cell=head.getCell(i+1);cell.value=label;cell.font={name:'Microsoft YaHei',size:11,bold:true,color:{argb:'FF153F70'}};cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFE7EFF9'}};cell.alignment={vertical:'middle',wrapText:true}});head.height=34;
      ws.pageSetup={paperSize:9,orientation:'landscape',fitToPage:true,fitToWidth:1,fitToHeight:0,printTitlesRow:'1:3'};
      return ws;
    }
    const summary=sheet('项目清单',[
      ['项目编号',24],['项目名称',34],['区域／城市',24],['项目负责人',16],['项目状态',14],['当前阶段',18],['省／直辖市',20],['城市',18],['报备面积（m²）',20],['计划开始日期',19],['计划结束日期',19],['计划周期原记录',32],['计划安装人数',18],['长期合作团队',18],['安装团队',34],['质量关注事项',42],['施工前室温（℃）',20],['地面状态',18],['其他情况说明',48],['安装完成日期',19],['完工室温（℃）',20],['实际面积（m²）',20],['胶水用量（kg）',20],['首次提交完工时间',25],['最近提交时间',25],['可编辑截止时间',25],['照片数量',14]
    ]);
    const detail=sheet('阶段明细',[['项目编号',24],['项目名称',32],['阶段',20],['阶段状态',16],['字段／确认事项',36],['填写内容／确认结果',72],['记录更新时间',25]]);
    const photos=sheet('照片资料',[['项目编号',24],['项目名称',32],['所属阶段',20],['照片类别',26],['文件名',36],['图片内容',50],['上传人',16],['上传时间',25],['图片状态',28]]);
    const history=sheet('负责人交接',[['项目编号',24],['项目名称',32],['转出人',18],['继承人',18],['交接时间',26],['备注',64],['操作人',18]]);
    let photoCount=0;
    for(const p of projects){
      const report=p.report||{},before=p.stageData?.[2]?.fields||{},finish=p.stageData?.[4]?.fields||{};
      const images=p.stages.flatMap(stage=>stage.photos||[]);
      summary.addRow([p.id,p.name,p.region,p.owner,p.status,p.stageName,report.province||'',report.city||'',number(report.area)??p.area,date(report.start),date(report.end),p.time,number(report.count)??number(p.count),choice(report.longTerm),p.team||report.team||'',p.risk||'',number(before['室内温度']),before['地面平整度情况']||'',before['其他情况说明']||'',date(finish['安装完成日期']),number(finish['完工时室内温度']),number(finish['实际完成面积']),number(finish['数量']),timestamp(p.completedAt),timestamp(p.lastSubmittedAt),timestamp(p.deadline),images.length]);
      for(const [index,stage] of p.stages.entries()){
        const state=p.stageData?.[index+1],status=index+1>p.stage?'未开始':index+1<p.stage||p.status==='已完工'?'已完成':'进行中';
        for(const [label,value] of stage.rows)detail.addRow([p.id,p.name,stage.name,status,label,typed(label,value),timestamp(state?.updatedAt)]);
        if(state?.consent?.materialRefs)for(const [kind,ref] of Object.entries(state.consent.materialRefs))detail.addRow([p.id,p.name,stage.name,status,(kind==='training'?'培训材料':'安装手册')+'确认版本标识',ref,timestamp(state.updatedAt)]);
        if(state?.materialReadHistory)for(const record of state.materialReadHistory)detail.addRow([p.id,p.name,stage.name,status,'材料阅读确认时间',record.title+' · '+record.version,timestamp(record.confirmedAt)]);
        for(const photo of stage.photos||[]){
          const row=photos.addRow([p.id,p.name,stage.name,photo.label||'现场照片',photo.name,'',photo.uploadedBy||'未记录',timestamp(photo.uploadedAt),photo.data?'已保存图片':'历史记录未保存图片内容']);
          const image=await imageForExcel(photo);
          if(image){const id=book.addImage({base64:image.base64,extension:image.extension});photos.addImage(id,{tl:{nativeCol:5,nativeColOff:47625,nativeRow:row.number-1,nativeRowOff:47625},br:{nativeCol:5,nativeColOff:Math.round((5+image.width)*9525),nativeRow:row.number-1,nativeRowOff:Math.round((5+image.height)*9525)},editAs:'oneCell'});photoCount++}
          else row.getCell(6).value='未保存图片内容';
        }
      }
      for(const record of p.history||[])history.addRow([p.id,p.name,record.from,record.to,record.time,record.note,record.operator||'李雯']);
    }
    if(photos.rowCount===3)photos.addRow(['','当前筛选项目暂无已保存照片','','','','','','','暂无照片']);
    if(history.rowCount===3)history.addRow(['','当前筛选项目暂无交接记录']);
    for(const ws of [summary,detail,photos,history]){formatRows(ws);ws.autoFilter={from:{row:3,column:1},to:{row:ws.rowCount,column:ws.columnCount}}}
    photos.eachRow((row,index)=>{if(index>3&&row.getCell(9).value==='已保存图片')row.height=Math.max(row.height,146)});
    const output=await book.xlsx.writeBuffer();
    const url=URL.createObjectURL(new Blob([output],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
    const link=document.createElement('a');link.href=url;link.download='美利肯项目数据-'+new Date().toLocaleDateString('sv-SE')+'.xlsx';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
    return {projects:projects.length,photos:photoCount};
  }
  window.MillikenProjectExcel=Object.freeze({download});
})();
