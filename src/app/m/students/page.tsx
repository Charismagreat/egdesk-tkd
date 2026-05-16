import React from 'react';
import { queryTable } from '@root/egdesk-helpers';
import ClientStudents from './ClientStudents';

export const dynamic = 'force-dynamic';

export default async function MobileStudentsPage() {
  let initialStudents = [];
  try {
    const res = await queryTable('students', { orderBy: 'id', orderDirection: 'DESC' });
    initialStudents = res.rows || [];
  } catch (error) {
    console.error('Failed to fetch students for mobile page:', error);
  }

  return <ClientStudents initialStudents={initialStudents} />;
}
