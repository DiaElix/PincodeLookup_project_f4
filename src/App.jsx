
import React, { useState } from "react";
import "./App.css";

function App() {

  // State to store the entered pincode
  const [pincode, setPincode] = useState("");

  // State to store error messages
  const [error, setError] = useState("");

  
  // State to store API data
  const [postOffices, setPostOffices] = useState([]);

  // State to manage loading
  const [loading, setLoading] = useState(false);

  const [searchedPincode, setSearchedPincode] = useState("");
  const [apiMessage, setApiMessage] = useState("");

  const [filter, setFilter] = useState("");
  // Function to handle form submission
  async function handleSubmit(e) {

    e.preventDefault();

    // Validate pincode
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode");
      setPostOffices([]);
      setFilter("");
      return;
    }

    // Clear previous error and data
    setError("");
    setPostOffices([]);
    setFilter("");
    // Start loading
    setLoading(true);

    try {

      // Fetch API data
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      const data = await response.json();

      console.log("API Response:", data);

      // Check API response
      if (data[0].Status === "Success" && 
        Array.isArray(data[0].PostOffice)) {
        setPostOffices(data[0].PostOffice);
        setSearchedPincode(pincode);
        setApiMessage(data[0].Message);
      } else {
        setError(data[0].Message);
      }

    } catch (err) {

      setError("Something went wrong. Please try again.");

    } finally {

      setLoading(false);

    }

  }

  const filteredOffices = postOffices.filter((office) =>
  office.Name.toLowerCase().includes(filter.toLowerCase()));
  // UI
  
return (
  <div className="app-container">

    {/* Initial Lookup Form */}
    {postOffices.length === 0 && (
      <form className="lookup-form" onSubmit={handleSubmit}>

        <label htmlFor="pincode">Enter Pincode</label>

        <input
          type="text"
          id="pincode"
          placeholder="Pincode"
          value={pincode}
          maxLength="6"
          onChange={(e) => setPincode(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Lookup"}
        </button>

      </form>
    )}

    {/* Loading */}
    {loading && <p className="loader">Loading...</p>}

    {/* Error */}
    {error && <p className="error">{error}</p>}

    {/* Results */}
    {postOffices.length > 0 && (

      <div className="results">

        <div className="result-info">

          <p>
            <strong>Pincode: {searchedPincode}</strong> 
          </p>

          <p>
            <strong>Message:</strong> {apiMessage}
          </p>

        </div>

        {/* Filter */}
        <div className="filter-container">

          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

        </div>

        {/* Post Office Cards */}
        <div className="office-grid">

          {filteredOffices.length > 0 ? (

            filteredOffices.map((office, index) => (

              <div className="office-card" key={index}>

                <p>{office.Name}</p>

                <p>{office.BranchType}</p>

                <p>{office.DeliveryStatus}</p>

                <p>{office.District}</p>

                <p>{office.Division}</p>

              </div>

            ))

          ) : (

            <p className="no-results">
              Couldn't find the postal data you're looking for...
            </p>

          )}

        </div>

      </div>

    )}

  </div>
);

}

export default App;
