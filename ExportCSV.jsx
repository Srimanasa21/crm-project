function ExportCSV({ leads, customers }) {
  const downloadCsv = (rows, filename) => {
    const headers = Object.keys(rows[0] || {}).join(",");
    const csvRows = rows.map((row) => Object.values(row).join(","));
    const csvContent = [headers, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="export-panel panel">
      <div className="card-heading">
        <span className="card-icon">⬇️</span>
        <h3>Export Data</h3>
      </div>
      <div className="actions export-actions">
        <button className="btn btn-primary" onClick={() => downloadCsv(customers, "customers.csv")}>Export Customers</button>
        <button className="btn btn-secondary" onClick={() => downloadCsv(leads, "leads.csv")}>Export Leads</button>
      </div>
    </div>
  );
}

export default ExportCSV;
