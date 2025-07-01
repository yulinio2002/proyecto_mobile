import { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface PhotoUploadProps {
  onPhotoChange: (uri: string | null) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoChange }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setPreview(uri);
      onPhotoChange(result.assets[0].base64 || null);
    }
  };

  return (
    <View className="space-y-2">
      <Text className="text-sm font-medium text-gray-700">Foto de perfil</Text>
      {!preview ? (
        <Pressable
          className="border-2 border-dashed border-gray-300 rounded-lg p-10 items-center"
          onPress={pickImage}
        >
          <Text className="text-gray-500 text-sm">Toca para subir una foto</Text>
        </Pressable>
      ) : (
        <View className="items-center">
          <Image source={{ uri: preview }} className="w-32 h-32 rounded-lg mb-3" />
          <Pressable onPress={pickImage}>
            <Text className="text-blue-500 text-sm">Cambiar foto</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};
