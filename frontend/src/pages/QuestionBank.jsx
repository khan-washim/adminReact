import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsPlus, BsPencil, BsTrash } from 'react-icons/bs';
import { fetchQuestions, createQuestion, updateQuestion, deleteQuestion } from '../store/slices/questionSlice.js';
import { fetchSubjects } from '../store/slices/subjectSlice.js';
import { useToast } from '../hooks/useToast.js';
import PageHeader from '../components/common/PageHeader.jsx';
import DataTable from '../components/common/DataTable.jsx';
import Modal from '../components/common/Modal.jsx';
import Badge from '../components/common/Badge.jsx';

const BLANK_FORM = {
  text: '', subjectId: '', examType: 'MCQ', difficulty: 'Medium',
  options: [
    { label: 'A', value: '' }, { label: 'B', value: '' },
    { label: 'C', value: '' }, { label: 'D', value: '' },
  ],
  correctOption: 0, isActive: true,
};

function QuestionBank() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { items, total, page, pages, loading } = useSelector((s) => s.questions);
  const { items: subjects } = useSelector((s) => s.subjects);

  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchQuestions({ search, subject: filterSubject, examType: filterType, difficulty: filterDiff }));
    dispatch(fetchSubjects());
  }, [dispatch, search, filterSubject, filterType, filterDiff]);

  const openAdd = () => { setEditItem(null); setForm(BLANK_FORM); setModalOpen(true); };
  const openEdit = (row) => {
    setEditItem(row);
    setForm({
      text: row.text, subjectId: row.subjectId?._id || row.subjectId || '',
      examType: row.examType, difficulty: row.difficulty,
      options: row.options?.length ? row.options : BLANK_FORM.options,
      correctOption: row.correctOption || 0, isActive: row.isActive,
    });
    setModalOpen(true);
  };

  const handleOptionChange = (i, val) => {
    const opts = [...form.options];
    opts[i] = { ...opts[i], value: val };
    setForm((f) => ({ ...f, options: opts }));
  };

  const addOption = () => {
    const labels = ['A','B','C','D','E','F'];
    setForm((f) => ({ ...f, options: [...f.options, { label: labels[f.options.length] || String(f.options.length+1), value: '' }] }));
  };

  const removeOption = (i) => {
    if (form.options.length <= 2) return;
    setForm((f) => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }));
  };

  const handleSave = async () => {
    if (!form.text.trim()) return toast.error('Question text is required');
    if (!form.subjectId) return toast.error('Please select a subject');
    setSaving(true);
    try {
      if (editItem) {
        await dispatch(updateQuestion({ id: editItem._id, ...form })).unwrap();
        toast.success('Question updated successfully');
      } else {
        await dispatch(createQuestion(form)).unwrap();
        toast.success('Question created successfully');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err || 'Failed to save question');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await dispatch(deleteQuestion(id)).unwrap();
      toast.success('Question deleted');
    } catch { toast.error('Failed to delete question'); }
  };

  const columns = [
    { key: 'text', label: 'Question', render: (val) => <span style={{ fontSize:'0.83rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', maxWidth:340 }}>{val}</span> },
    { key: 'subjectId', label: 'Subject', render: (val) => <span style={{ fontSize:'0.83rem' }}>{val?.name || '—'}</span> },
    { key: 'examType', label: 'Type', render: (val) => <span style={{ fontSize:'0.83rem' }}>{val}</span> },
    { key: 'difficulty', label: 'Difficulty', render: (val) => <Badge label={val} /> },
    { key: 'isActive', label: 'Status', render: (val) => <Badge label={val ? 'Active' : 'Inactive'} /> },
    { key: '_id', label: 'Actions', style: { width: 90, textAlign: 'center' },
      render: (_, row) => (
        <div className="d-flex gap-1 justify-content-center">
          <button className="btn-icon" onClick={() => openEdit(row)}><BsPencil /></button>
          <button className="btn-icon danger" onClick={() => handleDelete(row._id)}><BsTrash /></button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Question Bank" subtitle="Manage all exam questions" breadcrumb={['Dashboard','Question Bank']}
        actions={<button className="btn-primary-custom" onClick={openAdd}><BsPlus /> Add Question</button>} />

      <DataTable
        title={`All Questions (${total})`} columns={columns} data={items} loading={loading}
        searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search questions..."
        total={total} page={page} pages={pages}
        onPageChange={(p) => dispatch(fetchQuestions({ page:p, search, subject:filterSubject, examType:filterType, difficulty:filterDiff }))}
        emptyMessage="No questions found. Click 'Add Question' to create one."
        toolbar={
          <>
            <select className="filter-select" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
              <option value="">All Subjects</option>
              {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
            <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All Types</option>
              <option>MCQ</option><option>True/False</option><option>Fill in Blank</option>
            </select>
            <select className="filter-select" value={filterDiff} onChange={(e) => setFilterDiff(e.target.value)}>
              <option value="">All Difficulties</option>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </>
        }
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Question' : 'Add New Question'} size="lg"
        footer={<><button className="btn-outline-custom" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary-custom" onClick={handleSave} disabled={saving}>{saving ? <span className="loading-spinner" /> : (editItem ? 'Update' : 'Save')}</button></>}>
        <div className="form-group-custom">
          <label className="form-label-custom">Question Text *</label>
          <textarea className="form-control-custom" rows={3} placeholder="Enter the question..." value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} />
        </div>
        <div className="row g-3 mb-3">
          <div className="col-sm-4">
            <label className="form-label-custom">Subject *</label>
            <select className="form-control-custom" value={form.subjectId} onChange={(e) => setForm((f) => ({ ...f, subjectId: e.target.value }))}>
              <option value="">Select Subject</option>
              {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div className="col-sm-4">
            <label className="form-label-custom">Exam Type</label>
            <select className="form-control-custom" value={form.examType} onChange={(e) => setForm((f) => ({ ...f, examType: e.target.value }))}>
              <option>MCQ</option><option>True/False</option><option>Fill in Blank</option><option>Short Answer</option>
            </select>
          </div>
          <div className="col-sm-4">
            <label className="form-label-custom">Difficulty</label>
            <select className="form-control-custom" value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </div>
        </div>
        <div className="form-group-custom">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <label className="form-label-custom mb-0">Answer Options <span style={{ color:'var(--text-muted)',fontWeight:400 }}>(select correct)</span></label>
            <button className="btn-outline-custom" style={{ padding:'0.25rem 0.6rem',fontSize:'0.75rem' }} onClick={addOption}><BsPlus /> Add Option</button>
          </div>
          {form.options.map((opt, i) => (
            <div key={i} className="option-row">
              <input type="radio" className="option-radio" name="correctOption" checked={form.correctOption === i} onChange={() => setForm((f) => ({ ...f, correctOption: i }))} />
              <span style={{ fontSize:'0.8rem',fontWeight:700,color:'var(--accent)',width:18,flexShrink:0 }}>{opt.label}</span>
              <input type="text" className="option-input" placeholder={`Option ${opt.label}`} value={opt.value} onChange={(e) => handleOptionChange(i, e.target.value)} />
              {form.options.length > 2 && <button className="btn-icon danger" onClick={() => removeOption(i)}><BsTrash /></button>}
            </div>
          ))}
        </div>
        <div className="d-flex align-items-center gap-2">
          <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} style={{ accentColor:'var(--accent)' }} />
          <label htmlFor="isActive" className="form-label-custom mb-0">Active</label>
        </div>
      </Modal>
    </>
  );
}

export default QuestionBank;
