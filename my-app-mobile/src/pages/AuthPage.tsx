import React, { useState } from 'react';
import { TabNavigation } from "@components/TabNavigation";
import { RegisterRequest } from "@interfaces/auth/RegisterRequest";
import RegisterForm from "@components/auth/RegisterForm";
import LoginForm from "@components/auth/LoginForm";

const AuthPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('login');
    const [formData, setFormData] = useState<RegisterRequest & { isClient: boolean }>({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        telefono: "",
        foto: "",
        descripcion: "",
        isClient: true,
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-5">
            <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden">
                <TabNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {activeTab === 'login' ? (
                    <LoginForm />
                ) : (
                    <RegisterForm
                        formData={formData}
                        setFormData={setFormData}
                    />
                )}
            </div>
        </div>
    );
};

export default AuthPage;