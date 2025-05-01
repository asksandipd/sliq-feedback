import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function HomeContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Feedback Flow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This application demonstrates a modern web interface built with Next.js, Tailwind CSS, and ShadCN UI components.
            Explore the different sections using the tabs above.
          </p>
          <div className="relative aspect-video rounded-md overflow-hidden">
             <Image
               src="https://picsum.photos/1200/600"
               alt="Art assembly line with colors and paintings" // Updated alt text
               layout="fill"
               objectFit="cover"
               data-ai-hint="art assembly line colors paintings" // Updated AI hint
             />
          </div>
          <p>
            Use the "Send Feedback" button on the right to try out the feedback capturing feature. You can take snapshots, highlight areas, or hide sensitive information before submitting.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
