import { Heart, Linkedin, Youtube, Twitter } from "lucide-react";
import { categories } from "@/data/categories";

const Footer = () => {
  return (
    <footer className="bg-[#0A0B0F] border-sidebar-border">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold text-gray-200 mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-gray-400/80 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/search" className="text-gray-400 hover:text-gray-400/80 transition-colors">
                  Search
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-gray-400/80 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          { /* TODO: Add Logal Section here in future for T/C Privacy Policy etc. */}


          {/* Account */}
          <div>
            <h3 className="font-semibold text-gray-200 mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <a href="/login" className="text-gray-400 hover:text-gray-400/80 transition-colors">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-400 hover:text-gray-400/80 transition-colors">
                  Register
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-gray-400 hover:text-gray-400/80 transition-colors">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-gray-200 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-400/80 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-400/80 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-400/80 transition-colors"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-sidebar-border pt-6 mt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center gap-1">
            Made with <Heart size={16} className="text-red-500" fill="currentColor" /> by unravler media
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
