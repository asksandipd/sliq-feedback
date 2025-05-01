import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export function AboutContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About Feedback Flow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex flex-col md:flex-row gap-6 items-center">
               <div className="md:w-2/3 space-y-3">
                 <p>
                   Feedback Flow is a demonstration project showcasing how to integrate a visual feedback mechanism into a modern web application.
                 </p>
                 <p>
                   Built with cutting-edge technologies like Next.js for server-side rendering and static site generation, Tailwind CSS for utility-first styling, and ShadCN UI for beautifully crafted components, this app provides a seamless user experience.
                 </p>
                 <p>
                   The core feature is the feedback slider, which leverages `html2canvas` to capture screenshots and provides basic annotation tools, allowing users to give precise visual feedback.
                 </p>
              </div>
               <div className="md:w-1/3 relative aspect-square">
                   <Image
                     src="https://picsum.photos/400/400"
                     alt="Team or technology collage"
                     layout="fill"
                     objectFit="cover"
                     className="rounded-lg"
                     data-ai-hint="technology abstract team"
                   />
              </div>
           </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <li>Next.js</li>
                <li>React</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>ShadCN UI</li>
                <li>Lucide Icons</li>
                <li>html2canvas</li>
                <li>Zod</li>
                <li>React Hook Form</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
