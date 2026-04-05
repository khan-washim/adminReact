import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsPlus, BsPencil, BsTrash, BsKeyFill } from 'react-icons/bs';
import { fetchUsers, createUser, updateUser, deleteUser, resetUserPassword } from '../store/slices/userSlice.js';
import { useToast } from '../hooks/useToast.js';
import PageHeader from '../components/common/PageHeader.jsx';
import DataTable from '../components/common/DataTable.jsx';
import Modal from '../components/common/Modal.jsx';
import Badge from '../components/common/Badge.jsx';

const BLANK = { name: '', email: '', role: 'User', status: 'Active' };

function Users() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { items, total, page, pages, loading } = useSelector((s) => s.users);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers({ search, role: filterRole, status: filterStatus }));
  }, [dispatch, search, filterRole, filterStatus]);

  const openAdd = () => { setEditItem(null); setForm(BLANK); setModalOpen(true); };
  const openEdit = (row) => { setEditItem(row); setForm({ name:row.name, email:row.email, role:row.role, status:row.status }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) return toast.error('Name and email are required');
    setSaving(true);
    try {
      if (editItem) {
        await dispatch(updateUser({ id: editItem._id, ...form })).unwrap();
        toast.success('User updated successfully');
      } else {
        await dispatch(createUser(form)).unwrap();
        toast.success('User created successfully');
      }
      setModalOpen(false);
    } catch (err) { toast.error(err || 'Failed to save user'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await dispatch(deleteUser(id)).unwrap(); toast.success('User deleted'); }
    catch { toast.error('Failed to delete user'); }
  };

  const handleResetPassword = async (id) => {
    try { await dispatch(resetUserPassword(id)).unwrap(); toast.success('Password reset email sent successfully', 'Reset Password'); }
    catch { toast.error('Failed to send reset email'); }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (val, row) => (
      <div className="d-flex align-items-center gap-2">
        <div style={{ width:30,height:30,borderRadius:'50%',background:row.role==='Admin'?'var(--accent)':'rgba(79,110,247,0.2)',color:row.role==='Admin'?'#fff':'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.72rem',fontWeight:700,flexShrink:0 }}>
          {val?.[0]?.toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize:'0.85rem',fontWeight:600 }}>{val}</div>
          <div style={{ fontSize:'0.75rem',color:'var(--text-muted)' }}>{row.email}</div>
        </div>
      </div>
    )},
    { key: 'role', label: 'Role', render: (val) => <Badge label={val} /> },
    { key: 'status', label: 'Status', render: (val) => <Badge label={val} /> },
    { key: 'createdAt', label: 'Joined', render: (val) => <span style={{ fontSize:'0.82rem',color:'var(--text-muted)' }}>{val ? new Date(val).toLocaleDateString() : '—'}</span> },
    { key: '_id', label: 'Actions', style: { width:120, textAlign:'center' },
      render: (_, row) => (
        <div className="d-flex gap-1 justify-content-center">
          <button className="btn-icon success" title="Reset Password" onClick={() => handleResetPassword(row._id)}><BsKeyFill /></button>
          <button className="btn-icon" onClick={() => openEdit(row)}><BsPencil /></button>
          <button className="btn-icon danger" onClick={() => handleDelete(row._id)}><BsTrash /></button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="User Management" subtitle="Manage system users and permissions" breadcrumb={['Dashboard','Users']}
        actions={<button className="btn-primary-custom" onClick={openAdd}><BsPlus /> Add User</button>} />

      <DataTable title={`All Users (${total})`} columns={columns} data={items} loading={loading}
        searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search users..."
        total={total} page={page} pages={pages}
        onPageChange={(p) => dispatch(fetchUsers({ page:p, search, role:filterRole, status:filterStatus }))}
        emptyMessage="No users found."
        toolbar={
          <>
            <select className="filter-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="">All Roles</option><option>Admin</option><option>User</option>
            </select>
            <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option><option>Active</option><option>Inactive</option>
            </select>
          </>
        }
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit User' : 'Add New User'}
        footer={<><button className="btn-outline-custom" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary-custom" onClick={handleSave} disabled={saving}>{saving ? <span className="loading-spinner" /> : (editItem ? 'Update' : 'Save')}</button></>}>
        <div className="form-group-custom">
          <label className="form-label-custom">Full Name *</label>
          <input type="text" className="form-control-custom" placeholder="Enter full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="form-group-custom">
          <label className="form-label-custom">Email Address *</label>
          <input type="email" className="form-control-custom" placeholder="Enter email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="row g-3">
          <div className="col-sm-6">
            <label className="form-label-custom">Role</label>
            <select className="form-control-custom" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              <option>User</option><option>Admin</option>
            </select>
          </div>
          <div className="col-sm-6">
            <label className="form-label-custom">Status</label>
            <select className="form-control-custom" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <option>Active</option><option>Inactive</option>
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Users;
