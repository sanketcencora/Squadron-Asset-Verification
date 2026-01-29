import * as XLSX from 'xlsx';

export interface ExcelExportRow {
  employeeId: string;
  employeeName: string;
  email: string;
  team: string;
  location: string;
  serviceTag: string;
  assetType: string;
  model: string;
  verificationStatus: string;
  lastVerifiedDate?: string;
  issueDescription?: string;
}

export function exportToExcel(data: ExcelExportRow[], filename: string) {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: [
      'employeeId',
      'employeeName',
      'email',
      'team',
      'location',
      'serviceTag',
      'assetType',
      'model',
      'verificationStatus',
      'lastVerifiedDate',
      'issueDescription'
    ]
  });

  // Set column headers with better labels
  XLSX.utils.sheet_add_aoa(worksheet, [[
    'Employee ID',
    'Employee Name',
    'Email',
    'Team',
    'Location',
    'Service Tag',
    'Asset Type',
    'Model',
    'Verification Status',
    'Last Verified',
    'Issue Description'
  ]], { origin: 'A1' });

  // Set column widths
  worksheet['!cols'] = [
    { wch: 15 }, // Employee ID
    { wch: 20 }, // Employee Name
    { wch: 25 }, // Email
    { wch: 20 }, // Team
    { wch: 20 }, // Location
    { wch: 15 }, // Service Tag
    { wch: 15 }, // Asset Type
    { wch: 25 }, // Model
    { wch: 18 }, // Verification Status
    { wch: 15 }, // Last Verified
    { wch: 40 }  // Issue Description
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Verification Report');

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, filename);
}

export function formatDateForExcel(date: string | undefined): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
