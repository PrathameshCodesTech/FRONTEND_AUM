import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // ← ADD THIS
import { useAuth } from "../contexts/AuthContext"; // ← ADD THIS
import propertyService from "../services/propertyService"; // ← ADD THIS
import "../styles/PropertyCard.css";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Check if property is in wishlist on mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const isInWishlist = wishlist.some((item) => item.id === property.id);
    setIsFavorite(isInWishlist);
  }, [property.id]);

  const handleExpressInterest = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to express interest");
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  const confirmInterest = async () => {
    try {
      const response = await propertyService.expressInterest(property.id, 1);
      if (response.success) {
        toast.success(response.message);
        setShowModal(false);
      }
    } catch (error) {
      toast.error(error.message || "Failed to express interest");
    }
  };

  const handleWishlistToggle = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (isFavorite) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter(
        (item) => item.id !== property.id
      );
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsFavorite(false);
      toast.success("Removed from wishlist");
    } else {
      // Add to wishlist
      const updatedWishlist = [...wishlist, property];
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsFavorite(true);
      toast.success("Added to wishlist");
    }
  };

  const renderIcon = (iconName) => {
    const icons = {
      share: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" />
          <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" />
          <path
            d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
      heart: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61V4.61Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      heartFilled: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61V4.61Z" />
        </svg>
      ),
      location: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      arrowUp: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 19V5M5 12L12 5L19 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  return (
    <>
      <div className="property-card">
        <div className="property-image-container">
          <div className="property-image-container">
            <img
              src={
                property.image ||
                property.images?.[0] ||
                property.primary_image ||
                property.featured_image ||
                "https://via.placeholder.com/400x300?text=No+Image"
              }
              alt={property.name}
              className="property-image"
              onError={(e) => {
                console.error("Image failed to load:", e.target.src);
                e.target.src =
                  "https://via.placeholder.com/400x300?text=No+Image";
              }}
            />
            {/* Removed sale-badge */}
            <span className="type-badge">
              {property.property_type === "residential"
                ? "Residential"
                : property.property_type === "commercial"
                ? "Commercial"
                : property.property_type === "land"
                ? "Plots"
                : property.property_type?.charAt(0).toUpperCase() +
                  property.property_type?.slice(1)}
            </span>
            <div className="card-actions">
              <button className="action-btn" title="Share">
                {renderIcon("share")}
              </button>
              <button
                className={`action-btn ${isFavorite ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleWishlistToggle();
                }}
                title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isFavorite ? renderIcon("heartFilled") : renderIcon("heart")}
              </button>
            </div>
          </div>
          {/* Removed sale-badge */}
          <span className="type-badge">
            {property.property_type === "residential"
              ? "Residential"
              : property.property_type === "commercial"
              ? "Commercial"
              : property.property_type === "land"
              ? "Plots"
              : property.property_type?.charAt(0).toUpperCase() +
                property.property_type?.slice(1)}
          </span>
          <div className="card-actions">
            <button className="action-btn" title="Share">
              {renderIcon("share")}
            </button>
            <button
              className={`action-btn ${isFavorite ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleWishlistToggle();
              }}
              title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isFavorite ? renderIcon("heartFilled") : renderIcon("heart")}
            </button>
          </div>
        </div>

        <div className="property-content">
          <h3 className="property-name">{property.name || property.title}</h3>
          <p className="property-location">
            <span className="location-icon">{renderIcon("location")}</span>
            {property.location || `${property.city}, ${property.state}`}
          </p>

          <div className="property-details">
            <div className="detail-item">
              <span className="detail-label">Min Investment</span>
              <span className="detail-value">
                ₹{Number(property.minimum_investment)?.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Max Investment</span>
              <span className="detail-value">
                ₹{Number(property.maximum_investment)?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="property-metrics">
            <div className="metric">
              <span className="metric-label">Shares</span>
              <span className="metric-value">{property?.total_units ?? 0}</span>
            </div>

            <div className="metric">
              <span className="metric-label">Potential Growth</span>
              <span className="metric-value highlight">
                {property?.potential_gain ?? "2x"}
              </span>
            </div>
          </div>

          <div className="property-actions">
            <button
              className="btn-express-interest"
              onClick={(e) => {
                e.stopPropagation();
                handleExpressInterest();
              }}
            >
              Express Interest
            </button>
            <button
              className="btn-explore"
              onClick={() => navigate(`/properties/${property.id}`)}
            >
              Explore
            </button>
            <button
              className="btn-view-analytics"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/analytics/${property.slug}`);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 3V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 9L13 14L9 10L3 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              View Analytics
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h3>Express Interest</h3>
            <p>
              Our team will contact you shortly about{" "}
              <strong>{property.name}</strong>.
            </p>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmInterest}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;
