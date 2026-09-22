/* =========================================================
 * GEN REST API — RFWeb2APK Core (Shared)
 * Author : GENOS
 * ========================================================= */

const API = "https://rfweb2apk.rfdevv.com";
const TEMPMAIL = "https://akunlama.com/api";
const UA = "Mozilla/5.0 (Linux; Android 13; SM-A536E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";

const URL_FIELDS = ["url","websiteUrl","srcUrl","webUrl","sourceUrl","link","website","siteUrl","source_url","web_url"];
const NAME_FIELDS = ["appName","name","app_name"];
const PKG_FIELDS = ["packageName","pkgName","package"];
const VER_FIELDS = ["versionName","version"];
const CODE_FIELDS = ["versionCode","buildCode","build"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rnd = (n) => Array.from({ length: n }, () => "abcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 36))).join("");
const genEmail = () => `${rnd(8)}-${rnd(4)}-${Math.floor(Math.random() * 999)}@akunlama.com`;
const genUser = () => `xv${rnd(6)}${Math.floor(Math.random() * 999)}`;
const genPass = () => rnd(10) + "Aa1!";

function parseJSON(t){ if(typeof t!=="string")return t; try{return JSON.parse(t)}catch{return null} }

async function tmList(email){
  try{
    const r = await fetch(`${TEMPMAIL}/list?recipient=${encodeURIComponent(email)}`,{headers:{"User-Agent":UA,Accept:"application/json",Origin:"https://akunlama.com",Referer:"https://akunlama.com/"}});
    return await r.json();
  }catch{return null}
}
async function tmRead(key){
  try{
    const [k,h]=await Promise.all([
      fetch(`${TEMPMAIL}/getKey?region=us&key=${key}`,{headers:{"User-Agent":UA}}),
      fetch(`${TEMPMAIL}/getHtml?region=us&key=${key}`,{headers:{"User-Agent":UA}}),
    ]);
    return {detail:parseJSON(await k.text()),html:await h.text()};
  }catch{return null}
}
function extractOtp(text){
  if(!text)return null;
  let m=text.match(/font-size:\s*32px[^>]*>\s*(\d{4,8})/); if(m)return m[1];
  m=text.match(/\b(\d{6})\b/); return m?m[1]:null;
}
async function waitForOtp(email,maxWait,interval,onTick){
  const loops=Math.max(1,Math.floor(maxWait/interval));
  for(let i=0;i<loops;i++){
    const lst=await tmList(email);
    if(Array.isArray(lst)&&lst.length>0){
      const msg=lst[0];
      const key=(msg.storage&&msg.storage.key)||msg.key;
      if(key){
        const d=(await tmRead(key))||{};
        const html=(d.html||msg.preview||"").toString();
        const otp=extractOtp(html)||extractOtp(msg.preview||"");
        if(otp)return{otp,key};
      }
    }
    onTick&&onTick((i+1)*interval);
    await sleep(interval*1000);
  }
  return null;
}

async function apiRegister(email,username,password){
  const r=await fetch(`${API}/api/auth/register`,{method:"POST",headers:{"Content-Type":"application/json","User-Agent":UA,Origin:API,Referer:API+"/"},body:JSON.stringify({email,username,password})});
  return{status:r.status,data:parseJSON(await r.text())};
}
async function apiVerify(email,code){
  const r=await fetch(`${API}/api/auth/verify-register`,{method:"POST",headers:{"Content-Type":"application/json","User-Agent":UA,Origin:API,Referer:API+"/"},body:JSON.stringify({email,code})});
  return{status:r.status,data:parseJSON(await r.text())};
}

async function createAccount(log){
  const email=genEmail(),username=genUser(),password=genPass();
  log(`[REG] Mendaftar: ${email}`);
  const reg=await apiRegister(email,username,password);
  if(!(reg.data&&reg.data.success))throw new Error(`Register gagal: ${JSON.stringify(reg.data||reg.status)}`);
  log("[OTP] Menunggu kode (max 8s)...");
  const otpRes=await waitForOtp(email,8,2,(s)=>log(`[OTP] ${s}s...`));
  if(!otpRes)throw new Error("OTP timeout. Coba lagi atau pakai parameter 'token' manual.");
  log(`[OTP] Kode: ${otpRes.otp}`);
  const ver=await apiVerify(email,otpRes.otp);
  if(!(ver.data&&ver.data.success))throw new Error(`Verify gagal: ${JSON.stringify(ver.data||ver.status)}`);
  const d=ver.data,u=d.user||{};
  log("[ACC] Akun terverifikasi.");
  return{id:u.id,email,username,password,token:d.token,apiKey:u.apiKey,role:u.role||"free"};
}

async function tryBuild(url,appName,pkg,version,code,urlField,token,srcMode){
  const headers={"Content-Type":"application/json","User-Agent":UA,Origin:API,Referer:API+"/"};
  if(token)headers.Authorization=`Bearer ${token}`;

  const payload={
    [NAME_FIELDS[0]]:appName,
    [PKG_FIELDS[0]]:pkg,
    [VER_FIELDS[0]]:version,
    [CODE_FIELDS[0]]:code,
    [urlField]:url,
  };
  if(srcMode)payload.srcMode=srcMode;

  try{
    const r=await fetch(`${API}/api/apk/build`,{method:"POST",headers,body:JSON.stringify(payload)});
    const data=parseJSON(await r.text())||{};
    if(r.status===200&&data.success)return{ok:true,response:data,urlField};
    const err=String(data.error||"");
    if(!err.toLowerCase().includes("url")&&!err.toLowerCase().includes("wajib"))return{ok:false,response:data,urlField};
  }catch{}
  return{ok:false,response:{error:"fetch gagal"},urlField};
}

async function runBuild(mode,input,log){
  const url=(input.url||"").trim();
  const appName=(input.app_name||"My App").trim();
  const pkg=(input.package||"").trim()||`com.${rnd(6)}.app`;
  const version=(input.version||"1.0").trim();
  const code=(input.code||"1").trim();

  if(!url)throw new Error("Parameter 'url' wajib diisi");
  if(!/^https?:\/\//i.test(url))throw new Error("URL harus diawali http:// atau https://");

  let token=(input.token||"").trim();
  if(!token){
    log("[ACC] Tidak ada token, membuat akun baru...");
    const acc=await createAccount(log);
    token=acc.token;
  }else log("[ACC] Pakai token manual.");

  log(`[BUILD] Mode: ${mode.toUpperCase()}`);
  log(`[BUILD] Target: ${url}`);
  log(`[BUILD] App   : ${appName} (${pkg}) v${version}(${code})`);

  for(const field of URL_FIELDS){
    log(`[DETECT] Coba field '${field}'...`);
    const r=await tryBuild(url,appName,pkg,version,code,field,token,mode);
    if(r.ok){ log(`[DETECT] Berhasil pakai field: ${field}`); return{response:r.response,field_used:field,token}; }
    const err=(r.response&&r.response.error)||"gagal";
    log(`  ✗ ${err}`);
    if(!String(err).toLowerCase().includes("url")&&!String(err).toLowerCase().includes("wajib")){
      throw new Error(`Build gagal: ${err}`);
    }
  }
  throw new Error(`Build gagal: semua kandidat field URL dicoba`);
}

module.exports = { runBuild };
