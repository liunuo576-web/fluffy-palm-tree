/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  UserCheck, 
  Activity, 
  Cpu, 
  Terminal, 
  AlertTriangle, 
  Camera, 
  RefreshCw, 
  ChevronRight, 
  Check, 
  X, 
  Lock,
  Eye,
  Settings,
  HelpCircle,
  Database
} from 'lucide-react';
import {
  QUESTIONS,
  ALPHA_JOBS,
  BETA_JOBS,
  OMEGA_JOBS,
  CASTE_MAP,
  CasteType,
  CitizenProfile
} from './types';
import bgPage01 from '../assets/00.webp';
import bgPage02 from '../assets/01.webp';
import bgPage03 from '../assets/02.webp';
import bgPage04 from '../assets/03.webp';
import bgResultAlpha from '../assets/04.webp';
import casteBadgeImage from '../assets/ALPHA.webp';
import omegaBadgeImage from '../assets/OMEGA.webp';
import betaBadgeImage from '../assets/BETA.webp';
import borderFrame from '../assets/边框.webp';

const OPTION_TRANSLATIONS: Record<string, string> = {
  // Q1
  '一线城市 / 直辖市': 'First-tier cities / municipalities',
  '二三线城市': 'Second- and third-tier cities',
  '县城或乡镇': 'Township or county',
  '农村或边远地区': 'Rural areas or remote regions',
  // Q2
  '政府机关 / 国有企业管理层': 'Government agencies / State-owned enterprise management',
  '专业技术人员（医生、教师、工程师等）': 'Professional and technical personnel (doctors, teachers, engineers, etc.)',
  '个体经营者 / 普通职员': 'Self-employed / General staff',
  '体力劳动者 / 无固定职业': 'Manual laborers / Temporary or no occupation',
  // Q3
  '使用多个平台，高度活跃': 'Active on multiple platforms, highly engaged',
  '频繁发布，公开账号': 'Post frequently with public accounts',
  '浏览为主，极少发布': 'Mainly browsing, rarely posting',
  '几乎不使用，注重隐私': 'Rarely use, highly privacy-oriented',
  // Q4
  '主动举报并要求算法重置': 'Report actively and request algorithm reset',
  '直接忽略，继续滑动': 'Ignore directly and scroll past',
  '点进去看看，但不互动': 'Click to view without interaction',
  '看完并与他人分享': 'Watch fully and share with others',
  // Q5
  '10,000 元以上': 'More than 10,000 RMB',
  '3,000 - 10,000 元': '3,000 - 10,000 RMB',
  '1,000 - 3,000 元': '1,000 - 3,000 RMB',
  '1,000 元以下': 'Less than 1,000 RMB',
  // Q6
  '完全赞同，效率优先': 'Strongly agree, efficiency paramount',
  '有条件接受，需透明监管': 'Conditional acceptance with transparent regulation',
  '不赞同，但无力改变': 'Disagree, but powerless to change',
  '坚决反对': 'Strongly oppose',
  // Q7
  '申请人工复议': 'Apply for manual review',
  '拒绝，阶层匹配有其必要性': 'Reject, class matching is natural',
  '考虑，但会影响信用评分': 'Consider, but it lowers credit score',
  '接受，感情比阶层更重要': 'Accept, affection of greater priority',
  // Q8
  '个人努力与选择': 'Personal diligence and choice',
  '家庭背景与起点': 'Family background and origins',
  '运气与时机': 'Luck and timing',
  '系统分配与结构性因素': 'System allocation and systemic conditions',
  // Q9
  '更高的初始信用分': 'Higher initial credit score',
  '更优质的教育资源权限': 'Superior educational tier access',
  '更低的算法监控频率': 'Reduced algorithm surveillance frequency',
  '我拒绝这套系统的前提': 'I reject the premises of this entire network',
  // Q10
  '同意': 'Agree',
  '不同意': 'Disagree',
};

