import { ClerkProvider } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Fail fast with a clear message if env var is missing
if (!clerkPubKey) {
  throw new Error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY in your .env file. " +
      "Copy .env.example to .env and fill in the value."
  );
}

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const update = () => {
      setDark(document.documentElement.classList.contains("dark"));
    };

    update();

    // Only re-run when the `class` attribute changes, not all attributes
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "class") {
          update();
          break;
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        variables: {
          colorBackground: dark ? "#0B1220" : "#FFFFFF",
          colorInputBackground: dark ? "#1F2937" : "#F9FAFB",
          colorText: dark ? "#FFFFFF" : "#111827",
          colorPrimary: "#6366F1",
        },
        elements: {
          card: dark
            ? "bg-gray-900 border border-gray-800 text-white"
            : "bg-white border border-gray-200",
          formFieldInput: dark ? "bg-gray-800 border-gray-700 text-white" : "",
        },
      }}
    >
      <RouterProvider router={router} />
    </ClerkProvider>
  );
}