// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { FiArrowLeft } from "react-icons/fi";
// import toast from "react-hot-toast";
// import adminService from "../../services/adminService";
// import "../../styles/admin/AdminUserInvestment.css";

// const AdminUserInvestment = () => {
//   const navigate = useNavigate();

//   const { userId } = useParams();  // 🔥 REQUIRED

//   /* ---------------- State ---------------- */
//   const [properties, setProperties] = useState([]);
//   const [selectedProperty, setSelectedProperty] = useState(null);

//   const [units, setUnits] = useState(1);
//   const [amount, setAmount] = useState(0);

//   const [formData, setFormData] = useState({
//     referral_code: "",

//     payment_method: "",
//     payment_mode: "",
//     payment_date: "",
//     payment_notes: "",

//     transaction_no: "",
//     pos_slip_image: null,

//     cheque_number: "",
//     cheque_date: "",
//     bank_name: "",
//     ifsc_code: "",
//     branch_name: "",
//     cheque_image: null,

//     neft_rtgs_ref_no: "",
//   });

//   console.log("Cutsomeriddddddddd", userId);
//   /* ---------------- Fetch Properties ---------------- */
//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         const res = await adminService.getProperties();
//         if (res?.results) {
//           setProperties(res.results);
//         }
//       } catch (err) {
//         console.error("Failed to fetch properties", err);
//       }
//     };

//     fetchProperties();
//   }, []);

//   /* ---------------- Auto Calculate Amount ---------------- */
//   useEffect(() => {
//     if (selectedProperty) {
//       setAmount(units * Number(selectedProperty.price_per_unit));
//     }
//   }, [units, selectedProperty]);

//   /* ---------------- Handlers ---------------- */
//   const handlePropertyChange = (e) => {
//     const property = properties.find(
//       (p) => p.id === Number(e.target.value)
//     );
//     setSelectedProperty(property || null);
//   };

//   const handleInputChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.files[0],
//     }));
//   };

//   /* ---------------- Submit ---------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!userId) {
//       alert("Customer ID missing");
//       return;
//     }
//     if (!selectedProperty) {
//       alert("Please select a property");
//       return;
//     }
//     if (!formData.payment_method) {
//       alert("Please select a payment method");
//       return;
//     }

//     const payload = new FormData();

//     // REQUIRED
//     payload.append("customer_id", userId);
//     payload.append("property_id", selectedProperty.id);
//     payload.append("units_count", units);
//     // payload.append("paid_amount", amount);
//     payload.append("amount", String(amount));
//     payload.append("paid_amount", String(amount)); // 👈 ADD THIS


//     // Payment method: append only once
//     payload.append("payment_method", formData.payment_method);

//     // Payment date logic
//     payload.append(
//       "payment_date",
//       formData.payment_method === "DRAFT_CHEQUE"
//         ? formData.cheque_date
//         : formData.payment_date
//     );

//     // OPTIONAL: exclude payment_method and payment_date
//     Object.entries(formData).forEach(([key, value]) => {
//       if (value && key !== "payment_date" && key !== "payment_method") {
//         payload.append(key, value);
//       }
//     });

//     try {
//       await adminService.createInvestmentByAdmin(payload);
//       // alert("Investment created successfully");
//       toast.success("Investment created successfully");
//       navigate("/admin/users");
//     } catch (error) {
//       console.error("Investment creation failed", error.response?.data);
//       alert("Failed to create investment");
//     }
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <>
//       <button
//         type="button"
//         className="btn-back"
//         onClick={() => navigate("/admin/users")}
//       >
//         <FiArrowLeft size={18} />
//         Back to Users
//       </button>

//       <form className="investment-form" onSubmit={handleSubmit}>
//         {/* Property */}
//         <label>Property</label>
//         <select onChange={handlePropertyChange} required>
//           <option value="">-- Select Property --</option>
//           {properties.map((p) => (
//             <option key={p.id} value={p.id}>
//               {p.name}
//             </option>
//           ))}
//         </select>

//         {/* Units */}
//         <label>Units</label>
//         <input
//           type="number"
//           min="1"
//           value={units}
//           onChange={(e) => setUnits(Number(e.target.value))}
//           required
//         />

//         {/* Amount */}
//         <label>Total Amount</label>
//         <input type="text" value={amount} readOnly />

//         {/* Referral */}
//         <label>Referral Code</label>
//         <input
//           name="referral_code"
//           placeholder="Referral Code (optional)"
//           onChange={handleInputChange}
//         />

//         <h4>Payment Details</h4>

//         {/* Payment Method */}
//         <select
//           name="payment_method"
//           value={formData.payment_method}
//           onChange={handleInputChange}
//           required
//         >
//           <option value="">-- Payment Method --</option>
//           <option value="ONLINE">Online</option>
//           <option value="POS">POS</option>
//           <option value="DRAFT_CHEQUE">Cheque / Draft</option>
//           <option value="NEFT_RTGS">NEFT / RTGS</option>
//         </select>

//         {/* Payment Date */}
//         <label>Payment Date</label>
//         <input
//           type="date"
//           name="payment_date"
//           required={formData.payment_method !== "DRAFT_CHEQUE"}
//           onChange={handleInputChange}
//         />

//         {/* ONLINE / POS */}
//         {["ONLINE", "POS"].includes(formData.payment_method) && (
//           <>
//             <input
//               name="payment_mode"
//               placeholder="Payment Mode (UPI / Card / NetBanking)"
//               onChange={handleInputChange}
//             />
//             <input
//               name="transaction_no"
//               placeholder="Transaction Number"
//               onChange={handleInputChange}
//             />
//             {formData.payment_method === "POS" && (
//               <input
//                 type="file"
//                 name="pos_slip_image"
//                 onChange={handleFileChange}
//               />
//             )}
//           </>
//         )}

//         {/* CHEQUE */}
//         {formData.payment_method === "DRAFT_CHEQUE" && (
//           <>
//             <input
//               name="cheque_number"
//               placeholder="Cheque Number"
//               onChange={handleInputChange}
//             />
//             <label>Cheque / Draft Date</label>
//             <input
//               type="date"
//               name="cheque_date"
//               onChange={handleInputChange}
//             />
//             <input
//               name="bank_name"
//               placeholder="Bank Name"
//               onChange={handleInputChange}
//             />
//             <input
//               name="ifsc_code"
//               placeholder="IFSC Code"
//               onChange={handleInputChange}
//             />
//             <input
//               name="branch_name"
//               placeholder="Branch Name"
//               onChange={handleInputChange}
//             />
//             <input
//               type="file"
//               name="cheque_image"
//               onChange={handleFileChange}
//             />
//           </>
//         )}

//         {/* NEFT / RTGS */}
//         {formData.payment_method === "NEFT_RTGS" && (
//           <input
//             name="neft_rtgs_ref_no"
//             placeholder="NEFT / RTGS Reference Number"
//             onChange={handleInputChange}
//           />
//         )}

//         {/* Notes */}
//         <textarea
//           name="payment_notes"
//           placeholder="Payment Notes"
//           onChange={handleInputChange}
//         />

//         <button type="submit">Create Investment</button>
//       </form>
//     </>
//   );
// };

// export default AdminUserInvestment;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import adminService from "../../services/adminService";
import "../../styles/admin/AdminUserInvestment.css";

