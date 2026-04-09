import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  BsCloudUpload, BsFileEarmarkCode, BsX,
  BsCheckCircle, BsExclamationTriangle, BsInfoCircle, BsCode,
} from 'react-icons/bs';
import { importQuestions } from '../store/slices/questionSlice.js';
import { useToast } from '../hooks/useToast.js';
import PageHeader from '../components/common/PageHeader.jsx';

const SAMPLE_JSON = JSON.stringify([
  {
    subjectId: "SUBJECT_ID_HERE",
    examType: "MCQ",
    text: "What is 2 + 2?",
    options: [
      { label: "A", value: "3" },
      { label: "B", value: "4" },
      { label: "C", value: "5" },
      { label: "D", value: "6" },
    ],
    correctOption: 1,
    difficulty: "Easy",
    isActive: true,
  },
], null, 2);

const INSTRUCTIONS = [
  { code: null, text: 'File must be in ', bold: '.json', end: ' format only' },
  { code: null, text: 'Root element must be an ', bold: 'array', end: ' of question objects' },
  { code: 'text, examType, difficulty', text: 'Each question must include ', end: '' },
  { code: 'subjectId', text: '', end: ' must be a valid MongoDB ObjectId' },
  { code: 'correctOption', text: '', end: ' is the 0-based index of the correct answer' },
  { code: 'options', text: '', end: ' is an array of { label, value } objects' },
];

/* ── Reusable modal ── */
function Modal({ title, onClose, children, width = 560 }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.38)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--card-bg)', borderRadius: 14,
        border: '1px solid var(--border-color)',
        width: '100%', maxWidth: width, maxHeight: '88vh',
        overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--border-color)',
          position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 1,
        }}>
          <h6 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{title}</h6>
          <button className="btn-icon" onClick={onClose}><BsX /></button>
        </div>
        <div style={{ padding: '1.25rem' }}>{children}</div>
      </div>
    </div>
  );
}

