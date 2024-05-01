import { DocumentIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function FileUpload({
  onFileAdded,
}: Readonly<{ onFileAdded: (files: File[]) => void }>) {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  useEffect(() => {
    if (files) {
      const filesArray = Array.from(files);
      onFileAdded(filesArray);
    }
  }, [files, onFileAdded]);

  return (
    <>
      {!files && (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-200 hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs">PDF Files (multiple)</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              multiple
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}
      {files && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Selected Files:</h2>
          <ul className="mt-2 space-y-2">
            {Array.from(files).map((file) => (
              <li key={file.name} className="flex items-center">
                <DocumentIcon className="w-4 h-4" />
                <span className="text-sm">{file.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
