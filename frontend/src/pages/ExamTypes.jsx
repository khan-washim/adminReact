import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsPlus, BsPencil, BsTrash } from 'react-icons/bs';
import { fetchExamTypes, createExamType, updateExamType, deleteExamType } from '../store/slices/examTypeSlice.js';
import { useToast } from '../hooks/useToast.js';
import PageHeader from '../components/common/PageHeader.jsx';
import DataTable from '../components/common/DataTable.jsx';
import Modal from '../components/common/Modal.jsx';

const BLANK = { name: '', slug: '', order: 0 };
const autoSlug = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

function ExamTypes() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { items, loading } = useSelector((s) => s.examTypes);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const filtered = items.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
  useEffect(() => { dispatch(fetchExamTypes()); }, [dispatch]);

  const openAdd = () => { setEditItem(null); setForm(BLANK); setModalOpen(true); };
  const openEdit = (row) => { setEditItem(row); setForm({ name:row.name, slug:row.slug, order:row.order }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      if (editItem) { await dispatch(updateExamType({ id:editItem._id, ...form })).unwrap(); toast.success('Exam type updated'); }
      else { await dispatch(createExamType(form)).unwrap(); toast.success('Exam type created'); }
      setModalOpen(false);
    } catch (err) { toast.error(err || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exam type?')) return;
    try { await dispatch(deleteExamType(id)).unwrap(); toast.success('Exam type deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { key: 'order', label: '#', render: (val) => <span style={{ color:'var(--text-muted)',fontSize:'0.82rem' }}>{val}</span> },
    { key: 'name', label: 'Name', render: (val) => <strong style={{ fontSize:'0.85rem' }}>{val}</strong> },
    { key: 'slug', label: 'Slug', render: (val) => <code style={{ fontSize:'0.78rem',color:'var(--text-muted)' }}>{val}</code> },
    { key: '_id', label: 'Actions', style: { width:90,textAlign:'center' },
      render: (_, row) => <div className="d-flex gap-1 justify-content-center"><button className="btn-icon" onClick={() => openEdit(row)}><BsPencil /></button><button className="btn-icon danger" onClick={() => handleDelete(row._id)}><BsTrash /></button></div>
    },
  ];

  return (
    <>
      <PageHeader title="Exam Types" subtitle="Define the types of exams available" breadcrumb={['Dashboard','Exam Types']}
        actions={<button className="btn-primary-custom" onClick={openAdd}><BsPlus /> Add Type</button>} />
      <DataTable title={`All Exam Types (${filtered.length})`} columns={columns} data={filtered} loading={loading}
        searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search types..." emptyMessage="No exam types found." />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Exam Type' : 'Add Exam Type'}
        footer={<><button className="btn-outline-custom" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary-custom" onClick={handleSave} disabled={saving}>{saving ? <span className="loading-spinner" /> : (editItem ? 'Update' : 'Save')}</button></>}>
        <div className="form-group-custom">
          <label className="form-label-custom">Type Name *</label>
          <input type="text" className="form-control-custom" placeholder="e.g. Multiple Choice" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: autoSlug(e.target.value) }))} />
        </div>
        <div className="form-group-custom">
          <label className="form-label-custom">Slug</label>
          <input type="text" className="form-control-custom" placeholder="auto-generated" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
        </div>
        <div className="form-group-custom">
          <label className="form-label-custom">Order</label>
          <input type="number" className="form-control-custom" min={0} value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: +e.target.value }))} />
        </div>
      </Modal>
    </>
  );
}

export default ExamTypes;
