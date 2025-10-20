import { RegisterRequest } from "@interfaces/auth/RegisterRequest";
import { ChangeEvent, FormEvent, Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@contexts/AuthContext";
import { PhotoUpload } from "@components/auth/PhotoUpload";

interface RegisterFormProps {
	formData: RegisterRequest & { isClient: boolean };
	setFormData: Dispatch<SetStateAction<RegisterRequest & { isClient: boolean }>>;
}

export default function RegisterForm(props: RegisterFormProps) {
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const navigate = useNavigate();
	const { register } = useAuthContext();

	function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value, type } = e.target;

		if (type === "radio" && name === "isClient") {
			props.setFormData(prev => ({
				...prev,
				isClient: value === "true"
			}));
		} else {
			props.setFormData(prev => ({
				...prev,
				[name]: value
			}));
		}
	}

	const handlePhotoChange = (file: File | null) => {
		if (file) {
			// Convert file to base64 string
			const reader = new FileReader();
			reader.onloadend = () => {
				props.setFormData(prev => ({
					...prev,
					foto: reader.result as string
				}));
			};
			reader.readAsDataURL(file);
		} else {
			props.setFormData(prev => ({
				...prev,
				foto: undefined
			}));
		}
	};

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();

		if (props.formData.password !== confirmPassword) {
			alert('Las contraseñas no coinciden');
			return;
		}

		try {
			await register(props.formData, props.formData.isClient);

			// Redirigir inmediatamente según el tipo de usuario registrado
			if (props.formData.isClient) {
				navigate("/serviciosCliente", { replace: true });
			} else {
				navigate("/servicios", { replace: true });
			}
		} catch (error: any) {
			console.error("Error al registrar:", error);
			alert(error.response?.data?.message || "Error al registrar");
		}
	}

	return (
		<div className="p-10">
			<h2 className="text-gray-900 mb-8 text-2xl font-semibold">
				Crear una cuenta
			</h2>
			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="flex gap-4">
					<div className="flex-1">
						<label htmlFor="nombre" className="block mb-2 text-gray-700 font-medium text-sm">
							Nombre
						</label>
						<input
							type="text"
							name="nombre"
							id="nombre"
							value={props.formData.nombre || ""}
							onChange={handleChange}
							placeholder="Tu nombre"
							className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white"
							required
						/>
					</div>
					<div className="flex-1">
						<label htmlFor="apellido" className="block mb-2 text-gray-700 font-medium text-sm">
							Apellidos
						</label>
						<input
							type="text"
							name="apellido"
							id="apellido"
							value={props.formData.apellido || ""}
							onChange={handleChange}
							placeholder="Tus apellidos"
							className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white"
						/>
					</div>
				</div>

				<div>
					<label htmlFor="email" className="block mb-2 text-gray-700 font-medium text-sm">
						Correo electrónico
					</label>
					<input
						type="email"
						name="email"
						id="email"
						value={props.formData.email || ""}
						onChange={handleChange}
						placeholder="ejemplo@correo.com"
						className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white"
						required
					/>
				</div>

				<div>
					<label htmlFor="telefono" className="block mb-2 text-gray-700 font-medium text-sm">
						Celular
					</label>
					<input
						type="tel"
						name="telefono"
						id="telefono"
						value={props.formData.telefono || ""}
						onChange={handleChange}
						placeholder="Tu número de celular"
						className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white"
						required
					/>
				</div>

				<PhotoUpload onPhotoChange={handlePhotoChange} />

				<div>
					<label htmlFor="password" className="block mb-2 text-gray-700 font-medium text-sm">
						Contraseña
					</label>
					<input
						type="password"
						name="password"
						id="password"
						value={props.formData.password || ""}
						onChange={handleChange}
						placeholder="••••••••"
						className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white"
						required
					/>
				</div>

				<div>
					<label htmlFor="confirmPassword" className="block mb-2 text-gray-700 font-medium text-sm">
						Confirmar contraseña
					</label>
					<input
						type="password"
						name="confirmPassword"
						id="confirmPassword"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="••••••••"
						className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">Tipo de usuario</label>
					<div className="flex gap-4">
						<label className="flex items-center">
							<input
								type="radio"
								name="isClient"
								id="client"
								value="true"
								checked={props.formData.isClient === true}
								onChange={handleChange}
								className="mr-2 text-blue-600 focus:ring-blue-500"
							/>
							Cliente
						</label>
						<label className="flex items-center">
							<input
								type="radio"
								name="isClient"
								id="provider"
								value="false"
								checked={props.formData.isClient === false}
								onChange={handleChange}
								className="mr-2 text-blue-600 focus:ring-blue-500"
							/>
							Proveedor
						</label>
					</div>
				</div>

				{!props.formData.isClient && (
					<div>
						<label htmlFor="descripcion" className="block mb-2 text-gray-700 font-medium text-sm">
							Descripción de servicios
						</label>
						<textarea
							name="descripcion"
							id="descripcion"
							value={props.formData.descripcion || ""}
							onChange={handleChange}
							placeholder="Describe los servicios que ofreces..."
							className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white min-h-20 resize-y"
						/>
					</div>
				)}

				<button
					type="submit"
					className="w-full py-3.5 bg-blue-500 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 mt-3 hover:bg-blue-600"
				>
					Registrarse
				</button>
			</form>
		</div>
	);
}