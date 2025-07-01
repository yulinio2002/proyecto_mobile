
import React from 'react';
import ServiciosTableHeader from './ServiciosTableHeader';
import ServicioRow from './ServicioRow';
import EmptyTableMessage from './EmptyTableMessage';
import { ServicioResponse } from "@interfaces/servicio/ServicioResponse";

interface ServiciosTableProps {
    servicios: ServicioResponse[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onViewSchedule: (id: number) => void;
    onViewReviews: (id: number) => void;
    onToggleStatus: (id: number, currentStatus: boolean) => void;
}

const ServiciosTable: React.FC<ServiciosTableProps> = ({
                                                           servicios,
                                                           onEdit,
                                                           onDelete,
                                                           onViewSchedule,
                                                           onViewReviews,
                                                           onToggleStatus
                                                       }) => {
    return (
  
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full">
                <ServiciosTableHeader />
                <tbody className="bg-white divide-y divide-gray-200">
                {servicios.map((servicio) => (
                    <ServicioRow
                        key={servicio.id}
                        servicio={servicio}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onViewSchedule={onViewSchedule}
                        onViewReviews={onViewReviews}
                        onToggleStatus={onToggleStatus}
                    />
                ))}
                </tbody>
            </table>

            {servicios.length === 0 && <EmptyTableMessage />}
        </div>
    );
};

export default ServiciosTable;