import SEOHead from '../components/SEOHead';

export default function VideoPage() {
  return (
    <>
      <SEOHead
        title="QPOS Live Demo Video — All-in-One POS in Action | Malaysia"
        description="Watch QPOS run real businesses: counter POS, self-service kiosk, QR ordering, mobile POS, AI insights & loyalty. See why F&B, retail, wellness, and gym teams pick QPOS."
        keywords="QPOS demo video, POS demo Malaysia, self service kiosk demo, QR ordering demo, restaurant POS demo Malaysia, retail POS demo, kiosk video Malaysia, POS system in action, QPOS showcase"
        url="https://qbot.now/video"
      />
    <div className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-7xl aspect-video">
        <iframe
          className="w-full h-full rounded-lg"
          src="https://www.youtube.com/embed/Y8GNPc3yAxo?autoplay=1&rel=0"
          title="QBot Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
    </>
  );
}
