import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ErrorFallback() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground">
        We're sorry for the inconvenience. Please try again.
      </p>
      <Button onClick={() => router.refresh()}>Try Again</Button>
    </div>
  );
}
