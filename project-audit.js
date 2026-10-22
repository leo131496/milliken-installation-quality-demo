// Field-side edits are saved with the project; derived status and timestamps are excluded.
(() => {
  'use strict';
  const baselines = new Map(), sessions = new Map();
  const reportLabels = {name:'项目 / 客户名称',province:'省 / 直辖市',city:'城市',area:'项目面积（m²）',start:'计划开始日期',end:'计划结束日期',team:'安装团队',count:'本项目计划安装人数',longTerm:'是否长期合作团队'};
  const photoLabels = {2:['地面状态照片'],3:['中心定位及辅助线照片','胶粘剂透明状态照片'],4:['安装完成照片']};
  const reasons = ['现场无供暖设施，室内外温度基本一致','供暖 / 空调暂不具备启用条件','设备已安装，但现场暂不允许启用','现场高温，空调或降温条件不足'];
  function snapshot(project) {
    const values = {};
    const put = (stage,label,value,signature=value,empty='未填写') => {
      if(value==null || value==='')return;
      values[stage+':'+label] = {stage,label,value:String(value),signature:JSON.stringify(signature),empty};
    };
    const report=project.report||{};
    for(const [key,label] of Object.entries(reportLabels)) {
      if(key==='team'&&!report.longTerm)continue;
      const value=report[key];
      const display=key==='longTerm'?(typeof value==='boolean'?(value?'是':'否'):''):value;
      put(1,label,display,key==='team'?[value,report.teamId||'']:display);
    }
    for(const stage of [2,3,4]) {
      const state=project.stageData?.[stage]||{};
      for(const [label,value] of Object.entries(state.fields||{})) {
        const name=stage===4&&label==='数量'?'胶水实际用量（kg）':label.includes('温度')?label+'（℃）':label.includes('面积')?label+'（m²）':label;
        put(stage,name,value);
      }
      for(const [label,index] of Object.entries(state.options||{}))
        put(stage,label,(label==='安装环境温度'?['15–32℃','低于15或大于32度']:['是','否'])[index],'option:'+index,'未选择');
      for(const [label,checked] of Object.entries(state.checkboxes||{})) {
        if(label==='combinedLearning'||reasons.includes(label)||label==='其他现场原因')continue;
        if(checked)put(stage,label==='areaVarianceConfirmed'?'面积偏差核对确认':label,'已勾选',true,'未勾选');
      }
      if(stage===3) {
        let reason=state.temperatureReason;
        if(reason==null){const legacy=reasons.filter(item=>state.checkboxes?.[item]);if(legacy.length===1)reason=legacy[0]}
        put(stage,'异常温度施工原因',reason);
        if(state.consent?.training)put(stage,'参加过美利肯安装培训','已勾选',true,'未勾选');
        if(state.consent?.manual)put(stage,'已完整阅读美利肯安装手册','已勾选',true,'未勾选');
        const readings=state.materialReadHistory||[];
        if(readings.length)put(stage,'安装手册阅读记录',readings.map(item=>item.title+' · '+item.version+' · '+item.confirmedAt).join('\n'));
      }
      (state.uploads||[]).forEach((upload,index)=>{
        if(!upload)return;
        const photos=upload.photos?.length?upload.photos:[upload];
        put(stage,photoLabels[stage][index]||'现场照片 '+(index+1),photos.map(photo=>(photo.name||'现场照片')+(photo.uploadedAt?'（上传于 '+new Date(photo.uploadedAt).toLocaleString('zh-CN',{hour12:false})+'）':'')).join('\n'),photos.map(photo=>[photo.name,photo.uploadedAt,photo.data]),'未上传');
      });
    }
    return values;
  }
  function differences(before,after) {
    return [...new Set([...Object.keys(before),...Object.keys(after)])].sort().flatMap(key=>{
      const old=before[key],next=after[key],item=next||old;
      if(old?.signature===next?.signature)return [];
      return [{stage:item.stage,label:item.label,before:old?.value||(next?.empty||'未填写'),after:next?.value||(old?.empty||'未填写')}];
    });
  }
  function initialize(project) {baselines.set(project.id,snapshot(project));sessions.delete(project.id)}
  function record(project,{group='',actor=project.owner||'王建国'}={}) {
    const current=snapshot(project),previous=baselines.get(project.id);
    if(!previous){initialize(project);return}
    const session=sessions.get(project.id);
    const merge=group&&session?.group===group&&project.modificationHistory?.at(-1)===session.record;
    const changes=differences(merge?session.before:previous,current);
    if(merge)project.modificationHistory.pop();
    if(changes.length) {
      const entry={id:crypto.randomUUID(),time:new Date().toISOString(),actor,source:'企微工作台应用',changes};
      (project.modificationHistory||=[]).push(entry);
      if(group)sessions.set(project.id,{group,before:merge?session.before:previous,record:entry});
      else sessions.delete(project.id);
    } else if(!group||merge)sessions.delete(project.id);
    baselines.set(project.id,current);
  }
  window.MillikenProjectAudit=Object.freeze({initialize,record});
})();
