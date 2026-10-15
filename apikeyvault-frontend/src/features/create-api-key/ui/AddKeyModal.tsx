import type { FormEvent } from "react";
import { Card, PrimaryButton } from "@/shared/ui";
import type { AddKeyRequest } from "../model/types";

type AddKeyModalProps = {
  onAdd: (request: AddKeyRequest) => void;
  onClose: () => void;
};

export default function AddKeyModal({ onAdd, onClose }: AddKeyModalProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onAdd({
      category: String(formData.get("category") ?? "").trim(),
      expiresAt: String(formData.get("expiresAt") ?? ""),
      name: String(formData.get("name") ?? "").trim(),
      value: String(formData.get("value") ?? "").trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        aria-labelledby="add-key-title"
        aria-modal="true"
        className="w-full max-w-[32rem]"
        role="dialog"
      >
        <Card className="dashboard-card relative m-0! flex w-full flex-col gap-5 border-2! border-border! p-5! shadow-[5px_5px_0_var(--shadow)]! max-[599px]:gap-4! max-[599px]:p-4!">
          <button
            aria-label="Close add key modal"
            className="absolute right-2 top-2 inline-flex h-6 w-6 cursor-pointer items-center justify-center border-0! bg-transparent! text-text! hover:text-primary-accent"
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true" className="pixelart-icons-font-close text-[18px]! leading-none!" />
          </button>

          <div className="flex items-center gap-2.5 pr-7">
            <span
              aria-hidden="true"
              className="pixelart-icons-font-key text-2xl! leading-none! text-secondary-accent!"
            />
            <h2 className="text-xl! leading-tight! text-text! max-[599px]:text-base!" id="add-key-title">Add API key</h2>
          </div>

          <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.25">
              <label className="text-[14px]! text-text! max-[599px]:text-[12px]!" htmlFor="api-key-name">Key name</label>
              <input
                className="min-h-8! w-full border-2! border-border! bg-surface-elevated! px-2! py-[5px]! text-[14px]! text-text! placeholder:text-text-muted focus:outline-2 focus:outline-primary-accent focus:outline-offset-2 max-[599px]:text-[12px]!"
                id="api-key-name"
                name="name"
                placeholder="Production API key"
                required
                type="text"
              />
            </div>

            <div className="flex flex-col gap-1.25">
              <label className="text-[14px]! text-text! max-[599px]:text-[12px]!" htmlFor="api-key-value">API key</label>
              <input
                className="min-h-8! w-full border-2! border-border! bg-surface-elevated! px-2! py-[5px]! text-[14px]! text-text! placeholder:text-text-muted focus:outline-2 focus:outline-primary-accent focus:outline-offset-2 max-[599px]:text-[12px]!"
                id="api-key-value"
                name="value"
                placeholder="Enter your API key"
                required
                type="password"
              />
            </div>

            <div className="flex flex-col gap-1.25">
              <label className="text-[14px]! text-text! max-[599px]:text-[12px]!" htmlFor="api-key-category">Category</label>
              <input
                className="min-h-8! w-full border-2! border-border! bg-surface-elevated! px-2! py-[5px]! text-[14px]! text-text! placeholder:text-text-muted focus:outline-2 focus:outline-primary-accent focus:outline-offset-2 max-[599px]:text-[12px]!"
                id="api-key-category"
                name="category"
                placeholder="Development, production, or other"
                type="text"
              />
            </div>

            <div className="flex flex-col gap-1.25">
              <label className="text-[14px]! text-text! max-[599px]:text-[12px]!" htmlFor="api-key-expires-at">Expires on</label>
              <input
                className="min-h-8! w-full border-2! border-border! bg-surface-elevated! px-2! py-[5px]! text-[14px]! text-text! placeholder:text-text-muted focus:outline-2 focus:outline-primary-accent focus:outline-offset-2 max-[599px]:text-[12px]!"
                id="api-key-expires-at"
                name="expiresAt"
                type="date"
              />
            </div>

            <div className="mt-1.5 flex items-center justify-end gap-3 max-[599px]:gap-2.5">
              <button
                className="inline-flex h-[23px]! min-h-[23px]! cursor-pointer items-center justify-center whitespace-nowrap border-2! border-border! bg-surface-elevated! px-1.5! py-[3px]! text-[10px]! leading-none! text-text! shadow-[2px_2px_0_var(--shadow)]! hover:bg-surface active:[transform:translateY(2px)]! min-[900px]:h-[29px]! min-[900px]:min-h-[29px]! min-[900px]:px-2.5! min-[900px]:py-[5px]! min-[900px]:text-[13px]!"
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>
              <PrimaryButton className="m-0! inline-flex h-[23px]! min-h-[23px]! items-center justify-center gap-1 whitespace-nowrap border-2! border-border! px-1.5! py-[3px]! text-[10px]! leading-none! shadow-[0_4px_4px_rgba(0,0,0,0.25)]! min-[900px]:h-[29px]! min-[900px]:min-h-[29px]! min-[900px]:px-2.5! min-[900px]:py-[5px]! min-[900px]:text-[13px]!">
                Add key
              </PrimaryButton>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
