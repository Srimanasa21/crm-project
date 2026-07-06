function DashboardCharts({ leads, customers }) {
  const byStatus = leads.reduce(
    (acc, lead) => {
      const status = (lead.status || "New").toLowerCase();
      if (status === "contacted") acc.contacted += 1;
      else if (status === "qualified") acc.qualified += 1;
      else if (status === "converted") acc.converted += 1;
      else if (status === "lost") acc.lost += 1;
      else acc.new += 1;
      return acc;
    },
    { new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0 }
  );

  const customerGrowth = customers.length;
  const leadGrowth = leads.length;

  return (
    <div className="charts-grid">
      <div className="chart-card panel">
        <div className="card-heading">
          <span className="card-icon">📊</span>
          <h3>Customers Growth</h3>
        </div>
        <div className="chart-summary">Total customers: {customerGrowth}</div>
        <div className="chart-bars">
          <div className="chart-bar" style={{ width: `${Math.min(100, customerGrowth * 8)}%` }}>
            <span>Customers</span>
            <strong>{customerGrowth}</strong>
          </div>
        </div>
      </div>

      <div className="chart-card panel">
        <div className="card-heading">
          <span className="card-icon">📈</span>
          <h3>Leads Growth</h3>
        </div>
        <div className="chart-summary">Total leads: {leadGrowth}</div>
        <div className="chart-bars">
          <div className="chart-bar" style={{ width: `${Math.min(100, leadGrowth * 6)}%` }}>
            <span>Leads</span>
            <strong>{leadGrowth}</strong>
          </div>
        </div>
      </div>

      <div className="chart-card panel status-breakdown">
        <div className="card-heading">
          <span className="card-icon">🏷️</span>
          <h3>Lead Status</h3>
        </div>
        <div className="status-grid">
          {[
            { label: "New", value: byStatus.new, className: "status-new" },
            { label: "Contacted", value: byStatus.contacted, className: "status-contacted" },
            { label: "Qualified", value: byStatus.qualified, className: "status-qualified" },
            { label: "Converted", value: byStatus.converted, className: "status-converted" },
            { label: "Lost", value: byStatus.lost, className: "status-lost" },
          ].map((item) => (
            <div key={item.label} className={`status-pill ${item.className}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts;
