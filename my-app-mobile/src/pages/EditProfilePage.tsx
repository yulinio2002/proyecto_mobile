import Profile from "@components/Profile";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { getRoleBasedOnToken } from "src/utils/getRoleBasedOnToken";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@contexts/AuthContext";
import {getMeInfo} from "@services/auth/me.ts";
import {eliminarProveedor, updateProveedor} from "@services/proveedor/proveedor.ts"
import {eliminarCliente, updateCliente} from "@services/cliente/cliente.ts";
import {Navbar} from "@components/Navbar.tsx";


export default function EditProfilePage() {
	const navigate = useNavigate();
	const [userId, setUserId] = useState<number | null>(null);
	const [formData, setFormData] = useState({
		id: 0,
		nombre: "",
		apellido: "",
		telefono: "",
		descripcion: "",
		role: ['ROLE_CLIENTE'],
	});
	const { logout } = useAuthContext();

	useEffect(() => {
		fetchUserData();
	}, []);

	async function fetchUserData() {
		try {
			const user = await getMeInfo();
			setUserId(user.id);

			if (getRoleBasedOnToken() === "ROLE_CLIENTE") {
				// Si el backend devuelve nombre completo, dividirlo
				const nombreCompleto = user.nombre || "";
				const partes = nombreCompleto.trim().split(' ');
				const nombre = partes[0] || "";
				const apellido = partes.slice(1).join(' ') || "";

				setFormData({
					id: user.id,
					nombre: nombre,
					apellido: apellido,
					descripcion: "",
					telefono: user.telefono,
					role: user.role
				});
			} else {
				// ROLE_PROVEEDOR
				setFormData({
					id: user.id,
					nombre: user.nombre,
					apellido: "",
					descripcion: user.descripcion || "",
					telefono: user.telefono,
					role: user.role
				});
			}
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	}

	function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	}

	async function fetchDeleteUser() {
		if (!userId) return;
		try {
			if (getRoleBasedOnToken() === "ROLE_PROVEEDOR") {
				await eliminarProveedor(userId);
			} else if (getRoleBasedOnToken() === "ROLE_CLIENTE") {
				await eliminarCliente(userId);
			}
			//localStorage.removeItem("token");
			logout();
			navigate("/auth/login");
		} catch (error) {
			console.error("Error deleting user:", error);
		}
	}

	async function fetchUpdateUser() {
		if (!userId) return;

		try {
			if (getRoleBasedOnToken() === "ROLE_PROVEEDOR") {
				await updateProveedor(userId, {
					nombre: formData.nombre,
					descripcion: formData.descripcion,
					telefono: formData.telefono
				});
			} else if (getRoleBasedOnToken() === "ROLE_CLIENTE") {
				await updateCliente(userId, {
					nombre: formData.nombre,
					apellido: formData.apellido,
					telefono: formData.telefono,
					foto: "",								// POR MIENTRAS NO TENEMOS UN SERVIDOR DE IMAGENES
				});
			}
		} catch (error) {
			console.error("Error updating user:", error);
		}
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
			e.preventDefault();
			await fetchUpdateUser();

			navigate("/servicios");
		}

	return (
		<div>
		<Navbar avatarUrl="#" userName={formData.nombre} />

		<main className="p-10 max-w-4xl mx-auto">

			<article className="bg-white p-8 rounded-lg shadow-lg mb-6">
				<h1 className="text-3xl font-bold mb-6">Editar Perfil</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="nombre" className="block text-sm font-medium mb-2">Nombre</label>
						<input
							type="text"
							name="nombre"
							id="nombre"
							value={formData.nombre}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
							required
						/>
					</div>

					{/* Mostrar apellido solo para clientes */}
					{getRoleBasedOnToken() === "ROLE_CLIENTE" && (
						<div>
							<label htmlFor="apellido" className="block text-sm font-medium mb-2">Apellido</label>
							<input
								type="text"
								name="apellido"
								id="apellido"
								value={formData.apellido}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
								required
							/>
						</div>
					)}

					{/* Mostrar descripción solo para proveedores */}
					{getRoleBasedOnToken() === "ROLE_PROVEEDOR" && (
						<div>
							<label htmlFor="descripcion" className="block text-sm font-medium mb-2">Descripción</label>
							<textarea
								name="descripcion"
								id="descripcion"
								value={formData.descripcion}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
								rows={4}
								maxLength={2000}
							/>
						</div>
					)}

					<div>
						<label htmlFor="telefono" className="block text-sm font-medium mb-2">Teléfono</label>
						<input
							type="tel"
							name="telefono"
							id="telefono"
							value={formData.telefono}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary "
							required
						/>
					</div>
					<button
						id="updateSubmit"
						className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-full hover:bg-primary-dark"
						type="submit"
					>
						Actualizar
					</button>
				</form>
			</article>

			<div className="bg-white p-8 rounded-lg shadow-lg mb-6">
				<Profile setUserId={setUserId} />
			</div>

			<button 
				id="deleteUser" 
				onClick={fetchDeleteUser}
				className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-full hover:bg-red-600 transition-colors"
			>
				Eliminar cuenta
			</button>
		</main>
		</div>
	);
}