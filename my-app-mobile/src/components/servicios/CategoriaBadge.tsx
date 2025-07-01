
import React from 'react';

interface CategoriaBadgeProps {
    categoria: string;
}

const CategoriaBadge: React.FC<CategoriaBadgeProps> = ({ categoria }) => {
    const getCategoriaStyles = (categoria: string) => {
        switch (categoria.toUpperCase()) {
            case 'LIMPIEZA':
                return 'bg-blue-100 text-blue-800';
            case 'PLOMERIA':
                return 'bg-cyan-100 text-cyan-800';
            case 'ELECTRICISTA':
                return 'bg-yellow-100 text-yellow-800';
            case 'CARPINTERIA':
                return 'bg-amber-100 text-amber-800';
            case 'PINTURA':
                return 'bg-green-100 text-green-800';
            case 'JARDINERIA':
                return 'bg-emerald-100 text-emerald-800';
            case 'CUIDADOS':
                return 'bg-pink-100 text-pink-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoriaNombre = (categoria: string) => {
        switch (categoria.toUpperCase()) {
            case 'LIMPIEZA':
                return 'Limpieza';
            case 'PLOMERIA':
                return 'Plomería';
            case 'ELECTRICISTA':
                return 'Electricista';
            case 'CARPINTERIA':
                return 'Carpintería';
            case 'PINTURA':
                return 'Pintura';
            case 'JARDINERIA':
                return 'Jardinería';
            case 'CUIDADOS':
                return 'Cuidados';
            default:
                return categoria;
        }
    };

    return (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoriaStyles(categoria)}`}>
            {getCategoriaNombre(categoria)}
        </span>
    );
};

export default CategoriaBadge;