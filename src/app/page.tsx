"use client"; // Add this directive because we need state

import * as React from 'react'; // Import React for state management
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HomeContent } from '@/components/content/home-content';
import { FeaturesContent } from '@/components/content/features-content';
import { AboutContent } from '@/components/content/about-content';
import { Testimonials } from '@/components/content/testimonials';
import { Breadcrumbs } from '@/components/layout/breadcrumbs'; // Import Breadcrumbs

// Define breadcrumb items type
type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Home() {
  // State to track the active tab value
  const [activeTab, setActiveTab] = React.useState('home');

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
          </TabsContent>
          <TabsContent value="features">
            <FeaturesContent />
          </TabsContent>
          <TabsContent value="about">
            <AboutContent />
          </TabsContent>
        </Tabs>
      </div>
      <Testimonials />
    </div>
  );
}
