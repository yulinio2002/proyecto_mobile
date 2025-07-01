interface TabNavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}
export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex bg-gray-50">
            <button
                className={`flex-1 py-5 px-6 text-center font-medium text-base transition-all duration-300 relative ${
                    activeTab === 'login'
                        ? 'text-blue-500 bg-white'
                        : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => onTabChange('login')}
            >
                Iniciar Sesión
                {activeTab === 'login' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                )}
            </button>
            <button
                className={`flex-1 py-5 px-6 text-center font-medium text-base transition-all duration-300 relative ${
                    activeTab === 'register'
                        ? 'text-blue-500 bg-white'
                        : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => onTabChange('register')}
            >
                Registrarse
                {activeTab === 'register' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                )}
            </button>
        </div>
    );
};