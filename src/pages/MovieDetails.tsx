import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User as UserIcon, Edit, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  year: number;
  duration: number;
  director: string;
  poster_url?: string;
  user_id: string;
}

interface Comment {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [anonymousName, setAnonymousName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadMovieAndComments();
  }, [id]);

  async function loadMovieAndComments() {
    if (!id) return;
    
    const [movieResponse, commentsResponse] = await Promise.all([
      api.getMovie(id),
      api.getComments(id)
    ]);

    if (movieResponse.data) {
      setMovie(movieResponse.data as Movie);
    }

    if (commentsResponse.data) {
      setComments((commentsResponse.data as any).comments || []);
    }

    setIsLoading(false);
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !commentContent.trim()) return;

    const response = await api.createComment(
      id, 
      commentContent,
      isAuthenticated ? undefined : anonymousName
    );

    if (response.data) {
      toast.success('Comentário adicionado!');
      setCommentContent('');
      setAnonymousName('');
      loadMovieAndComments();
    } else {
      toast.error('Erro ao adicionar comentário');
    }
  }

  async function handleDelete() {
    if (!id) return;
    
    const response = await api.deleteMovie(id);
    
    if (response.data) {
      toast.success('Filme deletado com sucesso!');
      navigate('/');
    } else {
      toast.error('Erro ao deletar filme');
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-96 bg-secondary rounded-lg" />
        <div className="h-8 bg-secondary rounded w-1/2" />
        <div className="h-24 bg-secondary rounded" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">Filme não encontrado</p>
      </div>
    );
  }

  const canEdit = isAuthenticated && user?.id === movie.user_id;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Movie Header */}
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div className="aspect-[2/3] overflow-hidden rounded-lg bg-secondary shadow-card">
          {movie.poster_url ? (
            <img 
              src={movie.poster_url} 
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Calendar className="w-24 h-24 opacity-20" />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {movie.year}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {movie.duration} minutos
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                {movie.director}
              </div>
            </div>

            <p className="text-foreground leading-relaxed">
              {movie.synopsis}
            </p>
          </div>

          {canEdit && (
            <div className="flex gap-3">
              <Button 
                onClick={() => navigate(`/edit-movie/${movie.id}`)}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Button>
              <Button 
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Deletar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <Card className="p-6 bg-gradient-card">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          Comentários ({comments.length})
        </h2>

        <form onSubmit={handleAddComment} className="space-y-4 mb-8">
          {!isAuthenticated && (
            <div className="space-y-2">
              <Label htmlFor="name">Seu nome</Label>
              <Input
                id="name"
                value={anonymousName}
                onChange={(e) => setAnonymousName(e.target.value)}
                placeholder="Digite seu nome"
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="comment">Seu comentário</Label>
            <Textarea
              id="comment"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="O que você achou do filme?"
              rows={4}
              required
            />
          </div>
          
          <Button type="submit">
            Adicionar Comentário
          </Button>
        </form>

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Seja o primeiro a comentar!
            </p>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="p-4 bg-secondary">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold">{comment.author_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <p className="text-foreground">{comment.content}</p>
              </Card>
            ))
          )}
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este filme? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
