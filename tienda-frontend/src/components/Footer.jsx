import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-custom text-center py-3 mt-auto">
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} SuperCheck
        </p>
      </div>
    </footer>
  );
};

export default Footer;