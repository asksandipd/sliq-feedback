import { Breadcrumbs } from './breadcrumbs';
import { FeedbackToggle } from '../feedback/feedback-toggle';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Current Page' }, // Example, replace with dynamic logic if needed
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Breadcrumbs items={breadcrumbItems} />
        <FeedbackToggle />
      </div>
    </header>
  );
}
