import { LoaderCircle } from "lucide-react";

function Loader({
  size = "medium",
  text = "Loading...",
  showText = true,
  fullScreen = false,
  className = "",
}) {
  const loaderClassName = [
    "dm-loader",
    `dm-loader-${size}`,
    fullScreen ? "dm-loader-fullscreen" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconSize = {
    small: 18,
    medium: 26,
    large: 36,
  };

  return (
    <div className={loaderClassName}>
      <LoaderCircle
        size={iconSize[size] || iconSize.medium}
        className="dm-loader-spinner"
      />

      {showText && <span className="dm-loader-text">{text}</span>}
    </div>
  );
}

export default Loader;
