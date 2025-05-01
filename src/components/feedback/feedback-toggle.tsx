"use client";

import * as React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedbackSlider } from './feedback-slider';

export function FeedbackToggle() {
  const [isSliderOpen, setIsSliderOpen] = React.useState(false);

  return (
    <>
      <div data-feedback-ignore="true" className="fixed top-1/3 right-0 transform translate-y-[-50%] z-50 feedback-slider-container">
        <Button
          variant="default" // Changed to default for better visibility, uses primary color now
          className="feedback-slider-button py-3 px-2 rounded-l-md rounded-r-none shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground" // Use accent color
          onClick={() => setIsSliderOpen(true)}
        >
          <MessageSquarePlus className="h-5 w-5 mr-1 inline-block" />
          <span className="inline-block">Send Feedback</span>
        </Button>
      </div>
      <FeedbackSlider isOpen={isSliderOpen} onOpenChange={setIsSliderOpen} />
    </>
  );
}
