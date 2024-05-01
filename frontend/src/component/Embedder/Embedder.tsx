import { DocumentTextIcon, LinkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import PdfEmbedder from "./PdfEmbedder";

export default function Emebedder() {
  const [menuOpen, setMenuOpen] = useState(false);
  function toggleMenu() {
    setMenuOpen((yes) => !yes);
  }

  const embeddingTypes = [
    {
      component: () => <LinkIcon className="w-5 h-5" />,
      name: "Web page",
      description: "Embed a web page",
    },
    {
      component: PdfEmbedder,
      name: "PDF file",
      description: "Embed a pdf file",
    },
    {
      component: () => <DocumentTextIcon className="w-5 h-5" />,
      name: "Text document",
      description: "Embed a text document",
    },
  ];

  return (
    <div data-dial-init className="fixed bottom-6 start-6 group">
      <div
        id="speed-dial-menu-bottom-left"
        className={
          "flex-col items-start mb-4 space-y-2 " +
          (menuOpen ? "flex" : "hidden")
        }
      >
        {embeddingTypes.map((document) => (
          <document.component key={document.name} />
        ))}
      </div>
      <button
        className="flex items-center rounded-full  p-2 cursor-pointer"
        onClick={toggleMenu}
        data-dial-toggle="speed-dial-menu-bottom-left"
        aria-controls="speed-dial-menu-bottom-left"
        aria-expanded="false"
      >
        <div className="flex items-center justify-center bg-blue-700 rounded-full w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
          <svg
            className="w-5 h-5 transition-transform group-hover:rotate-45"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </div>
        {!menuOpen && <span className="mx-2">Add a document</span>}
      </button>
    </div>
  );
}
