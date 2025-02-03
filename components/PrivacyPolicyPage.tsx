import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  CheckCircle,
  Lock,
  Database,
  Bell,
  UserCircle,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Database className="w-6 h-6" />,
      content: [
        "Your Spotify account information (through Spotify's OAuth)",
        "Your listening history and playlist data",
        "Usage data and analytics",
        "Technical information about your device and browser",
      ],
    },
    {
      title: "How We Use Your Information",
      icon: <CheckCircle className="w-6 h-6" />,
      content: [
        "Generate your personalized music statistics and receipts",
        "Improve our services and user experience",
        "Provide technical support",
        "Send important updates about our service",
      ],
    },
    {
      title: "Data Security",
      icon: <Lock className="w-6 h-6" />,
      content: [
        "Implementation of industry-standard encryption",
        "Regular security audits and updates",
        "Secure storage of access tokens",
        "Protected server infrastructure",
      ],
    },
    {
      title: "Your Rights",
      icon: <UserCircle className="w-6 h-6" />,
      content: [
        "Access your personal data",
        "Request correction of your data",
        "Request deletion of your data",
        "Withdraw your consent at any time",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1DB954]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-[#181818] border-none shadow-2xl">
          <CardHeader className="text-center p-8">
            <CardTitle className="text-4xl md:text-5xl font-bold text-[#1DB954] flex items-center justify-center gap-4">
              <Shield className="w-10 h-10 md:w-12 md:h-12" />
              Privacy Policy
            </CardTitle>
            <p className="mt-4 text-[#b3b3b3] text-lg max-w-2xl mx-auto">
              At Receiptify+, we prioritize the protection of your personal
              information. This policy outlines our commitment to your privacy.
            </p>
          </CardHeader>

          <CardContent className="p-8">
            {/* Introduction Section */}
            <div className="mb-12 p-6 bg-[#282828] rounded-lg">
              <h2 className="text-2xl font-semibold text-[#1DB954] mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6" />
                Introduction
              </h2>
              <p className="text-[#b3b3b3] leading-relaxed">
                Welcome to Receiptify+&apos;s Privacy Policy. We&apos;ve created
                this policy to demonstrate our commitment to protecting your
                privacy and handling your data with care. This document explains
                how we collect, use, and safeguard your information when you use
                our service.
              </p>
            </div>

            {/* Main Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((section) => (
                <div
                  key={section.title}
                  className="p-6 bg-[#282828] rounded-lg hover:bg-[#303030] transition-colors duration-300"
                >
                  <h2 className="text-xl font-semibold text-[#1DB954] mb-4 flex items-center gap-2">
                    {section.icon}
                    {section.title}
                  </h2>
                  <ul className="space-y-3">
                    {section.content.map((item, index) => (
                      <li
                        key={index}
                        className="text-[#b3b3b3] flex items-start gap-2 text-sm md:text-base"
                      >
                        <span className="text-[#1DB954] mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Third Party Services Section */}
            <div className="mt-6 p-6 bg-[#282828] rounded-lg">
              <h2 className="text-xl font-semibold text-[#1DB954] mb-4">
                Third-Party Services
              </h2>
              <p className="text-[#b3b3b3] leading-relaxed">
                We use Spotify&apos;s API services to access your music data.
                Your use of Receiptify+ is also subject to Spotify&apos;s
                Privacy Policy and Terms of Service. We ensure that any
                third-party services we use maintain the same high standards of
                data protection.
              </p>
            </div>

            {/* Contact Section */}
            <div className="mt-6 p-6 bg-[#282828] rounded-lg text-center">
              <h2 className="text-xl font-semibold text-[#1DB954] mb-4">
                Contact Us
              </h2>
              <p className="text-[#b3b3b3]">
                If you have any questions about our Privacy Policy, please
                contact us at{" "}
                <a
                  href="mailto:privacy@receiptify-plus.com"
                  className="text-[#1DB954] hover:underline hover:text-green-400 transition-colors duration-200"
                >
                  privacy@receiptify-plus.com
                </a>
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-[#b3b3b3] p-8 bg-[#1c1c1c] rounded-b-lg">
            <p>Last updated: February 2024</p>
            <p className="text-xs">© 2024 Receiptify+ | All rights reserved</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
