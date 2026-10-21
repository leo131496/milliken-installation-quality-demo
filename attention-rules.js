// 看板与需求说明共用的关注事项分类口径。
(() => {
  'use strict';
  const rules = [
    {key:'low',label:'温度异常',description:'关注记录注明低温、高温或温度异常，或记录温度低于15℃、高于32℃；15℃和32℃不属于越界温度。'},
    {key:'photo',label:'照片待补充',description:'关注记录注明现场照片或图片需补充，例如地面状态照片、中心定位及辅助线照片、安装完成照片。'},
    {key:'temperature',label:'温度记录待确认',description:'关注记录涉及温度或室温待填写、待核对，且未归入温度异常。'},
    {key:'other',label:'其他关注事项',description:'项目已有其他非空关注记录，且未归入上述三类；在明细中显示原记录。'}
  ];
  const text=project=>String(project.risk??'').trim();
  function classify(project){
    const value=text(project);if(!value)return '';
    const temperatures=[...value.matchAll(/(?<![\d.])(-?\d+(?:\.\d+)?)\s*(?:℃|°\s*C|度)/gi)].map(match=>Number(match[1]));
    if(/低温|高温|异常温度|温度异常|低于\s*15|[高大]于\s*32/.test(value)||temperatures.some(number=>number<15||number>32))return 'low';
    if(/照片|图片/.test(value))return 'photo';
    if(/温度|室温/.test(value))return 'temperature';
    return 'other';
  }
  window.MillikenAttention=Object.freeze({rules,text,classify});
})();
