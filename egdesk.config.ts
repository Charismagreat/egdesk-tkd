/**
 * EGDesk User Data Configuration
 * Generated at: 2026-05-17T13:22:24.615Z
 *
 * This file contains type-safe definitions for your EGDesk tables.
 */

export const EGDESK_CONFIG = {
  apiUrl: 'http://localhost:8080',
  apiKey: 'a67ddc0f-7e2b-4997-9a0b-9667a74c89d0',
} as const;

export interface TableDefinition {
  name: string;
  displayName: string;
  description?: string;
  /** Omitted or unknown until synced / counted */
  rowCount?: number;
  columnCount: number;
  columns: string[];
}

export const TABLES = {
  table1: {
    name: 'tkd_usage_logs',
    displayName: '사용량 통계 로그',
    rowCount: 0,
    columnCount: 4,
    columns: ['id', 'type', 'timestamp', 'student_id']
  } as TableDefinition,
  table2: {
    name: 'students',
    displayName: '학생 명단',
    rowCount: 10,
    columnCount: 13,
    columns: ['id', 'name', 'parent_name', 'parent_phone', 'birth_date', 'rank', 'memo', 'face_vector', 'profile_image', 'class_id', 'receive_sms_in', 'receive_sms_out', 'status']
  } as TableDefinition,
  table3: {
    name: 'students_old_1778936377614',
    displayName: '학생 명단 (백업_1778936377614)',
    description: '학생 기본 정보 및 부가 정보',
    rowCount: 8,
    columnCount: 12,
    columns: ['id', 'name', 'parent_name', 'parent_phone', 'birth_date', 'rank', 'memo', 'face_vector', 'profile_image', 'class_id', 'receive_sms_in', 'receive_sms_out']
  } as TableDefinition,
  table4: {
    name: 'students_backup_2',
    displayName: 'students_backup_2',
    description: '학생 기본 정보 및 부가 정보',
    rowCount: 3,
    columnCount: 11,
    columns: ['id', 'name', 'parent_name', 'parent_phone', 'birth_date', 'rank', 'memo', 'face_vector', 'profile_image', 'class_id', 'receive_sms']
  } as TableDefinition,
  table5: {
    name: 'attendance_logs',
    displayName: '출결 기록',
    description: '학생 출결 기록 및 문자 발송 상태',
    rowCount: 23,
    columnCount: 6,
    columns: ['id', 'student_id', 'timestamp', 'type', 'status', 'sms_status']
  } as TableDefinition,
  table6: {
    name: 'tkd_system_settings',
    displayName: '태권도 시스템 설정',
    rowCount: 5,
    columnCount: 3,
    columns: ['id', 'key', 'value']
  } as TableDefinition,
  table7: {
    name: 'system_settings',
    displayName: '시스템 설정',
    rowCount: 0,
    columnCount: 3,
    columns: ['id', 'key', 'value']
  } as TableDefinition,
  table8: {
    name: 'student_classes',
    displayName: '반 관리',
    rowCount: 4,
    columnCount: 2,
    columns: ['id', 'name']
  } as TableDefinition,
  table9: {
    name: 'payment_records',
    displayName: '수납 기록',
    rowCount: 0,
    columnCount: 6,
    columns: ['id', 'student_id', 'amount', 'payment_date', 'depositor_name', 'status']
  } as TableDefinition,
  table10: {
    name: 'attendance_logs_backup',
    displayName: 'attendance_logs_backup',
    rowCount: 0,
    columnCount: 5,
    columns: ['id', 'student_id', 'timestamp', 'type', 'status']
  } as TableDefinition,
  table11: {
    name: 'students_backup',
    displayName: 'students_backup',
    rowCount: 3,
    columnCount: 10,
    columns: ['id', 'name', 'parent_name', 'parent_phone', 'birth_date', 'rank', 'memo', 'face_vector', 'profile_image', 'class_id']
  } as TableDefinition,
  table12: {
    name: 'classes',
    displayName: '수업 정보',
    rowCount: 0,
    columnCount: 4,
    columns: ['id', 'name', 'start_time', 'end_time']
  } as TableDefinition,
  table13: {
    name: 'custom_fields',
    displayName: '사용자 정의 항목',
    rowCount: 0,
    columnCount: 3,
    columns: ['id', 'field_name', 'display_name']
  } as TableDefinition,
  table14: {
    name: 'test_like',
    displayName: 'Test Table',
    rowCount: 1,
    columnCount: 2,
    columns: ['id', 'val']
  } as TableDefinition
} as const;


// Main table (first table by default)
export const MAIN_TABLE = TABLES.table1;


// Helper to get table by name
export function getTableByName(tableName: string): TableDefinition | undefined {
  return Object.values(TABLES).find(t => t.name === tableName);
}

// Export table names for easy access
export const TABLE_NAMES = {
  table1: 'tkd_usage_logs',
  table2: 'students',
  table3: 'students_old_1778936377614',
  table4: 'students_backup_2',
  table5: 'attendance_logs',
  table6: 'tkd_system_settings',
  table7: 'system_settings',
  table8: 'student_classes',
  table9: 'payment_records',
  table10: 'attendance_logs_backup',
  table11: 'students_backup',
  table12: 'classes',
  table13: 'custom_fields',
  table14: 'test_like'
} as const;
