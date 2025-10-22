import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/Logo";
import ImageUpload from "@/components/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, User, Mail, Phone, MapPin, Award, Shield } from "lucide-react";

const Perfil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [totalPontos, setTotalPontos] = useState(0);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    avatar_url: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        navigate("/login");
        return;
      }

      setUser(authUser);

      // Carregar perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profile) {
        setFormData({
          nome: profile.nome || "",
          email: profile.email || authUser.email || "",
          telefone: profile.telefone || "",
          endereco: profile.endereco || "",
          avatar_url: profile.avatar_url || ""
        });
      } else {
        setFormData({
          nome: "",
          email: authUser.email || "",
          telefone: "",
          endereco: "",
          avatar_url: ""
        });
      }

      // Carregar total de pontos
      const { data: coletas } = await supabase
        .from('coletas')
        .select('pontos_ganhos')
        .eq('user_id', authUser.id);

      if (coletas) {
        const total = coletas.reduce((sum, c) => sum + (c.pontos_ganhos || 0), 0);
        setTotalPontos(total);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          endereco: formData.endereco,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const initials = formData.nome
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" showText={true} />
          <nav className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </nav>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Cabeçalho do Perfil */}
          <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24 border-4 border-white">
                  <AvatarImage src={formData.avatar_url} />
                  <AvatarFallback className="text-2xl bg-white text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{formData.nome || "Seu Nome"}</h2>
                  <p className="opacity-90 mb-3">{formData.email}</p>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">{totalPontos} pontos acumulados</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Edição */}
          <Card>
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <ImageUpload
                  onImageUploaded={(url) => setFormData({ ...formData, avatar_url: url })}
                  currentImage={formData.avatar_url}
                  bucket="coletas-fotos"
                  folder="avatars"
                />

                <div className="space-y-2">
                  <Label htmlFor="nome">
                    <User className="w-4 h-4 inline mr-2" />
                    Nome Completo
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Seu nome"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="h-12 bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    O e-mail não pode ser alterado
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Endereço
                  </Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    placeholder="Rua, Número - Bairro, Cidade"
                    className="h-12"
                  />
                </div>

                <div className="flex gap-4 flex-wrap">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={saving}
                  >
                    {saving ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/coletas")}
                  >
                    Minhas Coletas
                  </Button>
                  {formData.email === "lucas.coelho9280@gmail.com" && (
                    <Button
                      type="button"
                      variant="default"
                      onClick={() => navigate("/admin")}
                      className="w-full sm:w-auto"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Painel Admin
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
