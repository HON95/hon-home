import { Github, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const FooterSection = () => {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} Håvard Ose Nordstrand
          </p>
          <p className="font-serif text-[10px] text-amber-400/40 italic mt-1">
            "Don't you dare go Hollow."
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/wiki"
            className="text-muted-foreground hover:text-primary transition-colors"
            title="Wiki"
          >
            <BookOpen className="w-5 h-5" />
          </Link>
          <a
            href="https://github.com/HON95"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
