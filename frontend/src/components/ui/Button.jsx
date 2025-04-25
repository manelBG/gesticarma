// src/components/ui/Button.jsx
export function Button({ children, className = '', ...props }) {
    return (
      <button
        className={`px-3 py-1.5 rounded-md border bg-white hover:bg-gray-100 text-sm text-gray-700 flex items-center gap-1 ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
  