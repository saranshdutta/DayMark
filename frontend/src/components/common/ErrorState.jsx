import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  retryText = "Try again",
  className = "",
}) {
  return (
    <div className={["dm-error-state", className].filter(Boolean).join(" ")}>
      <div className="dm-error-state-icon">
        <AlertCircle size={28} strokeWidth={1.8} />
      </div>

      <div className="dm-error-state-content">
        <h3>{title}</h3>
        <p>{message}</p>

        {onRetry && (
          <Button type="button" variant="secondary" onClick={onRetry}>
            <RefreshCw size={16} />
            {retryText}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;
