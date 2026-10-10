import React, { useState, useRef, useCallback } from 'react'
import { Database, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, RefreshCw, X } from 'lucide-react'
import Papa from 'papaparse'
import MainLayout from '../layouts/MainLayout'
import studentService from '../services/studentService'
import { StudentRecord } from '../data/students'
import StatCard from '../components/common/StatCard'

interface ParsedData {
  data: Record<string, string>[]
  errors: { row: number; message: string }[]
  meta: {
    fields: string[]
    rowCount: number
  }
}

const REQUIRED_COLUMNS = [
  'rollNumber',
  'name',
  'department',
  'year',
  'section',
  'attendance',
  'mathScore',
  'programmingScore',
  'aimlScore',
  'riskLevel',
  'trend',
]

const DataCenter: React.FC = () => {
  const [dragActive, setDragActive] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace')
  const [importSuccess, setImportSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const students = studentService.getStudents()

  // Data quality metrics
  const dataQuality = {
    totalRecords: students.length,
    missingValues: students.reduce((count, s) => {
      let missing = 0
      if (!s.name) missing++
      if (!s.email) missing++
      if (!s.phone) missing++
      return count + missing
    }, 0),
    duplicateIds: new Set(students.map(s => s.rollNumber)).size !== students.length ? 
      students.length - new Set(students.map(s => s.rollNumber)).size : 0,
    lastUpdated: students.length > 0 ? 
      students.reduce((latest, s) => 
        new Date(s.lastUpdated) > new Date(latest) ? s.lastUpdated : latest, students[0].lastUpdated
      ) : 'N/A',
  }

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  // Handle file drop/selection
  const handleFile = useCallback((file: File) => {
    setParseError(null)
    setParsedData(null)
    setImportSuccess(null)

    if (!file.name.endsWith('.csv')) {
      setParseError('Please upload a CSV file')
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as Record<string, string>[]
        const fields = results.meta.fields || []

        // Validate required columns
        const missingColumns = REQUIRED_COLUMNS.filter(col => !fields.includes(col))
        if (missingColumns.length > 0) {
          setParseError(`Missing required columns: ${missingColumns.join(', ')}`)
          return
        }

        // Check for errors
        const errors: { row: number; message: string }[] = []
        data.forEach((row, idx) => {
          if (!row.rollNumber) errors.push({ row: idx + 1, message: 'Missing roll number' })
          if (!row.name) errors.push({ row: idx + 1, message: 'Missing name' })
        })

        setParsedData({
          data,
          errors,
          meta: { fields, rowCount: data.length },
        })
      },
      error: (error) => {
        setParseError(`Parse error: ${error.message}`)
      },
    })
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [handleFile])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  // Import data
  const handleImport = () => {
    if (!parsedData) return

    const newStudents: StudentRecord[] = parsedData.data.map((row, idx) => ({
      id: idx + 1,
      rollNumber: row.rollNumber,
      name: row.name,
      gender: row.gender || 'Male',
      age: parseInt(row.age) || 20,
      department: row.department,
      year: row.year,
      section: row.section,
      email: row.email || `${row.rollNumber.toLowerCase()}@example.com`,
      phone: row.phone || '9876543210',
      attendance: parseInt(row.attendance) || 0,
      mathScore: parseInt(row.mathScore) || 0,
      programmingScore: parseInt(row.programmingScore) || 0,
      aimlScore: parseInt(row.aimlScore) || 0,
      overallScore: parseInt(row.overallScore) || 0,
      avgPerformance: parseFloat(row.avgPerformance) || 
        ((parseInt(row.mathScore) + parseInt(row.programmingScore) + parseInt(row.aimlScore)) / 3),
      daysPresent: parseInt(row.daysPresent) || 0,
      daysAbsent: parseInt(row.daysAbsent) || 0,
      lateCount: parseInt(row.lateCount) || 0,
      failedSubjects: parseInt(row.failedSubjects) || 0,
      riskLevel: row.riskLevel as StudentRecord['riskLevel'],
      trend: row.trend as StudentRecord['trend'],
      remarks: row.remarks || '',
      lastUpdated: new Date().toISOString().split('T')[0],
    }))

    if (importMode === 'replace') {
      studentService.setStudents(newStudents)
      setImportSuccess(`Successfully imported ${newStudents.length} records (replaced existing data)`)
    } else {
      const existing = studentService.getStudents()
      const existingRollNumbers = new Set(existing.map(s => s.rollNumber))
      const toAdd = newStudents.filter(s => !existingRollNumbers.has(s.rollNumber))
      const toUpdate = newStudents.filter(s => existingRollNumbers.has(s.rollNumber))
      
      let updated = [...existing]
      toUpdate.forEach(newStudent => {
        const idx = updated.findIndex(s => s.rollNumber === newStudent.rollNumber)
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], ...newStudent, id: updated[idx].id }
        }
      })
      toAdd.forEach(newStudent => {
        const maxId = Math.max(...updated.map(s => s.id), 0)
        updated.push({ ...newStudent, id: maxId + 1 })
      })
      
      studentService.setStudents(updated)
      setImportSuccess(`Merged: ${toUpdate.length} updated, ${toAdd.length} added`)
    }

    setParsedData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Export current data
  const handleExport = () => {
    const data = studentService.getStudents()
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `eduvision_students_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  // Download sample template
  const handleDownloadTemplate = () => {
    const template = [
      {
        rollNumber: 'STU001',
        name: 'John Doe',
        gender: 'Male',
        age: '20',
        department: 'CSE',
        year: '2nd Year',
        section: 'A',
        email: 'john.doe@example.com',
        phone: '9876543210',
        attendance: '85',
        mathScore: '80',
        programmingScore: '85',
        aimlScore: '82',
        overallScore: '88',
        avgPerformance: '82.3',
        daysPresent: '10',
        daysAbsent: '2',
        lateCount: '1',
        failedSubjects: '0',
        riskLevel: 'Low',
        trend: 'Improving',
        remarks: 'Good performance',
      },
      {
        rollNumber: 'STU002',
        name: 'Jane Smith',
        gender: 'Female',
        age: '19',
        department: 'AI & ML',
        year: '2nd Year',
        section: 'B',
        email: 'jane.smith@example.com',
        phone: '9876543211',
        attendance: '60',
        mathScore: '55',
        programmingScore: '58',
        aimlScore: '52',
        overallScore: '55',
        avgPerformance: '55.0',
        daysPresent: '12',
        daysAbsent: '8',
        lateCount: '3',
        failedSubjects: '2',
        riskLevel: 'High',
        trend: 'Declining',
        remarks: 'Needs attention',
      },
    ]
    const csv = Papa.unparse(template)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'eduvision_student_template.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const resetUpload = () => {
    setParsedData(null)
    setParseError(null)
    setImportSuccess(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6 page-enter">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Data Center
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Upload, validate, and manage student data
          </p>
        </div>

        {/* Data Quality Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Records"
            value={dataQuality.totalRecords}
            icon={Database}
            color="blue"
          />
          <StatCard
            title="Missing Values"
            value={dataQuality.missingValues}
            icon={AlertCircle}
            color="amber"
          />
          <StatCard
            title="Duplicate IDs"
            value={dataQuality.duplicateIds}
            icon={AlertCircle}
            color="red"
          />
          <StatCard
            title="Last Updated"
            value={dataQuality.lastUpdated}
            icon={RefreshCw}
            color="green"
          />
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-card shadow-card border border-neutral-200/60 dark:border-neutral-700/60 p-5">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Import Student Data
          </h2>

          {/* Drag & Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600 dark:text-neutral-300 font-medium">
              Drag & drop a CSV file here, or click to browse
            </p>
            <p className="text-sm text-neutral-400 mt-1">
              Required columns: rollNumber, name, department, year, section, attendance, mathScore, programmingScore, aimlScore, riskLevel, trend
            </p>
          </div>

          {/* Parse Error */}
          {parseError && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-red-700 dark:text-red-300">Import Error</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{parseError}</p>
              </div>
            </div>
          )}

          {/* Import Success */}
          {importSuccess && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-300">Import Successful</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">{importSuccess}</p>
              </div>
            </div>
          )}

          {/* Preview Table */}
          {parsedData && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    Preview: {parsedData.meta.rowCount} rows
                  </span>
                </div>
                <button onClick={resetUpload} className="text-neutral-400 hover:text-neutral-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {parsedData.errors.length > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {parsedData.errors.length} validation warning(s) found
                  </p>
                </div>
              )}

              <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                    <tr>
                      {parsedData.meta.fields.slice(0, 8).map((field) => (
                        <th key={field} className="px-3 py-2 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                          {field}
                        </th>
                      ))}
                      {parsedData.meta.fields.length > 8 && (
                        <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                          +{parsedData.meta.fields.length - 8} more
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {parsedData.data.slice(0, 10).map((row, idx) => (
                      <tr key={idx}>
                        {parsedData.meta.fields.slice(0, 8).map((field) => (
                          <td key={field} className="px-3 py-2 text-neutral-600 dark:text-neutral-300">
                            {row[field] || '-'}
                          </td>
                        ))}
                        {parsedData.meta.fields.length > 8 && (
                          <td className="px-3 py-2 text-neutral-400">...</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="replace"
                    name="importMode"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="text-primary-600"
                  />
                  <label htmlFor="replace" className="text-sm text-neutral-700 dark:text-neutral-300">
                    Replace existing data
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="merge"
                    name="importMode"
                    checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')}
                    className="text-primary-600"
                  />
                  <label htmlFor="merge" className="text-sm text-neutral-700 dark:text-neutral-300">
                    Merge with existing data
                  </label>
                </div>
                <button
                  onClick={handleImport}
                  className="ml-auto px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm rounded-lg transition-colors"
                >
                  Confirm Import
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Sample Template
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Current Data
          </button>
        </div>
      </div>
    </MainLayout>
  )
}

export default DataCenter
