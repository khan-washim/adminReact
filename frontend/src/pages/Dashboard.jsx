import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { BsQuestionCircleFill, BsPersonFill, BsGraphUp, BsCheckCircleFill } from 'react-icons/bs';
import { fetchDashboardStats } from '../store/slices/dashboardSlice.js';
import StatCard from '../components/common/StatCard.jsx';
import ChartCard from '../components/common/ChartCard.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import Badge from '../components/common/Badge.jsx';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartDefaults = {
  plugins: { legend: { display: false } },
  maintainAspectRatio: false,
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#718096' } },
    y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 }, color: '#718096' } },
  },
};

function Dashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((s) => s.dashboard);

  useEffect(() => { dispatch(fetchDashboardStats()); }, [dispatch]);

  if (loading && !stats) {
    return (
      <>
        <PageHeader title="Dashboard" subtitle="Loading your data..." breadcrumb={['Dashboard']} />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
          <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
        </div>
      </>
    );
  }

  if (error && !stats) {
    return (
      <>
        <PageHeader title="Dashboard" breadcrumb={['Dashboard']} />
        <div className="chart-card text-center" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠️</div>
          <h6 style={{ color: 'var(--fail-red)' }}>Failed to load dashboard data</h6>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
          <button className="btn-primary-custom" onClick={() => dispatch(fetchDashboardStats())}>Retry</button>
        </div>
      </>
    );
  }

  if (!stats) return null;
  const { kpis, userGrowth, attemptsTrend, passRateDist, topSubjects, recentAttempts } = stats;

  const lineData = {
    labels: userGrowth.labels,
    datasets: [{ label: 'New Users', data: userGrowth.data, borderColor: '#4f6ef7', backgroundColor: 'rgba(79,110,247,0.08)', tension: 0.4, fill: true, pointBackgroundColor: '#4f6ef7', pointRadius: 4 }],
  };
  const barData = {
    labels: attemptsTrend.labels,
    datasets: [{ label: 'Attempts', data: attemptsTrend.data, backgroundColor: 'rgba(79,110,247,0.75)', borderRadius: 6, borderSkipped: false }],
  };
  const doughnutData = {
    labels: passRateDist.labels,
    datasets: [{ data: passRateDist.data, backgroundColor: ['#00c896', '#f05252'], borderWidth: 0, hoverOffset: 6 }],
  };

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening today." breadcrumb={['Dashboard']} />
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><StatCard icon={<BsQuestionCircleFill />} label="Total Questions" value={kpis.totalQuestions} color="blue" badge="+12%" badgeType="up" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon={<BsPersonFill />} label="Total Users" value={kpis.totalUsers} color="green" badge="+8%" badgeType="up" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon={<BsGraphUp />} label="Total Attempts" value={kpis.totalAttempts} color="orange" badge="+23%" badgeType="up" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard icon={<BsCheckCircleFill />} label="Pass Rate" value={kpis.passRate} color="red" suffix="%" badge="-2%" badgeType="down" /></div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-lg-6"><ChartCard title="User Growth" subtitle="Last 12 months"><div style={{ height: 220 }}><Line data={lineData} options={chartDefaults} /></div></ChartCard></div>
        <div className="col-lg-6"><ChartCard title="Attempts Trend" subtitle="This week"><div style={{ height: 220 }}><Bar data={barData} options={chartDefaults} /></div></ChartCard></div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-lg-4">
          <ChartCard title="Pass Rate Distribution" subtitle="Overall">
            <div style={{ height: 240 }}>
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, color: '#718096', padding: 16, usePointStyle: true } } } }} />
            </div>
          </ChartCard>
        </div>
        <div className="col-lg-8">
          <div className="table-card h-100">
            <div className="table-card-header"><h6>Top Subjects by Attempts</h6></div>
            <table className="data-table">
              <thead><tr><th>#</th><th>Subject</th><th>Attempts</th><th>Pass Rate</th><th>Progress</th></tr></thead>
              <tbody>
                {topSubjects.map((s, i) => (
                  <tr key={s.name}>
                    <td><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{i + 1}</span></td>
                    <td><strong style={{ fontSize: '0.85rem' }}>{s.name}</strong></td>
                    <td>{s.attempts.toLocaleString()}</td>
                    <td><span style={{ color: s.passRate >= 70 ? 'var(--pass-green)' : 'var(--fail-red)', fontWeight: 600 }}>{s.passRate}%</span></td>
                    <td style={{ width: 120 }}><div className="progress-custom"><div className={`progress-fill ${s.passRate >= 70 ? 'green' : 'red'}`} style={{ width: `${s.passRate}%` }} /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="table-card">
        <div className="table-card-header"><h6>Recent Attempts</h6><span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Last 5 attempts</span></div>
        <table className="data-table">
          <thead><tr><th>User</th><th>Subject</th><th>Score</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {recentAttempts.length === 0
              ? <tr><td colSpan={5}><div className="empty-state"><p>No attempts recorded yet</p></div></td></tr>
              : recentAttempts.map((a, i) => (
                <tr key={i}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width:28,height:28,borderRadius:'50%',background:'var(--accent)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:700 }}>{a.user[0]}</div>
                      <span style={{ fontSize:'0.85rem',fontWeight:500 }}>{a.user}</span>
                    </div>
                  </td>
                  <td style={{ fontSize:'0.85rem' }}>{a.subject}</td>
                  <td><strong style={{ color: a.score >= 60 ? 'var(--pass-green)' : 'var(--fail-red)' }}>{a.score}%</strong></td>
                  <td><Badge label={a.status} /></td>
                  <td style={{ color:'var(--text-muted)',fontSize:'0.82rem' }}>{a.date}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Dashboard;
