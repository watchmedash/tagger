import { useState } from "react";
import { ChevronDown, Server } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface ServerOption {
  name: string;
  getUrl: (...args: (string | number)[]) => string;
}

interface ServerSelectorProps {
  servers: ServerOption[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const ServerSelector = ({ servers, selectedIndex, onSelect }: ServerSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-secondary border border-border rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
      >
        <Server className="w-4 h-4" />
        <span>{t('detail.server')}: {servers[selectedIndex]?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {servers.map((server, index) => (
            <button
              key={server.name}
              onClick={() => {
                onSelect(index);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                selectedIndex === index ? "text-primary font-medium" : "text-foreground"
              }`}
            >
              {server.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServerSelector;
