import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Alice Johnson",
    title: "UX Designer",
    image: "https://picsum.photos/100/100?random=1",
    quote: "The feedback tool is incredibly intuitive! Capturing and annotating screenshots directly saves so much time explaining issues.",
    rating: 5,
  },
  {
    name: "Bob Smith",
    title: "Product Manager",
    image: "https://picsum.photos/100/100?random=2",
    quote: "Finally, a way to get precise visual feedback from users without back-and-forth emails. This is a game-changer for product iteration.",
    rating: 5,
  },
  {
    name: "Charlie Brown",
    title: "Frontend Developer",
    image: "https://picsum.photos/100/100?random=3",
    quote: "The implementation is clean and integrates smoothly. The ability to hide sections is crucial for privacy.",
    rating: 4,
  },
    {
    name: "Diana Prince",
    title: "QA Engineer",
    image: "https://picsum.photos/100/100?random=4",
    quote: "Reporting bugs with visual context is much more efficient. The drawing tools are simple but effective.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-secondary">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8 md:mb-12">What Users Are Saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col">
              <CardContent className="pt-6 pb-4 flex-grow">
                <blockquote className="text-lg italic text-muted-foreground">
                  "{testimonial.quote}"
                </blockquote>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint="person face portrait"/>
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
