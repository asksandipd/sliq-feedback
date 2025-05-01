"use client"; // Add this directive because we need state

import * as React from 'react'; // Import React for state management
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HomeContent } from '@/components/content/home-content';
import { FeaturesContent } from '@/components/content/features-content';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AboutContent } from '@/components/content/about-content';
import { Testimonials } from '@/components/content/testimonials';
import { Breadcrumbs } from '@/components/layout/breadcrumbs'; // Import Breadcrumbs
import { useToast } from '@/hooks/use-toast'; // Import useToast

// Define breadcrumb items type
type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Home() {
  // State to track the active tab value
 const [activeTab, setActiveTab] = useState('home');
 const [productInput, setProductInput] = useState('');
 const [generatedDescription, setGeneratedDescription] = useState('');
 const [isLoading, setIsLoading] = useState(false); // Add loading state
 const { toast } = useToast(); // Initialize toast

  // Function to generate breadcrumb items based on the active tab
  const getBreadcrumbItems = (tab: string): BreadcrumbItem[] => {
    const baseItems: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];
    switch (tab) {
      case 'home':
        return [...baseItems, { label: 'Home' }];
      case 'features':
        return [...baseItems, { label: 'Features' }];
      case 'about':
        return [...baseItems, { label: 'About' }];
      default:
        return baseItems;
    }
  };

 const handleGenerateDescription = async () => {
    setIsLoading(true); // Set loading state to true
    setGeneratedDescription(''); // Clear previous description

    // Basic input validation
    if (!productInput.trim()) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please enter product name and features.",
      });
      setIsLoading(false);
      return;
    }

    // Simple extraction of name and features (can be improved)
    const lines = productInput.trim().split('\n');
    const productName = lines[0] || "Unnamed Product";
    const features = lines.slice(1).filter(line => line.trim() !== '');

    if (features.length === 0) {
        toast({
            variant: "destructive",
            title: "Features Required",
            description: "Please list at least one feature on a new line.",
          });
        setIsLoading(false);
        return;
    }


    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send productName and features separately
        body: JSON.stringify({ productName, features }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.description) {
        setGeneratedDescription(data.description);
         toast({ // Success toast
            title: "Description Generated",
            description: "Product description successfully created.",
          });
      } else {
         throw new Error('No description returned from API.');
      }

    } catch (error) {
      console.error('Error generating description:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setGeneratedDescription(`Error generating description: ${errorMessage}`);
      toast({ // Error toast
        variant: "destructive",
        title: "Generation Failed",
        description: errorMessage,
      });
    } finally {
        setIsLoading(false); // Reset loading state
    }
 };

  return (
    <div className="flex flex-col">
      {/* Render Breadcrumbs dynamically */}
      <div className="container px-4 md:px-6 pt-4"> {/* Add padding top */}
         <Breadcrumbs items={getBreadcrumbItems(activeTab)} />
      </div>

      <div className="container px-4 md:px-6 pb-8 md:pb-12"> {/* Remove py, add pb */}
        {/* Pass onValueChange to update activeTab state */}
        <Tabs defaultValue="home" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="home">
            <HomeContent />
            {/* Moved AI product description generation section here */}
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-4">Generate Product Description</h2>
              <Textarea
                placeholder="Enter product name on the first line, then key features each on a new line..."
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                rows={6}
                disabled={isLoading} // Disable textarea while loading
              />
              <Button onClick={handleGenerateDescription} className="mt-4" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Description'}
              </Button>
              {generatedDescription && (
                <div className="mt-4 p-4 border rounded bg-muted whitespace-pre-wrap">{generatedDescription}</div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="features">
            <FeaturesContent />
          </TabsContent>
          <TabsContent value="about">
            <AboutContent />
            {/* Removed AI product description generation section from here */}
          </TabsContent>
        </Tabs>
      </div>
      <Testimonials />
    </div>
  );
}
