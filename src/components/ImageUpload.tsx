import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  bucket?: string;
  folder?: string;
}

const ImageUpload = ({ 
  onImageUploaded, 
  currentImage, 
  bucket = "coletas-fotos",
  folder 
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    setUploading(true);

    try {
      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Você precisa estar logado');
        return;
      }

      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${user.id}/${folder}/${fileName}` : `${user.id}/${fileName}`;

      // Upload para Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onImageUploaded(publicUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label>Foto</Label>
      
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-border">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
        >
          {uploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-sm text-muted-foreground">Enviando...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-sm font-medium">Clique para selecionar uma imagem</p>
                <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP (máx. 5MB)</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
};

export default ImageUpload;
