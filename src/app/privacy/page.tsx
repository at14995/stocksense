
export default function PrivacyPage() {
  return (
    <main className="flex justify-center items-center min-h-screen px-4 py-20 bg-transparent">
      <div className="max-w-3xl w-full bg-[#0E0E12]/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/10">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>

          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <p className="text-gray-300 leading-relaxed">We collect information you provide directly to us, such as when you create an account, create or modify your profile, set preferences, or otherwise communicate with us. This information may include: name, email, password, and any other information you choose to provide.</p>
          <p className="text-gray-300 leading-relaxed">We automatically log information about you and your computer or mobile device when you access our Services. For example, we log your computer or mobile device operating system name and version, manufacturer and model, browser type, browser language, screen resolution, the website you visited before browsing to our Services, pages you viewed, how long you spent on a page, access times and information about your use of and actions on our Services.</p>

          <h2 className="text-2xl font-semibold">2. Use of Your Information</h2>
          <p className="text-gray-300 leading-relaxed">We use the information we collect to operate, maintain, and provide you the features and functionality of the Service, as well as to communicate directly with you, such as to send you email messages and push notifications.</p>

          <h2 className="text-2xl font-semibold">3. Sharing of Your Information</h2>
          <p className="text-gray-300 leading-relaxed">We do not sell, trade, rent or otherwise share for marketing purposes your Personal Information with third parties without your consent. We may share your Personal Information with vendors and other third-party service providers who are performing services for our company.</p>
          
          <h2 className="text-2xl font-semibold">4. Data Security</h2>
          <p className="text-gray-300 leading-relaxed">We use industry-standard security measures to protect the information we collect, both during transmission and once we receive it. However, no method of transmission over the Internet or method of electronic storage is 100% secure.</p>

          <h2 className="text-2xl font-semibold">5. Your Choices</h2>
          <p className="text-gray-300 leading-relaxed">You can review and change your personal information by logging into the application and visiting your account profile page. You may also send us an email to request access to, correct or delete any personal information that you have provided to us.</p>
        </div>
      </div>
    </main>
  );
}
