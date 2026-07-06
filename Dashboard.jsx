import { useEffect, useState } from "react";
import axios from "axios";
import DashboardCharts from "./DashboardCharts";
import ExportCSV from "./ExportCSV";

function Dashboard() {
  const [customerCount, setCustomerCount] = useState(0);
  const [leadCount, setLeadCount] = useState(0);
  const [pipelineValue, setPipelineValue] = useState(0);
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    Promise.all([
      axios.get("http://localhost:5000/customers"),
      axios.get("http://localhost:5000/leads"),
    ])
      .then(([customersRes, leadsRes]) => {
        const customerData = customersRes.data || [];
        const leadData = leadsRes.data || [];

        setCustomers(customerData);
        setLeads(leadData);
        setCustomerCount(customerData.length);
        setLeadCount(leadData.length);

        const pipeline = leadData
          .filter((lead) => {
            const status = (lead.status || "").toLowerCase();
            return status !== "lost" && status !== "converted";
          })
          .reduce((sum, lead) => sum + Number(lead.value || 0), 0);

        setPipelineValue(pipeline);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load dashboard data. Check the backend.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title"><span className="page-icon">🏠</span>Dashboard</h1>
          <p className="page-subtitle">A professional view of customers, leads, and pipeline growth.</p>
        </div>
      </div>

      {error && <p className="status-message">{error}</p>}

      {loading ? (
        <div className="panel">
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-main">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="card-heading">
                  <span className="card-icon">👥</span>
                  <h3>Total Customers</h3>
                </div>
                <p>{customerCount}</p>
              </div>

              <div className="stat-card">
                <div className="card-heading">
                  <span className="card-icon">📈</span>
                  <h3>Total Leads</h3>
                </div>
                <p>{leadCount}</p>
              </div>

              <div className="stat-card">
                <div className="card-heading">
                  <span className="card-icon">💰</span>
                  <h3>Pipeline Value</h3>
                </div>
                <p>₹{pipelineValue.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <DashboardCharts leads={leads} customers={customers} />
            <ExportCSV leads={leads} customers={customers} />
          </div>

          <div className="activity-card panel">
            <div className="card-heading">
              <span className="card-icon">📝</span>
              <h3>Recent activity</h3>
            </div>
            <ul className="activity-list">
              <li className="activity-item">
                <span>Customer Added</span>
                <span className="activity-time">Just now</span>
              </li>
              <li className="activity-item">
                <span>Lead Added</span>
                <span className="activity-time">2 hours ago</span>
              </li>
              <li className="activity-item">
                <span>Lead Converted</span>
                <span className="activity-time">Yesterday</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
