import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";
import EditAccount from "../components/EditAccount";
import { FiLogOut, FiUser, FiSettings, FiShield } from "react-icons/fi";
import useLogout from "../hooks/auth/useLogout";

const Settings = () => {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();

  return (
    <div className="h-[calc(100svh)] dark:bg-black bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 h-16 px-6 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
        <button
          className="hover:bg-neutral-100 dark:hover:bg-neutral-900 h-10 aspect-square flex items-center justify-center rounded-full transition-colors duration-200 dark:text-white"
          onClick={() => navigate(-1)}
        >
          <BiArrowBack size={20} />
        </button>
        <h1 className="text-xl font-semibold dark:text-white">Settings</h1>
      </div>

      {/* Content */}
      <div
        className="overflow-y-auto px-6 py-8"
        style={{ height: "calc(100svh - 4rem)" }}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Account Section */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiUser
                    className="text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Account
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage your profile and account settings
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <EditAccount />
              <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={() => logout()}
                  name="logout"
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-200 font-medium"
                >
                  <FiLogOut size={18} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>

          {/* General Section */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FiSettings
                    className="text-purple-600 dark:text-purple-400"
                    size={20}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Appearance
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Customize your chat experience
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ThemeSwitcher />
            </div>
          </div>

          {/* Privacy Section (Placeholder for future features) */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiShield
                    className="text-green-600 dark:text-green-400"
                    size={20}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Privacy & Security
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage your privacy settings
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiShield className="text-neutral-400" size={24} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Privacy settings coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
