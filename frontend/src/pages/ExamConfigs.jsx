import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsPlus, BsPencil, BsTrash } from 'react-icons/bs';
import { fetchExamConfigs, createExamConfig, updateExamConfig, deleteExamConfig } from '../store/slices/examConfigSlice.js';
import { useToast } from '../hooks/useToast.js';
import PageHeader from '../components/common/PageHeader.jsx';
import DataTable from '../components/common/DataTable.jsx';
import Modal from '../components/common/Modal.jsx';

const BLANK = { code: '', title: '', duration: 60, totalQuestions: 50, passMark: 70, negativeMarking: false };

function ExamConfigs() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { items, loading } = useSelector((s) => s.examConfigs);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const filtered = items.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));
  useEffect(() => { dispatch(fetchExamConfigs()); }, [dispatch]);

  const openAdd = () => { setEditItem(null); setForm(BLANK); setModalOpen(true); };
  const openEdit = (row) => { setEditItem(row); setForm({ code:row.code, title:row.title, duration:row.duration, totalQuestions:row.totalQuestions, passMark:row.passMark, negativeMarking:row.negativeMarking }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.code.trim() || !form.title.trim()) return toast.error('Code and title are required');
    setSaving(true);
    try {
      if (editItem) { await dispatch(updateExamConfig({ id:editItem._id, ...form })).unwrap(); toast.success('Exam config updated'); }
      else { await dispatch(createExamConfig(form)).unwrap(); toast.success('Exam config created'); }
      setModalOpen(false);
    } catch (err) { toast.error(err || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this config?')) return;
    try { await dispatch(deleteExamConfig(id)).unwrap(); toast.success('Config deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { key: 'code', label: 'Code', render: (val) => <span style={{ background:'rgba(79,110,247,0.1)',color:'var(--accent)',padding:'0.18rem 0.55rem',borderRadius:6,fontSize:'0.78rem',fontWeight:700 }}>{val}</span> },
    { key: 'title', label: 'Title', render: (val) => <strong style={{ fontSize:'0.85rem' }}>{val}</strong> },
    { key: 'duration', label: 'Duration', render: (val) => <span style={{ fontSize:'0.83rem' }}>{val} min</span> },
    { key: 'totalQuestions', label: 'Questions', render: (val) => <span style={{ fontSize:'0.83rem' }}>{val}</span> },
    { key: 'passMark', label: 'Pass Mark', render: (val) => <span style={{ color:'var(--pass-green)',fontWeight:600,fontSize:'0.83rem' }}>{val}%</span> },
    { key: 'negativeMarking', label: 'Neg. Marking', render: (val) => <span style={{ color:val?'var(--fail-red)':'var(--text-muted)',fontSize:'0.83rem' }}>{val?'Yes':'No'}</span> },
    { key: '_id', label: 'Actions', style: { width:90,textAlign:'center' },
      render: (_, row) => <div className="d-flex gap-1 justify-content-center"><button className="btn-icon" onClick={() => openEdit(row)}><BsPencil /></button><button className="btn-icon danger" onClick={() => handleDelete(row._id)}><BsTrash /></button></div>
    },
  ];

  return (
    <>
      <PageHeader title="Exam Configurations" subtitle="Set up exam rules and parameters" breadcrumb={['Dashboard','Exam Configs']}
        actions={<button className="btn-primary-custom" onClick={openAdd}><BsPlus /> Add Config</button>} />
      <DataTable title={`All Configs (${filtered.length})`} columns={columns} data={filtered} loading={loading}
        searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search configs..." emptyMessage="No exam configurations found." />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Exam Config' : 'Add Exam Config'}
        footer={<><button className="btn-outline-custom" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary-custom" onClick={handleSave} disabled={saving}>{saving ? <span className="loading-spinner" /> : (editItem ? 'Update' : 'Save')}</button></>}>
        <div className="row g-3 mb-3">
          <div className="col-sm-4"><label className="form-label-custom">Code *</label><input type="text" className="form-control-custom" placeholder="e.g. MCQ-01" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} /></div>
          <div className="col-sm-8"><label className="form-label-custom">Title *</label><input type="text" className="form-control-custom" placeholder="Exam title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-sm-4"><label className="form-label-custom">Duration (min)</label><input type="number" className="form-control-custom" min={1} value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: +e.target.value }))} /></div>
          <div className="col-sm-4"><label className="form-label-custom">Total Questions</label><input type="number" className="form-control-custom" min={1} value={form.totalQuestions} onChange={(e) => setForm((f) => ({ ...f, totalQuestions: +e.target.value }))} /></div>
          <div className="col-sm-4"><label className="form-label-custom">Pass Mark (%)</label><input type="number" className="form-control-custom" min={0} max={100} value={form.passMark} onChange={(e) => setForm((f) => ({ ...f, passMark: +e.target.value }))} /></div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <input type="checkbox" id="negMark" checked={form.negativeMarking} onChange={(e) => setForm((f) => ({ ...f, negativeMarking: e.target.checked }))} style={{ accentColor:'var(--accent)' }} />
          <label htmlFor="negMark" className="form-label-custom mb-0">Enable Negative Marking</label>
        </div>
      </Modal>
    </>
  );
}

export default ExamConfigs;
