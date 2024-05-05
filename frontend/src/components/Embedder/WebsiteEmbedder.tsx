import { useRef, useState } from "react";
import { DocumentIcon, InformationCircleIcon, LinkIcon } from "@heroicons/react/24/outline";
import { notificationService } from "../../service/NotificationService";
import { Dialog } from "../ui/Dialog/Diaolg";
import EmbedButton from "./EmbedButton";
import { z } from "zod";

const API_URL = "http://localhost:3000/embed/url";

const formValidation = z.string().url();

export default function WebsiteEmbedder() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | undefined>();

  function onTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUrl(event.target.value);
    const validation = formValidation.safeParse(url);
    if (validation.success) {
      setError(undefined);
    }
  }

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validation = formValidation.safeParse(url);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    } else {
      setError(undefined);
    }
    setLoading(true);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    setLoading(false);
    if (response.ok) {
      notificationService.addNotification(
        "Text send successfully",
        "The embedding is in progress. You will be notified once it is done."
      );
      setTimeout(() => {
        setOpen(false);
      }, 250);
    } else {
      notificationService.addNotification(
        "Error uploading the text",
        "There was an error uploading the text. Please try again later.",
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
      <EmbedButton Icon={LinkIcon} toggleOpen={toggleOpen}>
        Website link
      </EmbedButton>
      <Dialog open={open} setOpen={setOpen}>
        <form onSubmit={upload}>
          <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full  sm:mx-0 sm:h-10 sm:w-10">
                <DocumentIcon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6">
                  Embed a website
                </h3>
              </div>
            </div>
            <div>
              <p className="text-sm shadow p-2 my-3 rounded">
                <InformationCircleIcon className="w-5 h-5 inline-block me-1" />
                Get the text content from an url and all the relative links in
                the page
              </p>
              <label
                htmlFor="title"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Website url *
              </label>
              <input
                type="text"
                id="title"
                className={
                  "bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  " +
                  (error ? "border-red-500" : "border-gray-300")
                }
                placeholder="a title for this document"
                required
                value={url}
                onChange={onTextChange}
              />
              <p className="text-red-500 text-sm min-h-6">{error}</p>
            </div>
          </div>
          {loading && (
            <div className="w-full animate-pulse  shadow text-center p-2 ">
              uploading..
            </div>
          )}
          {!loading && <div className="w-full h-10 "></div>}
          <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="submit"
              disabled={url === "" || loading}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
            >
              Embed
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
        </form>
      </Dialog>
    </>
  );
}
