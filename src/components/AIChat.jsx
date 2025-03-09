import dynamic from 'next/dynamic';
const VoiceRecorder = dynamic(() => import('./VoiceRecorder'), {
  ssr: false,
  loading: () => <div className="voice-loading">Initializing AI assistant...</div>,
});

export default function VoiceChat() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<VoiceLoadingSkeleton />}>
        <VoiceRecorder />
      </Suspense>
    </ErrorBoundary>
  );
}
