// 需求说明 V2.3 · 2026-10-21。
(() => {
  'use strict';
  const groups = [
    {id:'field',label:'企微工作台应用',description:'按实际操作说明填写要求、阶段推进、选项联动、完工校验及7日修改规则。'},
    {id:'admin',label:'管理后台',description:'查询项目、交接负责人，维护安装团队及学习材料，下载项目资料。'},
    {id:'design',label:'界面与字号',description:'说明现有页面的排版、字体和字号，按当前 Demo 样式执行。'}
  ];
  const items = [
    {
      "id": "F01",
      "group": "field",
      "title": "入口、首页与项目查询",
      "entry": "通讯录 → 美利肯公司 → 安装质量中心",
      "details": [
        "Demo先展示企业入口，点击“美利肯公司”，再点击“安装质量中心”进入首页；现场演示人员为王建国。",
        "首页提供新建项目报备、草稿箱、进行中／已完工／全部项目统计、待补充任务和最近项目。项目卡片展示名称、地区、计划周期、当前阶段、状态和负责人。"
      ],
      "logic": [
        "首页输入项目名称或计划周期，筛选最近项目；点击“清除”恢复显示，找不到时提示没有匹配的项目。",
        "点击统计卡片进入对应状态的项目列表；列表内可继续搜索，并切换全部、进行中、已完工。",
        "待补充任务仅列出进行中且已有质量关注事项的项目；点击任务进入该项目当前阶段填写，不作为系统消息推送。",
        "点击项目卡片进入详情，查看面积、计划起止日期、安装人数和四阶段时间轴。"
      ]
    },
    {
      "id": "F12",
      "group": "field",
      "title": "四阶段顺序、提交与返回修改",
      "entry": "项目详情／阶段表单 → 安装阶段时间轴",
      "details": [
        "填写顺序为项目报备 → 施工前检查 → 施工流程 → 施工结束。时间轴分别显示未开始、进行中、已完成。",
        "当前阶段和已经完成的历史阶段可以进入；尚未开始的阶段禁用，不能跳过前一阶段直接填写。"
      ],
      "logic": [
        "新建项目先填写报备，提交成功后才加入项目列表；报备不经过后台审批，直接开放施工前检查。",
        "第2、3阶段点击“提交本阶段”，校验本阶段必填文字及选项；照片可后补，校验通过后开放下一阶段。",
        "返回历史阶段补充或修改，已保存内容回填；再次提交历史阶段不会倒退进度，也不会再多推进一个阶段。",
        "阶段填报期间可点击时间轴切换已开放阶段，或返回项目详情。最终完工统一检查四阶段资料；只有完成完工确认，状态才改为已完工。"
      ],
      "table": {
        "caption": "各阶段提交后的结果",
        "headers": [
          "当前阶段",
          "提交条件",
          "提交后"
        ],
        "rows": [
          [
            "项目报备",
            "报备必填信息有效",
            "进入施工前检查，项目为进行中"
          ],
          [
            "施工前检查",
            "室温、地面状态及必要说明有效；照片可后补",
            "进入施工流程，项目仍为进行中"
          ],
          [
            "施工流程",
            "学习确认、环境温度及原因、两项胶水选择有效；照片可后补",
            "进入施工结束，项目仍为进行中"
          ],
          [
            "施工结束",
            "四阶段检查全部通过，并完成二次确认",
            "项目变为已完工，开始计算7日修改期限"
          ]
        ]
      }
    },
    {
      "id": "F02",
      "group": "field",
      "title": "01 项目报备：字段、团队与日期",
      "entry": "首页 → 新建项目报备",
      "details": [
        "必填项目／客户名称、省／直辖市、城市、项目面积（m²）、计划开始日期、计划结束日期、本项目计划安装人数，以及是否长期合作团队。",
        "计划周期选择具体年月日；省市从现有下拉选项中选择。新建报备的字段留空，长期合作团队默认选“否”。"
      ],
      "logic": [
        "名称去除首尾空格后不能为空；项目面积须大于0，计划安装人数须为大于0的整数。缺少必填项时提示对应字段，项目不会进入下一阶段。",
        "开始、结束日期均须填写；结束日期可以等于开始日期，不能早于开始日期。",
        "长期合作选“是”，显示并必选安装团队，团队来自后台合作中的团队名册；无可选团队时提示先到后台新增。",
        "长期合作选“否”，隐藏团队选择，不另行要求输入团队或个人名称。后台暂停合作的团队不能用于新报备，历史项目保留原团队记录。",
        "点击“提交报备”保存项目信息，更新项目概览、列表及后台档案，并进入施工前检查；修改历史报备时保留原阶段进度。"
      ]
    },
    {
      "id": "F03",
      "group": "field",
      "title": "02 施工前检查：室温与地面状态",
      "entry": "项目详情 → 施工前检查",
      "details": [
        "填写室内温度，单位为℃，必须是有效数字。该数值用于下一阶段安装环境温度的联动判断。",
        "地面平整度情况单选：良好、一般、不平、起砂、含水率超标、自流平分层、其他。",
        "上传地面状态照片，支持多张，建议包含整体与局部。"
      ],
      "logic": [
        "室温和地面状态均为必填；选择“其他”时出现“其他情况说明”，说明不能为空，最多255字；输入框显示实时字数，如0/255、20/255，达到上限后不能继续输入。改选其他地面状态后隐藏说明框，不再将该说明作为必填项。",
        "室温低于15℃或高于32℃可如实填报，不阻止提交本阶段；进入施工流程后必须按异常温度补充现场原因。",
        "点击“提交本阶段”检查温度、地面状态及必要说明，照片可暂不上传；通过后进入施工流程。",
        "提交完工前，地面状态照片必须至少有1张。后续回改室温，再进入施工流程时按最新室温重新判断温度选项。"
      ]
    },
    {
      "id": "F04",
      "group": "field",
      "title": "03 施工流程：材料阅读与三项确认",
      "entry": "施工流程 → 安装人员培训与手册确认",
      "details": [
        "前两项为“参加过美利肯安装培训”“已完整阅读美利肯安装手册”，分别附“安装培训材料”“安装手册材料”入口，显示后台当前启用文件的名称及版本。",
        "第三项为“您已学习安装培训材料和安装手册”，用于同时确认上方两项。",
        "说明文字为“培训材料和安装手册可分别确认，可选择其中一项或同时选择两项。当两个都学习后请勾选第三个选项”。"
      ],
      "logic": [
        "分别确认材料时，先点击对应材料入口。PDF和图片可预览；Word／PPT须先打开或下载原文件，再返回确认。开始阅读后倒计时5秒，结束后点击“确认已阅读”，返回表单并自动勾选对应项。",
        "只打开材料、未点击阅读确认便返回，不新增该材料的确认状态；已完成阅读确认的单项可以取消、重新勾选。",
        "直接勾选第三项，上方两项同时选中；取消第三项时保留上方两项。取消上方任意一项时，第三项同步取消。",
        "提交施工流程及提交完工时，至少有一项与当前启用材料匹配的有效确认；前两项均已选中时，还必须勾选第三项。",
        "某类材料未启用或加载失败时，提示联系管理员或重试；该类别的旧确认不能作为当前有效确认。材料替换或版本切换后须重新确认；在阅读页发生更新时，禁用原文件的确认并提示返回阅读新材料。"
      ],
      "table": {
        "caption": "三项确认的联动结果",
        "headers": [
          "操作或状态",
          "页面结果",
          "提交要求"
        ],
        "rows": [
          [
            "仅确认培训或仅确认手册",
            "对应单项选中，第三项未选",
            "当前材料确认有效即可满足学习要求"
          ],
          [
            "分别确认培训和手册",
            "前两项选中，第三项需另勾选",
            "未勾选第三项时提示补充"
          ],
          [
            "勾选第三项",
            "上方两项自动选中并确认",
            "三项均选中"
          ],
          [
            "取消第三项",
            "上方两项仍保持选中",
            "两项均选中时仍须补勾第三项"
          ],
          [
            "取消上方任意一项",
            "该项及第三项取消，另一项保留",
            "保留的一项有效即可满足学习要求"
          ]
        ]
      }
    },
    {
      "id": "F05",
      "group": "field",
      "title": "03 施工流程：温度联动与现场原因",
      "entry": "施工流程 → 安装环境温度",
      "details": [
        "温度单选为“15–32℃”和“低于15或大于32度”，同时显示施工前检查已填写的室温。",
        "异常提示为“低于15或大于32度时需补充现场原因”。选择异常项后显示现场原因，可多选。",
        "原因包括现场无供暖设施，供暖／空调暂不具备启用条件，设备已安装但不允许启用，现场高温且降温条件不足，以及其他现场原因；“其他现场原因”当前为勾选项，没有额外文本框。"
      ],
      "logic": [
        "施工前室温低于15℃或高于32℃时，自动选择异常项并禁用15–32℃。例如填写35℃，只能选择“低于15或大于32度”。",
        "15℃和32℃均属于正常范围；正常范围内可选择正常，也可根据现场情况主动选择异常，系统不替用户自动选正常项。",
        "选择异常项时至少勾选一条现场原因，未选原因不能提交施工流程，也不能通过完工检查。切回正常项后隐藏原因区，不再要求填写原因。",
        "回改施工前室温后，再进入施工流程重新判断；若由异常值改成正常值，正常选项恢复可选，原异常选择不会自动清除，可由填报人调整。"
      ],
      "table": {
        "caption": "室温与可选项的对应关系",
        "headers": [
          "施工前室温",
          "安装环境温度",
          "现场原因"
        ],
        "rows": [
          [
            "低于15℃，如14℃",
            "自动异常，正常项禁用",
            "至少勾选1条"
          ],
          [
            "15℃至32℃，包含边界",
            "正常／异常均可选",
            "选异常须至少勾选1条"
          ],
          [
            "大于32℃，如35℃",
            "自动异常，正常项禁用",
            "至少勾选1条"
          ]
        ]
      }
    },
    {
      "id": "F06",
      "group": "field",
      "title": "03 施工流程：起始点、基准线与胶水",
      "entry": "施工流程 → 中心定位与基准线／胶水施工记录",
      "details": [
        "铺装说明：“地毯铺装，施工前请选择”起始点“，以此点为中心在地面弹设两条相互垂直的基准线，向四周延伸以助铺装准确。起始点不能从墙边或墙角开始铺装。”",
        "上传中心定位及辅助线照片，照片需拍到定位点和两条相互垂直的基准线。",
        "分别选择“是否使用美利肯胶水”“是否加水或其他物质稀释”，均为是／否单选；说明要求胶粘剂转为透明后再开始铺装。"
      ],
      "logic": [
        "两项胶水问题都必须作出选择；选择使用非美利肯胶水不额外出现其他品牌输入框。",
        "选择“加水或其他物质稀释＝是”时显示胶水不应稀释的质量警告；切回“否”隐藏警告。当前警告不拦截本阶段提交，也没有后台审批步骤。",
        "提交本阶段可暂不传图，提交完工前至少补齐1张中心定位及辅助线照片。",
        "当前页面不设独立的胶粘剂透明状态照片上传项；完工清单不额外检查此类照片。"
      ]
    },
    {
      "id": "F07",
      "group": "field",
      "title": "04 施工结束：实际数据与面积偏差",
      "entry": "项目详情 → 施工结束",
      "details": [
        "本阶段指地毯安装工作结束，不代表整个建设项目竣工。必填安装完成日期、完工时室内温度、实际完成面积、胶水实际用量，另需安装完成照片。",
        "完成日期精确到日；室温单位为℃，面积单位为m²，胶水用量单位固定为kg，不另选单位。实际完成面积旁显示报备面积供核对。"
      ],
      "logic": [
        "完成日期须为有效日期，室温须为有效数字，实际面积须大于0，胶水用量须为不小于0的有效数字。",
        "面积偏差按“实际完成面积与报备面积差值的绝对值 ÷ 报备面积”计算，增加或减少超过10%均提示核对。",
        "例如报备100m²，实际110m²或90m²恰为10%，不要求额外确认；实际111m²或89m²超过10%，必须勾选“已核对，确认按当前面积提交”。",
        "再次修改实际完成面积时，原面积核对勾选自动清除；若仍超过10%，须重新勾选。",
        "点击“提交完工”先打开四阶段检查清单；安装完成照片至少1张，未补齐不能最终提交。"
      ]
    },
    {
      "id": "F08",
      "group": "field",
      "title": "提交完工：四阶段检查、补全与二次确认",
      "entry": "施工结束 → 提交完工",
      "details": [
        "每次点击“提交完工”都按当前保存内容检查四阶段，清单显示各阶段“已完整”或待补全数量。缺失项写明具体字段、原因及所属阶段。",
        "照片统一检查地面状态、中心定位及辅助线、安装完成三类，每类各至少1张且已保存图片内容；只有文件名或没有实际图片不视为完成上传。"
      ],
      "logic": [
        "照片仍在保存时提示稍后重试；照片保存结束后再打开清单，避免漏掉刚选择的图片。",
        "有缺失项时“确认提交”禁用；点击某项“去补全”，关闭清单并跳到对应阶段的字段、选项或照片区域，突出显示目标位置。",
        "补全后回到施工结束，重新点击“提交完工”再次检查；在清单中点击“返回检查”仅关闭弹窗，不改为已完工。",
        "全部通过后点击“确认提交”，提示：“请检查申报信息是否正确，提交后仅有7日缓冲时间，超过7日将不给予修改。”此时仍未最终提交。",
        "再次点击“确认无误，提交完工”，系统重新核对资料及修改期限，成功后改为已完工，记录首次完工时间和本次提交时间、清除本项目草稿，并返回详情。",
        "若确认期间材料版本或修改期限等条件变化，提示重新检查，不直接提交。"
      ],
      "table": {
        "caption": "完工清单逐阶段检查内容",
        "headers": [
          "阶段",
          "必填信息与选项",
          "照片要求"
        ],
        "rows": [
          [
            "项目报备",
            "名称、省市、面积、起止日期、人数、长期合作选择；选是时含团队；同时检查数字和日期关系",
            "不要求照片"
          ],
          [
            "施工前检查",
            "有效室温、地面状态；选其他时含说明",
            "地面状态至少1张"
          ],
          [
            "施工流程",
            "当前材料有效确认、第三项联动、环境温度及必要原因、两项胶水选择",
            "中心定位及辅助线至少1张"
          ],
          [
            "施工结束",
            "有效完成日期、室温、实际面积、胶水用量；面积偏差超过10%时含核对确认",
            "安装完成至少1张"
          ]
        ]
      }
    },
    {
      "id": "F09",
      "group": "field",
      "title": "完工后7日编辑与到期锁定",
      "entry": "已完工项目详情 → 编辑项目",
      "details": [
        "已完工项目默认只读，详情提供“编辑项目”入口；有效期内显示精确到时间的可修改截止时间。",
        "修改期限从首次提交完工时刻起算7×24小时，不按自然日末尾计算。"
      ],
      "logic": [
        "首次完工后未满7日可点击“编辑项目”，从报备阶段进入，可切换四阶段修改字段、选项和照片；不点击编辑入口时保持只读。",
        "编辑后，第1阶段点击“提交报备”、第2／3阶段点击“提交本阶段”保存修改；第4阶段重新点击“提交完工”时，仍执行四阶段清单和二次确认。项目保持已完工，重新提交不延长修改期限。",
        "从首次提交时间起恰满7日及之后，入口禁用，不能保存修改或重新提交；即使提前进入编辑页，到期后继续保存也会被阻止。",
        "返回项目详情会结束本次编辑状态；有效期内再次修改须重新点击“编辑项目”。没有首次提交时间的历史完工项目保持只读。"
      ]
    },
    {
      "id": "F10",
      "group": "field",
      "title": "照片选择、保存、替换与查看",
      "entry": "施工前检查／施工流程／施工结束 → 照片区域",
      "details": [
        "三处照片区均支持选择图片、一次多选、缩略图及点击查看大图；只接受图片文件。",
        "记录图片内容、文件名、上传人和上传时间，并关联所属项目及阶段；返回阶段可查看已保存照片，后台项目详情及PDF使用同一批已保存图片。"
      ],
      "logic": [
        "首次选择后读取并保存整批图片，完成后提示“照片已保存”；读取失败提示重试，未选择文件直接返回则保持原照片。",
        "同一照片区再次选择时，用本次选择的整批图片替换原批次，不是在原照片上追加；需要保留的照片应一并重新选择。当前没有逐张删除入口。",
        "阶段性提交时，第2、3阶段的照片可以不上传；提交完工时三类照片各至少1张，不能用某一类多传几张代替另一类。",
        "照片时间指上传时间；相册照片不承诺获取原始拍摄时间，也不自动在图片上添加定位或天气水印。"
      ]
    },
    {
      "id": "F13",
      "group": "field",
      "title": "现场位置与天气获取",
      "entry": "施工流程 → 中心定位及辅助线照片 → 获取位置与天气",
      "details": [
        "位置和天气通过独立按钮获取，结果显示在中心定位照片区域，包括中文地点、天气情况及室外气温。",
        "位置与天气为辅助展示，不能替代施工前或完工时手工填写的室内温度。"
      ],
      "logic": [
        "点击后申请设备定位授权，显示获取中状态并暂时禁用按钮；取得坐标后分别查询中文地址及当地天气。",
        "定位不支持、拒绝授权、超时、精度不足，或地址／天气查询失败时，分别提示具体情况并允许重试，不使用报备城市伪装为当前定位。",
        "地址与天气独立返回，单项失败不覆盖另一项已经获取的结果；获取成功后可点击重新获取。",
        "没有获取到位置或天气不阻止阶段提交，也不是完工清单必填项；当前结果在页面区域展示，不作为照片原始拍摄信息。"
      ]
    },
    {
      "id": "F11",
      "group": "field",
      "title": "草稿保存、继续填写与数据回填",
      "entry": "阶段表单 → 保存草稿／首页 → 草稿箱",
      "details": [
        "未填完时可保存草稿，不要求先补齐本阶段所有必填信息。草稿箱显示项目名称、所属阶段和保存提示，首页显示待继续草稿数量。",
        "草稿按“项目＋阶段”保存；同一项目不同阶段可各有草稿，同一阶段再次保存更新原草稿，不重复新增。"
      ],
      "logic": [
        "点击“保存草稿”后进入草稿箱；点击草稿“继续填写”回到对应项目、对应阶段，回填已保存的字段、选项、学习确认及照片。",
        "新建项目的报备草稿不计入正式项目列表；提交报备后移除报备草稿，提交完工后清除本项目草稿。",
        "保存草稿、填写字段及切换已开放阶段均不会代替正式提交，也不会自动推进项目阶段；已提交的历史阶段再次提交不重复推进进度。",
        "当前Demo记录保存在同一浏览器中，刷新后可继续查看；更换设备、浏览器或清除站点数据，不会自动同步原草稿和现场记录。"
      ]
    },
    {"id": "A01", "group": "admin", "title": "数据看板：项目名称、区域与时间筛选", "entry": "管理后台 → 数据看板", "details": ["支持项目名称关键词、区域、负责人、状态、时间类型及起止日期组合查询；可重置或移除单个条件，刷新后保留已应用的筛选。", "时间类型选择计划开始日期、计划结束日期或实际完成日期；起始、截止日期均可单独填写。", "指标、图表、关注项目、负责人工作量和导出数据均使用同一已应用筛选范围。"], "logic": ["名称按关键词包含匹配，不区分英文大小写；多个条件同时生效。项目名称和起止日期填写后点击“查询”或回车应用；切换下拉选项时也会应用当前表单。", "时间按所选类型判断，包含起止当天；只填一端时另一端不限。截止日期早于起始日期时提示错误，保留上一次有效筛选，不更新看板。", "历史项目只有年月时按整月与筛选范围是否相交判断，不伪造具体日期；未保存实际完成日期的项目不参与实际完成日期范围的匹配。", "点击指标或图表进入项目档案，带入名称、区域、负责人、状态及时间范围等条件；返回看板保留原筛选。", "清除名称不会清除时间条件；“重置筛选”清空全部条件并将时间类型恢复为计划开始日期。空结果显示0个项目，导出时提示无可导出项目。", "面积按报备面积合计、人数按计划人数合计；质量关注依据当前项目已有记录，不等同于验收不合格。"]},
    {"id": "A02", "group": "admin", "title": "项目档案与详情", "entry": "管理后台 → 项目档案 → 详情", "details": ["按项目名称、阶段、区域、状态查询和重置；每页可选3、10或20条。", "列表提供详情、交接、交接明细和单项目PDF下载；详情按四阶段显示字段、学习确认及全部已保存照片。"], "logic": ["从看板进入时带入当前筛选范围，包括项目名称和所选时间类型的日期范围；清单上方显示所带入的时间条件，可返回看板。", "未开始阶段不能进入；内置演示项目的图片和字段标明“演示样例”，不作为真实上传或填写。", "在项目档案点击“重置”，清除该清单的筛选范围；看板原已保存筛选不随之清除。"]},
    {id:'A03',group:'admin',title:'负责人交接',entry:'项目档案 → 交接／交接明细',
      details:['转出人显示当前项目负责人，选择继承人，可填写交接备注。','交接明细显示项目、转出人、继承人、时间、备注和操作人。'],
      logic:['继承人不能为空，不能与转出人相同。','确认后更新项目负责人，保留原阶段资料和交接记录；当前演示操作人固定为李雯。']},
    {"id": "A04", "group": "admin", "title": "安装团队与团队内师傅维护", "entry": "管理后台 → 安装团队管理", "details": ["保留安装团队列表，移除独立“师傅名册”页签。团队行提供编辑、删除、新增；点击师傅人数查看当前团队的成员。", "团队维护名称、所在城市、服务区域、合作状态、联系人、电话、详细地址及备注。服务区域为必选下拉框，选择华东、华南、华北、华中、西南、西北、东北或港澳台。", "师傅维护姓名、电话、岗位、工种、从业年限、培训状态、合作状态、联系地址和备注；所属团队自动关联入口团队，以固定文字展示，无需手填或选择。"], "logic": ["团队行点击“新增”，进入该团队成员区域并打开“新增师傅”；也可在团队成员区域继续新增。保存后刷新该团队成员和人数，取消不新增记录。", "在团队成员区域搜索或重置，仅查询当前团队；点击“返回安装团队”回到团队列表。编辑已有师傅时所属团队同样固定，不能在表单中改归其他团队。", "新建或编辑团队时服务区域只能选择既定区域，不能输入城市替代；城市与服务区域分别保存，允许团队跨所在城市所属大区开展服务。区域范围见“区域对照与使用规则”。", "旧团队服务区域若为上海、苏州、北京等已识别城市，会按统一口径显示为对应大区；无法识别的旧值保留为历史值，编辑保存前须重新选择有效区域。", "团队校验同名，师傅校验重复电话；保存前校验必填信息和有效联系电话。暂停合作的团队不用于新项目报备，但保留原成员及历史项目记录。", "删除团队或师傅须二次确认；删除团队保留原师傅数据和历史项目记录，原成员关联标记为未分配团队；团队列表不提供独立师傅名册入口。"]},
    {id:'A05',group:'admin',title:'材料新增、查询与编辑',entry:'管理后台 → 材料管理',
      details:['培训材料与安装手册分别管理，可按关键词、类别、状态查询或重置。','支持选择或拖入文件，填写类别、名称、版本和说明；可修改信息或替换单份文件。'],
      logic:['支持PDF、Word、PowerPoint、JPG、PNG；单个文件须大于0且不超过20MB，并校验文件内容与格式。','批量上传按文件名分别新增，默认全部停用；不替换文件时保留原内容。','PDF和图片支持预览，Word／PPT提供原文件打开或下载。']},
    {id:'A06',group:'admin',title:'材料启用、停用与删除',entry:'材料管理 → 启用／停用／删除',
      details:['现场只展示每类当前启用的材料；培训材料和安装手册各最多启用1份。','启用、停用和删除均弹出确认。'],
      logic:['启用同类别的新材料时，旧材料自动停用。','停用或删除当前启用材料后，该类别显示暂无启用材料，不自动启用其他文件。','替换文件后须按新内容重新确认；已保存的历史阅读记录保留。']},
    {"id": "A07", "group": "admin", "title": "项目PDF与完整Excel导出", "entry": "数据看板 → 导出项目数据；数据看板／项目档案 → 单项目下载", "details": ["“导出项目数据”下载标准.xlsx工作簿，按当前已应用的筛选范围导出全部匹配项目，不受项目档案分页影响。", "Excel包含项目清单、阶段明细、照片资料、负责人交接四个工作表。项目清单列出编号、名称、地区、负责人、状态、阶段、报备数据、实际完成数据及完工和修改期限；阶段明细逐项列出四阶段字段、选项、异常原因、学习确认、材料版本及阅读记录。", "照片资料逐张提供项目、阶段、类别、文件名、图片内容、上传人和上传时间；负责人交接列出转出人、继承人、交接时间、备注及操作人。"], "logic": ["Excel的数字和完整日期以可计算、可排序的单元格保存；只有年月的旧计划周期保留原记录，不补造某一天。原未填写字段、未开始阶段和演示样例按真实状态标注。", "导出冻结表头、支持列筛选和自动换行；照片按比例嵌入独立行，保留完整画面，不裁切或相互覆盖。无照片或交接记录时显示无记录说明。", "图片内容缺失的旧记录保留文件名等信息并标注“未保存图片内容”；已有图片读取失败则提示具体照片，修正后重试，避免输出缺图的文件。", "导出期间显示生成中并防止重复点击，完成或失败后恢复按钮；没有匹配项目时提示无法导出。未点击查询应用的新条件不改变当前导出范围。", "单项目“下载”仍生成PDF，包含项目信息、四阶段字段、学习确认、完整照片和交接记录；图片逐张按比例分页，不拉伸、裁切或重叠。"]},
    {id:'A08',group:'admin',title:'区域对照与使用规则',entry:'新增／编辑安装团队 → 服务区域；数据看板 → 区域筛选',
      details:['Demo统一按下表划分服务区域。华东包含江浙沪，即江苏、浙江、上海，并包含安徽、福建、江西和山东；港澳台单列。','新增安装团队的服务区域为单选必填；团队所在城市保留原独立输入。'],
      logic:['团队服务区域表示可提供服务的大区；项目区域按项目报备省份归类，不能因为选择了华东服务团队，就把华南项目归为华东。','看板的区域筛选、区域统计及项目报备省份归类使用同一对照口径。已有历史项目保留其记录区域，不补造未填写地址。'],
      table:{caption:'服务区域与省级地区对照',headers:['区域','包含的省级地区'],rows:window.MillikenRegions.groups.map(group=>[group.name,group.provinces.join('、')])}},
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
  const ruleTable=table=>table?`<section class="reqRules"><h4>${esc(table.caption)}</h4><div class="reqTableScroll" tabindex="0" role="region" aria-label="${esc(table.caption)}"><table><thead><tr>${table.headers.map(label=>`<th scope="col">${esc(label)}</th>`).join('')}</tr></thead><tbody>${table.rows.map(row=>`<tr>${row.map(value=>`<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`:'';
  const itemHtml=(item,open=true)=>`<details class="reqItem" id="req-${item.id}"${open?' open':''}><summary><h3>${esc(item.title)}</h3><span class="reqChevron" aria-hidden="true"></span></summary><p class="reqEntry">入口：${esc(item.entry)}</p><div class="reqBody${item.logic.length?'':' reqSingle'}"><section><h4>需求细节</h4>${list(item.details)}</section>${item.logic.length?`<section><h4>操作逻辑</h4>${list(item.logic)}</section>`:''}</div>${ruleTable(item.table)}${item.fonts?fonts():''}</details>`;
  const chapter=(group,matching,open)=>`<section class="reqChapter"><header class="reqSectionTitle"><h2>${esc(group.label)}</h2><p>${esc(group.description)}</p></header>${matching.map(item=>itemHtml(item,open)).join('')}</section>`;
  function exportDocument(){
    const content=groups.map(group=>chapter(group,items.filter(item=>item.group===group.id),true)).join('');
    const css='*{box-sizing:border-box}body{margin:0;color:#183345;background:#f3f6fa;font:14px/1.75 "PingFang SC","Microsoft YaHei",Arial,sans-serif}main{max-width:1100px;margin:28px auto;padding:30px;background:#fff}h1{font-size:26px}h2{font-size:22px}h3{font-size:17px;margin:0}h4{font-size:14px;margin:0 0 8px}p{overflow-wrap:anywhere}.reqSectionTitle{margin:30px 0 18px}.reqSectionTitle p,.reqEntry{color:#60758b;font-size:13px}.reqItem{border:1px solid #dce5ef;border-radius:8px;margin:14px 0;overflow:hidden}.reqItem summary{cursor:pointer;padding:16px 20px;list-style:none}.reqEntry{padding:0 20px;margin:0 0 14px}.reqBody{display:grid;grid-template-columns:1fr 1fr;gap:26px;padding:0 20px 20px}.reqSingle{grid-template-columns:1fr}ul{padding-left:19px;margin:0}li{margin:7px 0;overflow-wrap:anywhere}.reqFonts{padding:0 20px 22px}.reqFonts section+section{margin-top:22px}.reqTableScroll{overflow:auto}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #dce5ef;padding:9px 12px;text-align:left}th{background:#f5f8fc}.reqFonts td:nth-child(n+2){white-space:nowrap;width:100px}.reqRules{padding:0 20px 22px}.reqRules table{table-layout:fixed}.reqRules th,.reqRules td{overflow-wrap:anywhere;vertical-align:top}.reqRules th:first-child{width:25%}@media(max-width:650px){main{margin:0;padding:16px}.reqBody{grid-template-columns:1fr;gap:18px}.reqItem summary,.reqEntry{padding-left:16px;padding-right:16px}.reqFonts,.reqRules{padding-left:16px;padding-right:16px}}@media print{body{background:#fff}main{margin:0;padding:0}.reqChapter{break-before:page}.reqChapter:first-of-type{break-before:auto}.reqSectionTitle,summary,h4{break-after:avoid}li,tr{break-inside:avoid}.reqTableScroll{overflow:visible}}';
    const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>美利肯安装质量中心 · 需求说明</title><style>${css}</style></head><body><main><h1>美利肯安装质量中心 · 需求说明</h1><p>2026-10-21 更新 · 需求细节、操作逻辑与界面字号。</p>${content}</main></body></html>`;
    const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='美利肯安装质量中心-需求说明-20261021.html';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
  }
  function mount(host){
    if(host.dataset.requirementsMounted)return;
    host.dataset.requirementsMounted='true';
    const state={group:'field',query:'',open:true};
    host.innerHTML=`<header class="reqHero"><div><h2>功能细节与操作逻辑</h2><p>按两端功能和界面规范查阅，内容对应当前 Demo。</p></div><button type="button" class="reqDownload">下载需求说明</button></header><nav class="reqTabs" aria-label="需求说明栏目">${groups.map(group=>`<button type="button" data-req-group="${group.id}">${esc(group.label)}</button>`).join('')}</nav><form class="reqToolbar" role="search"><label><span class="reqSr">搜索需求</span><input type="search" id="reqSearch" placeholder="搜索功能、字段或字号，例如：温度、照片、16px" autocomplete="off"></label><button type="button" id="reqReset">清除搜索</button></form><div class="reqResultsBar"><p id="reqResultCount" role="status" aria-live="polite"></p><div><button type="button" id="reqExpand">全部展开</button><button type="button" id="reqCollapse">全部收起</button></div></div><div id="reqResults"></div><p class="reqFooter">说明更新：2026-10-21。未保存的信息以各阶段实际记录为准。</p>`;
    const results=host.querySelector('#reqResults');
    const render=()=>{
      const query=state.query.trim().toLocaleLowerCase().replace(/\s+/g,'');
      const matches=items.filter(item=>{
        const text=[item.title,item.entry,...item.details,...item.logic,...(item.table?[item.table.caption,...item.table.headers,...item.table.rows.flat()]:[]),...(item.fonts?fontGroups.flatMap(g=>[g.label,...g.rows.map(row=>`${row[0]} ${row[1]}px ${row[2]}`)]):[])].join(' ').toLocaleLowerCase().replace(/\s+/g,'');
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
