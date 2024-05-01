import { useState } from "react";
import PdfEmbedder from "./PdfEmbedder";
import TextFileEmbedder from "./TextFileEmbedder";
import WebsiteEmbedder from "./WebsiteEmbedder";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function Emebedder() {
  const [menuOpen, setMenuOpen] = useState(false);
  function toggleMenu() {
    setMenuOpen((yes) => !yes);
  }

  const embeddingTypes = [
    {
      component: PdfEmbedder,
      name: "PDF file",
    },
    {
      component: WebsiteEmbedder,
      name: "website link",
    },
    {
      component: TextFileEmbedder,
      name: "Text document",
    },
  ];

  return (
    <div data-dial-init className="fixed bottom-6 start-6 group">
      <div
        id="speed-dial-menu-bottom-left"
        className={
          "flex-col items-start mb-4 space-y-2 transition-opacity " +
          (menuOpen ? "flex" : "invisible opacity-0 pointer-events-none")
        }
      >
        {embeddingTypes.map((document) => (
          <document.component key={document.name} />
        ))}
      </div>
      <button
        className="flex items-center rounded-full p-0.5 cursor-pointer"
        onClick={toggleMenu}
        data-dial-toggle="speed-dial-menu-bottom-left"
        aria-controls="speed-dial-menu-bottom-left"
        aria-expanded="false"
      >
        <div className="flex items-center justify-center bg-blue-700 rounded-full w-14 h-14">
          <PlusIcon className="w-8 h-8 transition-transform group-hover:rotate-45" />
        </div>
        {!menuOpen && <span className="mx-2">Add a document</span>}
      </button>
    </div>
  );
}
