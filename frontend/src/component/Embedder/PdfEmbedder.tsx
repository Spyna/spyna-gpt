import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { DocumentIcon } from "@heroicons/react/24/outline";
import FileUpload from "./FileUpload";
import { notificationService } from "../../service/NotificationService";

const API_URL = "http://localhost:3000/upload";

export default function PdfEmbedder() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>();

  function upload() {
    setLoading(true);
    const data = new FormData();

    files?.forEach((file, i) => {
      data.append("file", file, file.name);
      data.append("name" + i, file.name);
    });
    fetch(API_URL, {
      method: "POST",
      body: data,
    })
      .then(() => {
        notificationService.addNotification(
          "Files uploaded successfully",
          "The embedding is in progress. You will be notified once it is done."
        );
        setTimeout(() => {
          setOpen(false);
        }, 250);
      })
      .catch((err) => {
        console.error(err);
        notificationService.addNotification(
          "Error uploading files",
          "There was an error uploading the files. Please try again later."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const cancelButtonRef = useRef(null);

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <button
        type="button"
        data-tooltip-target="tooltip-share"
        data-tooltip-placement="left"
        className="flex items-center hover:bg-blue-800 min-w-52 p-2 rounded-full"
        onClick={toggleOpen}
      >
        <div className="flex justify-center items-center w-[52px] h-[52px] hover:rounded-full me-2">
          <DocumentIcon className="w-5 h-5" />
          <span className="sr-only">PDF document</span>
        </div>
        PDF Document
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg bg-gray-200">
                  <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full  sm:mx-0 sm:h-10 sm:w-10">
                        <DocumentIcon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6"
                        >
                          Embed a PDF file
                        </Dialog.Title>
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
