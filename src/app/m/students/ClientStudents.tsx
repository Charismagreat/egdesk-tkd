'use client';

import React, { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function ClientStudents({ initialStudents }: { initialStudents: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = initialStudents.filter(s => 
    s.name.includes(searchTerm) || 
    (s.parent_phone && s.parent_phone.includes(searchTerm))
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pt-safe">
      <header className="bg-white px-5 py-4 sticky top-0 z-10 shadow-sm border-b border-slate-100 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">관원 관리</h1>
          <Link href="/m/students/register" className="p-2 bg-blue-50 text-blue-600 rounded-full">
            <UserPlus size={20} />
          </Link>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="이름 또는 연락처 검색..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100/50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </header>

      <div className="p-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-bold text-sm">관원이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filtered.map((student) => (
              <div key={student.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-lg">{student.name}</div>
                    <div className="text-sm text-slate-500 flex gap-2">
                      <span className="font-medium">{student.parent_name}</span>
                      <span className="text-slate-300">|</span>
                      <span>{student.parent_phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
