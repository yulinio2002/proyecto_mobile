import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import TabNavigation from '../components/TabNavigation';

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-indigo-500 to-purple-600">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
        >
          <View className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <TabNavigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
            
            {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}