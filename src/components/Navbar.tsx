import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-white font-bold">Sistema de Envíos</Link>
        <div className="space-x-4">
          <Link to="/" className="text-white">Inicio</Link>
          <Link to="/tracking" className="text-white">Seguimiento</Link>
          <Link to="/shipping" className="text-white">Envíos</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
