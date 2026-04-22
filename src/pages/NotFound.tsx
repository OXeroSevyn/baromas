import { Link } from "react-router-dom";
import { PageShell } from "@/components/calendar/PageShell";
import { Button } from "@/components/calendar/IconButton";

const NotFound = () => {
  return (
    <PageShell>
      <section className="container flex min-h-[60vh] flex-col items-center justify-center py-10 text-center">
        <div className="font-decorative text-7xl text-primary">৪০৪</div>
        <h1 className="mt-2 font-display text-3xl font-bold text-accent">পাতা পাওয়া যায়নি</h1>
        <p className="mt-2 text-muted-foreground">দুঃখিত, আপনি যে পাতাটি খুঁজছেন তা নেই।</p>
        <Link to="/" className="mt-4">
          <Button>মূল পাতায় ফিরে যান</Button>
        </Link>
      </section>
    </PageShell>
  );
};

export default NotFound;
