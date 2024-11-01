import React from 'react';
import { Instagram, Twitter, Linkedin, Mail } from 'lucide-react';
import logo from "./assets/logo.png";

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/stayheaven', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/stayheaven', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/stayheaven', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:support@stayheaven.com', label: 'Email' }
  ];

  const supportLinks = [
    { href: '#help-centre', text: 'Help Centre' },
    { href: '#aircover', text: 'AirCover' },
    { href: '#anti-discrimination', text: 'Anti-discrimination' },
    { href: '#disability-support', text: 'Disability support' },
    { href: '#cancellation-options', text: 'Cancellation options' },
    { href: '#report-concern', text: 'Report neighbourhood concern' }
  ];

  return (
    <footer className="bg-white text-emerald-950 py-12 font-['Josefin_Sans']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo Section */}
          <div className="space-y-6">
            <img 
              src={logo}
              alt="StayHeaven Logo" 
              className="h-8 w-auto"
            />
            <p className="text-stone-700 text-sm leading-relaxed">
              StayHeaven is an Indian marketplace that connects people looking to book and create hotels. 
              It has revolutionized the travel industry by enabling hosts to offer unique, often 
              cost-effective lodging options to guests in country.
            </p>
          </div>

          {/* Support Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-emerald-950">Support</h3>
            <nav className="flex flex-col space-y-4">
              {supportLinks.map((link) => (
                <a
                  key={link.text}
                  href={link.href}
                  className="text-stone-600 hover:text-emerald-800 transition-colors duration-200 text-sm"
                >
                  {link.text}
                </a>
              ))}
            </nav>
          </div>

          {/* Social Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-emerald-950">Connect With Us</h3>
            <div className="flex flex-col space-y-4 md:items-start">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-stone-600 hover:text-emerald-800 transition-colors duration-200 group"
                >
                  <social.icon className="w-5 h-5 group-hover:text-emerald-700" />
                  <span className="text-sm">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <p className="text-center text-stone-500 text-sm">
            © {new Date().getFullYear()} StayHeaven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;