import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HomeContent } from '@/components/content/home-content';
import { FeaturesContent } from '@/components/content/features-content';
import { AboutContent } from '@/components/content/about-content';
import { Testimonials } from '@/components/content/testimonials';

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <Tabs defaultValue="home" className="w-full">
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
