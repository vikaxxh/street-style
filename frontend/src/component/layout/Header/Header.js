import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
const Header = () => {
  return (
      <div className="wrapper">
        <div>
          <Link to="/" className="text-link">
            Home
          </Link>
        </div>
        <div>
          <Link to="/products" className="text-link">
            Products
          </Link>
        </div>
        <div>
          <Link to="/contact" className="text-link">
            Contact
          </Link>
        </div>
        <div>
          <Link to="/search" className="text-link">
            Search
          </Link>
        </div>
        <div>
          <Link to="/cart" className="text-link">
            Cart
          </Link>
        </div>
        <div>
          <Link to="/login" className="text-link">
            login
          </Link>
        </div>
      </div>
  );
};

export default Header;