function ImportQuestions() {
  const dispatch = useDispatch();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [jsonModal, setJsonModal] = useState(false);

  const handleFile = (f) => {
    setError('');
    setParsed(null);
    setResult(null);
    if (!f) return;
    if (f.type !== 'application/json' && !f.name.endsWith('.json')) {
      setError('Invalid file type. Please upload a .json file only.');
      setFile(null);
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) { setError('JSON must be an array of question objects.'); setFile(null); return; }
        if (data.length === 0) { setError('The file contains no questions.'); return; }
        setParsed(data);
      } catch {
        setError('Invalid JSON format. Please check your file.');
        setFile(null);
      }
    };
    reader.readAsText(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleImport = async () => {
    if (!parsed) return;
    setUploading(true);
    try {
      const res = await dispatch(importQuestions(parsed)).unwrap();
      setResult({ imported: res.imported });
      toast.success(`${res.imported} questions imported successfully!`, 'Import Complete');
      setFile(null);
      setParsed(null);
    } catch (err) {
      toast.error(err || 'Import failed. Check console for details.');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setParsed(null);
    setError('');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_JSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sample_questions.json'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Import Questions"
        subtitle="Bulk import questions from a JSON file"
        breadcrumb={['Dashboard', 'Import Questions']}
      />

      {/* ── One row: dropzone left, instructions right ── */}
      <div className="row g-4">
        {/* LEFT — Upload card */}
        <div className="col-lg-7">
          <div className="chart-card mb-3">
            <div className="chart-card-header">
              <h6>Upload JSON File</h6>
              {/* JSON Format button opens modal */}
              <button
                className="btn-outline-custom"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.7rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                onClick={() => setJsonModal(true)}
              >
                <BsCode /> JSON Format
              </button>
            </div>

            {!file ? (
              <div
                className={`import-dropzone ${dragOver ? 'drag-over' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <div className="drop-icon"><BsCloudUpload /></div>
                <h6>Drag & drop your JSON file here</h6>
                <p>or click to browse — only .json files accepted</p>
                <button className="btn-primary-custom mt-3" style={{ pointerEvents: 'none' }}>
                  Browse File
                </button>
              </div>
            ) : (
              <div style={{ padding: '1rem' }}>
                {/* File info */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem', borderRadius: 10,
                  background: 'var(--main-bg)', border: '1px solid var(--border-color)',
                  marginBottom: '1rem',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: 'rgba(79,110,247,0.1)', color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                  }}>
                    <BsFileEarmarkCode />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{file.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {(file.size / 1024).toFixed(1)} KB
                      {parsed && <span style={{ color: 'var(--pass-green)', marginLeft: '0.5rem' }}>
                        ✓ {parsed.length} questions ready
                      </span>}
                    </div>
                  </div>
                  <button className="btn-icon danger" onClick={handleClear}><BsX /></button>
                </div>

                {/* Preview table */}
                {parsed && parsed.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      Preview (first 3)
                    </div>
                    <div className="table-card">
                      <table className="data-table">
                        <thead>
                          <tr><th>#</th><th>Question</th><th>Type</th><th>Difficulty</th></tr>
                        </thead>
                        <tbody>
                          {parsed.slice(0, 3).map((q, i) => (
                            <tr key={i}>
                              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{i + 1}</td>
                              <td style={{ fontSize: '0.82rem', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.text}</td>
                              <td style={{ fontSize: '0.82rem' }}>{q.examType || 'MCQ'}</td>
                              <td><span className="badge-pill easy" style={{ fontSize: '0.7rem' }}>{q.difficulty || 'Medium'}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {parsed.length > 3 && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem', textAlign: 'center' }}>
                        ...and {parsed.length - 3} more questions
                      </p>
                    )}
                  </div>
                )}

                <div className="d-flex gap-2">
                  <button className="btn-outline-custom" onClick={handleClear}>Clear</button>
                  <button
                    className="btn-primary-custom"
                    onClick={handleImport}
                    disabled={!parsed || uploading}
                    style={{ flex: 1 }}
                  >
                    {uploading
                      ? <><span className="loading-spinner" /> Importing...</>
                      : <><BsCloudUpload /> Import {parsed?.length} Questions</>
                    }
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.75rem 1rem', borderRadius: 8, margin: '0.75rem',
                background: 'rgba(240,82,82,0.08)', color: 'var(--fail-red)',
                border: '1px solid rgba(240,82,82,0.2)',
              }}>
                <BsExclamationTriangle />
                <span style={{ fontSize: '0.83rem' }}>{error}</span>
              </div>
            )}

            {result && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.75rem 1rem', borderRadius: 8, margin: '0.75rem',
                background: 'rgba(0,200,150,0.08)', color: 'var(--pass-green)',
                border: '1px solid rgba(0,200,150,0.2)',
              }}>
                <BsCheckCircle />
                <span style={{ fontSize: '0.83rem', fontWeight: 600 }}>
                  Successfully imported {result.imported} questions!
                </span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
        </div>

        {/* RIGHT — Instructions (compact, same row) */}
        <div className="col-lg-5">
          <div className="chart-card" style={{ height: '100%' }}>
            <div className="chart-card-header">
              <h6>Instructions</h6>
              <button
                className="btn-outline-custom"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.7rem' }}
                onClick={downloadSample}
              >
                Download Sample
              </button>
            </div>
            <ul style={{
              fontSize: '0.83rem', color: 'var(--text-muted)',
              lineHeight: 1.9, paddingLeft: '1.2rem', marginBottom: 0,
            }}>
              <li>File must be in <strong>.json</strong> format only</li>
              <li>Root element must be an <strong>array</strong> of question objects</li>
              <li>Each question must include <code>text</code>, <code>examType</code>, and <code>difficulty</code></li>
              <li><code>subjectId</code> must be a valid MongoDB ObjectId</li>
              <li><code>correctOption</code> is the 0-based index of the correct answer</li>
              <li><code>options</code> is an array of <code>{"{ label, value }"}</code> objects</li>
            </ul>

            {/* Quick tip */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
              marginTop: '1rem', padding: '0.7rem 0.9rem', borderRadius: 8,
              background: 'rgba(79,110,247,0.07)', border: '1px solid rgba(79,110,247,0.15)',
            }}>
              <BsInfoCircle style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Click <strong>JSON Format</strong> on the upload card to see a sample structure and download a template.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── JSON Format Modal ── */}
      {jsonModal && (
        <Modal title="JSON Format — Sample Structure" onClose={() => setJsonModal(false)}>
          <div style={{
            fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.6,
          }}>
            Your file must export an <strong>array</strong> of objects. Each object represents one question.
            Here's the expected structure:
          </div>

          <pre style={{
            fontSize: '0.73rem', color: 'var(--text-muted)',
            background: 'var(--main-bg)', padding: '1rem', borderRadius: 8,
            overflow: 'auto', maxHeight: 340, margin: 0,
            border: '1px solid var(--border-color)', lineHeight: 1.65,
          }}>
            {SAMPLE_JSON}
          </pre>

          {/* Field reference */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
              Field Reference
            </div>
            <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Field', 'Type', 'Required', 'Notes'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.35rem 0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['subjectId', 'string', '✓', 'Valid MongoDB ObjectId'],
                  ['examType', 'string', '✓', '"MCQ", "CQ", etc.'],
                  ['text', 'string', '✓', 'Question body'],
                  ['options', 'array', '✓ (MCQ)', '[{ label, value }, ...]'],
                  ['correctOption', 'number', '✓ (MCQ)', '0-based index'],
                  ['difficulty', 'string', '✓', '"Easy", "Medium", "Hard"'],
                  ['isActive', 'boolean', '—', 'Defaults to true'],
                ].map(([f, t, r, n]) => (
                  <tr key={f}>
                    <td style={{ padding: '0.35rem 0.5rem', borderBottom: '1px solid var(--border-color)' }}><code>{f}</code></td>
                    <td style={{ padding: '0.35rem 0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>{t}</td>
                    <td style={{ padding: '0.35rem 0.5rem', borderBottom: '1px solid var(--border-color)', color: r === '✓' ? 'var(--pass-green)' : 'var(--text-muted)' }}>{r}</td>
                    <td style={{ padding: '0.35rem 0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button className="btn-outline-custom" onClick={downloadSample}>Download Sample</button>
            <button className="btn-primary-custom" onClick={() => setJsonModal(false)}>Got it</button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default ImportQuestions;