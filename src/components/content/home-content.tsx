import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssemblyLineAnimation } from './assembly-line-animation'; // Import the new animation component

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
          {/* Replace the static Image with the animation component */}
          <AssemblyLineAnimation />
          <p>
            Use the "Send Feedback" button on the right to try out the feedback capturing feature. You can take snapshots, highlight areas, or hide sensitive information before submitting.
          </p>
          {/* The AI Generation section is now directly in page.tsx under the Home tab */}
        </CardContent>
      </Card>
    </div>
  );
}
