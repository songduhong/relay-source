import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { StaticPage } from "@/components/StaticPage";
import { postJson, type QuoteResponse } from "@/lib/api";
import html from "@/content/quote.html?raw";

export default function QuotePage() {
  const submitQuote = useMutation({
    mutationFn: (payload: Record<string, unknown>) => postJson<QuoteResponse>("/api/quotes", payload),
    onSuccess: (data) => {
      const button = document.querySelector<HTMLButtonElement>("#quote-form form button[type=submit]");
      if (button) {
        button.textContent = `Quote ${data.code} received`;
        button.disabled = true;
      }
      window.alert(data.message);
    },
    onError: (error: Error) => {
      window.alert(error.message);
    }
  });

  useEffect(() => {
    document.title = "Get a quote — SourcingRelay";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Submit a mixed-SKU buy list and receive supplier options, SKU-level landed costs and risk flags.");

    const form = document.querySelector<HTMLFormElement>("#quote-form form");
    const fileInput = document.getElementById("file-input") as HTMLInputElement | null;
    const filePreview = document.getElementById("file-preview");
    const summaryFile = document.getElementById("summary-file");
    const categorySummary = document.getElementById("summary-category");
    const quoteEmail = document.getElementById("quote-email") as HTMLInputElement | null;
    const summaryEmail = document.getElementById("summary-email");

    const updateCategorySummary = () => {
      if (!categorySummary) return;
      const count = document.querySelectorAll('input[name="category"]:checked').length;
      categorySummary.textContent = `${count} selected`;
    };

    const updateEmailSummary = () => {
      if (summaryEmail && quoteEmail) summaryEmail.textContent = quoteEmail.value.trim() || "Not provided";
    };

    const handleFileChange = () => {
      if (!fileInput || !filePreview) return;
      filePreview.innerHTML = "";
      const file = fileInput.files?.[0];
      if (form) form.dataset.hasFile = file ? "true" : "";
      if (!file) {
        if (summaryFile) summaryFile.textContent = "No file";
        return;
      }
      const row = document.createElement("div");
      row.className = "upload-row";
      const name = document.createElement("span");
      name.innerHTML = `<strong></strong><br><span class=\"small muted\"></span>`;
      name.querySelector("strong")!.textContent = file.name;
      name.querySelector(".muted")!.textContent = `${Math.max(1, Math.round(file.size / 1024))} KB`;
      const remove = document.createElement("button");
      remove.className = "btn btn-ghost";
      remove.type = "button";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        fileInput.value = "";
        filePreview.innerHTML = "";
        if (summaryFile) summaryFile.textContent = "No file";
      });
      row.append(name, remove);
      filePreview.append(row);
      if (summaryFile) summaryFile.textContent = file.name;
    };

    const handleSubmit = (event: Event) => {
      event.preventDefault();
      if (!form || !quoteEmail) return;
      const email = quoteEmail.value.trim();
      const notes = (document.getElementById("notes") as HTMLTextAreaElement | null)?.value.trim() ?? "";
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || (!form.dataset.hasFile && notes.length < 10)) {
        window.alert("Please provide your work email and either a buy-list file or a requirement description of at least 10 characters.");
        return;
      }
      const button = form.querySelector<HTMLButtonElement>("button[type=submit]");
      submitQuote.mutate({
        email,
        targetPrice: (document.getElementById("target-price") as HTMLInputElement | null)?.value,
        quantityRange: (document.getElementById("qty") as HTMLSelectElement | null)?.value,
        launchDate: (document.getElementById("launch") as HTMLInputElement | null)?.value,
        salesChannel: (document.getElementById("channel") as HTMLSelectElement | null)?.value,
        destination: (document.getElementById("destination") as HTMLInputElement | null)?.value,
        shippingMethod: (document.getElementById("freight") as HTMLSelectElement | null)?.value,
        notes,
        categoryCount: document.querySelectorAll('input[name="category"]:checked').length,
        hasAttachment: Boolean(form.dataset.hasFile)
      });
      if (button) button.textContent = submitQuote.isPending ? "Submitting..." : "Submit buy list";
    };

    fileInput?.addEventListener("change", handleFileChange);
    document.querySelectorAll<HTMLInputElement>('input[name="category"]').forEach((item) => item.addEventListener("change", updateCategorySummary));
    quoteEmail?.addEventListener("input", updateEmailSummary);
    form?.addEventListener("submit", handleSubmit);
    updateCategorySummary();
    updateEmailSummary();

    return () => {
      fileInput?.removeEventListener("change", handleFileChange);
      document.querySelectorAll<HTMLInputElement>('input[name="category"]').forEach((item) => item.removeEventListener("change", updateCategorySummary));
      quoteEmail?.removeEventListener("input", updateEmailSummary);
      form?.removeEventListener("submit", handleSubmit);
    };
  }, [submitQuote]);

  return <StaticPage title="Get a quote — SourcingRelay" description="Submit a mixed-SKU buy list and receive supplier options, SKU-level landed costs and risk flags." html={html} />;
}


