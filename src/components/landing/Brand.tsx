import { AudioLines } from "lucide-react";

export function Brand() {
  return (
    <a className="ff-brand" href="#inicio" aria-label="FinFlow, início">
      <span>
        <AudioLines size={23} strokeWidth={2.2} />
      </span>
      finflow<span className="ff-brand-dot">.</span>
    </a>
  );
}