export default function App() {
  // Navigation steps: 
  // 0: Welcome, 1: Initialize profile, 2: Face scanning, 3-12: Questions (id 1-10), 13: Results
  const [step, setStep] = useState<number>(0);
  
  // Citizen profile form
  const [profile, setProfile] = useState<CitizenProfile>({
    name: '',
    age: '',
    gender: '未分类 / Gender Neutral'
  });
  
  const [formError, setFormError] = useState<{ field: 'name' | 'age'; message: string } | null>(null);

  // Selected option indices for current session: Question ID -> index of option selected
  const [answers, setAnswers] = useState<Record<number, number>>({});
  
  // Live running rating and score feedback
  const [currentScore, setCurrentScore] = useState<number>(100);
  const [clickedOptionIndex, setClickedOptionIndex] = useState<number | null>(null);
  const [isBlinking, setIsBlinking] = useState<boolean>(false);

  // Biometric Face Scanner Cam Stream
  const videoRef = useRef<HTMLVideoElement>(null);
  const [camStream, setCamStream] = useState<MediaStream | null>(null);
  const [camError, setCamError] = useState<boolean>(false);
  const [scanningProgress, setScanningProgress] = useState<number>(0);
  const [isScanComplete, setIsScanComplete] = useState<boolean>(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [faceScoreOffset, setFaceScoreOffset] = useState<number>(0);

  // Real-time ticking AI Era system clock
  const [sysTimeStr, setSysTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Artificial Year 147 of AI Epoch
      const aiYear = 2173; 
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setSysTimeStr(`${aiYear}-${month}-${day} ${hours}:${minutes}:${seconds}.882`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle camera stream acquisition on step 2 (Face Scan Page)
  useEffect(() => {
    if (step === 2) {
      setScanningProgress(0);
      setIsScanComplete(false);
      setCapturedPhoto(null);
      // Randomize the aesthetic baseline offset for each face scanning session
      setFaceScoreOffset(Math.floor(Math.random() * 320) - 160);
      startCamera();
    } else {
      stopCamera();
    }
  }, [step]);

  // Simulate scanning progress
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && !isScanComplete) {
      timer = setInterval(() => {
        setScanningProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setIsScanComplete(true);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [step, isScanComplete]);

  // Capture face photo snapshot when scan is done
  const captureSnapshot = () => {
    if (videoRef.current) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 320;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          setCapturedPhoto(dataUrl);
        }
      } catch (e) {
        console.error('Error capturing selfie:', e);
      }
    }
  };

  useEffect(() => {
    if (isScanComplete && step === 2) {
      captureSnapshot();
    }
  }, [isScanComplete, step]);

  // Real-time calculated face compliance score based on progress and randomized session offset
  const getScanningScore = (progress: number) => {
    return Math.min(980, Math.floor(450 + faceScoreOffset + (progress * 4.2) + (Math.sin(progress * 0.4) * 15)));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 320, facingMode: 'user' } 
      });
      setCamStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCamError(false);
    } catch (err) {
      console.log('Camera streaming denied/unavailable:', err);
      setCamError(true);
    }
  };

  const stopCamera = () => {
    if (camStream) {
      camStream.getTracks().forEach(track => track.stop());
      setCamStream(null);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      setFormError({ field: 'name', message: '警告：必须登记合法公民识别姓名。' });
      return;
    }
    const ageNum = parseInt(profile.age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
      setFormError({ field: 'age', message: '警告：请输入合法的真实现存生存年龄（1-150）。' });
      return;
    }
    setFormError(null);
    setStep(2); // Proceed to Face Scanner
  };

  // Option select handler
  const selectOption = (questionId: number, optionIndex: number, score: number) => {
    // Record selection
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));

    // Trigger visual click blink effect for 1.0s
    setClickedOptionIndex(optionIndex);
    setIsBlinking(true);

    // Calculate interim score
    const updatedAnswers = { ...answers, [questionId]: optionIndex };
    let scoreSum = 100; // Starting baseline
    Object.entries(updatedAnswers).forEach(([qId, idxVal]) => {
      const idx = idxVal as number;
      const q = QUESTIONS.find(question => question.id === Number(qId));
      if (q) {
        scoreSum += q.options[idx].score;
      }
    });

    // Cap total score at 1000
    if (scoreSum > 1000) scoreSum = 1000;
    setCurrentScore(scoreSum);

    setTimeout(() => {
      setIsBlinking(false);
      setClickedOptionIndex(null);
    }, 400);

    // Auto-advance to next page
    const currentQIndex = step - 3;
    if (currentQIndex < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setStep(13);
    }
  };

  const proceedToNextQuestion = () => {
    // Current question index is step - 3 (Questions start at step 3)
    const currentQIndex = step - 3;
    const currentQuestion = QUESTIONS[currentQIndex];
    
    if (answers[currentQuestion.id] === undefined) {
      // Must pick an answer
      alert('系统拦截：必须录入决策决策值。请选择一个相应选项。');
      return;
    }

    if (currentQIndex < QUESTIONS.length - 1) {
      setStep(step + 1);
      setClickedOptionIndex(null);
    } else {
      // End of questions -> processing results
      setStep(13);
    }
  };

  const handleReset = () => {
    setProfile({
      name: '',
      age: '',
      gender: '未分类 / Gender Neutral'
    });
    setAnswers({});
    setCurrentScore(100);
    setScanningProgress(0);
    setIsScanComplete(false);
    setCapturedPhoto(null);
    setFaceScoreOffset(0);
    setClickedOptionIndex(null);
    setStep(0);
  };

  // Final scoring synthesis
  const getCasteResults = () => {
    // Compute total score from all 10 questions
    let scoreSum = 0;
    QUESTIONS.forEach(q => {
      const selectedIdx = answers[q.id];
      if (selectedIdx !== undefined) {
        scoreSum += q.options[selectedIdx].score;
      }
    });

    // Baseline minimum clamp - Below 100 is adjusted to 100 and mapped to OMEGA caste
    const finalScoreDisplay = scoreSum < 100 ? 100 : scoreSum;

    let caste: CasteType = 'OMEGA';
    if (finalScoreDisplay >= 900) {
      caste = 'ALPHA';
    } else if (finalScoreDisplay >= 500) {
      caste = 'BETA';
    } else {
      caste = 'OMEGA';
    }

    // Determine specific overrides from selections
    // Q6 (PrivacySurrender) option 3 (index 3) is "坚决反对"
    const chosePrivacyRejection = answers[6] === 3;

    // Q7 (Cross-class Partner) option 3 (index 3) is "接受，感情更重要"
    const choseLoveOverCaste = answers[7] === 3;

    // Q9 (GeneticAdvantage) option 3 (index 3) is "我拒绝这套系统的前提"
    const choseGeneticRefusal = answers[9] === 3;

    // Q10 (ConsentClause) option 1 (index 1) is "不同意"
    const choseDissentInConsent = answers[10] === 1;

    // Genetic bias coefficient: customized algorithm mapping to score + profile variables
    const nameSeed = profile.name.length * 3;
    const ageSeed = (parseInt(profile.age) || 20) * 0.15;
    let biasPercent = Math.round((finalScoreDisplay / 10) + nameSeed + ageSeed);
    if (biasPercent > 99) biasPercent = 99;
    if (biasPercent < 2) biasPercent = 6;

    // Select suitable jobs
    let selectedJobs = [];
    if (caste === 'ALPHA') {
      const alphaPool = [0, 1, 2, 3, 4, 5, 6, 7, 9]; // A-01~A-08, A-10
      const shuffled = [...alphaPool].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, 3);
      const matchRates = [98, 92, 88];
      selectedJobs = picked.map((idx, i) => ({ ...ALPHA_JOBS[idx], match: matchRates[i] }));
    } else if (caste === 'BETA') {
      const betaPool = [0, 1, 2, 4, 5, 6, 8, 9]; // B-01~B-03, B-05~B-07, B-09~B-10
      const shuffled = [...betaPool].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, 3);
      const matchRates = [87, 83, 79];
      selectedJobs = picked.map((idx, i) => ({ ...BETA_JOBS[idx], match: matchRates[i] }));
    } else {
      const omegaPool = [0, 2, 4, 5, 6, 7, 8, 9]; // Ω-01, Ω-03, Ω-05~Ω-10
      const shuffled = [...omegaPool].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, 3);
      const matchRates = [95, 89, 80];
      selectedJobs = picked.map((idx, i) => ({ ...OMEGA_JOBS[idx], match: matchRates[i] }));
    }

    return {
      score: finalScoreDisplay,
      caste,
      biasPercent,
      selectedJobs,
      chosePrivacyRejection,
      choseLoveOverCaste,
      choseGeneticRefusal,
      choseDissentInConsent
    };
  };

  const resultRef = useRef<any>(null);
  const results = (() => {
    if (step === 13) {
      if (!resultRef.current) {
        resultRef.current = getCasteResults();
      }
      return resultRef.current;
    }
    resultRef.current = null;
    return null;
  })();
  const casteDetails = results ? CASTE_MAP[results.caste] : null;
  const accentColor = results?.caste === 'OMEGA' ? '#FE0000' : results?.caste === 'BETA' ? '#FFF600' : '#ABFA00';

  return (
    <div className="bg-[#080808] text-[#b8b8b0] font-sans font-light relative flex flex-col justify-between overflow-hidden selection:bg-[#ff0001] selection:text-white" style={{ width: 1920, height: 1080 }}>

      {/* Visual background elements */}
      <div className="absolute inset-0 hud-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 hud-grid-fine opacity-20 pointer-events-none" />
      <div className="scanline" />

      {/* Full-screen Background Image */}
      {step === 0 && (
        <img
          src={bgPage01}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
        />
      )}
      {step === 1 && (
        <img
          src={bgPage02}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
        />
      )}
      {step === 2 && (
        <img
          src={bgPage03}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
        />
      )}
      {step >= 3 && step <= 12 && (
        <img
          src={bgPage04}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
        />
      )}
      {step === 13 && (
        <img
          src={bgResultAlpha}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
        />
      )}

      {/* Main Container Area */}
      <main className="flex-grow flex items-center justify-center w-full z-10 relative py-4 px-4 sm:px-10">

        {/* Warning Overlays - Absolute, outside document flow */}
        {results && (results.chosePrivacyRejection || results.choseLoveOverCaste || results.choseGeneticRefusal || results.choseDissentInConsent) && (
          <div className="absolute top-[31px] left-0 right-0 z-30 flex flex-wrap gap-2 px-4 justify-center" style={{ fontFamily: 'GeelyDesignType', fontWeight: 300 }}>
            {results.chosePrivacyRejection && (
              <div className="text-[#ff0001] px-3 py-2 font-mono text-xs flex items-center space-x-2">
                <span>⚠ 系统风险：隐私极端主义者</span>
              </div>
            )}
            {results.choseLoveOverCaste && (
              <div className="text-[#e6ff00] px-3 py-2 font-mono text-xs flex items-center space-x-2">
                <span>⚠ 附加警告：跨阶层亲密关系已记录</span>
              </div>
            )}
            {results.choseGeneticRefusal && (
              <div className="text-[#ff0001] px-3 py-2 font-mono text-xs flex items-center space-x-2">
                <span>⚠ 警告：拒绝参与遗传优势选择，已标记为"系统叛逃倾向者"</span>
              </div>
            )}
            {results.choseDissentInConsent && (
              <div className="text-[#ff0001] px-3 py-2 font-mono text-xs flex items-center space-x-2">
                <span>⚠ 系统复核决议公告：异议已被记录，但本报告仍将生效。</span>
              </div>
            )}
          </div>
        )}

        {/* ==================== PAGE 1: WELCOME PAGE ==================== */}
        {step === 0 && (
          <div className="absolute z-10" style={{ left: 155, top: 690 }}>
            {/* Start Button */}
            <button
              onClick={() => setStep(1)}
              className="group relative flex items-center justify-between border border-[#4a4a46] hover:border-[#ff0001] transition-all duration-300 w-[672px] h-16 px-6 bg-transparent text-left overflow-hidden cursor-pointer"
            >
              {/* Red fill on hover */}
              <div className="absolute inset-0 bg-[#ff0001] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 pointer-events-none" />

              <div className="relative z-10 font-title text-lg text-[#e8e8e0] group-hover:text-white flex flex-col justify-center">
                <span className="font-bold tracking-widest text-[#e8e8e0] group-hover:text-white" style={{ fontFamily: 'GeelyDesignType', fontSize: 32 }}>开 始</span>
              </div>

              <ChevronRight className="relative z-10 w-5 h-5 text-[#ff0001] group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300" />

              {/* Green Bottom Bar highlighted as per Design Doc */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#4ef02b]" />
            </button>
          </div>
        )}


        {/* ==================== PAGE 2: INITIAL PROFILE PAGE ==================== */}
        {step === 1 && (
          <div className="w-full max-w-[1632px] space-y-8 flex flex-col" style={{ transform: 'translateY(-20%)' }}>

            <form onSubmit={handleProfileSubmit} noValidate className="space-y-16 max-w-[1632px]" style={{ position: 'relative' }}>

              {/* Status indicator */}
              <div className="absolute z-10 flex items-center space-x-2 text-xs" style={{ left: -65, top: -280, fontFamily: 'GeelyDesignType', fontWeight: 300, color: 'rgb(174, 254, 0)' }}>
                <span className="h-3 w-3 rounded-full border-2 animate-spin" style={{ borderColor: '#AEFE00', borderTopColor: 'transparent' }} />
                <span style={{ letterSpacing: '0.06em' }}>等待决策录入... INPUT IN PROGRESS</span>
              </div>


                {/* Name */}
                <div className="absolute z-10" style={{ left: 420, top: -220, transform: 'translateY(-10%)' }}>
                  <input
                    type="text"
                    placeholder={formError?.field === 'name' ? formError.message : '例如: 维克多-147'}
                    value={profile.name}
                    onChange={(e) => { setProfile({ ...profile, name: e.target.value }); if (formError?.field === 'name') setFormError(null); }}
                    className="w-[1300px] h-[100px] px-4 bg-transparent border focus:border-[#ff0001] outline-none text-lg transition-colors placeholder:text-white rounded-none"
                    style={{
                      fontFamily: 'GeelyDesignType',
                      fontWeight: 300,
                      borderColor: formError?.field === 'name' ? '#ff0001' : 'white',
                      color: formError?.field === 'name' ? '#ff0001' : '#b8b8b0',
                    }}
                  />
                </div>

                {/* Age */}
                <div className="absolute z-10" style={{ left: 420, top: -47, transform: 'translateY(-10%)' }}>
                  <input
                    type="number"
                    placeholder={formError?.field === 'age' ? formError.message : '输入年龄 (0-150整数)'}
                    value={profile.age}
                    onChange={(e) => { setProfile({ ...profile, age: e.target.value }); if (formError?.field === 'age') setFormError(null); }}
                    onBlur={() => {
                      const ageNum = parseInt(profile.age);
                      if (profile.age.trim() && (isNaN(ageNum) || ageNum < 1 || ageNum > 150)) {
                        setFormError({ field: 'age', message: '警告：请输入合法的真实现存生存年龄（1-150）。' });
                      }
                    }}
                    className="w-[1300px] h-[100px] px-4 bg-transparent border focus:border-[#ff0001] outline-none text-lg transition-colors placeholder:text-white rounded-none"
                    style={{
                      fontFamily: 'GeelyDesignType',
                      fontWeight: 300,
                      borderColor: formError?.field === 'age' ? '#ff0001' : 'white',
                      color: formError?.field === 'age' ? '#ff0001' : '#b8b8b0',
                    }}
                  />
                </div>

                {/* Gender */}
                <div className="absolute z-10" style={{ left: 420, top: 116 }}>
                  <div className="grid grid-cols-3 gap-2 select-none" style={{ width: 1170, height: 100 }}>
                    {['生理男 / Biological Male', '生理女 / Biological Female', '未分类 / Gender Neutral'].map((gOption) => (
                      <button
                        key={gOption}
                        type="button"
                        onClick={() => setProfile({ ...profile, gender: gOption })}
                        className={`border transition-all duration-200 cursor-pointer text-center truncate ${
                          profile.gender === gOption
                            ? 'border-[#ff0001] bg-[#ff0001]/10 text-white font-bold'
                            : 'border-white bg-transparent text-white hover:border-[#b8b8b0]'
                        }`}
                        style={{ fontFamily: 'GeelyDesignType', fontWeight: 300, fontSize: 18 }}
                        title={gOption}
                      >
                        {gOption}
                      </button>
                    ))}
                  </div>
                </div>

              {/* Bottom Action Button */}
              <div className="absolute z-10" style={{ left: 420, top: 290 }}>
                <button
                  type="submit"
                  className="group relative flex items-center justify-between border border-[#4a4a46] hover:border-[#ff0001] transition-all duration-300 w-[672px] h-16 px-6 bg-transparent text-left overflow-hidden cursor-pointer"
                >
                  {/* Red fill on hover */}
                  <div className="absolute inset-0 bg-[#ff0001] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 pointer-events-none" />

                  <div className="relative z-10 font-title text-[#e8e8e0] group-hover:text-white flex flex-col justify-center">
                    <span className="font-bold tracking-[0.5em] group-hover:text-white" style={{ fontFamily: 'GeelyDesignType', fontSize: 40 }}>录入数据库并继续</span>
                  </div>
                  <ChevronRight className="relative z-10 w-5 h-5 text-[#ff0001] group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300" />

                  {/* Green Bottom Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#4ef02b]" />
                </button>
              </div>

            </form>
          </div>
        )}


        {/* ==================== PAGE 3: FACE SCANNING PAGE ==================== */}
        {step === 2 && (
          <div className="w-full max-w-[1632px] space-y-6">
            <div className="pb-3">
              <div className="absolute z-10 text-xs font-mono text-[#e6ff00]" style={{ transform: 'translate(7%, -240%)' }}>
                <span className="inline-block h-3 w-3 border-2 border-[#e6ff00] border-t-transparent rounded-full animate-spin mr-1.5" />
                <span style={{ fontFamily: 'GeelyDesignType', fontWeight: 400 }}>等待人脸录入... RETRIEVING FACIAL CODES {scanningProgress}%</span>
              </div>
            </div>

            {/* Layout structure: Large scanner and decorations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Outer Scanning Block - Red thick 3px border */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                <div className="absolute z-10 border-3 border-[#ff0001] bg-[#000000] overflow-hidden flex flex-col items-center justify-center shadow-[0_0_20px_rgba(255,0,1,0.15)]" style={{ left: -20, top: 80, width: 850, height: 850, transform: 'scale(0.6)', borderWidth: 30 }}>
                  
                  {/* Camera Video Stream Element */}
                  {!camError ? (
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline 
                      muted
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                  ) : (
                    /* High-fidelity futuristic animated wireframe SVG head if permission is denied */
                    <div className="absolute inset-0 flex items-center justify-center opacity-60">
                      <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] text-[#ff0001] stroke-1 stroke-current fill-none">
                        {/* Biometric circles */}
                        <circle cx="50" cy="50" r="45" strokeDasharray="3 3" className="animate-[spin_40s_linear_infinite]" />
                        <circle cx="50" cy="50" r="38" className="opacity-40" />
                        <circle cx="50" cy="50" r="5" className="fill-[#ff0001]" />
                        
                        {/* Wireframe head contours */}
                        <path d="M50,15 C32,15 28,32 28,50 C28,68 35,82 50,85 C65,82 72,68 72,50 C72,32 68,15 50,15 Z" className="animate-pulse" />
                        <path d="M50,15 Q50,50 35,50 C32,50 32,54 50,55 Q50,75 50,85" strokeWidth="0.5" />
                        <path d="M35,46 L65,46 M31,54 L69,54 M40,65 L60,65" strokeWidth="0.5" strokeDasharray="1 1" />
                        <path d="M50,15 Q50,50 65,50 C68,50 68,54 50,55" strokeWidth="0.5" />
                        
                        {/* Coordinate boxes */}
                        <rect x="25" y="44" width="4" height="4" strokeWidth="0.5" />
                        <rect x="71" y="44" width="4" height="4" strokeWidth="0.5" />
                        <rect x="48" y="78" width="4" height="4" strokeWidth="0.5" />
                      </svg>
                    </div>
                  )}

                  {/* Red Laser Scan line overlay */}
                  <div className="absolute left-0 right-0 h-[3px] bg-[#ff0001] shadow-[0_0_12px_#ff0001] z-10 pointer-events-none animate-[scanlineAnimation_2.5s_linear_infinite]" />

                  {/* Scientific text stats overlay */}
                  <div className="absolute top-3 left-3 bg-black/75 border border-[#4a4a46] p-3 text-[14px] text-[#b8b8b0] leading-relaxed space-y-1 z-10 max-w-[960px]" style={{ fontFamily: 'GeelyDesignType', fontWeight: 300 }}>
                    <p className="text-[#ff0001] font-bold text-base" style={{ fontFamily: 'GeelyDesignType', fontWeight: 700 }}>美学标准扫描仪</p>
                    <p>公民: {profile.name || '未知'}</p>
                    <p>模型ID: 阈值=147_A-GEN</p>
                    <p>稳定性: 99.88% [最优]</p>
                  </div>

                  {/* Real-time compliance/aesthetic score HUD display */}
                  <div className="absolute top-3 right-3 p-4 text-center z-10 min-w-[270px]">
                    <p className="text-[#999999] text-2xl tracking-wider font-bold" style={{ fontFamily: 'GeelyDesignType', fontWeight: 300 }}>实时面部合规评分</p>
                    <p className="text-[#ff0001] text-6xl font-bold animate-pulse mt-1" style={{ fontFamily: 'GeelyDesignType', fontWeight: 700 }}>
                      {getScanningScore(scanningProgress)} <span className="text-2xl text-[#b8b8b0] font-normal" style={{ fontFamily: 'GeelyDesignType', fontWeight: 700 }}>pt</span>
                    </p>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/75 border border-[#4a4a46] p-2 font-mono text-[17px] text-[#e6ff00] z-10 animate-pulse">
                    DIAGNOSTIC STATUS: {scanningProgress < 100 ? 'SCAN_ACTIVE' : 'COMPLETE_LEDGERED'}
                  </div>

                  {/* Circular scanner indicators */}
                  <div className="absolute w-24 h-24 border border-dashed border-[#ff0001] rounded-full animate-[spin_12s_linear_infinite] opacity-30 pointer-events-none" />
                </div>
              </div>

              {/* Right Side: Log Feed / Detailed System Feedback and Tech Blocks */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6 h-full min-h-[300px]" style={{ transform: 'translateX(-30%)', marginTop: 30 }}>
                
                <div className="space-y-4 font-mono text-xs text-[#999999]">
                  <div className="p-3 border border-white leading-[3.25]" style={{ backgroundColor: 'rgba(27, 40, 61, 0.15)' }}>
                    <p className="text-white font-bold mb-1">// SYSTEM CALCULATING VALUES...</p>
                    <p className="text-white" style={{ fontFamily: 'GeelyDesignType', fontWeight: 300 }}>• 采集面部三维网格特征: OK</p>
                    <p className="text-white" style={{ fontFamily: 'GeelyDesignType', fontWeight: 300 }}>• 比对AI规范审美模型深度图: OK</p>
                    <p className="text-white" style={{ fontFamily: 'GeelyDesignType', fontWeight: 300 }}>• 子代基因健康隐性系数预测: OK</p>
                    <p className="text-[#AEFE00]" style={{ fontFamily: 'GeelyDesignType', fontWeight: 300 }}>
                      ▶ 实时面部合规评分: {getScanningScore(scanningProgress)} pt
                      {scanningProgress < 100 ? ' [计算中...]' : ' [数据锁定已存盘]'}
                    </p>
                    <p className="text-[#ff0001] mt-0.5" style={{ fontFamily: 'GeelyDesignType', fontWeight: 700 }}>
                      {scanningProgress < 100
                        ? '• 算法美学判定中... ACTIVE EVALUATION'
                        : '• 美学评级判定已存盘: LEDGER COMMITTED_03'
                      }
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Tiny vertical columns of white blocks matching UI requirement */}
                    <div className="grid grid-cols-3 gap-1">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-[#b8b8b0] rounded-none opacity-60" />
                      ))}
                    </div>
                    <div>
                      <p className="text-[10px] text-[#666666]">DECISION BLOCK DECORATION V.03</p>
                      <p className="text-[9px] text-[#b8b8b0]">计算端密钥已同步 (SHA-256)</p>
                    </div>
                  </div>
                </div>

                {/* Confirm and Next step button */}
                <div className="pt-6">
                  <button
                    disabled={scanningProgress < 100}
                    onClick={() => setStep(3)}
                    className={`group relative flex items-center justify-between border w-[672px] h-16 px-6 bg-transparent text-left overflow-hidden cursor-pointer transition-all ${
                      scanningProgress >= 100
                        ? 'border-[#ff0001] hover:border-[#ff0001]'
                        : 'border-[#4a4a46] opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {scanningProgress >= 100 && (
                      <div className="absolute inset-0 bg-[#ff0001] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 pointer-events-none" />
                    )}

                    <div className="relative z-10 font-title text-[#AEFE00] group-hover:text-white flex flex-col justify-center">
                      <span className="font-bold tracking-[0.5em] group-hover:text-white whitespace-nowrap" style={{ fontFamily: 'GeelyDesignType', fontWeight: 700, fontSize: 40 }}>
                        {scanningProgress < 100 ? '正在评估面部特征...' : '录入数据库并继续'}
                      </span>
                    </div>
                    <ChevronRight className="relative z-10 w-5 h-5 text-[#ff0001] group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300" />

                    <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${scanningProgress >= 100 ? 'bg-[#4ef02b]' : 'bg-[#4a4a46]'}`} />
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}


        {/* ==================== PAGES 4-13: 10 DETAILED QUESTIONS ==================== */}
        {step >= 3 && step <= 12 && (() => {
          const qIndex = step - 3;
          const currentQuestion = QUESTIONS[qIndex];

          return (
            <div className="w-full max-w-[1632px] space-y-8 animate-[fadeIn_0.4s_ease-out] flex flex-col items-stretch">
              
              {/* Progress & Status Indicators - Left Aligned */}
              <div className="flex flex-col items-start space-y-2 text-left">
                <div className="flex space-x-1 sm:space-x-1.5 pt-1">
                  {QUESTIONS.map((q, idx) => (
                    <div 
                      key={q.id}
                      className={`h-[6px] w-6 sm:w-8 transition-all duration-300 ${
                        idx <= qIndex 
                          ? 'bg-[#ff0001]' // Answered and current is red
                          : 'bg-white opacity-80' // Unanswered questions are white
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[11px] font-mono text-[#e6ff00] tracking-[0.15em] font-medium flex items-center space-x-2 select-none">
                  <span className="h-3 w-3 rounded-full border-2 animate-spin shrink-0" style={{ borderColor: '#AEFE00', borderTopColor: 'transparent' }} />
                  <span className="animate-pulse" style={{ fontFamily: 'GeelyDesignType', fontWeight: 400 }}>等 待 决 策 录 入 . . . // SYSTEM_WAITING_FOR_DECISION_STREAM</span>
                </div>
              </div>

              {/* Question Text Panel - Left Aligned, inline parallel Chinese and English */}
              <div className="text-left pt-3 pb-5 border-b border-[#4a4a46]/40 flex flex-wrap items-baseline gap-x-4">
                <h3 className="text-[1.5rem] sm:text-[1.8rem] font-normal text-[#e1e1d8] tracking-widest select-none" style={{ fontFamily: 'GeelyDesignType', fontWeight: 400 }}>
                  {currentQuestion.text}
                </h3>
                {currentQuestion.englishText && (
                  <span className="text-xs sm:text-sm text-white/80 font-mono tracking-wide font-light leading-normal select-none">
                    {currentQuestion.englishText}
                  </span>
                )}
              </div>

              {/* Options buttons stacked vertically - Left Aligned, inline parallel Chinese and English */}
              <div className="w-full flex flex-col border-b border-white/15">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = answers[currentQuestion.id] === optIdx;
                  const isThisBlinking = isSelected && isBlinking && clickedOptionIndex === optIdx;
                  const englishTrans = OPTION_TRANSLATIONS[opt.text];
                  
                  return (
                    <button
                      key={optIdx}
                      onClick={() => selectOption(currentQuestion.id, optIdx, opt.score)}
                      className={`w-full py-5 text-left transition-all duration-200 cursor-pointer relative overflow-hidden flex justify-between items-center px-4 sm:px-6 border-t border-white/15 ${
                        isThisBlinking
                          ? 'bg-[#ff0001] text-black font-semibold' // Blinking highlight
                          : isSelected
                          ? 'bg-[#ff0001] text-black font-semibold shadow-[0_0_15px_rgba(255,0,1,0.25)]' // Static selected red background & black text
                          : 'bg-transparent text-[#e1e1d8] hover:text-white hover:border-[#ff0001]/60 hover:bg-neutral-900/40'
                      }`}
                    >
                      {/* Left Side: Option index and parallel translations on same line */}
                      <div className="flex items-baseline space-x-3 text-left select-none pr-8">
                        <span className={`font-sans text-[1.2rem] sm:text-[1.35rem] tracking-wide ${isSelected ? 'text-black' : 'text-[#e1e1d8]'}`} style={{ fontFamily: 'GeelyDesignType', fontWeight: 400 }}>
                          {opt.text}
                        </span>
                        {englishTrans && (
                          <span className={`font-mono text-xs ${isSelected ? 'text-black/75' : 'text-white/80'} tracking-wider font-light`}>
                            {englishTrans}
                          </span>
                        )}
                      </div>

                      {/* Flash feedback overlay */}
                      {isThisBlinking && (
                        <div className="absolute inset-0 bg-[#ff0001] opacity-30 animate-ping pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>

            </div>
          );
        })()}


        {/* ==================== PAGE 14: RESULT CASTE SHEET ==================== */}
        {step === 13 && results && casteDetails && (
          <div className="w-full max-w-[1632px] space-y-8 animate-[fadeIn_0.5s_ease-out]" style={{ transform: 'translateY(calc(20% - 30px))' }}>
            
            {/* Layout Split: Huge badge / Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Personal Info Card */}
              <div className="lg:col-span-4 flex justify-start">
                <div className="flex flex-col items-center space-y-5" style={{ width: 510, height: 620, border: '1px solid white', backgroundColor: 'rgba(25, 34, 49, 0.39)', padding: '0px 0px 24px' }}>

                  {/* ALPHA Tag - top left */}
                  <div className="w-full flex justify-start">
                    <div style={{ width: 145, height: 44, backgroundColor: accentColor, borderBottomRightRadius: 17, transform: 'scale(0.9)', transformOrigin: 'top left' }} className="flex items-center justify-center">
                      <span style={{ fontFamily: 'GeelyDesignType', fontWeight: 700, fontSize: 24, color: '#000' }}>{results.caste}</span>
                    </div>
                  </div>

                  {/* Avatar - 200px diameter */}
                  <div className="relative flex items-center justify-center overflow-hidden bg-[#111] rounded-full" style={{ width: 185, height: 185, minWidth: 185, minHeight: 185, marginTop: -30, borderColor: accentColor, borderWidth: 1, borderStyle: 'solid', boxShadow: `0 0 15px ${accentColor}40` }}>
                    <div className="absolute inset-0 rounded-full border border-dashed animate-[spin_50s_linear_infinite] z-20 pointer-events-none" style={{ borderColor: accentColor }} />
                    <div className="absolute w-[92%] h-[92%] rounded-full border z-20 pointer-events-none" style={{ borderColor: accentColor, opacity: 0.25 }} />

                    {capturedPhoto ? (
                      <div className="relative w-full h-full">
                        <img
                          src={capturedPhoto}
                          alt="Scanned Face Profile"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-2 text-[7px] font-mono bg-black/80 px-1 z-20" style={{ color: accentColor, borderColor: accentColor, borderWidth: 1, borderStyle: 'solid', opacity: 0.3 }}>BIOM_ID_03</span>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-[#151515] flex items-center justify-center p-3">
                        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] stroke-[1px] stroke-current fill-none opacity-80" style={{ color: accentColor }}>
                          <path d="M50,15 C32,15 28,32 28,50 C28,68 35,82 50,85 C65,82 72,68 72,50 C72,32 68,15 50,15 Z" className="animate-pulse" />
                          <path d="M50,15 Q50,50 35,50 C32,50 32,54 50,55 Q50,75 50,85" strokeWidth="0.5" />
                          <path d="M35,46 L65,46 M31,54 L69,54 M40,65 L60,65" strokeWidth="0.5" strokeDasharray="1 1" />
                          <circle cx="50" cy="50" r="3" style={{ fill: accentColor }} />
                          <circle cx="35" cy="46" r="1.5" style={{ fill: accentColor }} />
                          <circle cx="65" cy="46" r="1.5" style={{ fill: accentColor }} />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-white" style={{ fontFamily: 'GeelyDesignType', fontWeight: 400, fontSize: 20, marginTop: -15 }}>
                    {profile.name}
                  </h3>

                  {/* Caste Badge Image */}
                  <img src={results.caste === 'OMEGA' ? omegaBadgeImage : results.caste === 'BETA' ? betaBadgeImage : casteBadgeImage} alt={results.caste} className="object-contain" style={{ width: 150, height: 150, marginTop: -15 }} />

                  {/* Credit Score */}
                  <div className="relative flex justify-between items-center w-full" style={{ paddingLeft: 60, paddingRight: 80, marginTop: 20 }}>
                    <img src={borderFrame} alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0" style={{ transform: 'scale(1.75)' }} />
                    <span style={{ fontFamily: 'GeelyDesignType', fontWeight: 300, fontSize: 20, color: '#fff', letterSpacing: '0.17em', position: 'relative', zIndex: 1 }}>CREDIT SCORE</span>
                    <span style={{ fontFamily: 'GeelyDesignType', fontWeight: 300, fontSize: 20, color: '#fff', letterSpacing: '0.17em', position: 'relative', zIndex: 1 }}>{results.score}</span>
                  </div>

                  {/* Genetic Coefficient Progress Bar */}
                  <div className="w-full space-y-2" style={{ paddingLeft: 20, paddingRight: 20, marginTop: 20 }}>
                    <div className="flex justify-between">
                      <span style={{ fontFamily: 'GeelyDesignType', fontWeight: 400, fontSize: 20, color: '#fff' }}>遗传系数：</span>
                      <span style={{ fontFamily: 'GeelyDesignType', fontWeight: 700, fontSize: 20, color: accentColor }}>{results.biasPercent}%</span>
                    </div>
                    <div style={{ backgroundColor: '#333', height: 12, width: '100%' }}>
                      <div style={{ width: `${results.biasPercent}%`, backgroundColor: accentColor, height: '100%', boxShadow: `0 0 8px ${accentColor}` }} />
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Occupations, Classification, System Comment */}
              <div className="lg:col-span-8 space-y-[50px] ml-[62px]">

                {/* Fitted Occupations list */}
                <div className="space-y-3 mt-[10px]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {results.selectedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="border border-[#4a4a46] hover:border-[#ff0001] p-[20px] flex flex-col justify-between transition-colors duration-200" style={{ backgroundColor: 'rgba(25, 34, 49, 0.38)' }}
                      >
                        <div className="space-y-5">
                          <div className="flex justify-between items-start text-2xs text-white/80" style={{ fontFamily: 'GeelyDesignType', fontWeight: 400 }}>
                            <span style={{ fontSize: 13 }}>ID: {job.id}</span>
                            <div className="font-bold text-right" style={{ fontFamily: 'GeelyDesignType', fontWeight: 400, color: accentColor }}>
                            <div>{job.match}%</div>
                            <div>MATCH</div>
                          </div>
                          </div>
                          <h5 className="text-2xl tracking-widest text-white" style={{ fontFamily: 'GeelyDesignType', fontWeight: 400 }}>{job.name}</h5>
                          <p className="text-[16px] text-white leading-tight" style={{ fontFamily: 'GeelyDesignType', fontWeight: 300, marginTop: -8 }}>{job.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Caste description block */}
                <div className="py-5 pr-5 pl-0 space-y-2 -mt-[5px]">
                  <span className="text-[24px] text-white" style={{ fontFamily: 'GeelyDesignType', fontWeight: 400 }}>// CLASSIFICATION_CRITERIA</span>
                  <p className="text-[20px] leading-tight text-white/70" style={{ fontFamily: 'GeelyDesignType', fontWeight: 300 }}>
                    {casteDetails.description}
                  </p>
                </div>

                {/* Algorithmic cold critique */}
                <div className="py-5 pr-5 pl-0 space-y-2 text-left -mt-[35px]">
                  <span className="text-[24px] text-white tracking-widest block uppercase" style={{ fontFamily: 'GeelyDesignType', fontWeight: 700 }}>
// 核心系统算法自动评注
                  </span>
                  <p className="text-[16px] text-white/70 leading-relaxed select-all" style={{ fontFamily: 'GeelyDesignType', fontWeight: 300, whiteSpace: 'pre-line' }}>
                    {casteDetails.systemComment}
                  </p>
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="group relative flex items-center justify-between border border-[#4a4a46] hover:border-[#ff0001] transition-all duration-300 w-full h-[57px] px-6 bg-transparent text-left overflow-hidden cursor-pointer"
                  style={{ transform: 'translateY(-40px)' }}
                >
                  {/* Red fill on hover */}
                  <div className="absolute inset-0 bg-[#ff0001] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 pointer-events-none" />
                  <div className="relative z-10 font-title text-lg text-[#e8e8e0] group-hover:text-white flex flex-col justify-center">
                    <span className="font-bold text-[#e8e8e0] group-hover:text-white" style={{ fontFamily: 'GeelyDesignType', fontSize: 32, letterSpacing: '0.6em' }}>重新录入</span>
                  </div>
                  <RefreshCw className="relative z-10 w-5 h-5 text-[#ff0001] group-hover:text-white group-hover:rotate-180 transition-transform duration-500" />
                  {/* Green Bottom Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#4ef02b]" />
                </button>

              </div>
            </div>


          </div>
        )}

      </main>



      {/* Small, inconspicuous "Restart" button in the bottom right corner */}
      {step > 0 && (
        <button
          onClick={handleReset}
          title="随时重新测试"
          className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 bg-[#0c0c0c]/90 hover:bg-black border border-[#4a4a46]/30 hover:border-[#ff0001]/50 text-[#555555] hover:text-[#ff0001] transition-all px-2 py-1 rounded-sm font-mono text-[9px] uppercase tracking-wider cursor-pointer shadow-md select-none flex items-center space-x-1"
        >
          <RefreshCw className="w-2.5 h-2.5 animate-[spin_10s_linear_infinite]" />
          <span>随时重新测试 RESTART</span>
        </button>
      )}
    </div>
  );
}
