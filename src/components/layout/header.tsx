import { FeedbackToggle } from '../feedback/feedback-toggle';

// Remove Breadcrumbs import and related code

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-end px-4 md:px-6"> {/* Changed justify-between to justify-end */}
        {/* Remove Breadcrumbs component */}
        <FeedbackToggle />
      </div>
    </header>
  );
}
