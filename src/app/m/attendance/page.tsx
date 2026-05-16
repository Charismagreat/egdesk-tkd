import React from 'react';
import { executeSQL, queryTable } from '@root/egdesk-helpers';
import ClientAttendanceLogs from './ClientAttendanceLogs';

export const dynamic = 'force-dynamic';

export default async function MobileAttendancePage() {
  let formattedLogs = [];

  try {
    const classesRes = await queryTable('student_classes');
    const cmap: Record<number, string> = {};
    if (classesRes && classesRes.rows) {
      classesRes.rows.forEach((cls: any) => {
        cmap[cls.id] = cls.name;
      });
    }

    const studentsRes = await queryTable('students');
    const studentMap = new Map<number, any>((studentsRes?.rows || []).map((s: any) => [s.id, s]));

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const logsRes = await executeSQL(`
      SELECT * FROM attendance_logs 
      WHERE timestamp LIKE '${todayStr}%' 
      ORDER BY id DESC
    `);

    formattedLogs = (logsRes?.rows || []).map((log: any) => {
      const student = studentMap.get(log.student_id);
      return {
        ...log,
        student_name: student?.name || `ID: ${log.student_id}`,
        class_name: student ? (cmap[student.class_id] || '') : ''
      };
    });
  } catch (error) {
    console.error('Failed to fetch attendance logs for mobile page:', error);
  }

  return <ClientAttendanceLogs initialLogs={formattedLogs} />;
}
