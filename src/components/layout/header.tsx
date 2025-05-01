import { FeedbackToggle } from '../feedback/feedback-toggle';

// Remove Breadcrumbs import and related code

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6"> {/* Changed justify-end to justify-between */}
        {/* Add centered title */}
        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold text-foreground">SliQ-Page-Pulse</h1>
        </div>
        <FeedbackToggle />
      </div>
    </header>
  );
}
