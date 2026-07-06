import { useEffect, useState } from "react";
import axios from "axios";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [value, setValue] = useState("0");
  const [status, setStatus] = useState("New");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get("http://localhost:5000/leads")
      .then((response) => {
        setLeads(response.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load leads. Make sure the backend is running.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setValue("0");
    setStatus("New");
    setEditingLeadId(null);
    setError("");
  };

  const saveLead = async () => {
    if (!name || !email || !phone) {
      setError("Please fill in name, email, and phone.");
      return;
    }

    setError("");
    const leadData = {
      name,
      email,
      phone,
      company,
      status,
      value: Number(value) || 0,
    };

    try {
      if (editingLeadId) {
        await axios.put(`http://localhost:5000/leads/${editingLeadId}`, leadData);
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead._id === editingLeadId ? { ...lead, ...leadData } : lead
          )
        );
        resetForm();
      } else {
        const response = await axios.post("http://localhost:5000/leads", leadData);
        setLeads((prevLeads) => [...prevLeads, response.data.lead]);
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError(editingLeadId ? "Unable to update lead." : "Unable to add lead.");
    }
  };

  const startEdit = (lead) => {
    setName(lead.name);
    setEmail(lead.email);
    setPhone(lead.phone);
    setCompany(lead.company || "");
    setValue(lead.value?.toString() || "0");
    setStatus(lead.status || "New");
    setEditingLeadId(lead._id);
    setError("");
  };

  const convertLead = async (lead) => {
    try {
      const response = await axios.post(`http://localhost:5000/leads/${lead._id}/convert`);
      setLeads((prevLeads) =>
        prevLeads.map((item) =>
          item._id === lead._id ? { ...item, status: "Converted" } : item
        )
      );
      setError("");
      if (editingLeadId === lead._id) {
        resetForm();
      }
      console.log(response.data.message);
    } catch (err) {
      console.error(err);
      setError("Unable to convert lead to customer.");
    }
  };

  const deleteLead = async (id) => {
    const confirmed = window.confirm("Are you sure?");
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/leads/${id}`);
      setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== id));
      if (editingLeadId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete lead.");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "contacted":
        return "status-badge status-contacted";
      case "qualified":
        return "status-badge status-qualified";
      case "lost":
        return "status-badge status-lost";
      case "converted":
        return "status-badge status-converted";
      default:
        return "status-badge status-new";
    }
  };

  const getStatusLabel = (status) => {
    switch ((status || "").toLowerCase()) {
      case "contacted":
        return "Contacted";
      case "qualified":
        return "Qualified";
      case "lost":
        return "Lost";
      case "converted":
        return "Converted";
      default:
        return "New";
    }
  };

  const isLeadConvertible = (status) => {
    const state = (status || "").toLowerCase();
    return state !== "lost" && state !== "converted";
  };

  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      lead.name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.phone?.toLowerCase().includes(query) ||
      lead.company?.toLowerCase().includes(query) ||
      lead.status?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title"><span className="page-icon">📋</span>Leads</h1>
          <p className="page-subtitle">Track new opportunities, convert leads, and manage follow-up status.</p>
        </div>
      </div>

      {error && <p className="status-message">{error}</p>}

      {loading ? (
        <div className="panel">
          <p>Loading leads...</p>
        </div>
      ) : (
        <>
          <div className="panel">
            <div className="form-grid">
              <div className="field-row">
                <label className="form-label">Search leads</label>
                <input
                  className="search-box"
                  type="text"
                  placeholder="Search leads by name, email, phone, company, or status"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="field-row">
                <p>Total leads: {leads.length}</p>
                <p>Showing: {filteredLeads.length}</p>
              </div>
            </div>
          </div>

          <div className="panel">
            <h3>{editingLeadId ? "Edit Lead" : "Add Lead"}</h3>
            <div className="form-grid">
              <div className="field-row">
                <label className="form-label">Name</label>
                <input
                  className="form-field"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="field-row">
                <label className="form-label">Email</label>
                <input
                  className="form-field"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field-row">
                <label className="form-label">Phone</label>
                <input
                  className="form-field"
                  type="text"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="field-row">
                <label className="form-label">Company</label>
                <input
                  className="form-field"
                  type="text"
                  placeholder="Company (optional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="field-row">
                <label className="form-label">Value</label>
                <input
                  className="form-field"
                  type="number"
                  min="0"
                  placeholder="Estimated value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>

              <div className="field-row">
                <label className="form-label">Status</label>
                <select className="form-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>

            <div className="actions">
              <button className="btn btn-primary" type="button" onClick={saveLead}>
                <span className="btn-icon">➕</span>
                {editingLeadId ? "Update Lead" : "Add Lead"}
              </button>
              {editingLeadId && (
                <button className="btn btn-secondary" type="button" onClick={resetForm}>
                  <span className="btn-icon">✖️</span>
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="panel">
            {filteredLeads.length === 0 ? (
              <p>No leads match your search.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Value</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, index) => (
                    <tr key={lead._id || index}>
                      <td>{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>{lead.phone}</td>
                      <td>{lead.company}</td>
                      <td>₹{Number(lead.value || 0).toLocaleString("en-IN")}</td>
                      <td>
                        <span className={getStatusBadgeClass(lead.status)}>{getStatusLabel(lead.status)}</span>
                      </td>
                      <td>
                        <button className="btn btn-secondary" type="button" onClick={() => startEdit(lead)}>
                          <span className="btn-icon">✏️</span>
                          Edit
                        </button>
                        <button
                          className="btn btn-primary"
                          type="button"
                          disabled={!isLeadConvertible(lead.status)}
                          onClick={() => convertLead(lead)}
                          title={isLeadConvertible(lead.status) ? "Convert lead" : "Cannot convert this lead"}
                        >
                          <span className="btn-icon">🔄</span>
                          Convert
                        </button>
                        <button className="btn btn-danger" type="button" onClick={() => deleteLead(lead._id)}>
                          <span className="btn-icon">🗑️</span>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Leads;
