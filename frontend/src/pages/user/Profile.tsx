import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export const Profile = () => {
  const { user, logoutUser } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-steam-panel p-8 rounded-lg shadow-lg border border-steam-dark">
        <h1 className="text-3xl font-bold text-steam-text-light mb-6 border-b border-steam-dark pb-4">
          Account Details
        </h1>
        
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4 border-b border-steam-dark pb-4">
            <div className="text-steam-text font-medium">Username</div>
            <div className="col-span-2 text-steam-text-light">{user.username}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 border-b border-steam-dark pb-4">
            <div className="text-steam-text font-medium">Email Address</div>
            <div className="col-span-2 text-steam-text-light">{user.email}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 border-b border-steam-dark pb-4">
            <div className="text-steam-text font-medium">Account Role</div>
            <div className="col-span-2 text-steam-text-light">{user.role}</div>
          </div>
          
          <div className="pt-6 flex justify-end">
            <Button variant="danger" onClick={logoutUser}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
