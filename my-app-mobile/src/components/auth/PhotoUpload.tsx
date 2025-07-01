import {ChangeEvent, useState} from "react";

interface PhotoUploadProps {
    onPhotoChange: (file: File | null) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoChange }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
                onPhotoChange(file);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                Foto de perfil
            </label>
            {!preview ? (
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer transition-all duration-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50"
                    onClick={() => document.getElementById('photo-input')?.click()}
                >
                    <div className="w-12 h-12 mx-auto mb-3 text-gray-400">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21,15 16,10 5,21"/>
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm">Haz clic para subir una foto</p>
                </div>
            ) : (
                <div className="text-center">
                    <img
                        src={preview}
                        alt="Vista previa"
                        className="max-w-48 max-h-48 rounded-lg mx-auto mb-3"
                    />
                    <button
                        type="button"
                        className="text-blue-500 text-sm hover:text-blue-600"
                        onClick={() => {
                            setPreview(null);
                            const input = document.getElementById('photo-input') as HTMLInputElement;
                            if (input) input.value = '';
                        }}
                    >
                        Cambiar foto
                    </button>
                </div>
            )}
            <input
                type="file"
                id="photo-input"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
            />
        </div>
    );
};
