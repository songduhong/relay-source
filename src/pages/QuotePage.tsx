import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { StaticPage } from "@/components/StaticPage";
import { postJson, type QuoteRequest, type QuoteResponse, type QuoteUploadResponse } from "@/lib/api";
import html from "@/content/quote.html?raw";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type UploadState = "idle" | "uploading" | "uploaded" | "error";

export default function QuotePage() {
  const attachmentRef = useRef<{ id: string; name: string } | null>(null);
  const uploadTokenRef = useRef(0);
  const uploadStateRef = useRef<UploadState>("idle");

  const submitQuote = useMutation({
    mutationFn: (payload: QuoteRequest) => postJson<QuoteResponse>("/api/quotes", payload),
    onSuccess: (data) => {
      const successBox = document.getElementById("form-success");
      const errorBox = document.getElementById("form-error");
      if (errorBox) {
        errorBox.hidden = true;
        errorBox.textContent = "";
      }
      if (successBox) {
        successBox.textContent = data.message;
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      const form = document.querySelector<HTMLFormElement>("#quote-form form");
      form?.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
        button.disabled = true;
      });
      const button = form?.querySelector<HTMLButtonElement>("button[type=submit]");
      if (button) button.textContent = `Quote ${data.code} received`;
    },
    onError: (error: Error) => {
      const successBox = document.getElementById("form-success");
      const errorBox = document.getElementById("form-error");
      if (successBox) {
        successBox.hidden = true;
        successBox.textContent = "";
      }
      if (errorBox) {
        errorBox.textContent = error.message;
        errorBox.hidden = false;
        errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      const button = document.querySelector<HTMLButtonElement>("#quote-form form button[type=submit]");
      if (button) {
        button.disabled = false;
        button.textContent = "Request my quote";
      }
    }
  });

  useEffect(() => {
    document.title = "Get a quote - SourcingRelay";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Submit a mixed-SKU buy list and receive supplier options, SKU-level landed costs and risk flags.");

    const form = document.querySelector<HTMLFormElement>("#quote-form form");
    const fileInput = document.getElementById("file-input") as HTMLInputElement | null;
    const filePreview = document.getElementById("file-preview");
    const uploadZone = document.getElementById("upload-zone");
    const nameInput = document.getElementById("quote-name") as HTMLInputElement | null;
    const emailInput = document.getElementById("quote-email") as HTMLInputElement | null;
    const notesInput = document.getElementById("notes") as HTMLTextAreaElement | null;
    const errorBox = document.getElementById("form-error");
    const successBox = document.getElementById("form-success");
    const summaryFile = document.getElementById("summary-file");
    const summaryName = document.getElementById("summary-name");
    const summaryEmail = document.getElementById("summary-email");
    const summaryNotes = document.getElementById("summary-notes");
    const submitButton = form?.querySelector<HTMLButtonElement>("button[type=submit]") ?? null;

    function showError(message: string | null) {
      if (!errorBox) return;
      errorBox.textContent = message ?? "";
      errorBox.hidden = !message;
    }

    async function deleteUpload(id: string) {
      try {
        await fetch(`/api/quotes/upload/${id}`, { method: "DELETE" });
      } catch {
        // Ignore cleanup failures; the upload can be removed on a later attempt.
      }
    }

    function renderPreview(file: File | null, status: string | null) {
      if (!filePreview) return;
      filePreview.innerHTML = "";
      if (!file) {
        if (summaryFile) summaryFile.textContent = "No file";
        return;
      }
      const row = document.createElement("div");
      row.className = "upload-row";
      const meta = document.createElement("span");
      const fileName = document.createElement("strong");
      fileName.textContent = file.name;
      const fileSize = document.createElement("span");
      fileSize.className = "small muted";
      fileSize.textContent = `${Math.max(1, Math.round(file.size / 1024))} KB${status ? ` / ${status}` : ""}`;
      meta.append(fileName, document.createElement("br"), fileSize);
      const remove = document.createElement("button");
      remove.className = "btn btn-ghost";
      remove.type = "button";
      remove.textContent = "Remove";
      remove.addEventListener("click", removeFile);
      row.append(meta, remove);
      filePreview.append(row);
    }

    function removeFile() {
      uploadTokenRef.current += 1;
      const current = attachmentRef.current;
      attachmentRef.current = null;
      uploadStateRef.current = "idle";
      if (current) void deleteUpload(current.id);
      if (fileInput) fileInput.value = "";
      if (form) form.dataset.hasFile = "";
      renderPreview(null, null);
    }

    async function handleFileChange() {
      const file = fileInput?.files?.[0] ?? null;
      const token = ++uploadTokenRef.current;
      const previous = attachmentRef.current;
      attachmentRef.current = null;
      if (previous) void deleteUpload(previous.id);

      if (!file) {
        uploadStateRef.current = "idle";
        if (form) form.dataset.hasFile = "";
        renderPreview(null, null);
        return;
      }

      uploadStateRef.current = "uploading";
      if (form) form.dataset.hasFile = "true";
      renderPreview(file, "Uploading...");
      if (summaryFile) summaryFile.textContent = `${file.name} (uploading...)`;

      const body = new FormData();
      body.append("file", file);
      try {
        const response = await fetch("/api/quotes/upload", { method: "POST", body });
        const data = (await response.json().catch(() => ({}))) as QuoteUploadResponse & { message?: string };
        if (!response.ok) throw new Error(data.message || "Upload failed. Please try again.");
        if (token !== uploadTokenRef.current) {
          void deleteUpload(data.id);
          return;
        }
        attachmentRef.current = { id: data.id, name: data.name };
        uploadStateRef.current = "uploaded";
        renderPreview(file, "Ready");
        if (summaryFile) summaryFile.textContent = file.name;
        showError(null);
      } catch (error) {
        if (token !== uploadTokenRef.current) return;
        uploadStateRef.current = "error";
        renderPreview(file, "Upload failed");
        if (summaryFile) summaryFile.textContent = "Upload failed";
        showError(error instanceof Error ? error.message : "Upload failed. Please try again.");
      }
    }

    function updateSummary() {
      if (summaryName) summaryName.textContent = nameInput?.value.trim() || "Not provided";
      if (summaryEmail) summaryEmail.textContent = emailInput?.value.trim() || "Not provided";
      if (summaryNotes) summaryNotes.textContent = (notesInput?.value.trim().length ?? 0) >= 10 ? "Provided" : "Not provided";
    }

    function handleSubmit(event: Event) {
      event.preventDefault();
      if (!form) return;
      showError(null);
      if (successBox) successBox.hidden = true;

      const name = nameInput?.value.trim() ?? "";
      const email = emailInput?.value.trim() ?? "";
      const notes = notesInput?.value.trim() ?? "";
      const hasFile = Boolean(fileInput?.files?.length);

      if (!EMAIL_PATTERN.test(email)) {
        showError("Please enter a valid work email address.");
        emailInput?.focus();
        return;
      }
      if (hasFile && uploadStateRef.current === "uploading") {
        showError("Please wait for the file upload to finish.");
        return;
      }
      if (hasFile && uploadStateRef.current !== "uploaded") {
        showError("The file upload failed. Please remove it and try again.");
        return;
      }
      if (!hasFile && notes.length < 10) {
        showError("Please upload a buy list or describe your requirement in at least 10 characters.");
        notesInput?.focus();
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
      }
      submitQuote.mutate({
        name: name || undefined,
        email,
        notes: notes || undefined,
        attachmentId: attachmentRef.current?.id
      });
    }

    function handleDragOver(event: DragEvent) {
      event.preventDefault();
      uploadZone?.classList.add("dragover");
    }
    function handleDragLeave() {
      uploadZone?.classList.remove("dragover");
    }
    function handleDrop(event: DragEvent) {
      event.preventDefault();
      uploadZone?.classList.remove("dragover");
      const dropped = event.dataTransfer?.files?.[0];
      if (!dropped || !fileInput) return;
      const transfer = new DataTransfer();
      transfer.items.add(dropped);
      fileInput.files = transfer.files;
      void handleFileChange();
    }

    fileInput?.addEventListener("change", handleFileChange);
    nameInput?.addEventListener("input", updateSummary);
    emailInput?.addEventListener("input", updateSummary);
    notesInput?.addEventListener("input", updateSummary);
    uploadZone?.addEventListener("dragover", handleDragOver);
    uploadZone?.addEventListener("dragleave", handleDragLeave);
    uploadZone?.addEventListener("drop", handleDrop);
    form?.addEventListener("submit", handleSubmit);
    renderPreview(null, null);
    updateSummary();

    return () => {
      fileInput?.removeEventListener("change", handleFileChange);
      nameInput?.removeEventListener("input", updateSummary);
      emailInput?.removeEventListener("input", updateSummary);
      notesInput?.removeEventListener("input", updateSummary);
      uploadZone?.removeEventListener("dragover", handleDragOver);
      uploadZone?.removeEventListener("dragleave", handleDragLeave);
      uploadZone?.removeEventListener("drop", handleDrop);
      form?.removeEventListener("submit", handleSubmit);
    };
  }, [submitQuote.mutate]);

  return <StaticPage title="Get a quote - SourcingRelay" description="Submit a mixed-SKU buy list and receive supplier options, SKU-level landed costs and risk flags." html={html} />;
}
