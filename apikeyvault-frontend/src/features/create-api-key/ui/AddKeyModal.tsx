import { useEffect, useRef, type FormEvent } from "react";
import { Card, PrimaryButton } from "@/shared/ui";
import type { AddKeyRequest } from "../model/types";

type AddKeyModalProps = {
  onAdd: (request: AddKeyRequest) => void;
  onClose: () => void;
  isSubmitting?: boolean;
  error?: string | null;
};

export function AddKeyModal({
  onAdd,
  onClose,
  isSubmitting = false,
  error,
}: AddKeyModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (dialog !== null && !dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog?.open) {
        dialog.close();
      }
      if (opener?.isConnected) {
        opener.focus();
      }
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    onAdd({
      category: String(formData.get("category") ?? "").trim(),
      expiresAt: String(formData.get("expiresAt") ?? ""),
      name: String(formData.get("name") ?? "").trim(),
      value: String(formData.get("value") ?? "").trim(),
    });
  }

  return (
    <dialog
      aria-labelledby="add-key-title"
      className="fixed inset-0 z-50 m-0! h-dvh w-screen max-h-none! max-w-none! overflow-visible border-0! bg-transparent! p-4! open:flex open:items-center open:justify-center backdrop:bg-black/40"
      onCancel={(event) => {
        event.preventDefault();
        if (!isSubmitting) {
          onClose();
        }
      }}
      onClick={(event) => {
        if (!isSubmitting && event.target === event.currentTarget) {
          onClose();
        }
      }}
      ref={dialogRef}
    >
      <div className="w-full max-w-lg">
        <Card className="relative m-0! flex max-h-[calc(100dvh-2rem)] w-full shrink-0 flex-col gap-3 overflow-y-auto px-8! py-10! max-[599px]:p-4! max-[599px]:px-4! min-[900px]:px-12!">
          <button
            autoFocus
            aria-label="Close add key modal"
            className="absolute right-2 top-2 inline-flex h-6 w-6 cursor-pointer items-center justify-center border-0! bg-transparent! text-text! hover:text-primary-accent disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true" className="pixelart-icons-font-close text-[18px]! leading-none!" />
          </button>

          <div className="flex shrink-0 items-center justify-center px-7">
            <h2 className="text-xl! leading-tight! text-text! max-[599px]:text-base!" id="add-key-title">Add key</h2>
          </div>

          <form className="flex shrink-0 flex-col gap-2.5" onSubmit={handleSubmit}>
            {error ? (
              <p
                aria-live="polite"
                className="border-2! border-error! bg-surface-elevated! p-2! text-[11px]! leading-tight! text-error!"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <div className="flex flex-col gap-1">
              <label className="text-[14px]! text-text! max-[599px]:text-[12px]!" htmlFor="api-key-name">Key name</label>
              <input
                className="min-h-8! w-full border-2! border-border! bg-surface-elevated! px-2! py-1.25! text-[14px]! text-text! placeholder:text-text-muted focus:outline-2 focus:outline-primary-accent focus:outline-offset-2 max-[599px]:text-[12px]!"
                disabled={isSubmitting}
                id="api-key-name"
                maxLength={50}
                minLength={3}
                name="name"
                placeholder="eg. OpenRouter key"
                required
                type="text"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[14px]! text-text! max-[599px]:text-[12px]!" htmlFor="api-key-value">API key</label>
              <input
                className="min-h-8! w-full border-2! border-border! bg-surface-elevated! px-2! py-1.25! text-[14px]! text-text! placeholder:text-text-muted focus:outline-2 focus:outline-primary-accent focus:outline-offset-2 max-[599px]:text-[12px]!"
                disabled={isSubmitting}
                id="api-key-value"
                name="value"
                placeholder="[Paste here]"
                required
                type="password"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[14px]! text-text! max-[599px]:text-[12px]!" htmlFor="api-key-category">Category</label>
              <input
                className="min-h-8! w-full border-2! border-border! bg-surface-elevated! px-2! py-1.25! text-[14px]! text-text! placeholder:text-text-muted focus:outline-2 focus:outline-primary-accent focus:outline-offset-2 max-[599px]:text-[12px]!"
                disabled={isSubmitting}
                id="api-key-category"
                maxLength={50}
                minLength={3}
                name="category"
                placeholder="eg. Development, production, or other"
                type="text"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[14px]! text-text! max-[599px]:text-[12px]!" htmlFor="api-key-expires-at">Expires on</label>
              <input
                className="min-h-8! w-full border-2! border-border! bg-surface-elevated! px-2! py-1.25! text-[14px]! text-text! placeholder:text-text-muted focus:outline-2 focus:outline-primary-accent focus:outline-offset-2 max-[599px]:text-[12px]!"
                disabled={isSubmitting}
                id="api-key-expires-at"
                name="expiresAt"
                type="date"
              />
            </div>

            <p className="text-center text-xs md:text-sm! text-text-muted">The key is encrypted before being stored</p>
              <PrimaryButton
                className="mt-2! m-auto! inline-flex! w-[90%] align-middle items-center justify-center gap-2 whitespace-nowrap text-sm! leading-none! disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
              >
                <span className="pixelart-icons-font-plus" />
                Add key
              </PrimaryButton>
          </form>
        </Card>
      </div>
    </dialog>
  );
}
