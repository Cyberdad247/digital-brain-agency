import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  active: boolean;
}

export default function ExtensionsPanel() {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(false);
  const [newExtensionUrl, setNewExtensionUrl] = useState('');

  const handleAddExtension = async () => {
    if (!newExtensionUrl) return;
    
    setLoading(true);
    try {
      // Simulate extension loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newExtension: Extension = {
        id: Math.random().toString(36).substring(7),
        name: 'New Extension',
        version: '1.0.0',
        description: 'Extension loaded from URL',
        active: true
      };
      
      setExtensions(prev => [...prev, newExtension]);
      setNewExtensionUrl('');
    } catch (error) {
      console.error('Failed to load extension:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveExtension = (id: string) => {
    setExtensions(prev => prev.filter(ext => ext.id !== id));
  };

  const handleToggleExtension = (id: string) => {
    setExtensions(prev => 
      prev.map(ext => 
        ext.id === id ? { ...ext, active: !ext.active } : ext
      )
    );
  };

  return (
    <motion.div
      className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Enter extension URL..."
          value={newExtensionUrl}
          onChange={(e) => setNewExtensionUrl(e.target.value)}
        />
        <Button
          onClick={handleAddExtension}
          disabled={loading || !newExtensionUrl}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        {extensions.length > 0 ? (
          <div className="space-y-2">
            {extensions.map((ext) => (
              <motion.div
                key={ext.id}
                className="flex items-center justify-between p-2 border rounded-lg"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{ext.name}</h3>
                    <Badge variant="secondary">{ext.version}</Badge>
                    <Badge variant={ext.active ? 'default' : 'destructive'}>
                      {ext.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ext.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleExtension(ext.id)}
                  >
                    {ext.active ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveExtension(ext.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            No extensions installed
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
}
