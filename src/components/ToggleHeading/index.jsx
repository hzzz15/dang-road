import { useState } from "react";
import "./ToggleHeading.css";

export default function ToggleHeading({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="toggle-heading">
      <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {title}
        <span className={`arrow ${isOpen ? "open" : ""}`}>&#9660;</span> {/* ▼ 아이콘 */}
      </button>
      {isOpen && <div className="toggle-content">{children}</div>}
    </div>
  );
}
