import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const features = [
  "Modern UI with Next.js & Tailwind CSS",
  "Responsive Design",
  "Breadcrumb Navigation",
  "Tabbed Interface",
  "Interactive Feedback Slider",
  "Snapshot Capture & Annotation",
  "User Testimonials Section",
];

export function FeaturesContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Core Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-3 mt-px shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Feedback Mechanism</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
           <p>The feedback slider allows users to easily report issues or suggest improvements.</p>
            <ul className="list-disc list-inside space-y-1 pl-4 text-sm text-muted-foreground">
                <li>Click "Send Feedback" on the right edge.</li>
                <li>Describe the feedback.</li>
                <li>Optionally capture snapshots of the current page.</li>
                <li>Use drawing tools (highlight/hide) to annotate snapshots.</li>
                <li>Choose whether to include account/system info.</li>
                <li>Send the feedback for review.</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
