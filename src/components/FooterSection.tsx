import { Github } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} Håvard Ose Nordstrand
        </p>
        <a
          href="https://github.com/HON95"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
    </footer>
  );
};

export default FooterSection;
