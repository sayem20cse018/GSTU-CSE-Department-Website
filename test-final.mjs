const B = 'https://gstu-cse-department-website.onrender.com/api';
let tok = ''; let p = 0; let f = 0;

async function api(m, path, body, auth = true) {
  const h = { 'Content-Type': 'application/json' };
  if (auth) h['Authorization'] = `Bearer ${tok}`;
  const r = await fetch(`${B}${path}`, { method: m, headers: h, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(20000) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${JSON.stringify(d).slice(0,150)}`);
  return d.data ?? d;
}

async function t(name, fn) {
  try { await fn(); console.log(`  PASS  ${name}`); p++; }
  catch(e) { console.log(`  FAIL  ${name} — ${e.message}`); f++; }
}

await t('Admin login', async () => { const d = await api('POST', '/auth/login', {email:'admin@gstu-cse.edu',password:'Admin@1234'}, false); tok = d.accessToken; if (!tok) throw new Error('no token'); });

// All public GETs
for (const [n, url] of [['Hero slides','/hero-slides'],['Settings','/settings'],['Statistics','/statistics'],['Faculty','/faculty'],['News','/news?limit=3'],['Notices','/notices'],['Events','/events?limit=3'],['Gallery','/gallery'],['Achievements','/achievements'],['Clubs','/clubs'],['Alumni','/alumni'],['Research','/research'],['Programs','/academics/programs'],['Courses','/academics/courses'],['Labs','/academics/labs'],['Resources','/academics/resources']])
  await t(`${n} GET`, () => api('GET', url, null, false));

await t('Student stats', () => api('GET', '/students/stats'));

// All CRUD
const crud = [
  ['Hero slide', '/hero-slides', {title:'T',subtitle:'s',tag:'',imageUrl:'',overlayOpacity:60,primaryBtnLabel:'',primaryBtnHref:'',secondaryBtnLabel:'',secondaryBtnHref:'',align:'left',isActive:false,sortOrder:99}],
  ['Notice', '/notices', {title:'Test Notice',category:'general',isPublished:false,postedByName:'Admin'}],
  ['News', '/news', {title:'Test',slug:'t-final-x1',excerpt:'test excerpt here',content:'body',authorName:'Admin',isPublished:false}],
  ['Faculty', '/faculty', {name:'Test Faculty',email:'tfinal@t.com',designation:'Lecturer',isActive:true,sortOrder:0,staffType:'faculty',employmentStatus:'full_time'}],
  ['Event', '/events', {title:'Test',slug:'t-ev-final2',description:'d',venue:'H',startDate:'2026-09-01T10:00:00Z',isPublished:false}],
  ['Gallery', '/gallery', {title:'Test',slug:'t-gal-final2',albumDate:'2026-01-01',isPublished:false,uploadedByName:'Admin'}],
  ['Achievement', '/achievements', {title:'Test',description:'d',type:'student',achievedAt:'2026-01-01',isPublished:false}],
  ['Club', '/clubs', {name:'Test',slug:'t-club-final2',description:'d',isActive:false}],
  ['Alumni', '/alumni', {name:'Test',email:'al-final2@t.com',degree:'BSc',batchYear:2020,graduationYear:2024}],
  ['Course', '/academics/courses', {code:'TFX99',title:'Test Course',credits:3,semester:1,degree:'BSc',type:'core',isActive:false}],
  ['Program', '/academics/programs', {name:'Test Program',degree:'BSc',duration:'4 Years',totalCredits:160,description:'Test description',objectives:'Test objectives',eligibility:'Test eligibility',isActive:false}],
  ['Lab', '/academics/labs', {name:'Test Lab',slug:'t-lab-final2',description:'Test description',location:'Room 1',isActive:false}],
  ['Research', '/research', {name:'Test Group',slug:'t-rg-final',description:'Test description',lead:'Dr. Test'}],
];

for (const [name, path, body] of crud) {
  await t(`${name} CREATE+DELETE`, async () => {
    const c = await api('POST', path, body);
    if (!c.id) throw new Error('no id');
    await api('DELETE', `${path}/${c.id}`);
  });
}

// Student full flow
await t('Student register+login+me', async () => {
  await api('POST', '/students/records', {studentId:'FINAL99',name:'Final Test',session:'2025'});
  const reg = await api('POST', '/students/register', {studentId:'FINAL99',email:'final99@t.com',password:'Test@1234'}, false);
  if (!reg.token) throw new Error('no reg token');
  const log = await api('POST', '/students/login', {email:'final99@t.com',password:'Test@1234'}, false);
  if (!log.token) throw new Error('no login token');
  const meR = await fetch(`${B}/students/me`, {headers:{Cookie:`cse_student=${log.token}`},signal:AbortSignal.timeout(10000)});
  const me = await meR.json();
  if (!me.data?.student) throw new Error('no me');
  const recs = await api('GET', '/students/records');
  const rec = Array.isArray(recs) ? recs.find(r => r.studentId === 'FINAL99') : null;
  if (rec?.id) await api('DELETE', `/students/records/${rec.id}`);
});

await t('Settings PATCH', async () => { const r = await api('PATCH', '/settings', {deptName:'Department of Computer Science & Engineering'}); if (!r.deptName) throw new Error('empty'); });

console.log(`\n${'═'.repeat(50)}`);
console.log(`  PASSED: ${p}  |  FAILED: ${f}  |  TOTAL: ${p+f}`);
console.log('═'.repeat(50));
if (f === 0) console.log('  ✅ ALL TESTS PASSED — Production fully healthy!');
else console.log(`  ⚠️  ${f} test(s) still failing`);
