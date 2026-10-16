import React, { useState, useRef, useCallback } from 'react'
import { Users, AlertTriangle, AlertCircle, Calendar, Upload, Download, X, CheckCircle } from 'lucide-react'
import Papa from 'papaparse'
import MainLayout from '../layouts/MainLayout'
import studentService from '../services/studentService'
import { StudentRecord } from '../data/students'
import StatCard from '../components/common/StatCard'

interface ParsedData {
  data: Record<string, string>[]
  errors: string[]
  meta: { fields: string[]; rowCount: number }
}

const REQUIRED_COLUMNS = [
  'name', 'rollnumber', 'department', 'attendance', 'avgperformance',
  'mathscore', 'programmingscore', 'aimlscore', 'failedsubjects',
  'dayspresent', 'daysabsent', 'latecount', 'trend', 'remarks', 'risklevel'
]

const DataCenter: React.FC = () => {
  const [dragActive, setDragActive] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)
  const [missingColumns, setMissingColumns] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const students = studentService.getStudents()

  // Data quality metrics
  const totalRecords = students.length

  // Count missing values across ALL fields
  const countMissingValues = () => {
    let count = 0
    const fieldsToCheck: (keyof StudentRecord)[] = [
      'id', 'rollNumber', 'name', 'gender', 'age', 'department', 'year', 'section',
      'email', 'phone', 'attendance', 'mathScore', 'programmingScore', 'aimlScore',
      'overallScore', 'avgPerformance', 'daysPresent', 'daysAbsent', 'lateCount',
      'failedSubjects', 'riskLevel', 'trend', 'remarks', 'lastUpdated'
    ]
    
    students.forEach(s => {
      fieldsToCheck.forEach(field => {
        const value = s[field]
        if (value === null || value === undefined || value === '') {
          count++
        }
      })
    })
    return count
  }

  const missingValues = countMissingValues()

  // Count duplicate IDs (by rollNumber)
  const duplicateIds = students.length - new Set(students.map(s => s.rollNumber)).size

  // Last updated - current date formatted
  const lastUpdated = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

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
    setMissingColumns([])

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

        // Validate required columns (case-insensitive)
        const fieldsLower = fields.map(f => f.toLowerCase())
        const missing = REQUIRED_COLUMNS.filter(col => !fieldsLower.includes(col))
        
        if (missing.length > 0) {
          // Map back to proper case for display
          const missingDisplay = missing.map(m => {
            const originalField = fields.find(f => f.toLowerCase() === m)
            return originalField || m
          })
          setMissingColumns(missingDisplay)
          return
        }

        setParsedData({
          data,
          errors: [],
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

  // Map CSV row to StudentRecord
  const mapRowToStudent = (row: Record<string, string>, id: number): StudentRecord => {
    return {
      id,
      rollNumber: row.RollNumber || row.rollNumber || '',
      name: row.Name || row.name || '',
      gender: row.Gender || row.gender || 'Male',
      age: parseInt(row.Age || row.age) || 20,
      department: row.Department || row.department || '',
      year: row.Year || row.year || '1st Year',
      section: row.Section || row.section || 'A',
      email: row.Email || row.email || `${(row.RollNumber || row.rollNumber || '').toLowerCase()}@example.com`,
      phone: row.Phone || row.phone || '9999999999',
      attendance: parseInt(row.Attendance || row.attendance) || 0,
      mathScore: parseInt(row.MathScore || row.mathScore) || 0,
      programmingScore: parseInt(row.ProgrammingScore || row.programmingScore) || 0,
      aimlScore: parseInt(row.AIMLScore || row.aimlScore) || 0,
      overallScore: Math.round(parseFloat(row.AvgPerformance || row.avgPerformance) || 0),
      avgPerformance: parseFloat(row.AvgPerformance || row.avgPerformance) || 0,
      daysPresent: parseInt(row.DaysPresent || row.daysPresent) || 0,
      daysAbsent: parseInt(row.DaysAbsent || row.daysAbsent) || 0,
      lateCount: parseInt(row.LateCount || row.lateCount) || 0,
      failedSubjects: parseInt(row.FailedSubjects || row.failedSubjects) || 0,
      riskLevel: (row.RiskLevel || row.riskLevel) as StudentRecord['riskLevel'] || 'Low',
      trend: (row.Trend || row.trend) as StudentRecord['trend'] || 'Stable',
      remarks: row.Remarks || row.remarks || '',
      lastUpdated: new Date().toISOString().split('T')[0],
    }
  }

  // Replace data
  const handleReplace = () => {
    if (!parsedData) return

    const newStudents: StudentRecord[] = parsedData.data.map((row, idx) => 
      mapRowToStudent(row, idx + 1)
    )

    studentService.setStudents(newStudents)
    setImportSuccess(`Successfully imported ${newStudents.length} records (replaced existing data)`)
    setParsedData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Merge data
  const handleMerge = () => {
    if (!parsedData) return

    const existing = studentService.getStudents()
    const existingRollNumbers = new Set(existing.map(s => s.rollNumber))
    const maxId = existing.length > 0 ? Math.max(...existing.map(s => s.id)) : 0

    let added = 0
    let skipped = 0
    const updated = [...existing]

    parsedData.data.forEach((row, idx) => {
      const rollNumber = row.RollNumber || row.rollNumber || ''
      if (existingRollNumbers.has(rollNumber)) {
        skipped++
      } else {
        const newStudent = mapRowToStudent(row, maxId + idx + 1)
        updated.push(newStudent)
        added++
      }
    })

    studentService.setStudents(updated)
    setImportSuccess(`Merged: ${added} added, ${skipped} already existed (skipped)`)
    setParsedData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Cancel
  const handleCancel = () => {
    setParsedData(null)
    setParseError(null)
    setImportSuccess(null)
    setMissingColumns([])
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
    const headers = [
      'Name', 'RollNumber', 'Department', 'Attendance', 'AvgPerformance',
      'MathScore', 'ProgrammingScore', 'AIMLScore', 'FailedSubjects',
      'DaysPresent', 'DaysAbsent', 'LateCount', 'Trend', 'Remarks', 'RiskLevel'
    ]
    
    const template = [
      {
        Name: 'John Doe',
        RollNumber: 'STU001',
        Department: 'CSE',
        Attendance: '85',
        AvgPerformance: '82.3',
        MathScore: '80',
        ProgrammingScore: '85',
        AIMLScore: '82',
        FailedSubjects: '0',
        DaysPresent: '10',
        DaysAbsent: '2',
        LateCount: '1',
        Trend: 'Improving',
        Remarks: 'Good performance',
        RiskLevel: 'Low',
      },
      {
        Name: 'Jane Smith',
        RollNumber: 'STU002',
        Department: 'AI & ML',
        Attendance: '60',
        AvgPerformance: '55.0',
        MathScore: '55',
        ProgrammingScore: '58',
        AIMLScore: '52',
        FailedSubjects: '2',
        DaysPresent: '12',
        DaysAbsent: '8',
        LateCount: '3',
        Trend: 'Declining',
        Remarks: 'Needs attention',
        RiskLevel: 'High',
      },
    ]
    
    const csv = Papa.unparse(template, {
      columns: headers,
      header: true,
    })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'eduvision_student_template.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <MainLayout>
      <div className="space-y-5 page-enter">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Data Center
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Manage and import student data
          </p>
        </div>

        {/* Data Quality Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Records"
            value={totalRecords}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Missing Values"
            value={missingValues}
            icon={AlertTriangle}
            color="amber"
          />
          <StatCard
            title="Duplicate IDs"
            value={duplicateIds}
            icon={AlertCircle}
            color="red"
          />
          <StatCard
            title="Last Updated"
            value={lastUpdated}
            icon={Calendar}
            color="green"
          />
        </div>

        {/* Import Success */}
        {importSuccess && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-green-700 dark:text-green-300">Import Successful</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">{importSuccess}</p>
            </div>
          </div>
        )}

        {/* CSV Upload Section */}
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
              Drop CSV file here or click to browse
            </p>
          </div>

          {/* Missing Columns Error */}
          {missingColumns.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="font-medium text-red-700 dark:text-red-300 mb-2">
                Missing required columns:
              </p>
              <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 space-y-1">
                {missingColumns.map((col, idx) => (
                  <li key={idx}>{col}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Parse Error */}
          {parseError && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-red-700 dark:text-red-300">Import Error</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{parseError}</p>
              </div>
            </div>
          )}

          {/* Preview Table */}
          {parsedData && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  Showing {Math.min(10, parsedData.meta.rowCount)} of {parsedData.meta.rowCount} rows
                </span>
                <button onClick={handleCancel} className="text-neutral-400 hover:text-neutral-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                    <tr>
                      {parsedData.meta.fields.map((field) => (
                        <th key={field} className="px-3 py-2 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {parsedData.data.slice(0, 10).map((row, idx) => (
                      <tr key={idx}>
                        {parsedData.meta.fields.map((field) => (
                          <td key={field} className="px-3 py-2 text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                            {row[field] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Import Options */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleReplace}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors"
                >
                  Replace Data
                </button>
                <button
                  onClick={handleMerge}
                  className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 font-medium text-sm rounded-lg transition-colors"
                >
                  Merge Data
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Sample CSV Template
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
