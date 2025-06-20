import React, { useState } from "react";
import UserEnrollmentList from "../components/enrollments/UserEnrollmentList";
import UserEnrollmentDetail from "../components/enrollments/UserEnrollmentDetail";

const EnrollmentManager = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedUser(null);
    setViewMode('list');
  };

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-7xl mx-auto p-6">
        {viewMode === 'list' ? (
          <UserEnrollmentList onUserSelect={handleUserSelect} />
        ) : (
          <UserEnrollmentDetail 
            user={selectedUser} 
            onBack={handleBackToList} 
          />
        )}
      </div>
    </div>
  );
};

export default EnrollmentManager;