const AdminUserInvestment = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  /* ---------------- State ---------------- */
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [units, setUnits] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0); // 🆕 NEW STATE
  const [isPartialPayment, setIsPartialPayment] = useState(false); // 🆕 NEW STATE

  const [formData, setFormData] = useState({
    referral_code: "",
    payment_method: "",
    payment_mode: "",
    payment_date: "",
    payment_notes: "",
    transaction_no: "",
    pos_slip_image: null,
    cheque_number: "",
    cheque_date: "",
    bank_name: "",
    ifsc_code: "",
    branch_name: "",
    cheque_image: null,
    neft_rtgs_ref_no: "",
    payment_due_date: "", // 🆕 NEW FIELD
  });

  console.log("Customer ID:", userId);

  /* ---------------- Fetch Properties ---------------- */
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await adminService.getProperties();
        if (res?.results) {
          setProperties(res.results);
        }
      } catch (err) {
        console.error("Failed to fetch properties", err);
      }
    };

    fetchProperties();
  }, []);

  /* ---------------- Auto Calculate Total Amount ---------------- */
  useEffect(() => {
    if (selectedProperty) {
      const calculatedTotal = units * Number(selectedProperty.price_per_unit);
      setTotalAmount(calculatedTotal);
      
      // 🆕 Auto-set paid amount to total by default (full payment)
      if (paidAmount === 0 || paidAmount === totalAmount) {
        setPaidAmount(calculatedTotal);
      }
    }
  }, [units, selectedProperty]);

  /* ---------------- Check if Partial Payment ---------------- */
  useEffect(() => {
    if (totalAmount > 0 && paidAmount > 0) {
      setIsPartialPayment(paidAmount < totalAmount);
    }
  }, [paidAmount, totalAmount]);

  /* ---------------- Handlers ---------------- */
  const handlePropertyChange = (e) => {
    const property = properties.find((p) => p.id === Number(e.target.value));
    setSelectedProperty(property || null);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.files[0],
    }));
  };

  // 🆕 Handle Paid Amount Change
  const handlePaidAmountChange = (e) => {
    const value = Number(e.target.value);
    if (value > totalAmount) {
      toast.error("Paid amount cannot exceed total amount");
      return;
    }
    setPaidAmount(value);
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Customer ID missing");
      return;
    }
    if (!selectedProperty) {
      toast.error("Please select a property");
      return;
    }
    if (!formData.payment_method) {
      toast.error("Please select a payment method");
      return;
    }
    if (paidAmount <= 0) {
      toast.error("Paid amount must be greater than 0");
      return;
    }
    if (paidAmount > totalAmount) {
      toast.error("Paid amount cannot exceed total amount");
      return;
    }

    // 🆕 Validate due date for partial payments
    if (isPartialPayment && !formData.payment_due_date) {
      toast.error("Payment due date is required for partial payments");
      return;
    }

    const payload = new FormData();

    // REQUIRED FIELDS
    payload.append("customer_id", userId);
    payload.append("property_id", selectedProperty.id);
    payload.append("units_count", units);
    payload.append("paid_amount", String(paidAmount)); // ✅ Backend expects 'paid_amount'
    payload.append("amount", String(paidAmount)); // ✅ Also send as 'amount' for compatibility
    payload.append("commitment_amount", String(totalAmount)); // 🆕 Total commitment

    // Payment method
    payload.append("payment_method", formData.payment_method);

    // Payment date logic
    payload.append(
      "payment_date",
      formData.payment_method === "DRAFT_CHEQUE"
        ? formData.cheque_date
        : formData.payment_date
    );

    // 🆕 Add payment due date if partial payment
    if (isPartialPayment && formData.payment_due_date) {
      payload.append("payment_due_date", formData.payment_due_date);
    }

    // OPTIONAL FIELDS
    Object.entries(formData).forEach(([key, value]) => {
      if (value && key !== "payment_date" && key !== "payment_method") {
        payload.append(key, value);
      }
    });

    try {
      await adminService.createInvestmentByAdmin(payload);
      toast.success("Investment created successfully");
      navigate("/admin/users");
    } catch (error) {
      console.error("Investment creation failed", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to create investment"
      );
    }
  };

  /* ---------------- Calculate Due Amount ---------------- */
  const dueAmount = totalAmount - paidAmount;

  /* ---------------- UI ---------------- */
  return (
    <>
      <button
        type="button"
        className="btn-back"
        onClick={() => navigate("/admin/users")}
      >
        <FiArrowLeft size={18} />
        Back to Users
      </button>

      <form className="investment-form" onSubmit={handleSubmit}>
        <h3>Create Investment for User</h3>

        {/* Property */}
        <label>Property *</label>
        <select onChange={handlePropertyChange} required>
          <option value="">-- Select Property --</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - ₹{Number(p.price_per_unit).toLocaleString()}/Share
            </option>
          ))}
        </select>

        {/* Units */}
        <label>Number of Shares *</label>
        <input
          type="number"
          min="1"
          value={units}
          onChange={(e) => setUnits(Number(e.target.value))}
          required
        />

        {/* Total Amount (Calculated) */}
        <label>Total Investment Amount (Calculated)</label>
        <input
          type="text"
          value={`₹${totalAmount.toLocaleString()}`}
          readOnly
          style={{ backgroundColor: "#f0f0f0" }}
        />

        {/* 🆕 Paid Amount */}
        <label>
          Paid Amount *
          {isPartialPayment && (
            <span style={{ color: "#f59e0b", fontSize: "0.9em", marginLeft: "8px" }}>
              (Partial Payment)
            </span>
          )}
        </label>
        <input
          type="number"
          min="0"
          max={totalAmount}
          step="0.01"
          value={paidAmount}
          onChange={handlePaidAmountChange}
          placeholder="Enter paid amount"
          required
        />

        {/* 🆕 Due Amount Display */}
        {isPartialPayment && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#fef3c7",
              borderLeft: "4px solid #f59e0b",
              marginBottom: "16px",
              borderRadius: "4px",
            }}
          >
            <strong>Due Amount:</strong> ₹{dueAmount.toLocaleString()}
            <br />
            <small style={{ color: "#92400e" }}>
              Customer needs to pay the remaining amount by the due date
            </small>
          </div>
        )}

        {/* 🆕 Payment Due Date (only for partial payments) */}
        {isPartialPayment && (
          <>
            <label>Payment Due Date *</label>
            <input
              type="date"
              name="payment_due_date"
              value={formData.payment_due_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </>
        )}

        {/* Referral */}
        <label>Referral Code (Optional)</label>
        <input
          name="referral_code"
          placeholder="Enter CP referral code"
          onChange={handleInputChange}
        />

        <h4>Payment Details</h4>

        {/* Payment Method */}
        <label>Payment Method *</label>
        <select
          name="payment_method"
          value={formData.payment_method}
          onChange={handleInputChange}
          required
        >
          <option value="">-- Select Payment Method --</option>
          <option value="ONLINE">Online</option>
          <option value="POS">POS</option>
          <option value="DRAFT_CHEQUE">Cheque / Draft</option>
          <option value="NEFT_RTGS">NEFT / RTGS</option>
        </select>

        {/* Payment Date */}
        {formData.payment_method !== "DRAFT_CHEQUE" && (
          <>
            <label>Payment Date *</label>
            <input
              type="date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleInputChange}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </>
        )}

        {/* ONLINE / POS */}
        {["ONLINE", "POS"].includes(formData.payment_method) && (
          <>
            <label>Payment Mode</label>
            <input
              name="payment_mode"
              placeholder="UPI / Card / NetBanking"
              onChange={handleInputChange}
            />
            
            <label>Transaction Number *</label>
            <input
              name="transaction_no"
              placeholder="Enter transaction number"
              onChange={handleInputChange}
              required
            />
            
            {formData.payment_method === "POS" && (
              <>
                <label>POS Slip Image</label>
                <input
                  type="file"
                  name="pos_slip_image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </>
            )}
          </>
        )}

        {/* CHEQUE */}
        {formData.payment_method === "DRAFT_CHEQUE" && (
          <>
            <label>Cheque Number *</label>
            <input
              name="cheque_number"
              placeholder="Enter cheque number"
              onChange={handleInputChange}
              required
            />
            
            <label>Cheque / Draft Date *</label>
            <input
              type="date"
              name="cheque_date"
              value={formData.cheque_date}
              onChange={handleInputChange}
              required
            />
            
            <label>Bank Name *</label>
            <input
              name="bank_name"
              placeholder="Enter bank name"
              onChange={handleInputChange}
              required
            />
            
            <label>IFSC Code *</label>
            <input
              name="ifsc_code"
              placeholder="Enter IFSC code"
              onChange={handleInputChange}
              required
            />
            
            <label>Branch Name *</label>
            <input
              name="branch_name"
              placeholder="Enter branch name"
              onChange={handleInputChange}
              required
            />
            
            <label>Cheque Image</label>
            <input
              type="file"
              name="cheque_image"
              accept="image/*"
              onChange={handleFileChange}
            />
          </>
        )}

        {/* NEFT / RTGS */}
        {formData.payment_method === "NEFT_RTGS" && (
          <>
            <label>NEFT / RTGS Reference Number *</label>
            <input
              name="neft_rtgs_ref_no"
              placeholder="Enter reference number"
              onChange={handleInputChange}
              required
            />
          </>
        )}

        {/* Payment Notes */}
        <label>Payment Notes (Optional)</label>
        <textarea
          name="payment_notes"
          placeholder="Add any additional notes about the payment"
          rows="3"
          onChange={handleInputChange}
        />

        {/* Submit Button */}
        <button type="submit" className="btn-submit">
          Create Investment
        </button>
      </form>
    </>
  );
};

export default AdminUserInvestment;