// hooks/useSavedContacts.ts
import { useEffect, useState } from "react";

export function useSavedContacts() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/saved") // You can use a handler that wraps getSavedContactIds
      .then((res) => res.json())
      .then((data) => setSaved(data));
  }, []);

  return { saved, setSaved };
}
