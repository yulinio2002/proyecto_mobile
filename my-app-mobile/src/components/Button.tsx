// src/components/Button.tsx
import { useLocation, useNavigate } from "react-router-dom";

interface ButtonProps {
  message: string;
  to?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function Button({
  message,
  to,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = to !== undefined && location.pathname === to;

  const buttonStyle = isActive
    ? "bg-primary text-white"
    : "bg-gray-200 text-gray-700 hover:bg-gray-300";

  function handleClick() {
    if (disabled) return;
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${buttonStyle} px-6 py-2 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={handleClick}
    >
      {message}
    </button>
  );
}
