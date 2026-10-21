// Demo统一使用的业务区域口径。
(() => {
  'use strict';
  const groups = [
    {name:'华东',provinces:['上海市','江苏省','浙江省','安徽省','福建省','江西省','山东省']},
    {name:'华南',provinces:['广东省','广西壮族自治区','海南省']},
    {name:'华北',provinces:['北京市','天津市','河北省','山西省','内蒙古自治区']},
    {name:'华中',provinces:['河南省','湖北省','湖南省']},
    {name:'西南',provinces:['重庆市','四川省','贵州省','云南省','西藏自治区']},
    {name:'西北',provinces:['陕西省','甘肃省','青海省','宁夏回族自治区','新疆维吾尔自治区']},
    {name:'东北',provinces:['辽宁省','吉林省','黑龙江省']},
    {name:'港澳台',provinces:['香港特别行政区','澳门特别行政区','台湾省']}
  ];
  const short=value=>String(value||'').replace(/特别行政区|壮族自治区|回族自治区|维吾尔自治区|自治区|省|市/g,'').trim();
  const cityProvinces={苏州:'江苏省',无锡:'江苏省',南京:'江苏省',杭州:'浙江省',嘉兴:'浙江省',宁波:'浙江省',深圳:'广东省',广州:'广东省',成都:'四川省'};
  const regionForPlace=value=>groups.find(group=>group.name===value||group.provinces.some(province=>short(province)===short(value)||province===cityProvinces[short(value)]))?.name||'';
  const serviceRegion=value=>{
    const values=String(value||'').split(/[、,，/|]+/).filter(Boolean);
    const matches=values.map(regionForPlace);
    return values.length&&matches.every(Boolean)&&new Set(matches).size===1?matches[0]:String(value||'');
  };
  window.MillikenRegions=Object.freeze({groups,names:groups.map(group=>group.name),provinceCount:groups.reduce((count,group)=>count+group.provinces.length,0),regionForPlace,serviceRegion});
})();
