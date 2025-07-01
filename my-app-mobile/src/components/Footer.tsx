import React from 'react';
import {SiInstagram, SiFacebook } from 'react-icons/si';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between">
                {/* Logo and description */}
                <div className="mb-8 md:mb-0 max-w-xs">
                    <h2 className="text-xl font-semibold text-white mb-2">ServiMarket</h2>
                    <p>
                        La plataforma que conecta a clientes con los mejores proveedores de servicios.
                    </p>
                </div>

                {/* Quick links */}
                <div className="mb-8 md:mb-0">
                    <h3 className="text-lg font-semibold text-white mb-2">Enlaces Rápidos</h3>
                    <ul className="space-y-1">
                        <li>
                            <a href="/servicios" className="hover:text-white">
                                Inicio
                            </a>
                        </li>
                        {/* <li>
                            <a href="#" className="hover:text-white">
                                Categorías
                            </a>
                        </li> */}
                        <li>
                            <a href="#" className="hover:text-white">
                                Cómo Funciona
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white">
                                Contacto
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Social icons */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Síguenos</h3>
                    <div className="flex space-x-4">
                        <a href="#" aria-label="Instagram" className="hover:text-white">
                            <SiInstagram size={20} />
                        </a>
                        <a href="#" aria-label="Facebook" className="hover:text-white">
                            <SiFacebook size={20} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom copyright */}
            <div className="border-t border-gray-700 mt-8 pt-4">
                <p className="text-center text-sm">
                    © 2025 ServiMarket. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;