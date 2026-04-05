import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../store/slices/questionSlice.js';
import { fetchSubjects } from '../store/slices/subjectSlice.js';
import PageHeader from '../components/common/PageHeader.jsx';
import DataTable from '../components/common/DataTable.jsx';
import Badge from '../components/common/Badge.jsx';

function UserQuestions() {
  const dispatch = useDispatch();
  const { items, total, page, pages, loading } = useSelector((s) => s.questions);
  const { items: subjects } = useSelector((s) => s.subjects);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterDiff, setFilterDiff] = useState('');

  useEffect(() => {
    dispatch(fetchQuestions({ search, subject: filterSubject, difficulty: filterDiff }));
    dispatch(fetchSubjects());
  }, [dispatch, search, filterSubject, filterDiff]);

  const columns = [
    { key: 'text', label: 'Question', render: (val) => <span style={{ fontSize:'0.83rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', maxWidth:340 }}>{val}</span> },
    { key: 'subjectId', label: 'Subject', render: (val) => <span style={{ fontSize:'0.83rem' }}>{val?.name || '—'}</span> },
    { key: 'examType', label: 'Type', render: (val) => <span style={{ fontSize:'0.83rem' }}>{val}</span> },
    { key: 'difficulty', label: 'Difficulty', render: (val) => <Badge label={val} /> },
    { key: 'options', label: 'Options', render: (val) => <span style={{ fontSize:'0.83rem',color:'var(--text-muted)' }}>{val?.length || 0} options</span> },
    { key: 'isActive', label: 'Status', render: (val) => <Badge label={val ? 'Active' : 'Inactive'} /> },
  ];

  return (
    <>
      <PageHeader title="User Questions" subtitle="Read-only view of questions assigned to users" breadcrumb={['Dashboard','User Questions']} />
      <DataTable
        title={`User Questions (${total})`} columns={columns} data={items} loading={loading}
        searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search questions..."
        total={total} page={page} pages={pages}
        onPageChange={(p) => dispatch(fetchQuestions({ page:p, search, subject:filterSubject, difficulty:filterDiff }))}
        emptyMessage="No questions available."
        toolbar={
          <>
            <select className="filter-select" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
              <option value="">All Subjects</option>
              {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
            <select className="filter-select" value={filterDiff} onChange={(e) => setFilterDiff(e.target.value)}>
              <option value="">All Difficulties</option>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </>
        }
      />
    </>
  );
}

export default UserQuestions;
