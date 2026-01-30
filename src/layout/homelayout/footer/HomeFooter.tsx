
const HomeFooter = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 font-mona">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo & Description */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <img
                src="/../icons/kit-logo-icon.svg"
                alt="KIT Logo"
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-[#000000] leading-relaxed font-mona">
              Securely store, manage, and share your health information with
              confidence. Designed to give you control, privacy, and access when
              it matters most.
            </p>
          </div>

          {/* Legal & Policies */}
          <div className="ml-10">
            <h4 className="mb-4 text-sm font-semibold text-[#000000]">
              Legal &amp; Policies
            </h4>
            <ul className="space-y-2 text-sm text-[#000000]">
              <li>
                <a href={`/terms-condition`} className="hover:text-[#000000]">
                  Terms and Condition
                </a>
              </li>
              <li>
                <a href={`/privacy-policy`} className="hover:text-[#000000]">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#000000]">
              Support &amp; Contact
            </h4>
            <p className="text-sm text-[#000000]">
              <a
                href="mailto:contact@mykitbuddy.com"
                className="hover:text-gray-900"
              >
                contact@mykitbuddy.com
              </a>
            </p>
          </div>

          {/* Support Hours */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#000000]">
              Support hours
            </h4>
            <p className="text-sm text-[#000000]">
              Monday–Friday, 9:00 AM – 6:00 PM
              <br />
              <span className="text-xs text-[#000000]">(Local Time)</span>
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center text-sm text-[#000000] mt-6">
          © 2026 Seva Healthcare IT LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
