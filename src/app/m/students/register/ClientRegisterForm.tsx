'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, UserPlus, Info, Camera, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import Script from 'next/script';

export default function ClientRegisterForm({ classes }: { classes: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceVector, setFaceVector] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('');
  const [processStatus, setProcessStatus] = useState<string>('');
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [modelError, setModelError] = useState<string>('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Debug if useEffect is even running
    const debugEl = document.getElementById('debug-status');
    if (debugEl) debugEl.innerText = 'useEffect 정상 작동 확인됨!';
  }, []);

  const injectScriptManually = () => {
    setProcessStatus('버튼 클릭됨! 스크립트 다운로드 시작 (V6)');
    
    setTimeout(() => {
      const script = document.createElement('script');
      script.src = window.location.origin + '/js/face-api.js';
      script.async = true;
      script.onload = () => {
        console.log('face-api script loaded via vanilla DOM');
        setProcessStatus('스크립트 다운로드 완료! 모델 로드 준비 중... (V6)');
        setTimeout(() => setIsScriptLoaded(true), 500);
      };
      script.onerror = () => {
        console.error('Failed to load face-api.js');
        setModelError('자바스크립트 파일 주입 완전 실패');
      };
      document.body.appendChild(script);
    }, 100);
  };

  useEffect(() => {
    if (!isScriptLoaded) return;
    
    // Load models in the background just in case they want to upload a photo
    const loadModels = async () => {
      try {
        setProcessStatus('AI 모델 파일 fetching 중... (V4)');
        const faceapi = (window as any).faceapi;
        const MODEL_URL = window.location.origin + '/models/';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setProcessStatus('');
        setIsModelLoaded(true);
      } catch (err: any) {
        console.error('모델 로드 실패:', err);
        setModelError(err?.message || String(err) || '알 수 없는 오류');
      }
    };
    loadModels();
  }, [isScriptLoaded]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic' || file.type === 'image/heif') {
      alert('스마트폰의 고화질 압축 포맷(HEIC)은 지원하지 않습니다. 일반 사진(JPG/PNG)을 선택하거나 직접 카메라로 촬영해주세요.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (!isModelLoaded) {
      alert('AI 모델이 로드되지 않았습니다. 인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsProcessing(true);
    setProcessStatus('분석 준비 중...');
    setFaceVector('');
    setProfileImage('');

    try {
      setProcessStatus('사진 분석 중... (1/4: 파일 읽기)');
      // 1. Read file as Data URL using FileReader (more stable on some Android WebViews)
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setProcessStatus('사진 분석 중... (2/4: 이미지 디코딩)');
      const img = new window.Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = dataUrl;
      });

      setProcessStatus('사진 분석 중... (3/4: 이미지 최적화)');
      // 2. Downsize large mobile images before AI processing
      const MAX_SIZE = 800;
      let width = img.width;
      let height = img.height;
      
      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(img, 0, 0, width, height);
      }

      const faceapi = (window as any).faceapi;

      setProcessStatus('사진 분석 중... (4/4: AI 얼굴 추출)');
      // 3. Detect Face on downsized canvas
      const detections = await faceapi
        .detectSingleFace(tempCanvas, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        alert('사진에서 얼굴을 찾지 못했습니다. 얼굴이 정면으로 잘 보이는 사진을 선택해주세요.');
        setIsProcessing(false);
        setProcessStatus('');
        return;
      }

      setProcessStatus('얼굴 데이터 추출 완료!');

      // 4. Save face vector
      const vector = JSON.stringify(Array.from(detections.descriptor));
      setFaceVector(vector);

      // 5. Crop Face for Profile Image
      const canvas = document.createElement('canvas');
      const box = detections.detection.box;
      
      // Add padding around the face for a nice profile picture
      const padding = box.width * 0.3;
      let sx = Math.max(0, box.x - padding);
      let sy = Math.max(0, box.y - padding);
      let sWidth = Math.min(tempCanvas.width - sx, box.width + padding * 2);
      let sHeight = Math.min(tempCanvas.height - sy, box.height + padding * 2);

      // Make it square
      const size = Math.min(sWidth, sHeight);
      sx += (sWidth - size) / 2;
      sy += (sHeight - size) / 2;

      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(tempCanvas, sx, sy, size, size, 0, 0, 150, 150);
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
        setProfileImage(base64Image);
      }

      // URL.revokeObjectURL(imageUrl); // No longer needed
    } catch (err: any) {
      console.error('Face processing error:', err);
      const errMsg = err?.message || String(err) || '알 수 없는 오류';
      alert(`얼굴 분석 중 오류가 발생했습니다: ${errMsg}`);
      setProcessStatus(`분석 실패: ${errMsg}`);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 pt-safe items-center justify-center">
        <Loader2 size={32} className="text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500 font-bold text-sm">스마트폰 최적화 UI 로딩 중...</p>
        <p className="text-slate-400 text-xs mt-2">화면이 넘어가지 않는다면 서버 터미널에서<br/>npm run build &amp;&amp; npm start 를 실행해주세요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pt-safe">
      <header className="bg-white px-5 py-4 sticky top-0 z-10 shadow-sm border-b border-slate-100 flex items-center gap-3">
        <Link href="/m/students" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">신규 관원 등록</h1>
      </header>

      <div className="p-4 flex flex-col gap-4">
        
        {/* Face Image Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col items-center gap-4">
          <div className="relative w-32 h-32">
            <div 
              className={`w-full h-full rounded-full flex flex-col items-center justify-center border-4 overflow-hidden transition-all ${profileImage ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-slate-100 bg-slate-50 border-dashed hover:bg-slate-100 hover:border-slate-300'}`}
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : isProcessing ? (
                <Loader2 size={32} className="text-blue-500 animate-spin" />
              ) : (
                <>
                  <Camera size={32} className="text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-400">미리보기</span>
                </>
              )}
            </div>
            {profileImage && (
              <div className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1 border-2 border-white pointer-events-none z-10">
                <CheckCircle2 size={16} />
              </div>
            )}
          </div>
          
            {/* Visible Native File Input - 100% Reliable */}
            <div className="w-full flex flex-col items-center mt-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
                onChange={handleFileChange}
              />
              <div className="mt-2 text-xs font-semibold flex flex-col items-center gap-2">
                <span id="debug-status" className="text-purple-600 font-bold border border-purple-200 bg-purple-50 px-2 py-1 rounded">
                  useEffect 작동 대기 중...
                </span>
                
                {modelError ? (
                  <span className="text-red-500 font-bold">에러: {modelError}</span>
                ) : isModelLoaded ? (
                  <span className="text-green-600 flex items-center justify-center gap-1"><CheckCircle2 size={12}/> 엔진 작동 준비 완료 (V6)</span>
                ) : (
                  <>
                    <span className="text-amber-500 flex items-center justify-center gap-1"><Loader2 size={12} className="animate-spin"/> {processStatus || '초기 렌더링 (V6)'}</span>
                    <button 
                      type="button" 
                      onClick={injectScriptManually}
                      className="mt-2 px-4 py-2 bg-slate-800 text-white rounded-lg font-bold text-xs"
                    >
                      강제 엔진 다운로드 시작
                    </button>
                  </>
                )}
              </div>
            </div>

          <div className="text-center">
            {profileImage ? (
              <p className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">AI 얼굴 분석 완료</p>
            ) : isProcessing ? (
              <p className="text-sm font-bold text-blue-600">{processStatus}</p>
            ) : (
              <p className="text-xs text-slate-500">위 버튼을 눌러 사진을 업로드하거나 촬영하세요.<br/>(선택사항)</p>
            )}
          </div>
        </div>

        {/* Standard Form Submission */}
        <form action="/api/mobile_register_post" method="POST" encType="multipart/form-data" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4">
          
          {/* Hidden inputs to pass processed AI data safely */}
          <input type="hidden" name="face_vector" value={faceVector} />
          <input type="hidden" name="profile_image" value={profileImage} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">관원 이름 *</label>
            <input 
              type="text" 
              name="name" 
              required
              placeholder="예: 홍길동"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">수련반 선택</label>
            <select 
              name="class_id"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">학부모 성함</label>
            <input 
              type="text" 
              name="parent_name" 
              placeholder="예: 홍아빠"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">학부모 연락처 (- 없이)</label>
            <input 
              type="tel" 
              name="parent_phone" 
              placeholder="예: 01012345678"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <input type="hidden" name="receive_sms_in" value="true" />
          <input type="hidden" name="receive_sms_out" value="true" />

          <button 
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
          >
            <UserPlus size={20} />
            등록 완료하기
          </button>
        </form>
      </div>
    </div>
  );
}
