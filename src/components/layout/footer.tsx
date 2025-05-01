export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container px-4 md:px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Feedback Flow. All rights reserved.
      </div>
    </footer>
  );
}
