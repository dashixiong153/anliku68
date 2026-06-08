/* ============================================================
 * 数据层 SCDB —— 封装 Supabase 读写,供前台与管理后台共用
 * 字段映射:数据库用 snake_case(teacher_title),前端用 camelCase(teacherTitle)
 * 未配置 Supabase 时 isConfigured() 返回 false,前台自动回退本地数据。
 * ============================================================ */
(function (global) {
  "use strict";

  // 与 RAW_CASES 一一对应的业务字段(不含数据库内部主键)
  var FIELDS = ["case_id","school","level","teacher","teacher_title","course","major",
    "knowledge","ai","data","simulation","keywords","honor","url","source","citations","score","notes"];

  function isConfigured() {
    var u = global.SUPABASE_URL, k = global.SUPABASE_ANON_KEY;
    return !!(u && k && u.indexOf("YOUR_") !== 0 && k.indexOf("YOUR_") !== 0
      && global.supabase && typeof global.supabase.createClient === "function");
  }

  var _client = null;
  function getClient() {
    if (!isConfigured()) return null;
    if (!_client) _client = global.supabase.createClient(global.SUPABASE_URL, global.SUPABASE_ANON_KEY);
    return _client;
  }

  // 数据库行 → 前端案例对象(RAW_CASES 形态)
  function rowToCase(row) {
    return {
      id: row.case_id != null ? String(row.case_id) : String(row.id),
      _pk: row.id,
      school: row.school || "",
      level: row.level || "",
      teacher: row.teacher || "",
      teacherTitle: row.teacher_title || "",
      course: row.course || "",
      major: row.major || "",
      knowledge: row.knowledge || "",
      ai: row.ai || "",
      data: row.data || "",
      simulation: row.simulation || "",
      keywords: row.keywords || "",
      honor: row.honor || "",
      url: row.url || "",
      source: row.source || "",
      citations: row.citations || "",
      score: row.score || "",
      notes: row.notes || ""
    };
  }

  // 前端案例对象 → 数据库行(写入用)
  function caseToRow(c) {
    return {
      case_id: c.id || null,
      school: c.school || null,
      level: c.level || null,
      teacher: c.teacher || null,
      teacher_title: c.teacherTitle || null,
      course: c.course || null,
      major: c.major || null,
      knowledge: c.knowledge || null,
      ai: c.ai || null,
      data: c.data || null,
      simulation: c.simulation || null,
      keywords: c.keywords || null,
      honor: c.honor || null,
      url: c.url || null,
      source: c.source || null,
      citations: c.citations || null,
      score: c.score || null,
      notes: c.notes || null
    };
  }

  // 拉取全部案例(前台使用)
  async function fetchCases() {
    var client = getClient();
    if (!client) return null;
    var out = [], from = 0, page = 1000;
    // 分页拉取,突破默认 1000 行上限
    while (true) {
      var res = await client.from("cases").select("*")
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("id", { ascending: true })
        .range(from, from + page - 1);
      if (res.error) throw res.error;
      out = out.concat(res.data);
      if (!res.data || res.data.length < page) break;
      from += page;
    }
    return out.map(rowToCase);
  }

  global.SCDB = {
    FIELDS: FIELDS,
    isConfigured: isConfigured,
    getClient: getClient,
    rowToCase: rowToCase,
    caseToRow: caseToRow,
    fetchCases: fetchCases
  };
})(window);
