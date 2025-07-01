import { LoginRequest } from "@interfaces/auth/LoginRequest";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@contexts/AuthContext";
import { getRoleBasedOnToken } from "../../utils/getRoleBasedOnToken";

export default function LoginForm() {
	const [formData, setFormData] = useState<LoginRequest>({
		email: "",
		password: ""
	});
	const [error, setError] = useState<string>("");
	const [successMessage, setSuccessMessage] = useState<string>("");
	const navigate = useNavigate();
	const { login } = useAuthContext();

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError("");
		setSuccessMessage("");

		try {
			await login(formData);

			// Redirigir inmediatamente según el rol, sin setTimeout
			const role = getRoleBasedOnToken();
			if (role === "ROLE_PROVEEDOR") {
				navigate("/servicios", { replace: true });
			} else if (role === "ROLE_CLIENTE") {
				navigate("/serviciosCliente", { replace: true });
			} else {
				// Fallback si no se puede determinar el rol
				navigate("/", { replace: true });
			}
		} catch (error: any) {
			setError(error.response?.data?.message || "Error al iniciar sesión");
		}
	}

	return (
		<div className="p-10">
			<h2 className="text-gray-900 mb-8 text-2xl font-semibold">
				Bienvenido a ServiMatch
			</h2>
			<form onSubmit={handleSubmit} className="space-y-5">
				<div>
					<label htmlFor="email" className="block mb-2 text-gray-700 font-medium text-sm">
						Correo electrónico
					</label>
					<input
						type="email"
						name="email"
						id="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="ejemplo@correo.com"
						className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white"
						required
					/>
				</div>

				<div>
					<label htmlFor="password" className="block mb-2 text-gray-700 font-medium text-sm">
						Contraseña
					</label>
					<input
						type="password"
						name="password"
						id="password"
						value={formData.password}
						onChange={handleChange}
						placeholder="••••••••"
						className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white"
						required
					/>
				</div>

				<button
					type="submit"
					className="w-full py-3.5 bg-blue-500 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 mt-3 hover:bg-blue-600"
				>
					Iniciar Sesión
				</button>

				{error && (
					<div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						{error}
					</div>
				)}
				{successMessage && (
					<div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
						{successMessage}
					</div>
				)}
			</form>
		</div>
	);
}