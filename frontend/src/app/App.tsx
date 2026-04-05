import { ClerkProvider } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const update = () => {
      setDark(document.documentElement.classList.contains("dark"));
    };

    update();

    const observer = new MutationObserver(update);
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
          formFieldInput: dark
            ? "bg-gray-800 border-gray-700 text-white"
            : "",
        },
      }}
    >
      <RouterProvider router={router} />
    </ClerkProvider>
  );
}