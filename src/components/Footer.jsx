import React from "react";

const Footer = () => {
  const footerStyle = {
    backgroundColor: "#0d0d0d",
    color: "#cccccc",
    textAlign: "center",
    padding: "20px 10px",
    fontSize: "1rem",
    marginTop: "auto",
    borderTop: "1px solid #333",
  };

  const iconContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "10px", // reduced gap
    marginTop: "10px",
  };

  const iconStyle = {
    width: "28px",
    height: "28px",
    filter: "brightness(0.8)",
    transition: "transform 0.3s ease, filter 0.3s ease",
  };

  const iconHoverStyle = {
    transform: "scale(1.1)",
    filter: "brightness(1.2)",
  };

  return (
    <footer style={footerStyle}>
      <p>
        Developed by <strong>Mahesh</strong>
      </p>
      <p>Contact: <a href="mailto:mahesh20104@gmail.com" style={{ color: "#61dafb", textDecoration: "none" }}>mahesh20104@gmail.com</a></p>
      <div style={iconContainerStyle}>
        <a
          href="https://github.com/Mahesh5f4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
            alt="GitHub"
            style={iconStyle}
            onMouseOver={(e) => Object.assign(e.target.style, iconHoverStyle)}
            onMouseOut={(e) => Object.assign(e.target.style, iconStyle)}
          />
        </a>
        <a
          href="https://in.linkedin.com/in/mahesh-mahi-93024b2b2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
            alt="LinkedIn"
            style={iconStyle}
            onMouseOver={(e) => Object.assign(e.target.style, iconHoverStyle)}
            onMouseOut={(e) => Object.assign(e.target.style, iconStyle)}
          />
        </a>
        <a
          href="https://www.instagram.com/mahesh_16_mahi/profilecard/?igsh=eGVqdDNxMndja2hx"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
            alt="Instagram"
            style={iconStyle}
            onMouseOver={(e) => Object.assign(e.target.style, iconHoverStyle)}
            onMouseOut={(e) => Object.assign(e.target.style, iconStyle)}
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
