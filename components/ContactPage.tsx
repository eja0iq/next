import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Github, Twitter } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1DB954]">
      <Header />
      <div className="flex items-center justify-center p-4 h-[calc(100vh-64px)]">
        <Card className="w-full max-w-md bg-[#181818] border-none shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-[#1DB954] flex items-center justify-center">
              <Mail className="w-8 h-8 mr-2" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-white text-lg">
                Get in Touch with Receiptify+
              </p>
              <p className="text-sm text-[#b3b3b3]">
                Have questions, suggestions, or just want to say hello?
                We&apos;d love to hear from you!
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-left text-[#b3b3b3]">
                <div className="mb-4">
                  <h3 className="text-[#1DB954] font-semibold mb-2">Email</h3>
                  <p className="text-sm">support@receiptify-plus.com</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-[#1DB954] font-semibold mb-2">
                    Business Inquiries
                  </h3>
                  <p className="text-sm">business@receiptify-plus.com</p>
                </div>
                <div>
                  <h3 className="text-[#1DB954] font-semibold mb-2">
                    Response Time
                  </h3>
                  <p className="text-sm">
                    We typically respond within 24-48 hours during business
                    days.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#282828]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#181818] px-2 text-[#b3b3b3]">
                    Social Media
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-center space-x-4">
                <a
                  href="https://github.com/your-username/receiptify-plus"
                  className="text-[#b3b3b3] hover:text-[#1DB954] transition-colors duration-300"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com/receiptify_plus"
                  className="text-[#b3b3b3] hover:text-[#1DB954] transition-colors duration-300"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-[#b3b3b3]">
            <p>We aim to respond to all inquiries promptly.</p>
            <p className="text-xs">© 2024 Receiptify+ | All rights reserved</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
