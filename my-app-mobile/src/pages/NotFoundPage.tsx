import { useNavigate, useLocation } from "react-router-dom";
import {useAuthContext} from "@contexts/AuthContext.tsx";

export default function NotFoundPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { logout } = useAuthContext();

	const handleLogout = () => {
		logout(); // Esto ya maneja limpiar el token y el userId
		navigate(`/auth/login?from=${encodeURIComponent(location.pathname)}`, {
			replace: true,
		});
	};
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
			<div className="text-center">
				<h1 id="notFound" className="text-6xl font-bold text-gray-800 mb-4">
					404
				</h1>
				<h2 className="text-2xl font-semibold text-gray-600 mb-4">
					Página No Encontrada
				</h2>
				<p className="text-gray-500 mb-6">
					La ruta <code className="bg-gray-200 px-2 py-1 rounded">{location.pathname}</code> no existe
				</p>
				<div className="space-x-4">
					<button 
						id="historyBack" 
						onClick={() => navigate(-1)}
						className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
					>
						Volver Atrás
					</button>
					<button 
						onClick={handleLogout}
						className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
					>
						Ir al Login
					</button>
				</div>
			</div>
		</div>
	);
}