// src/components/ServiciosTable/ServiciosTableHeader.tsx
import React from 'react';

const ServiciosTableHeader: React.FC = () => {
    return (
        <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SERVICIO
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PRECIO
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CATEGORÍA
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ESTADO
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACCIONES
            </th>
        </tr>
        </thead>
    );
};

export default ServiciosTableHeader;