import { useEffect } from "react";
import { X } from "lucide-react";

function Modal({
  isOpen = false,
  onClose,
  title,
  description,
  children,
  size = "medium",
  showClose = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = "",
}) {
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEscape, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalClassName = ["dm-modal", `dm-modal-${size}`, className]
    .filter(Boolean)
    .join(" ");

  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="dm-modal-overlay"
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        className={modalClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dm-modal-title" : undefined}
      >
        {(title || showClose) && (
          <div className="dm-modal-header">
            <div className="dm-modal-heading">
              {title && <h2 id="dm-modal-title">{title}</h2>}

              {description && <p>{description}</p>}
            </div>

            {showClose && (
              <button
                type="button"
                className="dm-modal-close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            )}
          </div>
        )}

        <div className="dm-modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
