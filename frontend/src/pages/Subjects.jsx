import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsPlus, BsPencil, BsTrash } from 'react-icons/bs';
import { fetchSubjects, createSubject, updateSubject, deleteSubject } from '../store/slices/subjectSlice.js';
import { useToast } from '../hooks/useToast.js';
import PageHeader from '../components/common/PageHeader.jsx';
import DataTable from '../components/common/DataTable.jsx';
import Modal from '../components/common/Modal.jsx';
import Badge from '../components/common/Badge.jsx';

const BLANK = { name: '', slug: '', description: '', isActive: true };

function Subjects() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { items, loading } = useSelector((s) => s.subjects);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const filtered = items.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  useEffect(() => { dispatch(fetchSubjects()); }, [dispatch]);

  const autoSlug = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const openAdd = () => { setEditItem(null); setForm(BLANK); setModalOpen(true); };
  const openEdit = (row) => { setEditItem(row); setForm({ name:row.name, slug:row.slug, description:row.description||'', isActive:row.isActive }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Subject name is required');
    setSaving(true);
    try {
      if (editItem) { await dispatch(updateSubject({ id:editItem._id, ...form })).unwrap(); toast.success('Subject updated'); }
      else { await dispatch(createSubject(form)).unwrap(); toast.success('Subject created'); }
      setModalOpen(false);
    } catch (err) { toast.error(err || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try { await dispatch(deleteSubject(id)).unwrap(); toast.success('Subject deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (val) => <strong style={{ fontSize:'0.85rem' }}>{val}</strong> },
    { key: 'slug', label: 'Slug', render: (val) => <code style={{ fontSize:'0.78rem',color:'var(--text-muted)' }}>{val}</code> },
    { key: 'description', label: 'Description', render: (val) => <span style={{ fontSize:'0.83rem',color:'var(--text-muted)' }}>{val||'—'}</span> },
    { key: 'isActive', label: 'Status', render: (val) => <Badge label={val ? 'Active' : 'Inactive'} /> },
    { key: '_id', label: 'Actions', style: { width:90,textAlign:'center' },
      render: (_, row) => <div className="d-flex gap-1 justify-content-center"><button className="btn-icon" onClick={() => openEdit(row)}><BsPencil /></button><button className="btn-icon danger" onClick={() => handleDelete(row._id)}><BsTrash /></button></div>
    },
  ];

  return (
    <>
      <PageHeader title="Subjects" subtitle="Manage exam subjects" breadcrumb={['Dashboard','Subjects']}
        actions={<button className="btn-primary-custom" onClick={openAdd}><BsPlus /> Add Subject</button>} />
      <DataTable title={`All Subjects (${filtered.length})`} columns={columns} data={filtered} loading={loading}
        searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search subjects..." emptyMessage="No subjects found. Add one to get started." />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Subject' : 'Add Subject'}
        footer={<><button className="btn-outline-custom" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary-custom" onClick={handleSave} disabled={saving}>{saving ? <span className="loading-spinner" /> : (editItem ? 'Update' : 'Save')}</button></>}>
        <div className="form-group-custom">
          <label className="form-label-custom">Subject Name *</label>
          <input type="text" className="form-control-custom" placeholder="e.g. Mathematics" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: autoSlug(e.target.value) }))} />
        </div>
        <div className="form-group-custom">
          <label className="form-label-custom">Slug</label>
          <input type="text" className="form-control-custom" placeholder="auto-generated" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
        </div>
        <div className="form-group-custom">
          <label className="form-label-custom">Description</label>
          <textarea className="form-control-custom" rows={2} placeholder="Brief description..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="d-flex align-items-center gap-2">
          <input type="checkbox" id="subActive" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} style={{ accentColor:'var(--accent)' }} />
          <label htmlFor="subActive" className="form-label-custom mb-0">Active</label>
        </div>
      </Modal>
    </>
  );
}

export default Subjects;
