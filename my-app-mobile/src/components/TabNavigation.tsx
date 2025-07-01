import { Pressable, Text, View } from 'react-native';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <View className="flex-row bg-gray-50">
      <Pressable
        className={`flex-1 py-5 px-6 items-center ${activeTab === 'login' ? 'bg-white' : ''}`}
        onPress={() => onTabChange('login')}
      >
        <Text className={activeTab === 'login' ? 'text-blue-500 font-medium' : 'text-gray-500'}>Iniciar Sesión</Text>
      </Pressable>
      <Pressable
        className={`flex-1 py-5 px-6 items-center ${activeTab === 'register' ? 'bg-white' : ''}`}
        onPress={() => onTabChange('register')}
      >
        <Text className={activeTab === 'register' ? 'text-blue-500 font-medium' : 'text-gray-500'}>Registrarse</Text>
      </Pressable>
    </View>
  );
};
