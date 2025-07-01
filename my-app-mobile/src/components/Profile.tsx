import { getMeInfo } from "@services/auth/me";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { getRoleBasedOnToken } from "src/utils/getRoleBasedOnToken";
import {AuthMeDto} from "@interfaces/auth/AuthMeDto.ts";

interface ProfileProps {
	setUserId: (id: number | null) => void;
}

export default function Profile(props: ProfileProps) {
	const [profileInfo, setProfileInfo] = useState<AuthMeDto | null>(null);
	const [isProveedor, setIsProveedor] = useState(false);

	useEffect(() => {
		fetchProfileInfo();
	}, []);

	async function fetchProfileInfo() {
		try {
			const role = getRoleBasedOnToken();
			const userData = await getMeInfo();

			if (role === "ROLE_PROVEEDOR") {
				setProfileInfo(userData);
				setIsProveedor(true);
				props.setUserId(userData.id);
			} else if (role === "ROLE_CLIENTE") {
				setProfileInfo(userData);
				setIsProveedor(false);
				props.setUserId(userData.id);
			} else {
				console.error("Error: No role found");
			}
		} catch (error) {
			console.error("Error fetching profile:", error);
		}
	}

	if (!profileInfo) {
		return <div>Cargando perfil...</div>;
	}

	return (
		<article>
			<h1 className="title text-2xl font-bold mb-3">
				{isProveedor ? "Proveedor de Servicios" : "Cliente"}
			</h1>
			<section className="flex items-center">
				<div className="w-2/5">
					<FaUserCircle className="w-full text-9xl text-gray-400" />
				</div>
				<ul className="w-3/5 ml-6 space-y-2">
					<li id="profileNames" className="text-lg font-semibold">
						{ profileInfo.nombre}
					</li>

					<li id="profileEmail" className="text-gray-600">
						<b>Email:</b> {profileInfo.email}
					</li>

					<li id="profilePhone" className="text-gray-600">
						<b>Teléfono:</b> {profileInfo.telefono}
					</li>

					{isProveedor && profileInfo.descripcion && (
						<li id="profileDescription" className="text-gray-600">
							<b>Descripción:</b> {profileInfo.descripcion}
						</li>
					)}

					<li className="text-gray-600">
						<b>Rol:</b> {isProveedor ? "Proveedor" : "Cliente"}
					</li>

				</ul>
			</section>
		</article>
	);
}