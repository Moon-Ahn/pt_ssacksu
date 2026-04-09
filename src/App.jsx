import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCcw, Share2, Brain, Activity, BookOpen, Dumbbell, Building2, Coffee } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

const App = () => {
  const [step, setStep] = useState('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState({ ns: 0, os: 0, research: 0, sports: 0, industry: 0, routine: 0 });
  const [answers, setAnswers] = useState([]);

  const COMMUNITY_URL = "https://www.instagram.com/the.pt.map?igsh=MWIwOTV2OTY1Y2loaw==";

  // 카카오 광고 스크립트 로드 및 갱신
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, [step, currentIdx]);

  const questions = [
    { id: 1, q: "지하철 앞 사람 걸음걸이가 이상하다면?", options: [{ text: "어떤 신경계 손상 기전일까 분석해본다", types: ['ns'] }, { text: "골반 불균형인가? 내가 교정해주고 싶다", types: ['os'] }, { text: "'아, 나도 다리 아픈데...' 하며 핸드폰을 본다", types: ['routine'] }, { text: "저런 보행을 교정해주는 보조기 사업은 어떨까?", types: ['industry'] }] },
    { id: 2, q: "동기 엠티에서 친구가 \"어깨 아파\"라고 한다면?", options: [{ text: "\"연관통인가? 일단 기전부터...\" (진지하게 설명)", types: ['research'] }, { text: "\"야, 일로와 봐.\" 일단 한 번 꺾거나 눌러준다", types: ['sports'] }, { text: "\"파스 붙여. 내일 병원 가.\" 적당히 조언하고 쉰다", types: ['routine'] }, { text: "\"너 같은 애들 많지? 이거 예방 운동 영상 있는데.\"", types: ['industry'] }] },
    { id: 3, q: "시험 기간, 도서관에서 내 책상 모습은?", options: [{ text: "전공 서적과 학술 자료가 산더미처럼 쌓여있다", types: ['ns'] }, { text: "해부학 앱과 실습 때 쓴 소도구가 놓여있다", types: ['os'] }, { text: "형광펜으로 깔끔하게 정리된 족보 한 권뿐이다", types: ['research'] }, { text: "아이패드에 진로/취업 뉴스 창이 떠 있다", types: ['industry'] }] },
    { id: 4, q: "실습 첫날, 선생님의 현란한 치료를 봤을 때?", options: [{ text: "'저 동작의 이론적 근거는 뭘까?' 궁금해서 질문한다", types: ['research'] }, { text: "'와, 손맛 장난 아니다. 나도 저 테크닉 배우고 싶다'", types: ['sports'] }, { text: "'선생님 진짜 힘드시겠다... 퇴근은 제때 하시나?'", types: ['ns'] }, { text: "'이 병원은 시스템이 잘 갖춰져 있네. 구조가 궁금하다'", types: ['industry'] }] },
    { id: 5, q: "유튜브 알고리즘에 뜬 영상 중 클릭하고 싶은 것은?", options: [{ text: "[임상 강의] 편마비 환자의 보행 패턴 분석", types: ['ns'] }, { text: "[도수 필살기] 단 5분 만에 거북목 교정하기", types: ['os', 'sports'] }, { text: "[브이로그] 워라밸 최강, 칼퇴하는 물치사의 하루", types: ['routine'] }, { text: "[비즈니스] 병원을 탈출해 연봉 1억 번 물치사", types: ['research'] }] },
    { id: 6, q: "해부학 시험 공부 중 내 머릿속 생각은?", options: [{ text: "근육의 기시/정지를 외우며 인체의 신비에 감탄한다", types: ['research'] }, { text: "이걸 외워서 나중에 치료할 때 써먹을 생각에 설렌다", types: ['os'] }, { text: "\"하... 이걸 다 외워야 국시 붙겠지? 일단 외우자.\"", types: ['routine'] }, { text: "\"이런 걸 더 쉽고 재밌게 배우는 앱은 안 나오나?\"", types: ['industry'] }] },
    { id: 7, q: "방학 때 하고 싶은 알바나 대외활동은?", options: [{ text: "재활병원 보조 알바 (현장을 미리 경험)", types: ['ns'] }, { text: "스포츠 구단 의무팀 보조 (현장감 만끽)", types: ['sports'] }, { text: "카페 알바나 여행 (일단 쉬면서 힐링)", types: ['os'] }, { text: "헬스케어 서포터즈나 마케팅 인턴 (스펙 확장)", types: ['research'] }] },
    { id: 8, q: "환자와 대화할 때 나의 스타일은?", options: [{ text: "신체 구조와 회복 기전을 상세히 설명한다", types: ['research'] }, { text: "당장 좋아질 부분에 대해 확신을 준다", types: ['os', 'sports'] }, { text: "따뜻하게 공감하며 일상 이야기를 나눈다", types: ['routine'] }, { text: "환자의 생활 습관과 환경 개선을 조언한다", types: ['industry'] }] },
    { id: 9, q: "만약 나만의 '치료 공간'을 딱 하나만 꾸밀 수 있다면?", options: [{ text: "섬세한 핸들링과 관찰이 가능한 넓은 매트와 치료 베드", types: ['ns'] }, { text: "슬링, 바벨, 고난도 재활이 가능한 최신식 트레이닝 짐(Gym)", types: ['sports'] }, { text: "동선이 효율적이고 체계적으로 관리되는 표준 물리치료실", types: ['routine'] }, { text: "동작 분석 센서와 데이터 분석용 고사양 워크스테이션", types: ['research'] }] },
    { id: 10, q: "물치과를 견디게 하는 원동력은?", options: [{ text: "한 분야의 '장인'이 되고 싶다는 학구열", types: ['ns'] }, { text: "내 손기술로 누군가를 낫게 하겠다는 보람", types: ['os', 'sports'] }, { text: "면허증 따서 안정적으로 먹고살겠다는 현실감각", types: ['routine'] }, { text: "이 전공을 발판 삼아 더 넓은 세상으로 나가는 야망", types: ['industry'] }] }
  ];

  const resultData = {
    ns: { title: "뇌와 소통하는 마법사", type: "NS (신경계 재활)", desc: "당신은 인체의 복잡한 신경망을 이해하고, 환자의 아주 작은 변화에서도 큰 보람을 찾는 섬세한 탐구자입니다. 대학병원이나 재활전문병원에서 뇌신경계 환자들의 기적을 함께 만들어갈 상이군요!", tags: ["#뇌와밀당", "#섬세함끝판왕", "#재활장인", "#뇌섹"], icon: <Brain className="w-16 h-16 text-indigo-600" />, color: "bg-indigo-50" },
    os: { title: "근육 연금술사", type: "OS (정형계/도수치료)", desc: "당신은 확실한 테크닉과 빠른 피드백을 선호하는 실전 해결사입니다. 환자의 통증을 즉각적으로 잡아내는 '손맛' 좋은 치료사로 이름을 날릴 확률이 높습니다. 로컬 정형외과의 에이스가 될 준비 되셨나요?", tags: ["#근육박사", "#손맛장인", "#도수치료신", "#근육전문"], icon: <Activity className="w-16 h-16 text-blue-600" />, color: "bg-blue-50" },
    research: { title: "논문 읽는 전략가", type: "대학원생 / 연구원", desc: "당신은 '왜?'라는 질문을 멈추지 않는 근거 중심의 완벽주의자입니다. 임상도 좋지만, 이론을 체계화하고 새로운 지식을 발견하는 데 더 큰 희열을 느낍니다. 미래의 물리치료학계를 이끌 교수의 싹이 보입니다!", tags: ["#대학원이체질", "#교수찰떡", "#논문운명", "#학구열"], icon: <BookOpen className="w-16 h-16 text-emerald-600" />, color: "bg-emerald-50" },
    sports: { title: "필드의 에너자이저", type: "스포츠 트레이너", desc: "당신은 한계를 돌파하고 퍼포먼스를 극대화하는 역동적인 현장을 즐깁니다. 병원 안보다는 푸른 잔디 위, 선수들과 함께 호흡하며 부상을 관리해주는 의무팀 트레이너가 당신의 천직입니다!", tags: ["#필드지배자", "#선수히어로", "#스포츠답", "#체력왕"], icon: <Dumbbell className="w-16 h-16 text-rose-600" />, color: "bg-rose-50" },
    industry: { title: "갓생 보건관리자", type: "산업체 물리치료사", desc: "당신은 병원이라는 틀을 벗어나 더 넓은 시스템을 설계하고 싶은 야망가입니다. 기업의 근로 환경을 관리하고 헬스케어 비즈니스를 기획하는 대기업 보건관리자나 스타트업이 당신의 무대입니다!", tags: ["#사원증플렉스", "#갓생러", "#병원밖은즐거워", "#비즈니스"], icon: <Building2 className="w-16 h-16 text-slate-600" />, color: "bg-slate-50" },
    routine: { title: "일상의 지킴이", type: "루틴 치료사 (의원/안정형)", desc: "당신은 안정적인 환경에서 성실하게 환자들의 삶의 질을 유지해주는 든든한 수호자입니다. 워라밸을 지키며 지역사회 이웃들의 평화로운 일상을 돕는 따뜻하고 실속 있는 프로 치료사의 길을 걷겠군요!", tags: ["#평화수호자", "#워라밸장인", "#칼퇴전설", "#일상"], icon: <Coffee className="w-16 h-16 text-cyan-600" />, color: "bg-cyan-50" }
  };

  const handleAnswer = (option) => {
    const newScores = { ...scores };
    option.types.forEach(type => { newScores[type] += 1; });
    setScores(newScores);
    setAnswers([...answers, option]);
    if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
    else setStep('result');
  };

  const getResult = () => {
    let maxVal = -1; let candidates = [];
    Object.entries(scores).forEach(([key, val]) => { if (val > maxVal) { maxVal = val; candidates = [key]; } else if (val === maxVal) candidates.push(key); });
    if (candidates.length === 1) return candidates[0];
    const q10Match = candidates.find(c => answers[9].types.includes(c));
    return q10Match || candidates[0];
  };

  const restart = () => { setStep('start'); setCurrentIdx(0); setScores({ ns: 0, os: 0, research: 0, sports: 0, industry: 0, routine: 0 }); setAnswers([]); };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Jua&display=swap'); * { font-family: 'Jua', sans-serif !important; word-break: keep-all; }`}</style>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 min-h-[600px] flex flex-col transition-all">

        {/* 시작 화면 광고 삽입 */}
        {step === 'start' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-indigo-50 to-white">
            <div className="w-24 h-24 bg-indigo-100 rounded-3xl rotate-12 flex items-center justify-center mb-8 shadow-indigo-100 shadow-xl"><Activity className="w-12 h-12 text-indigo-700 -rotate-12" /></div>
            <h1 className="text-3xl font-black mb-4 text-slate-900 leading-tight">물리치료사<br/>진로 성향 테스트</h1>
            <p className="text-slate-500 mb-8 text-lg font-sans font-medium italic">나의 진로 로드맵은?<br /><span className="font-bold text-indigo-800 text-sm uppercase tracking-widest leading-none">NS / OS / Routine / Research / Industry / Sports</span></p>
            <button onClick={() => setStep('quiz')} className="w-full py-5 bg-indigo-800 text-white rounded-2xl font-bold text-xl shadow-lg active:scale-95 transition-all mb-8">테스트 시작하기</button>

            {/* 시작 페이지 광고 */}
            <div className="flex justify-center items-center w-full overflow-hidden py-2">
              <div className="inline-block min-w-[320px] max-w-full overflow-hidden">
                <ins className="kakao_ad_area"
                     style={{ display: 'none', margin: '0 auto' }}
                     data-ad-unit="DAN-759Dqui0igvOIbst"
                     data-ad-width="320"
                     data-ad-height="50"></ins>
              </div>
            </div>

            <p className="mt-6 text-sm text-slate-400 font-medium tracking-widest uppercase">10 Questions | @the.pt.map</p>
          </div>
        )}

        {/* 퀴즈 화면 광고 삽입 */}
        {step === 'quiz' && (
          <div className="flex-1 flex flex-col p-6">
            <div className="mb-10"><div className="flex justify-between items-end mb-3"><span className="text-indigo-700 font-black text-xl italic uppercase tracking-widest">Question {currentIdx + 1}</span><span className="text-slate-400 text-sm font-bold">{currentIdx + 1} / {questions.length}</span></div><div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-700 transition-all duration-500" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} /></div></div>
            <div className="flex-1 flex flex-col"><h2 className="text-2xl font-bold mb-10 leading-snug text-slate-900">{questions[currentIdx].q}</h2><div className="space-y-4">{questions[currentIdx].options.map((option, i) => (<button key={i} onClick={() => handleAnswer(option)} className="w-full p-5 text-left border-2 border-slate-100 hover:border-indigo-400 hover:bg-indigo-50 bg-white rounded-2xl transition-all active:scale-[0.98] group flex items-center justify-between shadow-sm"><span className="text-lg font-semibold text-slate-700 group-hover:text-indigo-900 leading-tight">{option.text}</span><ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-400 transition-colors" /></button>))}</div></div>

            {/* 퀴즈 페이지 하단 광고 */}
            <div className="flex justify-center overflow-hidden py-4 mt-auto">
              <ins className="kakao_ad_area" style={{ display: 'none' }}
                data-ad-unit="DAN-759Dqui0igvOIbst"
                data-ad-width="320"
                data-ad-height="50"></ins>
            </div>
          </div>
        )}

        {/* 결과 화면 광고 삽입 */}
        {step === 'result' && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-white">
            <div className="text-center mb-8"><div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-black mb-3 tracking-widest uppercase">PT MAP 진단결과 🔍</div><h2 className="text-3xl font-black text-slate-900 break-keep">{resultData[getResult()].title}</h2></div>
            <div className={`rounded-[32px] ${resultData[getResult()].color} p-8 mb-8 flex flex-col items-center justify-center border border-white shadow-xl shadow-slate-200/50`}>
              <div className="mb-6 bg-white p-5 rounded-3xl shadow-md transform -rotate-3">{resultData[getResult()].icon}</div>
              <span className="inline-block px-6 py-2 bg-indigo-800 rounded-full text-xs font-black text-white shadow-md mb-4 tracking-widest uppercase">{resultData[getResult()].type}</span>
              <div className="flex flex-wrap justify-center gap-2 mb-6 px-2">{resultData[getResult()].tags.map((tag, i) => (<span key={i} className="text-indigo-700 font-bold text-sm bg-white/70 px-3 py-1 rounded-xl border border-indigo-100 shadow-sm">{tag}</span>))}</div>
              <p className="text-slate-700 leading-relaxed text-center font-bold text-lg px-2">{resultData[getResult()].desc}</p>
            </div>

            {/* 결과 페이지 광고 */}
            <div className="flex justify-center mb-10 overflow-hidden">
              <ins className="kakao_ad_area" style={{ display: 'none' }}
                data-ad-unit="DAN-759Dqui0igvOIbst"
                data-ad-width="320"
                data-ad-height="50"></ins>
            </div>

            <div className="space-y-4 mb-10">
              <button onClick={() => { const dummy = document.createElement("textarea"); document.body.appendChild(dummy); dummy.value = window.location.href; dummy.select(); document.execCommand("copy"); document.body.removeChild(dummy); alert("링크가 복사되었습니다!"); }} className="w-full py-4 bg-indigo-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 text-lg"><Share2 className="w-6 h-6" /> 링크 복사하기</button>
              <button onClick={restart} className="w-full py-4 bg-white border-2 border-slate-200 text-slate-500 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95"><RefreshCcw className="w-5 h-5" /> 다시 테스트하기</button>
            </div>

            <div className="bg-slate-900 rounded-[36px] p-10 text-center shadow-2xl border border-slate-800">
              <p className="text-indigo-400 text-lg font-black mb-4 tracking-widest uppercase italic uppercase tracking-widest">💡 NEXT STEP</p>
              <div className="text-slate-200 text-base mb-8 leading-relaxed font-medium">놓치면 손해인 물리치료사들의 로드맵!<br /><span className="text-white text-3xl font-black block mt-3 mb-1 tracking-tighter italic font-serif leading-none">PT MAP</span><span className="text-slate-400 text-sm font-bold tracking-tight uppercase">에서 당신의 커리어를 완성하세요.</span></div>
              <button onClick={() => window.open(COMMUNITY_URL, '_blank')} className="w-full py-5 bg-indigo-600 text-white rounded-[20px] font-black text-xl hover:bg-indigo-500 shadow-[0_10px_30px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2">커뮤니티 바로가기</button>
            </div>
          </div>
        )}
      </div>
      <div className="fixed -z-10 top-0 left-0 w-full h-full overflow-hidden opacity-40 pointer-events-none"><div className="absolute top-[-25%] left-[-15%] w-[600px] h-[600px] bg-indigo-200 rounded-full blur-[140px]" /><div className="absolute bottom-[-15%] right-[-15%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-[120px]" /></div>
      <Analytics />
    </div>
  );
};
export default App;