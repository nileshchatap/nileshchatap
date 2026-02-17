const Footer = () => {
  return (
    <footer className="hero-gradient py-8">
      <div className="container mx-auto px-6 text-center">
        <p className="text-hero-muted text-sm">
          © {new Date().getFullYear()} Nilesh Chatap. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
