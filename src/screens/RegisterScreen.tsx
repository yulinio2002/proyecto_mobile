import React, { useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import type { RegisterRequest } from '../interfaces/auth/RegisterRequest';

export default function RegisterScreen() {
  const [formData, setFormData] = useState<RegisterRequest & { isClient: boolean }>({
    nombre: '', apellido: '', email: '', telefono: '', password: '', descripcion: '', foto: undefined, isClient: true
  });
  return <RegisterForm formData={formData} setFormData={setFormData} />;
}