import ProfileUpload from "@/components/dashboard/settings/profile-upload";
import UpdateForm from "@/components/dashboard/settings/update-form";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-secondary-8 px-8 py-12">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-light mb-2">Settings</h1>
        <p className="text-gray">Manage your account settings and preferences</p>
      </div>

      {/* Settings Container */}
      <div className="max-w-4xl space-y-10">
        {/* Profile Picture Section */}
        <section className="bg-gradient-to-br from-blue-accent-8/40 to-primary-8/20 rounded-2xl p-8 border border-gray/20">
          <ProfileUpload />
        </section>

        {/* Account Settings Section */}
        <section className="bg-gradient-to-br from-blue-accent-8/40 to-primary-8/20 rounded-2xl p-8 border border-gray/20">
          <UpdateForm />
        </section>

        {/* Additional Info Section */}
        <section className="bg-gradient-to-br from-blue-accent-8/30 to-primary-8/10 rounded-2xl p-8 border border-gray/10">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-5 h-5 text-pink-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM8 7a1 1 0 000 2h4a1 1 0 100-2H8zm4 4a1 1 0 100-2H8a1 1 0 100 2h4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-light mb-1">Need Help?</h3>
              <p className="text-xs text-gray">If you encounter any issues updating your settings, please reach out to our support team.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
