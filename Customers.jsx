import { useState, useEffect } from "react";
import axios from "axios";

function Customers() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      customer.name?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.phone?.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get("http://localhost:5000/customers")
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load customers. Check that the backend is running.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setEditingCustomerId(null);
    setError("");
  };

  const saveCustomer = async () => {
    if (!name || !email || !phone) {
      setError("Please fill in name, email, and phone.");
      return;
    }

    setError("");
    const customerData = { name, email, phone };

    try {
      if (editingCustomerId) {
        await axios.put(`http://localhost:5000/customers/${editingCustomerId}`, customerData);
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer._id === editingCustomerId ? { ...customer, ...customerData } : customer
          )
        );
        resetForm();
      } else {
        const response = await axios.post("http://localhost:5000/customers", customerData);
        setCustomers((prevCustomers) => [...prevCustomers, response.data.customer]);
        resetForm();
      }
    } catch (error) {
      console.error(error);
      setError(editingCustomerId ? "Unable to update customer. Try again later." : "Unable to add customer. Try again later.");
    }
  };

  const startEdit = (customer) => {
    setName(customer.name || "");
    setEmail(customer.email || "");
    setPhone(customer.phone || "");
    setEditingCustomerId(customer._id);
    setError("");
  };

  const deleteCustomer = async (id) => {
    const confirmed = window.confirm("Are you sure?");
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/customers/${id}`);
      setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer._id !== id));
      if (editingCustomerId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
      setError("Unable to delete customer. Try again later.");
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title"><span className="page-icon">👥</span>Customers</h1>
          <p className="page-subtitle">Add, search, edit, and manage all your customer contacts in one place.</p>
        </div>
      </div>

      {error && <p className="status-message">{error}</p>}

      {loading ? (
        <div className="panel">
          <p>Loading customers...</p>
        </div>
      ) : (
        <>
          <div className="panel">
            <div className="form-grid">
              <div className="field-row">
                <label className="form-label">Search customers</label>
                <input
                  className="search-box"
                  type="text"
                  placeholder="Search by name, email, or phone"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="field-row">
                <p>Total customers: {customers.length}</p>
                <p>Showing: {filteredCustomers.length}</p>
              </div>
            </div>
          </div>

          <div className="panel">
            <h3>{editingCustomerId ? "Edit customer" : "Add customer"}</h3>
            <div className="form-grid">
              <div className="field-row">
                <label className="form-label">Name</label>
                <input
                  className="form-field"
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="field-row">
                <label className="form-label">Email</label>
                <input
                  className="form-field"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field-row">
                <label className="form-label">Phone</label>
                <input
                  className="form-field"
                  type="text"
                  placeholder="Enter phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="actions">
              <button className="btn btn-primary" type="button" onClick={saveCustomer}>
                <span className="btn-icon">➕</span>
                {editingCustomerId ? "Update customer" : "Add customer"}
              </button>
              {editingCustomerId && (
                <button className="btn btn-secondary" type="button" onClick={resetForm}>
                  <span className="btn-icon">✖️</span>
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="panel">
            {filteredCustomers.length === 0 ? (
              <p>No customers match your search.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <tr key={customer._id || index}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>
                        <button className="btn btn-secondary" type="button" onClick={() => startEdit(customer)}>
                          <span className="btn-icon">✏️</span>
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => deleteCustomer(customer._id)}
                        >
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
    </>
  );
}

export default Customers;
