import { Mail, Github, Linkedin, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-background px-6 py-32 text-foreground"
    >
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Get in touch
        </p>
        <h2 className="mt-4 font-display text-5xl font-semibold tracking-tight md:text-7xl">
          Want to talk?
          <br />
          <span className="text-foreground/50">Drop a line.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Always happy to chat — about projects, training, or where to hike
          next. Email&apos;s the fastest way to reach me.
        </p>

        <a
          href="mailto:zchung@usc.edu"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-base font-medium text-background transition-transform hover:-translate-y-0.5"
        >
          <Mail className="h-5 w-5" />
          zchung@usc.edu
        </a>

        <div className="mt-12 flex flex-col items-center justify-center gap-6 text-sm text-muted-foreground sm:flex-row sm:gap-10">
          <a
            href="https://github.com/ZacharyTChung"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            github.com/ZacharyTChung
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
            linkedin.com/in/zacharychung
          </a>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Los Angeles, CA · open to relocating
          </span>
        </div>
      </div>

      <footer className="relative mt-24 border-t border-border pt-8 text-center text-xs text-muted-foreground">
        <p>
          Built with Next.js and Tailwind. © {new Date().getFullYear()} Zachary
          Chung.
        </p>
      </footer>
    </section>
  );
}
