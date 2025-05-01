"use client";

import * as React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedbackSlider } from './feedback-slider';

export function FeedbackToggle() {
  const [isSliderOpen, setIsSliderOpen] = React.useState(false);

  return (
    <>
      {/* Position the container using fixed positioning */}
      <div data-feedback-ignore="true" className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50">
        {/* Use flexbox to arrange the icon and text vertically */}
        <Button
          variant="default"
          className="flex flex-col items-center justify-center h-auto py-3 px-2 rounded-l-md rounded-r-none shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground" // Adjusted classes for vertical layout
          onClick={() => setIsSliderOpen(true)}
          style={{ writingMode: 'vertical-rl' }} // Use writing-mode for vertical layout
        >
          {/* Ensure icon and text are displayed correctly */}
           <div className="flex flex-col items-center" style={{ writingMode: 'horizontal-tb'}}> {/* Counteract writing-mode for content */}
              <MessageSquarePlus className="h-5 w-5 mb-1" /> {/* Adjusted margin */}
              <span>Send</span>
              <span>Feedback</span>
           </div>
        </Button>
      </div>
      <FeedbackSlider isOpen={isSliderOpen} onOpenChange={setIsSliderOpen} />
    </>
  );
}
