interface EmptyTableMessageProps {
    mainMessage?: string;
    secondaryMessage?: string;
}

const EmptyTableMessage: React.FC<EmptyTableMessageProps> = ({
                                                                 mainMessage = "No tienes servicios registrados todavía",
                                                                 secondaryMessage = "Haz clic en 'Nuevo Servicio' para comenzar"
                                                             }) => {
    return (
        <div className="text-center py-16">
            <p className="text-gray-500 text-sm">
                {mainMessage}
            </p>
            <p className="text-gray-400 text-xs mt-2">
                {secondaryMessage}
            </p>
        </div>
    );
};
export default EmptyTableMessage;