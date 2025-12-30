// src/pages/admin/AdminPropertyForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import adminService from "../../services/adminService";
import "../../styles/admin/AdminProperties.css";

const AdminPropertyForm = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!propertyId;

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [property, setProperty] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState([]);

  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    slug: "",
    description: "",
    builder_name: "",

    // Location
    address: "",
    city: "",
    state: "",
    country: "India",
    locality: "",
    pincode: "",
    latitude: "",
    longitude: "",

    // Property Type
    property_type: "",

    // Specifications
    total_area: "",
    total_units: "",
    available_units: "",

    // Pricing
    price_per_unit: "",
    minimum_investment: "",
    maximum_investment: "",
    target_amount: "",
    funded_amount: "",

    // Returns
    expected_return_percentage: "",
    gross_yield: "",
    potential_gain: "",
    expected_return_period: "",

    // Tenure
    lock_in_period: "",
    project_duration: "",

    // Dates
    launch_date: "",
    funding_start_date: "",
    funding_end_date: "",
    possession_date: "",

    // Status
    status: "draft",

    // Visibility flags
    is_featured: false,
    is_published: false,
    is_public_sale: true,
    is_presale: false,

    // Features
    amenities: [],
    highlights: [],

    // SEO
    meta_title: "",
    meta_description: "",
  });

  const dateOnly = (value) =>
    value ? String(value).slice(0, 10) : "";

  useEffect(() => {
    const init = async () => {
      await fetchPropertyTypes();
      if (isEditMode) {
        await fetchPropertyDetail();
      } else {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const fetchPropertyTypes = async () => {
    try {
      const res = await adminService.getPropertyTypes();
      // expect: { success: true, data: [{ value, label }, ...] }
      if (res.success && Array.isArray(res.data)) {
        setPropertyTypes(res.data);
      }
    } catch (error) {
      console.error("❌ Error fetching property types:", error);
      toast.error("Failed to load property types");
    }
  };

  const fetchPropertyDetail = async () => {
    setLoading(true);
    try {
      const response = await adminService.getPropertyDetail(propertyId);

      if (response.success) {
        const p = response.data;
        setProperty(p);

        setFormData((prev) => ({
          ...prev,
          name: p.name || "",
          slug: p.slug || "",
          description: p.description || "",
          builder_name: p.builder_name || "",

          address: p.address || "",
          city: p.city || "",
          state: p.state || "",
          country: p.country || "India",
          locality: p.locality || "",
          pincode: p.pincode || "",
          latitude: p.latitude || "",
          longitude: p.longitude || "",

          property_type: p.property_type || "",

          total_area: p.total_area || "",
          total_units: p.total_units || "",
          available_units: p.available_units || "",

          price_per_unit: p.price_per_unit || "",
          minimum_investment: p.minimum_investment || "",
          maximum_investment: p.maximum_investment || "",
          target_amount: p.target_amount || "",
          funded_amount: p.funded_amount || "",

          expected_return_percentage: p.expected_return_percentage || "",
          gross_yield: p.gross_yield || "",
          potential_gain: p.potential_gain || "",
          expected_return_period: p.expected_return_period || "",

          lock_in_period: p.lock_in_period || "",
          project_duration: p.project_duration || "",

          launch_date: dateOnly(p.launch_date),
          funding_start_date: dateOnly(p.funding_start_date),
          funding_end_date: dateOnly(p.funding_end_date),
          possession_date: dateOnly(p.possession_date),

          status: p.status || "draft",
          is_featured: !!p.is_featured,
          is_published: !!p.is_published,
          is_public_sale: p.is_public_sale ?? true,
          is_presale: !!p.is_presale,

          amenities: p.amenities || [],
          highlights: p.highlights || [],

          meta_title: p.meta_title || "",
          meta_description: p.meta_description || "",
        }));

        if (p.featured_image_url) {
          setImagePreview(p.featured_image_url);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching property:", error);
      toast.error("Failed to load property details");
      navigate("/admin/properties");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, featured_image: file }));

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Frontend validation aligned with backend
    if (!formData.name) {
      toast.error("Property name is required");
      return;
    }
    if (!formData.builder_name) {
      toast.error("Builder name is required");
      return;
    }
    if (!formData.city) {
      toast.error("City is required");
      return;
    }
    if (!formData.property_type) {
      toast.error("Property type is required");
      return;
    }
    if (!formData.minimum_investment) {
      toast.error("Minimum investment is required");
      return;
    }
    if (!formData.target_amount) {
      toast.error("Target amount is required");
      return;
    }
    if (!formData.project_duration) {
      toast.error("Project duration is required");
      return;
    }

    setSubmitting(true);

    try {
        const submitData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (value instanceof File) {
        submitData.append(key, value);
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => submitData.append(`${key}[]`, item));
        return;
      }

      submitData.append(key, value);
    });

      let response;
      if (isEditMode) {
        response = await adminService.updateProperty(propertyId, submitData);
      } else {
        response = await adminService.createProperty(submitData);
      }

      if (response.success) {
        toast.success(response.message || "Property saved");
        navigate("/admin/properties");
      } else {
        toast.error(response.message || "Failed to save property");
      }
    } catch (error) {
      console.error("❌ Error saving property:", error);
      toast.error(error.message || "Failed to save property");
    } finally {
      setSubmitting(false);
    }
  };

  const renderIcon = (iconName) => {
    if (iconName === "back") {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return null;
  };

  const totalPrice =
    (Number(formData.price_per_unit) || 0) *
    (Number(formData.total_units) || 0);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner">Loading property...</div>
      </div>
    );
  }

  return (
    <div className="admin-property-form-page">
      <div className="form-header">
        <button
          className="btn-back"
          onClick={() => navigate("/admin/properties")}
          type="button"
        >
          {renderIcon("back")}
          Back to Properties
        </button>
        <h1>{isEditMode ? "Edit Property" : "Add New Property"}</h1>
      </div>

      <form className="property-form" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-section">
          <h3 className="section-title">Basic Information</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Property Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., DLF Garden City"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Builder / Developer Name *</label>
              <input
                type="text"
                name="builder_name"
                value={formData.builder_name}
                onChange={handleInputChange}
                placeholder="e.g., DLF Limited"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
                required
              />
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g., Bangalore"
                required
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="e.g., Karnataka"
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="e.g., India"
              />
            </div>

            <div className="form-group">
              <label>Locality</label>
              <input
                type="text"
                name="locality"
                value={formData.locality}
                onChange={handleInputChange}
                placeholder="e.g., Whitefield"
              />
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="e.g., 560001"
                maxLength="6"
              />
            </div>

            <div className="form-group">
              <label>Latitude</label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="e.g., 12.9716"
              />
            </div>

            <div className="form-group">
              <label>Longitude</label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="e.g., 77.5946"
              />
            </div>

            <div className="form-group">
              <label>Property Type *</label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Type</option>
                {propertyTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Custom Slug (optional)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="URL slug, auto if blank"
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Property description..."
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="form-section">
          <h3 className="section-title">Featured Image</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Upload Featured Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {imagePreview && (
                <div className="image-preview">
                  <img
                    src={imagePreview}
                    alt="Featured"
                    style={{
                      maxWidth: "300px",
                      marginTop: "10px",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Unit & Pricing */}
{/* Shares & Pricing */}
<div className="form-section">
  <h3 className="section-title">Shares & Pricing</h3>
  <div className="form-grid">
    <div className="form-group">
      <label>Total Shares *</label>
      <input
        type="number"
        name="total_units"
        value={formData.total_units}
        onChange={handleInputChange}
        placeholder="e.g., 1000"
        min="1"
        required
      />
      <small className="hint">Total number of shares available for this property</small>
    </div>

    <div className="form-group">
      <label>Available Shares</label>
      <input
        type="number"
        name="available_units"
        value={formData.available_units}
        onChange={handleInputChange}
        placeholder="e.g., 750"
        min="0"
      />
      <small className="hint">Shares currently available for investment</small>
    </div>

    <div className="form-group">
      <label>Price Per Share (₹) *</label>
      <input
        type="number"
        name="price_per_unit"
        value={formData.price_per_unit}
        onChange={handleInputChange}
        placeholder="e.g., 10000"
        min="1"
        step="0.01"
        required
      />
      <small className="hint">Price of one share</small>
    </div>

    <div className="form-group">
      <label>Total Property Value (₹)</label>
      <input type="number" value={totalPrice || ""} readOnly />
      <small className="hint">
        Auto-calculated = Price per share × Total shares
      </small>
    </div>

    <div className="form-group">
      <label>Minimum Investment (₹) *</label>
      <input
        type="number"
        name="minimum_investment"
        value={formData.minimum_investment}
        onChange={handleInputChange}
        placeholder="e.g., 50000"
        min="1"
        step="0.01"
        required
      />
      <small className="hint">Minimum amount an investor can invest</small>
    </div>

    <div className="form-group">
      <label>Maximum Investment (₹)</label>
      <input
        type="number"
        name="maximum_investment"
        value={formData.maximum_investment}
        onChange={handleInputChange}
        placeholder="e.g., 5000000"
        min="0"
        step="0.01"
      />
      <small className="hint">Maximum amount per investor (optional)</small>
    </div>

    <div className="form-group">
      <label>Target Funding Amount (₹) *</label>
      <input
        type="number"
        name="target_amount"
        value={formData.target_amount}
        onChange={handleInputChange}
        placeholder="e.g., 10000000"
        min="1"
        step="0.01"
        required
      />
      <small className="hint">Total funding goal for this property</small>
    </div>

    <div className="form-group">
      <label>Current Funded Amount (₹)</label>
      <input
        type="number"
        name="funded_amount"
        value={formData.funded_amount}
        onChange={handleInputChange}
        placeholder="Auto-calculated from investments"
        min="0"
        step="0.01"
      />
      <small className="hint">Leave blank for auto-calculation</small>
    </div>

    {/* Optional: Keep total_area but with different label */}
    <div className="form-group">
      <label>Property Area (sq ft)</label>
      <input
        type="number"
        name="total_area"
        value={formData.total_area}
        onChange={handleInputChange}
        placeholder="e.g., 5000"
        min="0"
        step="0.01"
      />
      <small className="hint">Total built-up area (optional)</small>
    </div>
  </div>
</div>

        {/* Returns & Tenure */}
        <div className="form-section">
          <h3 className="section-title">Returns & Tenure</h3>
          <div className="form-grid">
            {/* <div className="form-group">
              <label>Expected IRR (%)</label>
              <input
                type="number"
                name="expected_return_percentage"
                value={formData.expected_return_percentage}
                onChange={handleInputChange}
                placeholder="e.g., 13.5"
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Gross Yield (%)</label>
              <input
                type="number"
                name="gross_yield"
                value={formData.gross_yield}
                onChange={handleInputChange}
                placeholder="e.g., 7.5"
                min="0"
                max="100"
                step="0.01"
              />
            </div> */}

            <div className="form-group">
              <label>Potential Gain (%)</label>
              <input
                name="potential_gain"
                value={formData.potential_gain}
                onChange={handleInputChange}
                placeholder="e.g., 25.5"
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Target Hold Period (months)</label>
              <input
                type="number"
                name="expected_return_period"
                value={formData.expected_return_period}
                onChange={handleInputChange}
                placeholder="e.g., 36"
                min="1"
              />
            </div>

           <div className="form-group">
              <label>Subscription (%)</label>
              <input
                name="expected_return_percentage"
                value={formData.expected_return_percentage}
                onChange={handleInputChange}
                placeholder="e.g., 13.5"
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Project Duration (months) *</label>
              <input
                type="number"
                name="project_duration"
                value={formData.project_duration}
                onChange={handleInputChange}
                placeholder="e.g., 48"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="form-section">
          <h3 className="section-title">Important Dates</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Launch Date</label>
              <input
                type="date"
                name="launch_date"
                value={formData.launch_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Funding Start Date</label>
              <input
                type="date"
                name="funding_start_date"
                value={formData.funding_start_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Funding End Date</label>
              <input
                type="date"
                name="funding_end_date"
                value={formData.funding_end_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Possession Date</label>
              <input
                type="date"
                name="possession_date"
                value={formData.possession_date}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="form-section">
          <h3 className="section-title">SEO Metadata</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Meta Title</label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
                placeholder="SEO title"
              />
            </div>

            <div className="form-group full-width">
              <label>Meta Description</label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                placeholder="SEO description"
                rows="2"
              />
            </div>
          </div>
        </div>

        {/* Status & Visibility */}
        {/* <div className="form-section">
          <h3 className="section-title">Status & Visibility</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Property Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="draft">Draft</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="live">Live</option>
                <option value="funding">Funding</option>
                <option value="funded">Fully Funded</option>
                <option value="under_construction">Under Construction</option>
                <option value="completed">Completed</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                />
                <span>Mark as Featured Property</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                />
                <span>Published (visible to investors)</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_public_sale"
                  checked={formData.is_public_sale}
                  onChange={handleInputChange}
                />
                <span>Public Sale Enabled</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_presale"
                  checked={formData.is_presale}
                  onChange={handleInputChange}
                />
                <span>Presale Phase</span>
              </label>
            </div>
          </div>
        </div> */}

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/admin/properties")}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Property"
              : "Create Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPropertyForm;