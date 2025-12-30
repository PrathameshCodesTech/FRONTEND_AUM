import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import adminService from "../../services/adminService";
import StatusBadge from "../../components/admin/StatusBadge";
import ActionModal from "../../components/admin/ActionModal";
import "../../styles/admin/AdminUserDetail.css";
import { FiEdit, FiSave, FiX } from "react-icons/fi";

const AdminUserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

    // Investment stats
  const [investmentStats, setInvestmentStats] = useState({
    total_investments: 0,
    total_amount: 0,
    total_paid_amount: 0,      // 🆕 Add this
    total_due_amount: 0         // 🆕 Add this
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Modal states
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    action: null,
    title: "",
    message: "",
    requireReason: false,
  });
  const [actionLoading, setActionLoading] = useState(false);

  const handleInvest = (userId) => {
    navigate(`/admin/users/${userId}/investment`);
  };

  useEffect(() => {
    fetchUserDetail();
    fetchUserInvestmentStats();
  }, [userId]);

  const fetchUserDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminService.getUserDetail(userId);

      if (response.success) {
        setUser(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch user");
      }
    } catch (error) {
      console.error("❌ Error fetching user detail:", error);
      setError(error.message || "Failed to load user details");
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
  { id: 1, name: "admin", display_name: "Admin" },
  { id: 4, name: "user", display_name: "User" },
  { id: 3, name: "channel partner", display_name: "Channel Partner" },
  { id: 5, name: "rm", display_name: "RM" },
  // { id: 2, name: "developer", display_name: "Developer" },
];


    const fetchUserInvestmentStats = async () => {
    setStatsLoading(true);
    try {
      const response = await adminService.getInvestmentsByCustomer(userId);
      
      if (response.success) {
        setInvestmentStats({
          total_investments: response.total_investments || response.data?.length || 0,
          total_amount: response.total_amount || 0,
          total_paid_amount: response.total_paid_amount || 0,     // 🆕 Add this
          total_due_amount: response.total_due_amount || 0         // 🆕 Add this
        });
      }
    } catch (error) {
      console.error("❌ Error fetching investment stats:", error);
      // Keep default values if fetch fails
    } finally {
      setStatsLoading(false);
    }
  };

  const openActionModal = (action) => {
    const modalConfig = {
      verify: {
        title: "Verify User",
        message: `Are you sure you want to verify ${user.username}?`,
        requireReason: false,
      },
      suspend: {
        title: "Suspend User",
        message: `Are you sure you want to suspend ${user.username}? They will not be able to access their account.`,
        requireReason: true,
      },
      unsuspend: {
        title: "Unsuspend User",
        message: `Are you sure you want to unsuspend ${user.username}?`,
        requireReason: false,
      },
      block: {
        title: "Block User",
        message: `Are you sure you want to block ${user.username}? This is a serious action.`,
        requireReason: true,
      },
      unblock: {
        title: "Unblock User",
        message: `Are you sure you want to unblock ${user.username}?`,
        requireReason: false,
      },
    };

    setActionModal({
      isOpen: true,
      action,
      ...modalConfig[action],
    });
  };

  const handleUserAction = async (reason) => {
    setActionLoading(true);

    try {
      const response = await adminService.userAction(
        userId,
        actionModal.action,
        reason
      );

      if (response.success) {
        toast.success(response.message);
        setUser(response.data); // Update user with latest data
        setActionModal({ ...actionModal, isOpen: false });
      }
    } catch (error) {
      toast.error(error.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: type === "checkbox" ? checked : value,
       role: user.role_details, // ✅ map correctly
    });
  };

  // const saveUserEdit = async () => {
  //   try {
  //     const response = await adminService.updateUser(userId, editedUser);
  //     if (response.success) {
  //       setUser(response.data);
  //       setIsEditing(false);
  //       toast.success("User updated successfully");
  //     } else {
  //       throw new Error(response.message || "Failed to update user");
  //     }
  //   } catch (error) {
  //     toast.error(error.message || "Failed to update user");
  //   }
  // };

  const saveUserEdit = async () => {
    try {
      const payload = {
        id: editedUser.id,
        first_name: editedUser.first_name,
        last_name: editedUser.last_name,
        username: editedUser.username,
        email: editedUser.email,
        phone: editedUser.phone,
        role: editedUser.role ? editedUser.role.id : null,
        date_of_birth: editedUser.date_of_birth,
        is_indian: editedUser.is_indian,
      };

      console.log("Updating user payload:", payload);

      const updatedUser = await adminService.updateUser(user.id, payload);

      // Update UI
      setUser(updatedUser.data || updatedUser);
      setIsEditing(false);
      toast.success("User updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };


   const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const renderIcon = (iconName) => {
    const icons = {
      back: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      user: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      kyc: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
          <path
            d="M6 16C6 14.5 7.5 13 9 13C10.5 13 12 14.5 12 16"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
      wallet: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 12V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V12Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M21 12H17C15.8954 12 15 12.8954 15 14C15 15.1046 15.8954 16 17 16H21"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
      investments: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M23 6L13.5 15.5L8.5 10.5L1 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner">Loading user details...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="admin-error">
        <h3>Failed to Load User</h3>
        <p>{error}</p>
        <button className="btn-retry" onClick={fetchUserDetail}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-user-detail-page">
      {/* Header */}
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate("/admin/users")}>
          {renderIcon("back")}
          Back to Users
        </button>

        <div className="detail-actions">
          {!user.is_verified && (
            <button
              className="btn-action-detail btn-verify"
              onClick={() => openActionModal("verify")}
            >
              ✓ Verify User
            </button>
          )}

          {!user.is_suspended ? (
            <button
              className="btn-action-detail btn-suspend"
              onClick={() => openActionModal("suspend")}
            >
              ⏸ Suspend
            </button>
          ) : (
            <button
              className="btn-action-detail btn-unsuspend"
              onClick={() => openActionModal("unsuspend")}
            >
              ▶ Unsuspend
            </button>
          )}

          {!user.is_blocked ? (
            <button
              className="btn-action-detail btn-block"
              onClick={() => openActionModal("block")}
            >
              ⛔ Block
            </button>
          ) : (
            <button
              className="btn-action-detail btn-unblock"
              onClick={() => openActionModal("unblock")}
            >
              ✓ Unblock
            </button>
          )}
        </div>
      </div>

      {/* User Profile Card */}
      <div className="detail-card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="user-avatar-large">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2>{user.username}</h2>
              <p className="user-id">User ID: #{user.id}</p>
            </div>
          </div>

          <div className="invest-button-container">
            <button
              className="btn-invest"
              // onClick={() => toast.success("Invest action triggered")}
              onClick={() => handleInvest(user.id)}
            >
              Invest
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="card-content">
          <div className="info-section">
            <h3>
              <span className="section-icon">{renderIcon("user")}</span>
              Personal Information
            </h3>

            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">First Name</span>
                {!isEditing ? (
                  <span className="info-value-detail">
                    {user.first_name || "N/A"}
                  </span>
                ) : (
                  <input
                    type="text"
                    name="first_name"
                    value={editedUser.first_name || ""}
                    onChange={handleInputChange}
                  />
                )}
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Last Name</span>
                {!isEditing ? (
                  <span className="info-value-detail">
                    {user.last_name || "N/A"}
                  </span>
                ) : (
                  <input
                    type="text"
                    name="last_name"
                    value={editedUser.last_name || ""}
                    onChange={handleInputChange}
                  />
                )}
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Username</span>
                {!isEditing ? (
                  <span className="info-value-detail">
                    {user.username || "N/A"}
                  </span>
                ) : (
                  <input
                    type="text"
                    name="username"
                    value={editedUser.username || ""}
                    onChange={handleInputChange}
                  />
                )}
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Email</span>
                {!isEditing ? (
                  <span className="info-value-detail">
                    {user.email || "N/A"}
                  </span>
                ) : (
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email || ""}
                    onChange={handleInputChange}
                  />
                )}
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Phone</span>
                {!isEditing ? (
                  <span className="info-value-detail">
                    {user.phone || "N/A"}
                  </span>
                ) : (
                  <input
                    type="text"
                    name="phone"
                    value={editedUser.phone || ""}
                    onChange={handleInputChange}
                  />
                )}
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Date of Birth</span>
                {!isEditing ? (
                  <span className="info-value-detail">
                    {user.date_of_birth
                      ? new Date(user.date_of_birth).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "N/A"}
                  </span>
                ) : (
                  <input
                    type="date"
                    name="date_of_birth"
                    value={
                      editedUser.date_of_birth
                        ? editedUser.date_of_birth.split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                )}
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Citizenship</span>
                {!isEditing ? (
                  <span className="info-value-detail">
                    {user.is_indian === true
                      ? "🇮🇳 Indian"
                      : user.is_indian === false
                      ? "🌍 Non-Indian"
                      : "Not Specified"}
                  </span>
                ) : (
                  <select
                    name="is_indian"
                    value={editedUser.is_indian}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value={true}>🇮🇳 Indian</option>
                    <option value={false}>🌍 Non-Indian</option>
                  </select>
                )}
              </div>
              {/* <div className="info-item-detail">
                <span className="info-label-detail">Role</span>
                {!isEditing ? (
                  <span className="info-value-detail">
                   {user.role_details?.display_name || "N/A"}

                  </span>
                ) : (
                  <input
                    type="text"
                    name="role"
                    value={editedUser.role?.name || ""}
                    onChange={handleInputChange}
                  />
                )}
              </div> */}<div className="info-item-detail">
  <span className="info-label-detail">Role</span>

  {!isEditing ? (
    <span className="info-value-detail">
      {user.role_details?.display_name || "N/A"}
    </span>
  ) : (
    <select
      name="role"
      value={editedUser.role?.id || ""}
      onChange={(e) => {
        const selectedRole = roles.find(
          (role) => role.id === Number(e.target.value)
        );
        setEditedUser({
          ...editedUser,
          role: selectedRole,
        });
      }}
    >
      <option value="">Select Role</option>
      {roles.map((role) => (
        <option key={role.id} value={role.id}>
          {role.display_name}
        </option>
      ))}
    </select>
  )}
</div>

              {!isEditing ? (
                <button
                  className="btn-edit-user"
                  onClick={() => {
                    setIsEditing(true);
                    setEditedUser(user);
                  }}
                  title="Edit User"
                >
                  <FiEdit size={18} />
                </button>
              ) : (
                <div className="edit-buttons">
                  <button className="btn-save" onClick={saveUserEdit}>
                    <FiSave size={18} /> Save
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => setIsEditing(false)}
                  >
                    <FiX size={18} /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* KYC Information */}
          <div className="info-section">
            <h3>
              <span className="section-icon">{renderIcon("kyc")}</span>
              KYC Information
            </h3>

            {user.kyc_details ? (
              <>
                <div className="info-grid-detail">
                  <div className="info-item-detail">
                    <span className="info-label-detail">Overall Status</span>
                    <span className="info-value-detail">
                      <StatusBadge status={user.kyc_details.status} />
                    </span>
                  </div>
                  <div className="info-item-detail">
                    <span className="info-label-detail">Submission Date</span>
                    <span className="info-value-detail">
                      {new Date(user.kyc_details.created_at).toLocaleDateString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>
                {/* Other KYC details here as per your existing code */}
              </>
            ) : (
              <div className="info-grid-detail">
                <div className="info-item-detail">
                  <span className="info-label-detail">KYC Status</span>
                  <span className="info-value-detail">Not Started</span>
                </div>
              </div>
            )}
          </div>

          {/* Account Activity */}
          <div className="info-section">
            <h3>Account Activity</h3>
            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">Date Joined</span>
                <span className="info-value-detail">
                  {new Date(user.date_joined).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Last Login</span>
                <span className="info-value-detail">
                  {user.last_login
                    ? new Date(user.last_login).toLocaleString("en-IN")
                    : "Never"}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Email Verified</span>
                <span className="info-value-detail">
                  {user.is_verified ? "✓ Yes" : "✗ No"}
                </span>
              </div>
            </div>
          </div>
          {/* Suspension/Block Info */}
          {user.is_suspended && (
            <div className="warning-section suspended">
              <h4>⚠ User Suspended</h4>
              <p>
                <strong>Reason:</strong>{" "}
                {user.suspended_reason || "No reason provided"}
              </p>
              {user.suspended_at && (
                <p>
                  <strong>Suspended On:</strong>{" "}
                  {new Date(user.suspended_at).toLocaleString("en-IN")}
                </p>
              )}
            </div>
          )}

          {user.is_blocked && (
            <div className="warning-section blocked">
              <h4>⛔ User Blocked</h4>
              <p>
                <strong>Reason:</strong>{" "}
                {user.blocked_reason || "No reason provided"}
              </p>
              {user.blocked_at && (
                <p>
                  <strong>Blocked On:</strong>{" "}
                  {new Date(user.blocked_at).toLocaleString("en-IN")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {/* <div className="user-stats-grid">
        <div className="stat-card-detail">
          <span className="stat-icon-detail">{renderIcon("wallet")}</span>
          <div className="stat-content-detail">
            <span className="stat-label-detail">Wallet Balance</span>
            <span className="stat-value-detail">₹0</span>
          </div> 
        </div>
        <div className="stat-card-detail">
          <span className="stat-icon-detail">{renderIcon("investments")}</span>
          <div className="stat-content-detail">
            <span className="stat-label-detail">Total Investments</span>
            <span className="stat-value-detail">0</span>
          </div>
        </div>
        <div className="stat-card-detail">
          <span className="stat-icon-detail">{renderIcon("investments")}</span>
          <div className="stat-content-detail">
            <span className="stat-label-detail">Total Invested</span>
            <span className="stat-value-detail">₹0</span>
          </div>
        </div>
      </div> */}

       <div className="user-stats-grid">
        <div className="stat-card-detail">
          <span className="stat-icon-detail">{renderIcon("investments")}</span>
          <div className="stat-content-detail">
            <span className="stat-label-detail">Total Investments</span>
            <span className="stat-value-detail">
              {statsLoading ? (
                <span className="stat-loading">Loading...</span>
              ) : (
                investmentStats.total_investments
              )}
            </span>
          </div>
        </div>
        <div className="stat-card-detail">
          <span className="stat-icon-detail">{renderIcon("investments")}</span>
          <div className="stat-content-detail">
            <span className="stat-label-detail">Total Invested</span>
            <span className="stat-value-detail">
              {statsLoading ? (
                <span className="stat-loading">Loading...</span>
              ) : (
                formatCurrency(investmentStats.total_amount)
              )}
            </span>
          </div>
        </div>
      {/* </div> */}  

      {/* <div className="user-stats-grid">
  <div className="stat-card-detail">
    <span className="stat-icon-detail">{renderIcon("investments")}</span>
    <div className="stat-content-detail">
      <span className="stat-label-detail">Total Investments</span>
      <span className="stat-value-detail">
        {statsLoading ? (
          <span className="stat-loading">Loading...</span>
        ) : (
          investmentStats.total_investments
        )}
      </span>
    </div>
  </div>
  
  <div className="stat-card-detail">
    <span className="stat-icon-detail">{renderIcon("investments")}</span>
    <div className="stat-content-detail">
      <span className="stat-label-detail">Total Investment Amount</span>
      <span className="stat-value-detail">
        {statsLoading ? (
          <span className="stat-loading">Loading...</span>
        ) : (
          formatCurrency(investmentStats.total_amount)
        )}
      </span>
    </div>
  </div> */}
  
  {/* 🆕 ADD THESE TWO NEW CARDS */}
  <div className="stat-card-detail">
    <span className="stat-icon-detail">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/>
      </svg>
    </span>
    <div className="stat-content-detail">
      <span className="stat-label-detail">Total Paid Amount</span>
      <span className="stat-value-detail" style={{ color: '#10B981' }}>
        {statsLoading ? (
          <span className="stat-loading">Loading...</span>
        ) : (
          formatCurrency(investmentStats.total_paid_amount)
        )}
      </span>
    </div>
  </div>
  
  <div className="stat-card-detail">
    <span className="stat-icon-detail">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
          stroke="currentColor" strokeWidth="2"/>
      </svg>
    </span>
    <div className="stat-content-detail">
      <span className="stat-label-detail">Total Due Amount</span>
      <span className="stat-value-detail" style={{ color: investmentStats.total_due_amount > 0 ? '#f59e0b' : '#6b7280' }}>
        {statsLoading ? (
          <span className="stat-loading">Loading...</span>
        ) : (
          formatCurrency(investmentStats.total_due_amount)
        )}
      </span>
    </div>
  </div>
</div>

      {/* Action Modal */}
      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handleUserAction}
        title={actionModal.title}
        message={actionModal.message}
        requireReason={actionModal.requireReason}
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminUserDetail;