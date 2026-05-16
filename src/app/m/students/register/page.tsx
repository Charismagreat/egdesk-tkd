import React from 'react';
import { queryTable } from '@root/egdesk-helpers';
import ClientRegisterForm from './ClientRegisterForm';

export const dynamic = 'force-dynamic';

export default async function MobileRegisterPage() {
  let classes = [];

  try {
    const res = await queryTable('student_classes');
    classes = res.rows || [];
  } catch (error) {
    console.error('Failed to fetch classes:', error);
  }

  return <ClientRegisterForm classes={classes} />;
}
