'use client';

import { Settings as SettingsIcon, Bell, Shield, User, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your dashboard preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-pink-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                placeholder="email@tmobile.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-600"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-pink-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700 dark:text-gray-300">Email notifications</span>
              <input type="checkbox" className="w-5 h-5 text-pink-600 rounded focus:ring-pink-600" defaultChecked />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700 dark:text-gray-300">Push notifications</span>
              <input type="checkbox" className="w-5 h-5 text-pink-600 rounded focus:ring-pink-600" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700 dark:text-gray-300">Escalation alerts</span>
              <input type="checkbox" className="w-5 h-5 text-pink-600 rounded focus:ring-pink-600" defaultChecked />
            </label>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-pink-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Theme preferences are managed via the toggle in the header.
          </p>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-pink-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy & Security</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700 dark:text-gray-300">Two-factor authentication</span>
              <input type="checkbox" className="w-5 h-5 text-pink-600 rounded focus:ring-pink-600" defaultChecked />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700 dark:text-gray-300">Activity logging</span>
              <input type="checkbox" className="w-5 h-5 text-pink-600 rounded focus:ring-pink-600" defaultChecked />
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button className="px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          Cancel
        </button>
        <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 transition-colors shadow-lg">
          Save Changes
        </button>
      </div>
    </div>
  );
}
