// 需求说明 V2.0 · 2026-10-20。
(() => {
  'use strict';
  const groups = [
    {id:'field',label:'企微工作台应用',description:'填报顺序：项目报备 → 施工前检查 → 施工流程 → 施工结束。'},
    {id:'admin',label:'管理后台',description:'查询项目、交接负责人，维护安装团队及学习材料，下载项目资料。'},
    {id:'design',label:'界面与字号',description:'说明现有页面的排版、字体和字号，按当前 Demo 样式执行。'}
  ];
  const items = [
    {id:'F01',group:'field',title:'入口、首页与项目列表',entry:'通讯录 → 美利肯公司 → 安装质量中心',
      details:['首页显示进行中、已完工、全部项目数量，以及待补充任务和最近项目。','可按项目名称或计划周期搜索，项目列表可按全部、进行中、已完工筛选。'],
      logic:['点击统计卡片进入对应的项目列表；点击项目查看详情。','详情显示地区、面积、计划起止日期、人数和四阶段时间轴；未开始的阶段不能进入。']},
    {id:'F02',group:'field',title:'01 项目报备',entry:'首页 → 新建项目报备',
      details:['填写项目／客户名称、省市、项目面积、计划开始日期、计划结束日期和安装人数。省市使用现有选项。','计划周期选择具体年月日；选择是否为长期合作团队，选“是”时从合作中团队里选择。'],
      logic:['必填信息不能空缺；面积大于0，安装人数为正整数，结束日期不能早于开始日期。','选“否”时不要求填写团队；暂停合作的团队不能用于新报备，历史项目保留原团队记录。','提交后进入施工前检查阶段，无报备审批步骤。']},
    {id:'F03',group:'field',title:'02 施工前检查',entry:'项目详情 → 施工前检查',
      details:['填写工地室内温度。','地面状态单选：良好、一般、不平、起砂、含水率超标、自流平分层、其他；选择“其他”时填写说明。','可上传地面状态照片，支持多张。'],
      logic:['提交本阶段时检查温度和地面状态等必填信息，照片可暂不上传。','提交完工前，地面状态照片必须至少有1张。']},
    {id:'F04',group:'field',title:'03 施工流程：培训与手册',entry:'施工流程 → 安装人员培训与手册确认',
      details:['“安装培训材料”和“安装手册材料”分别打开后台当前启用的文件。','文件打开后提供5秒阅读确认；Word／PPT需先打开或下载原文件，再返回确认。','第三项为“您已学习安装培训材料和安装手册”。'],
      logic:['前两项可分别确认，至少确认其中一项才能提交施工流程。','勾选第三项时，上方两项自动选中；两项都已确认时，提交前须勾选第三项。','后台替换或启用其他材料后，原确认不作为当前版本的确认，需要重新确认当前材料。']},
    {id:'F05',group:'field',title:'03 施工流程：安装环境温度',entry:'施工流程 → 安装环境温度',
      details:['温度选项为“15–32℃”和“低于15或大于32度”。','异常提示为“低于15或大于32度时需补充现场原因”。'],
      logic:['施工前室温低于15℃或高于32℃时，自动选择异常项，禁用15–32℃。例如填写35℃，只能选择异常项。','15℃和32℃属于正常范围；正常范围内仍可主动选择异常项。','选择异常项时，至少勾选一条现场原因；原因可多选。']},
    {id:'F06',group:'field',title:'03 施工流程：起始点、基准线与胶水',entry:'施工流程 → 中心定位与基准线／胶水施工记录',
      details:['铺装说明：“地毯铺装，施工前请选择”起始点“，以此点为中心在地面弹设两条相互垂直的基准线，向四周延伸以助铺装准确。起始点不能从墙边或墙角开始铺装。”','上传中心定位及辅助线照片；选择是否使用美利肯胶水、是否加水或其他物质稀释。'],
      logic:['两项胶水问题均须选择“是”或“否”；选择稀释时显示质量警告。','提交本阶段可暂不传图，提交完工前至少补齐1张中心定位及辅助线照片。','当前页面不设独立的胶粘剂透明状态照片上传项。']},
    {id:'F07',group:'field',title:'04 施工结束',entry:'项目详情 → 施工结束',
      details:['填写安装完成日期、完工时室内温度、实际完成面积和胶水实际用量（kg）。','上传安装完成照片，至少1张。'],
      logic:['完成日期须有效，室温须为数字，实际面积大于0，胶水用量不小于0。','实际面积与报备面积的增减偏差超过10%时，显示提醒并要求勾选“已核对，确认按当前面积提交”。']},
    {id:'F08',group:'field',title:'提交完工：统一检查与确认',entry:'施工结束 → 提交完工',
      details:['弹出检查清单，按项目报备、施工前检查、施工流程、施工结束四阶段列出缺失信息。','照片统一检查：地面状态、中心定位及辅助线、安装完成三类照片各至少1张。'],
      logic:['每个缺失项写清字段和所属阶段；点击后跳到对应位置补全。未补齐时不能确认提交。','检查通过后点击“确认提交”，提示：“请检查申报信息是否正确，提交后仅有7日缓冲时间，超过7日将不给予修改。”','再次点击“确认无误，提交完工”，项目变为已完工。']},
    {id:'F09',group:'field',title:'完工后7日编辑',entry:'已完工项目详情 → 编辑项目',
      details:['已完工项目默认只读，详情提供“编辑项目”入口并显示可修改截止时间。'],
      logic:['从首次提交完工时间起算，7日内可编辑；恰满7日及之后入口禁用。','再次提交不会重新计算7日；没有首次提交时间的历史完工项目保持只读。']},
    {id:'F10',group:'field',title:'照片、定位与天气',entry:'各阶段照片区域／施工流程 → 获取位置与天气',
      details:['照片支持单张、多张选择，显示缩略图并可查看大图。','记录照片文件名、上传人、上传时间和所属项目阶段；返回阶段可查看已保存照片。'],
      logic:['位置和天气在设备授权后获取，失败时显示提示并可重试。','天气是辅助信息，不能替代手工填写的室内温度；相册照片不承诺获取原始拍摄时间。']},
    {id:'F11',group:'field',title:'草稿与阶段回填',entry:'阶段表单 → 保存草稿／首页 → 草稿箱',
      details:['未填完的项目或阶段可保存草稿，从草稿箱继续填写。','切换阶段后，已保存的字段、选项和照片回显。'],
      logic:['报备提交后移除报备草稿；提交完工后清除本项目草稿。','已提交的历史阶段再次提交，不重复推进项目进度。当前记录保存在同一浏览器中。']},
    {id:'A01',group:'admin',title:'数据看板',entry:'管理后台 → 数据看板',
      details:['按区域、项目经理、项目状态组合筛选，支持重置和移除单个条件，刷新后保留筛选。','显示项目总数、进行中、已完工、需关注项目、报备施工面积、计划安装人数六项指标。','显示优先关注项目、阶段分布、质量关注分布、计划开始／结束月份、区域分布和负责人工作量。'],
      logic:['点击指标、阶段、关注分类、月份、区域或负责人，进入对应项目清单。人数按各项目计划人数合计，面积按报备面积合计。','团队与材料配置显示全局配置，可跳转对应管理页；最近负责人交接可进入明细。','质量关注依据现有项目记录分类，不等同于验收不合格。']},
    {id:'A02',group:'admin',title:'项目档案与详情',entry:'管理后台 → 项目档案 → 详情',
      details:['按项目名称、阶段、区域、状态查询和重置；每页可选3、10或20条。','列表提供详情、交接、交接明细和下载。详情按四阶段查看字段、学习确认及全部已保存照片。'],
      logic:['从看板进入时，带入对应筛选范围；可返回看板。','未开始阶段不能进入；内置演示项目的图片标明“演示样例”。']},
    {id:'A03',group:'admin',title:'负责人交接',entry:'项目档案 → 交接／交接明细',
      details:['转出人显示当前项目负责人，选择继承人，可填写交接备注。','交接明细显示项目、转出人、继承人、时间、备注和操作人。'],
      logic:['继承人不能为空，不能与转出人相同。','确认后更新项目负责人，保留原阶段资料和交接记录；当前演示操作人固定为李雯。']},
    {id:'A04',group:'admin',title:'安装团队与师傅名册',entry:'管理后台 → 安装团队管理',
      details:['团队可新增、编辑、搜索，按城市和合作状态筛选；维护名称、联系人、电话、地址、服务区域和备注。','师傅可新增、编辑、搜索，按团队和状态筛选；维护姓名、电话、团队、岗位、工种、年限、培训状态、地址和备注。'],
      logic:['团队校验同名，师傅校验重复电话；保存前校验必填信息和联系电话。','暂停合作的团队不供新项目选择；点击师傅人数可查看该团队成员。','删除须确认；删除团队保留师傅档案，所属团队改为“未分配团队”，历史项目保留记录。']},
    {id:'A05',group:'admin',title:'材料新增、查询与编辑',entry:'管理后台 → 材料管理',
      details:['培训材料与安装手册分别管理，可按关键词、类别、状态查询或重置。','支持选择或拖入文件，填写类别、名称、版本和说明；可修改信息或替换单份文件。'],
      logic:['支持PDF、Word、PowerPoint、JPG、PNG；单个文件须大于0且不超过20MB，并校验文件内容与格式。','批量上传按文件名分别新增，默认全部停用；不替换文件时保留原内容。','PDF和图片支持预览，Word／PPT提供原文件打开或下载。']},
    {id:'A06',group:'admin',title:'材料启用、停用与删除',entry:'材料管理 → 启用／停用／删除',
      details:['现场只展示每类当前启用的材料；培训材料和安装手册各最多启用1份。','启用、停用和删除均弹出确认。'],
      logic:['启用同类别的新材料时，旧材料自动停用。','停用或删除当前启用材料后，该类别显示暂无启用材料，不自动启用其他文件。','替换文件后须按新内容重新确认；已保存的历史阅读记录保留。']},
    {id:'A07',group:'admin',title:'项目PDF下载与清单导出',entry:'数据看板／项目档案 → 下载；数据看板 → 导出项目数据',
      details:['每个项目可下载PDF，包含项目信息、四阶段字段、学习确认、已保存照片和交接记录。','“导出项目数据”下载当前筛选范围的CSV，包含项目、区域、负责人、阶段、状态、计划周期、面积、人数、团队和关注事项。'],
      logic:['PDF必须逐张输出图片内容、文件名和已有上传信息；图片按比例分页，不能拉伸、裁切或重叠。','图片读取失败时提示具体照片；未保存图片内容的历史记录如实标注。','CSV日期列当前实际按年月导出；项目报备表单的计划日期仍精确到日。']},
    {id:'D01',group:'design',title:'页面排版与品牌',entry:'现场首页、项目详情及各阶段表单',
      details:['首页标题使用美利肯Logo；移除王建国右侧圆形头像及其中“王”字，移除顶部“企业微信工作台 · 美利肯”。','项目概览按面积、计划周期、安装人数横向三列显示，开始日期和结束日期分行显示。'],
      logic:['保持现有蓝色主题、卡片和阶段时间轴样式；手机窄屏下文字正常换行，页头和正文不重叠。','弹窗及PDF中的图片保持原比例；表单、说明和按钮不得互相遮挡。']},
    {id:'D02',group:'design',title:'字体与字号',entry:'当前Demo业务页面',
      details:['中文优先使用苹方、微软雅黑；英文和数字沿用现有页面字体。','下表为当前页面实际字号，单位为px。常规为400，中等为500，半粗为650，加粗为700。'],
      logic:[],fonts:true},
    {id:'D03',group:'design',title:'提示与操作状态',entry:'表单、列表及弹窗',
      details:['必填字段带星号；异常温度、面积偏差、胶水稀释用明确文字提示。','未开始阶段、过期编辑入口及不符合条件的提交按钮显示不可用状态。'],
      logic:['错误提示写清需要补充的内容；补全后重新检查。','照片上传、PDF生成过程中显示处理状态，完成或失败后恢复操作。']}
  ];
  const fontGroups = [
    {label:'企微工作台应用',rows:[
      ['页面标题','20','加粗'],['首页欢迎语、项目详情标题','27','加粗'],['项目卡片名称','21','加粗'],['项目辅助信息','17','常规'],
      ['项目统计数字','25','加粗'],['统计标签、概览字段名、表单说明','14','常规'],['概览字段值、表单分组标题','18','加粗'],
      ['阶段时间轴文字','15','加粗'],['字段名称、材料入口、底部按钮','16','加粗'],['培训确认文字','17','加粗'],['输入框、日期显示','16','常规']
    ]},
    {label:'管理后台（电脑）',rows:[
      ['页面标题','30','加粗'],['侧栏菜单','16','常规'],['项目表头、项目操作链接','17','加粗'],['项目表格正文','17','常规'],
      ['看板指标名称','14','常规'],['看板指标数字','32','加粗'],['看板分组标题','18','半粗'],['看板说明文字','13','常规'],
      ['团队／师傅弹窗标题','25','半粗'],['团队／师傅字段名称','14','中等'],['团队／师傅输入文字','14','常规'],
      ['材料库标题','18','加粗'],['材料表头','13','中等'],['材料表格正文','14','常规']
    ]},
    {label:'管理后台（手机，屏宽不超过600px）',rows:[
      ['看板指标数字','28','加粗'],['看板分组标题','17','半粗'],['看板列表正文','12','常规']
    ]}
  ];
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list=values=>`<ul>${values.map(value=>`<li>${esc(value)}</li>`).join('')}</ul>`;
  const fonts=()=>`<div class="reqFonts">${fontGroups.map(group=>`<section><h4>${esc(group.label)}</h4><div class="reqTableScroll" tabindex="0" role="region" aria-label="${esc(group.label)}字号表"><table><thead><tr><th scope="col">页面文字</th><th scope="col">字号</th><th scope="col">字重</th></tr></thead><tbody>${group.rows.map(row=>`<tr><td>${esc(row[0])}</td><td>${esc(row[1])} px</td><td>${esc(row[2])}</td></tr>`).join('')}</tbody></table></div></section>`).join('')}</div>`;
  const itemHtml=(item,open=true)=>`<details class="reqItem" id="req-${item.id}"${open?' open':''}><summary><h3>${esc(item.title)}</h3><span class="reqChevron" aria-hidden="true"></span></summary><p class="reqEntry">入口：${esc(item.entry)}</p><div class="reqBody${item.logic.length?'':' reqSingle'}"><section><h4>需求细节</h4>${list(item.details)}</section>${item.logic.length?`<section><h4>操作逻辑</h4>${list(item.logic)}</section>`:''}</div>${item.fonts?fonts():''}</details>`;
  const chapter=(group,matching,open)=>`<section class="reqChapter"><header class="reqSectionTitle"><h2>${esc(group.label)}</h2><p>${esc(group.description)}</p></header>${matching.map(item=>itemHtml(item,open)).join('')}</section>`;
  function exportDocument(){
    const content=groups.map(group=>chapter(group,items.filter(item=>item.group===group.id),true)).join('');
    const css='*{box-sizing:border-box}body{margin:0;color:#183345;background:#f3f6fa;font:14px/1.75 "PingFang SC","Microsoft YaHei",Arial,sans-serif}main{max-width:1100px;margin:28px auto;padding:30px;background:#fff}h1{font-size:26px}h2{font-size:22px}h3{font-size:17px;margin:0}h4{font-size:14px;margin:0 0 8px}p{overflow-wrap:anywhere}.reqSectionTitle{margin:30px 0 18px}.reqSectionTitle p,.reqEntry{color:#60758b;font-size:13px}.reqItem{border:1px solid #dce5ef;border-radius:8px;margin:14px 0;overflow:hidden}.reqItem summary{cursor:pointer;padding:16px 20px;list-style:none}.reqEntry{padding:0 20px;margin:0 0 14px}.reqBody{display:grid;grid-template-columns:1fr 1fr;gap:26px;padding:0 20px 20px}.reqSingle{grid-template-columns:1fr}ul{padding-left:19px;margin:0}li{margin:7px 0;overflow-wrap:anywhere}.reqFonts{padding:0 20px 22px}.reqFonts section+section{margin-top:22px}.reqTableScroll{overflow:auto}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #dce5ef;padding:9px 12px;text-align:left}th{background:#f5f8fc}td:nth-child(n+2){white-space:nowrap;width:100px}@media(max-width:650px){main{margin:0;padding:16px}.reqBody{grid-template-columns:1fr;gap:18px}.reqItem summary,.reqEntry{padding-left:16px;padding-right:16px}.reqFonts{padding-left:16px;padding-right:16px}}@media print{body{background:#fff}main{margin:0;padding:0}.reqChapter{break-before:page}.reqChapter:first-of-type{break-before:auto}.reqSectionTitle,summary,h4{break-after:avoid}li,tr{break-inside:avoid}.reqTableScroll{overflow:visible}}';
    const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>美利肯安装质量中心 · 需求说明</title><style>${css}</style></head><body><main><h1>美利肯安装质量中心 · 需求说明</h1><p>2026-10-20 更新 · 需求细节、操作逻辑与界面字号。</p>${content}</main></body></html>`;
    const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='美利肯安装质量中心-需求说明-20261020.html';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
  }
  function mount(host){
    if(host.dataset.requirementsMounted)return;
    host.dataset.requirementsMounted='true';
    const state={group:'field',query:'',open:true};
    host.innerHTML=`<header class="reqHero"><div><h2>功能细节与操作逻辑</h2><p>按两端功能和界面规范查阅，内容对应当前 Demo。</p></div><button type="button" class="reqDownload">下载需求说明</button></header><nav class="reqTabs" aria-label="需求说明栏目">${groups.map(group=>`<button type="button" data-req-group="${group.id}">${esc(group.label)}</button>`).join('')}</nav><form class="reqToolbar" role="search"><label><span class="reqSr">搜索需求</span><input type="search" id="reqSearch" placeholder="搜索功能、字段或字号，例如：温度、照片、16px" autocomplete="off"></label><button type="button" id="reqReset">清除搜索</button></form><div class="reqResultsBar"><p id="reqResultCount" role="status" aria-live="polite"></p><div><button type="button" id="reqExpand">全部展开</button><button type="button" id="reqCollapse">全部收起</button></div></div><div id="reqResults"></div><p class="reqFooter">说明更新：2026-10-20。未保存的信息以各阶段实际记录为准。</p>`;
    const results=host.querySelector('#reqResults');
    const render=()=>{
      const query=state.query.trim().toLocaleLowerCase().replace(/\s+/g,'');
      const matches=items.filter(item=>{
        const text=[item.title,item.entry,...item.details,...item.logic,...(item.fonts?fontGroups.flatMap(g=>[g.label,...g.rows.map(row=>`${row[0]} ${row[1]}px ${row[2]}`)]):[])].join(' ').toLocaleLowerCase().replace(/\s+/g,'');
        return query?text.includes(query):item.group===state.group;
      });
      host.querySelectorAll('[data-req-group]').forEach(button=>{
        const active=!query&&button.dataset.reqGroup===state.group;
        button.classList.toggle('active',active);
        if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
      });
      host.querySelector('#reqResultCount').textContent=query?`找到 ${matches.length} 项相关内容`:`${groups.find(group=>group.id===state.group).label} · ${matches.length} 项内容`;
      results.innerHTML=matches.length?groups.filter(group=>matches.some(item=>item.group===group.id)).map(group=>chapter(group,matches.filter(item=>item.group===group.id),state.open)).join(''):'<div class="reqEmpty"><h3>没有找到相关内容</h3><p>换一个关键词，或清除搜索后按栏目查看。</p></div>';
    };
    const search=host.querySelector('#reqSearch');
    host.querySelector('.reqToolbar').onsubmit=event=>event.preventDefault();
    search.oninput=()=>{state.query=search.value;render()};
    host.querySelector('#reqReset').onclick=()=>{state.query='';search.value='';render();search.focus()};
    host.querySelectorAll('[data-req-group]').forEach(button=>button.onclick=()=>{state.group=button.dataset.reqGroup;state.query='';search.value='';render()});
    host.querySelector('#reqExpand').onclick=()=>{state.open=true;results.querySelectorAll('details').forEach(item=>item.open=true)};
    host.querySelector('#reqCollapse').onclick=()=>{state.open=false;results.querySelectorAll('details').forEach(item=>item.open=false)};
    host.querySelector('.reqDownload').onclick=exportDocument;
    render();
  }
  window.MillikenRequirements=Object.freeze({mount});
})();
