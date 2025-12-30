import React, { useState } from 'react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import StatusBadge from './StatusBadge';
import '../../styles/admin/PropertyUnits.css';

const PropertyUnits = ({ propertyId, units = [], onUnitsUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    unit_number: '',
    floor: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    price: '',
    status: 'available',
  });

  const resetForm = () => {
    setFormData({
      unit_number: '',
      floor: '',
      area: '',
      bedrooms: '',
      bathrooms: '',
      price: '',
      status: 'available',
    });
    setEditingUnit(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (unit) => {
    setFormData({
      unit_number: unit.unit_number,
      floor: unit.floor || '',
      area: unit.area,
      bedrooms: unit.bedrooms || '',
      bathrooms: unit.bathrooms || '',
      price: unit.price,
      status: unit.status,
    });
    setEditingUnit(unit);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.unit_number || !formData.area || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      let response;

      if (editingUnit) {
        // Update existing unit
        response = await adminService.updatePropertyUnit(propertyId, editingUnit.id, formData);
      } else {
        // Create new unit
        response = await adminService.createPropertyUnit(propertyId, formData);
      }

      if (response.success) {
        toast.success(response.message || 'Unit saved');
        resetForm();
        if (onUnitsUpdate) {
          onUnitsUpdate();
        }
      } else if (response.errors) {
        // DRF validation-style error
        const firstKey = Object.keys(response.errors)[0];
        const firstMsg = response.errors[firstKey]?.[0] || 'Validation error';
        toast.error(firstMsg);
      } else {
        toast.error('Failed to save unit');
      }
    } catch (error) {
      console.error('❌ Error saving unit:', error);
      toast.error(error.message || 'Failed to save unit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (unitId) => {
    if (!window.confirm('Are you sure you want to delete this unit?')) {
      return;
    }

    try {
      const response = await adminService.deletePropertyUnit(propertyId, unitId);

      if (response.success) {
        toast.success('Unit deleted successfully');
        if (onUnitsUpdate) {
          onUnitsUpdate();
        }
      } else {
        toast.error(response.message || 'Failed to delete unit');
      }
    } catch (error) {
      console.error('❌ Error deleting unit:', error);
      toast.error('Failed to delete unit');
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === '') return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  return (
    <div className="property-units">
      <div className="units-header">
        <h3>🏢 Shares</h3>
        <button
          className="btn-add-unit"
          onClick={() => {
            resetForm();
            setShowForm((prev) => !prev);
          }}
        >
          {showForm ? 'Cancel' : '+ Add Unit'}
        </button>
      </div>

      {showForm && (
        <form className="unit-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Unit Number *</label>
              <input
                type="text"
                name="unit_number"
                value={formData.unit_number}
                onChange={handleInputChange}
                placeholder="e.g., A-101"
                required
              />
            </div>

            <div className="form-group">
              <label>Floor</label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                placeholder="e.g., 5"
              />
            </div>

            <div className="form-group">
              <label>Area (sq ft) *</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="e.g., 1200"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                placeholder="e.g., 2"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                placeholder="e.g., 2"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 5000000"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn-submit-unit"
            disabled={submitting}
          >
            {submitting
              ? 'Saving...'
              : editingUnit
              ? 'Update Unit'
              : 'Create Unit'}
          </button>
        </form>
      )}

      {units.length === 0 ? (
        <div className="units-empty">
          <p>No units added yet</p>
        </div>
      ) : (
        <div className="units-table">
          <table>
            <thead>
              <tr>
                <th>Unit #</th>
                <th>Floor</th>
                <th>Area</th>
                <th>BHK</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id}>
                  <td>
                    <strong>{unit.unit_number}</strong>
                  </td>
                  <td>{unit.floor || 'N/A'}</td>
                  <td>{unit.area} sq ft</td>
                  <td>{unit.bedrooms ? `${unit.bedrooms}BHK` : 'N/A'}</td>
                  <td>{formatCurrency(unit.price)}</td>
                  <td>
                    <StatusBadge status={unit.status} />
                  </td>
                  <td>
                    <div className="unit-actions">
                      <button
                        className="btn-edit-unit"
                        onClick={() => handleEdit(unit)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-delete-unit"
                        onClick={() => handleDelete(unit.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PropertyUnits;
