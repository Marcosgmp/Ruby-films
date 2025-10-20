import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { User as UserIcon } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    passwordConfirmation: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email
      });
    }
  }, [user]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsLoadingProfile(true);

    const response = await api.updateProfile(profileData);
    
    if (response.data) {
      updateUser(profileData);
      toast.success('Perfil atualizado com sucesso!');
    } else {
      toast.error(response.error || 'Erro ao atualizar perfil');
    }
    
    setIsLoadingProfile(false);
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.passwordConfirmation) {
      toast.error('As senhas não coincidem');
      return;
    }

    setIsLoadingPassword(true);

    const response = await api.updatePassword(
      passwordData.currentPassword,
      passwordData.newPassword,
      passwordData.passwordConfirmation
    );
    
    if (response.data) {
      toast.success('Senha atualizada com sucesso!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        passwordConfirmation: ''
      });
    } else {
      toast.error(response.error || 'Erro ao atualizar senha');
    }
    
    setIsLoadingPassword(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-gradient-card shadow-glow">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UserIcon className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Meu Perfil</CardTitle>
          <CardDescription>
            Gerencie suas informações pessoais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="password">Senha</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <form onSubmit={handleUpdateProfile} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoadingProfile}>
                  {isLoadingProfile ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="password">
              <form onSubmit={handleUpdatePassword} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordConfirmation">Confirmar Nova Senha</Label>
                  <Input
                    id="passwordConfirmation"
                    type="password"
                    value={passwordData.passwordConfirmation}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, passwordConfirmation: e.target.value }))}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoadingPassword}>
                  {isLoadingPassword ? 'Atualizando...' : 'Atualizar Senha'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
