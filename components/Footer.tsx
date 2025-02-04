import Link from "next/link";
import { Github, Twitter, Mail, Music2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/30 bg-gradient-to-b from-zinc-950 to-black text-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Branding Section */}
          <div className="flex flex-col space-y-5">
            <div className="flex items-center space-x-3">
              <Music2 className="h-7 w-7 text-green-500" />
              <h3 className="text-2xl font-bold text-green-500">Spotifai</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              Transform your Spotify listening history into beautiful receipts
              and share your music taste with the world.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-5 sm:items-center lg:items-start">
            <h3 className="text-lg font-semibold text-zinc-100">Quick Links</h3>
            <div className="flex flex-col space-y-3 sm:items-center lg:items-start">
              <Link
                href="/about"
                className="text-zinc-400 hover:text-green-500 transition-colors duration-200 flex items-center space-x-2 group"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-700 group-hover:bg-green-500 transition-colors duration-200"></span>
                <span>About</span>
              </Link>
              <Link
                href="/contact"
                className="text-zinc-400 hover:text-green-500 transition-colors duration-200 flex items-center space-x-2 group"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-700 group-hover:bg-green-500 transition-colors duration-200"></span>
                <span>Contact</span>
              </Link>
              <Link
                href="/privacy-policy"
                className="text-zinc-400 hover:text-green-500 transition-colors duration-200 flex items-center space-x-2 group"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-700 group-hover:bg-green-500 transition-colors duration-200"></span>
                <span>Privacy Policy</span>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-col space-y-5 sm:items-center lg:items-start">
            <h3 className="text-lg font-semibold text-zinc-100">Features</h3>
            <ul className="flex flex-col space-y-3 sm:items-center lg:items-start text-zinc-400">
              <li className="flex items-center space-x-3 group">
                <span className="text-green-500 text-lg group-hover:scale-125 transition-transform">
                  •
                </span>
                <span className="group-hover:text-zinc-300 transition-colors">
                  Receipt Generation
                </span>
              </li>
              <li className="flex items-center space-x-3 group">
                <span className="text-green-500 text-lg group-hover:scale-125 transition-transform">
                  •
                </span>
                <span className="group-hover:text-zinc-300 transition-colors">
                  Spotify Integration
                </span>
              </li>
              <li className="flex items-center space-x-3 group">
                <span className="text-green-500 text-lg group-hover:scale-125 transition-transform">
                  •
                </span>
                <span className="group-hover:text-zinc-300 transition-colors">
                  Custom Styling
                </span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col space-y-5 sm:items-center lg:items-start">
            <h3 className="text-lg font-semibold text-zinc-100">
              Connect With Us
            </h3>
            <div className="flex space-x-5">
              <Link href="https://github.com" target="_blank" className="group">
                <div className="p-3 rounded-full bg-zinc-900 text-zinc-400 hover:bg-green-500/10 hover:text-green-500 transition-all duration-200 hover:scale-110">
                  <Github className="h-5 w-5" />
                </div>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="group"
              >
                <div className="p-3 rounded-full bg-zinc-900 text-zinc-400 hover:bg-green-500/10 hover:text-green-500 transition-all duration-200 hover:scale-110">
                  <Twitter className="h-5 w-5" />
                </div>
              </Link>
              <Link href="mailto:contact@spotifai.com" className="group">
                <div className="p-3 rounded-full bg-zinc-900 text-zinc-400 hover:bg-green-500/10 hover:text-green-500 transition-all duration-200 hover:scale-110">
                  <Mail className="h-5 w-5" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-800/50">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
              © {new Date().getFullYear()} Spotifai. All rights reserved.
            </p>
            <p className="text-sm text-zinc-400 flex items-center space-x-2">
              <span className="hover:text-zinc-300 transition-colors">
                Made with
              </span>
              <span className="text-green-500 animate-pulse">♥️</span>
              <span className="hover:text-zinc-300 transition-colors">
                for music lovers
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
