import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export const ContactForm = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Message sent!',
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-6">
      <div>
        <Input
          placeholder="Your Name"
          className="border-secondary/20 bg-background/50 text-white"
          required
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Your Email"
          className="border-secondary/20 bg-background/50 text-white"
          required
        />
      </div>
      <div>
        <Textarea
          placeholder="Your Message"
          className="min-h-[150px] border-secondary/20 bg-background/50 text-white"
          required
        />
      </div>
      <Button type="submit" className="w-full bg-accent hover:bg-accent/80">
        Send Message
      </Button>
    </form>
  );
};
