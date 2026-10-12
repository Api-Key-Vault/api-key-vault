import type { FormEvent } from "react";
import Card from "../components/atoms/Card";
import PrimaryButton from "../components/atoms/PrimaryButton";

type AddKeyModalProps = {
  onClose: () => void;
};

export default function AddKeyModal({ onClose }: AddKeyModalProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="dashboard-modal-backdrop">
      <div
        aria-labelledby="add-key-title"
        aria-modal="true"
        className="dashboard-modal-dialog"
        role="dialog"
      >
        <Card className="dashboard-card dashboard-modal-card">
          <button
            aria-label="Close add key modal"
            className="dashboard-modal-close"
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true" className="pixelart-icons-font-close" />
          </button>

          <div className="dashboard-modal-header">
            <span
              aria-hidden="true"
              className="pixelart-icons-font-key text-secondary-accent"
            />
            <h2 id="add-key-title">Add API key</h2>
          </div>

          <form className="dashboard-modal-form" onSubmit={handleSubmit}>
            <div className="dashboard-modal-field">
              <label htmlFor="api-key-name">Key name</label>
              <input
                className="dashboard-modal-input"
                id="api-key-name"
                name="name"
                placeholder="Production API key"
                required
                type="text"
              />
            </div>

            <div className="dashboard-modal-field">
              <label htmlFor="api-key-value">API key</label>
              <input
                className="dashboard-modal-input"
                id="api-key-value"
                name="value"
                placeholder="Enter your API key"
                required
                type="password"
              />
            </div>

            <div className="dashboard-modal-field">
              <label htmlFor="api-key-category">Category</label>
              <input
                className="dashboard-modal-input"
                id="api-key-category"
                name="category"
                placeholder="Development, production, or other"
                type="text"
              />
            </div>

            <div className="dashboard-modal-field">
              <label htmlFor="api-key-expires-at">Expires on</label>
              <input
                className="dashboard-modal-input"
                id="api-key-expires-at"
                name="expiresAt"
                type="date"
              />
            </div>

            <div className="dashboard-modal-actions">
              <button
                className="dashboard-modal-cancel"
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>
              <PrimaryButton className="dashboard-button dashboard-add-key-button">
                Add key
              </PrimaryButton>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
