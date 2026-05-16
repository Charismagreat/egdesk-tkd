import React from 'react';
import { queryTable } from '@root/egdesk-helpers';
import { Settings, Info, Bell, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MobileSettingsPage() {
  let settings: any = {};
  try {
    const res = await queryTable('settings');
    settings = res.rows?.[0] || {};
  } catch (error) {
    console.error('Failed to fetch settings:', error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pt-safe">
      <header className="bg-white px-5 py-4 sticky top-0 z-10 shadow-sm border-b border-slate-100">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">환경 설정</h1>
      </header>

      <div className="p-4 flex flex-col gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">시스템 설정</h2>
              <p className="text-xs text-slate-400">자동 하원 및 기타 모바일 설정은 현재 PC버전에서 지원됩니다.</p>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold text-slate-700">자동 하원 처리</span>
              <span className="text-sm text-blue-600 font-black">{settings.auto_checkout_minutes ? `${settings.auto_checkout_minutes}분 후` : '사용 안함'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold text-slate-700">문자 자동 발송</span>
              <span className="text-sm text-blue-600 font-black">활성화됨</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center">
              <Info size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">앱 정보</h2>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold text-slate-700">버전</span>
              <span className="text-sm text-slate-500">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
