import { useRef, useState } from "react";
import { DocumentIcon } from "@heroicons/react/24/outline";
import FileUpload from "./FileUpload";
import { notificationService } from "../../service/NotificationService";
import { Dialog } from "../ui/Dialog/Diaolg";
import EmbedButton from "./EmbedButton";

const API_URL = "http://localhost:3000/embed/pdf";

export default function PdfEmbedder() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>();

  async function upload() {
    setLoading(true);
    const data = new FormData();

    files?.forEach((file, i) => {
      data.append("file", file, file.name);
      data.append("name" + i, file.name);
    });
    const response = await fetch(API_URL, {
      method: "POST",
      body: data,
    });
    setLoading(false);
    if (response.ok) {
      notificationService.addNotification(
        "Files uploaded successfully",
        "The embedding is in progress. You will be notified once it is done."
      );
      setTimeout(() => {
        setOpen(false);
      }, 250);
    } else {
      notificationService.addNotification(
        "Error uploading files",
        "There was an error uploading the files. Please try again later.",
        "error"
      );
    }
  }

  const cancelButtonRef = useRef(null);

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <EmbedButton toggleOpen={toggleOpen} Icon={DocumentIcon}>
        PDF Document
      </EmbedButton>
      <Dialog open={open} setOpen={setOpen}>
        <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full  sm:mx-0 sm:h-10 sm:w-10">
              <DocumentIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6">
                Embed a PDF file
              </h3>
            </div>
          </div>
          <FileUpload onFileAdded={setFiles} />
        </div>
        {loading && (
          <div className="w-full animate-pulse  shadow text-center p-2 ">
            uploading..
          </div>
        )}
        {!loading && <div className="w-full h-10 "></div>}
        <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            disabled={!files || loading}
            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
            onClick={upload}
          >
            Upload
          </button>
          <button
            type="button"
            disabled={loading}
            className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300  sm:mt-0 sm:w-auto"
            onClick={() => setOpen(false)}
            ref={cancelButtonRef}
          >
            Cancel
          </button>
        </div>
      </Dialog>
    </>
  );
}
