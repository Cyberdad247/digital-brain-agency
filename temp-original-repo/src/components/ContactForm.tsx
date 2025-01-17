import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export const ContactForm = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div>
        <Input
          placeholder="Your Name"
          className="bg-background/50 border-secondary/20 text-white"
          required
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Your Email"
          className="bg-background/50 border-secondary/20 text-white"
          required
        />
      </div>
      <div>
        <Textarea
          placeholder="Your Message"
          className="bg-background/50 border-secondary/20 text-white min-h-[150px]"
          required
        />
      </div>
      <Button type="submit" className="w-full bg-accent hover:bg-accent/80">
        Send Message
      </Button>
    </form>
  );
};