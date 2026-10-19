const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const sections = $$('.section');
const navLinks = $$('.nav-link');
const progressBar = $('#progressBar');
const toast = $('#toast');
let toastTimer;
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2300)}
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;progressBar.style.width=(max>0?scrollY/max*100:0)+'%'}
addEventListener('scroll',updateProgress,{passive:true});updateProgress();

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const id=entry.target.id;
      navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));
    }
  });
},{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>observer.observe(s));

$('#menuBtn').addEventListener('click',()=>$('.topnav').classList.toggle('open'));
navLinks.forEach(a=>a.addEventListener('click',()=>$('.topnav').classList.remove('open')));
$('#overviewBtn').addEventListener('click',()=>$('#concept').scrollIntoView({behavior:'smooth'}));
$('#backTop').addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

const timelineItems=$$('.timeline-item');
timelineItems.forEach((item,index)=>item.addEventListener('click',()=>{
  timelineItems.forEach(el=>el.classList.remove('selected'));item.classList.add('selected');
  $('#timelineNum').textContent=String(index+1).padStart(2,'0');
  $('#timelineTitle').textContent=item.dataset.title;
  $('#timelineText').textContent=item.dataset.detail;
}));

const fieldData={
 education:{code:'EDU',eyebrow:'01 / EDUCATION',title:'التعليم الرقمي',text:'تتيح المنصات التعليمية والمحاضرات عن بُعد والمكتبات الإلكترونية الوصول إلى مصادر التعلم، كما تساعد الأساتذة على مشاركة الدروس والواجبات.',tags:['E-learning','Digital libraries','Remote classes']},
 business:{code:'BIZ',eyebrow:'02 / BUSINESS',title:'الاقتصاد والتجارة',text:'تدعم التكنولوجيا التجارة الإلكترونية والتسويق الرقمي وإدارة الحسابات وخدمة الزبائن، وتساعد المؤسسات على توسيع أسواقها وتحسين كفاءة العمل.',tags:['E-commerce','Digital marketing','Automation']},
 health:{code:'HEALTH',eyebrow:'03 / HEALTHCARE',title:'الخدمات الصحية',text:'تساعد الأنظمة الرقمية على تنظيم الملفات الطبية والمواعيد وتبادل المعلومات بين المؤسسات، كما تدعم الاستشارات الطبية عن بُعد عند توفر الشروط المناسبة.',tags:['Digital records','Telehealth','Data systems']},
 admin:{code:'ADMIN',eyebrow:'04 / ADMINISTRATION',title:'الإدارة الإلكترونية',text:'تسهم رقمنة الوثائق والخدمات في تسريع الإجراءات الإدارية وتقليل الاعتماد على الورق وتسهيل تبادل البيانات بين الموظفين والمؤسسات.',tags:['E-government','Digital documents','Workflow']},
 media:{code:'MEDIA',eyebrow:'05 / MEDIA & SOCIETY',title:'الإعلام والمجتمع',text:'تتيح المواقع الإخبارية والمنصات الرقمية نشر الأخبار والتفاعل معها بسرعة، كما توسع فرص التواصل وتبادل الثقافات، لكنها تجعل التحقق من المصادر أكثر أهمية.',tags:['Digital media','Social networks','Media literacy']}
};
$$('.field-tab').forEach(tab=>tab.addEventListener('click',()=>{
  $$('.field-tab').forEach(t=>{t.classList.remove('active');t.setAttribute('aria-selected','false')});
  tab.classList.add('active');tab.setAttribute('aria-selected','true');
  const d=fieldData[tab.dataset.field];
  $('#fieldVisual span').textContent=d.code;$('#fieldEyebrow').textContent=d.eyebrow;
  $('#fieldTitle').textContent=d.title;$('#fieldText').textContent=d.text;
  $('#fieldTags').innerHTML=d.tags.map(tag=>`<span>${tag}</span>`).join('');
}));

const slideIds=['home','intro','concept','components','fields','pros-cons','conclusion','references'];
let presenting=false,slideIndex=0;
function getSlideIndex(){const current=sections.findIndex(s=>s.classList.contains('active-slide'));return current>=0?current:slideIndex}
function setSlide(index){
  slideIndex=Math.max(0,Math.min(slideIds.length-1,index));
  sections.forEach(s=>s.classList.toggle('active-slide',s.id===slideIds[slideIndex]));
  $('#slideCount').textContent=String(slideIndex+1).padStart(2,'0')+' / '+String(slideIds.length).padStart(2,'0');
  $('#prevSlide').disabled=slideIndex===0;$('#nextSlide').disabled=slideIndex===slideIds.length-1;
  const target=$('#'+slideIds[slideIndex]);if(target)target.scrollIntoView({behavior:'instant',block:'start'});
  progressBar.style.width=((slideIndex+1)/slideIds.length*100)+'%';
}
function enterPresentation(){
  if(presenting)return;presenting=true;document.body.classList.add('presenting');
  if(!document.fullscreenElement && document.documentElement.requestFullscreen){document.documentElement.requestFullscreen().catch(()=>{});}
  const visible=sections.filter(s=>s.getBoundingClientRect().height>0);
  const nearest=visible.reduce((best,s,i)=>Math.abs(s.getBoundingClientRect().top)<Math.abs(best.getBoundingClientRect().top)?s:best,visible[0]||sections[0]);
  const idx=slideIds.indexOf(nearest.id);setSlide(idx>=0?idx:0);
  showToast('وضع العرض مفعّل — استخدم ↑ و ↓ أو ← و → للتنقل');
}
function exitPresentation(){
  if(!presenting)return;presenting=false;document.body.classList.remove('presenting');
  sections.forEach(s=>s.classList.remove('active-slide'));
  if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});
  $('#'+slideIds[slideIndex]).scrollIntoView({behavior:'smooth',block:'start'});updateProgress();
}
$('#presentBtn').addEventListener('click',enterPresentation);
$('#exitPresent').addEventListener('click',exitPresentation);
$('#prevSlide').addEventListener('click',()=>setSlide(getSlideIndex()-1));
$('#nextSlide').addEventListener('click',()=>setSlide(getSlideIndex()+1));
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&presenting){document.body.classList.remove('presenting');presenting=false;sections.forEach(s=>s.classList.remove('active-slide'));updateProgress();}});
document.addEventListener('keydown',e=>{
  if(!presenting)return;
  if(['ArrowDown','ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();setSlide(getSlideIndex()+1)}
  else if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();setSlide(getSlideIndex()-1)}
  else if(e.key==='Escape'){exitPresentation()}
});

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.08});
$$('.glass-card,.definition-panel,.flow-node,.balance-card,.reference-item,.conclusion-panel,.discussion-card').forEach(el=>{el.classList.add('reveal');revealObserver.observe(el)});
