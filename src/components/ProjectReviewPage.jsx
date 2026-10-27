import { Fragment, useEffect, useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ContentWatermark from "./ContentWatermark";
import CustomDropBox from "./Dropbox";
import Footer from "./Footer";
import HeaderHero from "./HeaderHero";
import { projectReviewBySlug, projectReviewSteps } from "../data/projectReview";
import {
  MAX_PROJECT_REVIEW_FILES,
  MAX_PROJECT_REVIEW_FILE_SIZE,
  PROJECT_REVIEW_FILE_ACCEPT,
  PROJECT_REVIEW_FILE_EXTENSIONS,
} from "../data/projectReviewUploads";

import { useReviewDraft } from "../context/ReviewDraftContext";

import { useApi } from "../context/ApiContext";
import {
  downloadProjectReviewPdf,
  projectReviewPdfFilename,
} from "../utils/projectReviewPdf";
import {
  reviewFieldId,
  reviewFieldKey as fieldKey,
  reviewFieldsAreRelated,
  validateProjectReview,
  validationErrorFromApi,
} from "../utils/projectReviewValidation";

const structureNotes = {
  "Stand-up pouch":
    "A flexible pouch with a shaped base so it can stand on a shelf.",
  "Stand-up zipper pouch":
    "A stand-up pouch with a reclosable zipper for repeated use.",
  "Side-gusset bag": "Side folds expand to hold more product.",
  "Side-gusset bag with wire tie":
    "A side-gusset bag with a fold-over, wire-tie reclosure.",
  "Quad-seal bag":
    "A bag with four vertical corner seals for a more defined shape.",
  "Box- or block-bottom bag":
    "A bag with a broad base for a box-like shelf display.",
  Rollstock:
    "Printed packaging film delivered on a roll for form-fill-seal machinery.",
  "Rigid or combined structure":
    "A container or a mix of flexible and rigid parts.",
  "Existing structure":
    "Keep the current structure and review any needed changes.",
  "Need a structure recommendation":
    "Review product, filling, sales channel and shelf needs first.",
};

function scrollPageTop() {
  const reduceMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: reduceMotion ? "auto" : "smooth",
  });
}

function focusReviewField(error) {
  window.setTimeout(() => {
    const element = document.getElementById(reviewFieldId(error.key));
    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => element.focus({ preventScroll: true }), 280);
  }, 80);
}

function InlineFieldError({ fieldError, targetKey }) {
  if (fieldError?.key !== targetKey) return null;

  return (
    <p className="mt-2 text-xs font-black text-[#bd1f30]" role="alert">
      {fieldError.message}
    </p>
  );
}

function ChoiceGroup({ step, group, values, updateValue, fieldError }) {
  return (
    <div
      id={group.type === "radio" ? reviewFieldId(group.name) : undefined}
      tabIndex={group.type === "radio" ? -1 : undefined}
      className={`grid gap-3 rounded-xl outline-none sm:grid-cols-2 ${
        group.type === "radio" && fieldError?.key === group.name
          ? "ring-2 ring-[#e51f32]/45 ring-offset-4"
          : ""
      }`}
    >
      {group.options.map((option) => {
        const key = fieldKey(step, group, option);
        const targetKey = group.type === "radio" ? group.name : key;
        const hasError = fieldError?.key === targetKey;

        const checked =
          group.type === "radio"
            ? values[group.name] === option
            : Boolean(values[key]);

        const structureNote =
          group.name === "structures" ? structureNotes[option] : null;

        return (
          <div
            key={option}
            className={`border text-sm font-bold transition sm:rounded-xl ${
              checked
                ? "border-[#e51f32] bg-[#fff1f2] text-[#8f1321]"
                : hasError
                  ? "border-[#e51f32] bg-[#fff7f8] text-[#8f1321]"
                  : "border-[#ded4cd] bg-white/85 text-[#49372d] hover:border-[#c8b7ad]"
            }`}
          >
            <label className="flex cursor-pointer items-start gap-3 p-3.5">
              <input
                id={group.type === "checkbox" ? reviewFieldId(key) : undefined}
                type={group.type}
                name={group.name}
                checked={checked}
                required={Boolean(group.required)}
                aria-invalid={hasError || undefined}
                onChange={(event) =>
                  updateValue(
                    group.type === "radio" ? group.name : key,
                    group.type === "radio" ? option : event.target.checked,
                  )
                }
                className="mt-0.5 h-4 w-4 accent-[#e51f32]"
              />
              <span>{option}</span>
            </label>

            {group.type === "checkbox" && (
              <div className="px-3.5 pb-2">
                <InlineFieldError fieldError={fieldError} targetKey={key} />
              </div>
            )}

            {structureNote && (
              <details className="mx-3.5 mb-3.5 border-t border-[#e6d9d0] pt-2 font-normal">
                <summary className="cursor-pointer text-xs font-bold text-[#8a483c]">
                  About this structure
                </summary>
                <p className="mt-2 text-xs leading-5 text-[#5b493f]">
                  {structureNote}
                </p>
                <Link
                  to="/packaging-services/art-templates"
                  className="mt-2 inline-block text-xs font-bold text-[#bd2333] underline"
                >
                  See available structure visuals
                </Link>
              </details>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EmbeddedRadioField({ field, values, updateValue, fieldError }) {
  const selected = values[field.name] || "";
  const showOther = selected === field.otherField?.trigger;
  const otherPanelId = `${field.name}-other-field`;

  return (
    <fieldset
      id={reviewFieldId(field.name)}
      tabIndex="-1"
      className={`rounded-xl outline-none sm:col-span-2 ${
        fieldError?.key === field.name
          ? "ring-2 ring-[#e51f32]/45 ring-offset-4"
          : ""
      }`}
    >
      <legend className="mb-2 block text-xs font-black tracking-wide text-[#6e5547] uppercase">
        {field.label}
      </legend>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {field.options.map((option) => {
          const checked = selected === option;

          return (
            <label
              key={option}
              className={`flex min-h-11 cursor-pointer items-center gap-2.5 border px-3 py-2.5 text-sm font-bold transition sm:rounded-xl ${
                checked
                  ? "border-[#e51f32] bg-[#fff1f2] text-[#8f1321] shadow-[0_4px_14px_rgba(229,31,50,.08)]"
                  : "border-[#ded4cd] bg-white/85 text-[#49372d] hover:border-[#c8b7ad]"
              }`}
            >
              <input
                type="radio"
                name={field.name}
                value={option}
                checked={checked}
                onChange={() => {
                  updateValue(field.name, option);
                  if (field.otherField && option !== field.otherField.trigger) {
                    updateValue(field.otherField.name, "");
                  }
                }}
                aria-controls={field.otherField ? otherPanelId : undefined}
                aria-expanded={field.otherField ? showOther : undefined}
                aria-invalid={fieldError?.key === field.name || undefined}
                className="h-4 w-4 shrink-0 accent-[#e51f32]"
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>

      <InlineFieldError fieldError={fieldError} targetKey={field.name} />

      {field.otherField && (
        <div
          id={otherPanelId}
          className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
            showOther
              ? "mt-4 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden" inert={!showOther}>
            <label className="block">
              <span className="mb-2 block text-xs font-black tracking-wide text-[#6e5547] uppercase">
                {field.otherField.label} *
              </span>
              <input
                id={reviewFieldId(field.otherField.name)}
                type="text"
                required={showOther}
                aria-invalid={
                  fieldError?.key === field.otherField.name || undefined
                }
                value={values[field.otherField.name] || ""}
                onChange={(event) =>
                  updateValue(field.otherField.name, event.target.value)
                }
                className={`h-12 w-full border bg-white/90 px-4 text-sm outline-none transition focus:border-[#e51f32] focus:ring-2 focus:ring-[#e51f32]/15 sm:rounded-xl ${
                  fieldError?.key === field.otherField.name
                    ? "border-[#e51f32] ring-2 ring-[#e51f32]/15"
                    : "border-[#d7ccc4]"
                }`}
                placeholder="Enter the product form"
              />
              <InlineFieldError
                fieldError={fieldError}
                targetKey={field.otherField.name}
              />
            </label>
          </div>
        </div>
      )}
    </fieldset>
  );
}

function TextFields({ step, group, values, updateValue, fieldError }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {group.fields.map((label, index) => {
        const key = fieldKey(step, group, label);

        const isLong =
          group.multiline?.includes(label) ||
          (![
            "Name",
            "Email",
            "City and State",
            "Preferred contact method",
            "Best time to contact",
          ].includes(label) &&
            (label.length > 42 || index === group.fields.length - 1));

        const required =
          group.type === "contact" && ["Name", "Email"].includes(label);

        return (
          <Fragment key={label}>
            <label className={isLong ? "sm:col-span-2" : ""}>
              <span className="mb-2 block text-xs font-black tracking-wide text-[#6e5547] uppercase">
                {label}
                {required && " *"}
              </span>

              {isLong ? (
                <textarea
                  id={reviewFieldId(key)}
                  value={values[key] || ""}
                  aria-invalid={fieldError?.key === key || undefined}
                  onChange={(event) => updateValue(key, event.target.value)}
                  rows="4"
                  className={`w-full resize-y border bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-[#e51f32] focus:ring-2 focus:ring-[#e51f32]/15 sm:rounded-xl ${
                    fieldError?.key === key
                      ? "border-[#e51f32] ring-2 ring-[#e51f32]/15"
                      : "border-[#d7ccc4]"
                  }`}
                />
              ) : (
                <input
                  id={reviewFieldId(key)}
                  type={label === "Email" ? "email" : "text"}
                  required={required}
                  aria-invalid={fieldError?.key === key || undefined}
                  value={values[key] || ""}
                  onChange={(event) => updateValue(key, event.target.value)}
                  className={`h-12 w-full border bg-white/90 px-4 text-sm outline-none transition focus:border-[#e51f32] focus:ring-2 focus:ring-[#e51f32]/15 sm:rounded-xl ${
                    fieldError?.key === key
                      ? "border-[#e51f32] ring-2 ring-[#e51f32]/15"
                      : "border-[#d7ccc4]"
                  }`}
                />
              )}
              <InlineFieldError fieldError={fieldError} targetKey={key} />
            </label>

            {group.embeddedRadio?.afterField === label && (
              <EmbeddedRadioField
                field={group.embeddedRadio}
                values={values}
                updateValue={updateValue}
                fieldError={fieldError}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

function ReviewGroup({
  step,
  group,
  values,
  files,
  updateValue,
  onFilesChange,
  onFileError,
  fieldError,
}) {
  return (
    <section className="mt-6 border border-[#e2d8d0] bg-[#faf8f6]/90 p-5 sm:rounded-2xl sm:p-7">
      <h2 className="mb-4 text-lg font-black text-[#2b201a]">
        {group.heading}
      </h2>

      {(group.type === "radio" || group.type === "checkbox") && (
        <ChoiceGroup
          step={step}
          group={group}
          values={values}
          updateValue={updateValue}
          fieldError={fieldError}
        />
      )}

      {(group.type === "text" || group.type === "contact") && (
        <TextFields
          step={step}
          group={group}
          values={values}
          updateValue={updateValue}
          fieldError={fieldError}
        />
      )}

      {group.type === "file" && (
        <div
          id={reviewFieldId("uploadedFiles")}
          tabIndex="-1"
          className={`rounded-xl outline-none ${
            fieldError?.key === "uploadedFiles"
              ? "ring-2 ring-[#e51f32]/45 ring-offset-4"
              : ""
          }`}
        >
          <CustomDropBox
            files={files}
            onFilesChange={onFilesChange}
            onError={onFileError}
            maxFiles={MAX_PROJECT_REVIEW_FILES}
            maxSizeBytes={MAX_PROJECT_REVIEW_FILE_SIZE}
            allowedExtensions={PROJECT_REVIEW_FILE_EXTENSIONS}
            accept={PROJECT_REVIEW_FILE_ACCEPT}
          />

          <p className="mt-3 text-xs leading-5 text-[#7b6558]">
            Supported: JPG, JPEG, PNG, WEBP, GIF, BMP, TIFF, HEIC, HEIF, MP4,
            MOV, M4V, WEBM, MPEG, MPG, AVI, PDF, DOCX and XLSX. If you return to
            this review later, please select the files again before submitting.
          </p>
          <InlineFieldError fieldError={fieldError} targetKey="uploadedFiles" />
        </div>
      )}
    </section>
  );
}

function SubmissionSuccess({ receipt, onClose, onDownload }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-[#160e0b]/70 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-success-title"
        className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-[0_30px_100px_rgba(0,0,0,.4)]"
      >
        <div className="h-2 bg-[#e51f32]" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close confirmation"
          className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full bg-[#f5efeb] text-lg font-black text-[#3c2b23] transition hover:bg-[#eadfd8]"
        >
          ×
        </button>

        <div className="p-6 sm:p-9">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#e9f8ed] text-3xl text-[#23863d]">
            ✓
          </div>
          <p className="mt-5 text-xs font-black tracking-[.18em] text-[#e51f32] uppercase">
            Submission complete
          </p>
          <h2
            id="submission-success-title"
            className="mt-2 text-2xl font-black text-[#211914] sm:text-3xl"
          >
            Thank you. Your Project Review has been received.
          </h2>

          <dl className="mt-6 grid gap-3 rounded-2xl bg-[#f7f3f0] p-5 text-sm text-[#4d382e]">
            <div className="grid gap-1 sm:grid-cols-[150px_1fr]">
              <dt className="font-black">Reference number</dt>
              <dd className="break-all font-bold text-[#a91f2e]">
                {receipt.reference}
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[150px_1fr]">
              <dt className="font-black">Submission date</dt>
              <dd>{receipt.date}</dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[150px_1fr]">
              <dt className="font-black">Contact email</dt>
              <dd className="break-all">{receipt.email || "Not provided"}</dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[150px_1fr]">
              <dt className="font-black">PDF copy</dt>
              <dd className="break-all">{receipt.filename}</dd>
            </div>
          </dl>

          <p className="mt-5 text-sm leading-6 text-[#675044]">
            {receipt.pdfDownloaded
              ? "A PDF copy of your complete Project Review has been downloaded. "
              : "Your review was received, but the PDF download could not start. Use Download PDF again below. "}
            Additional information may be requested before services, scope,
            timing or fees can be discussed.
          </p>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onDownload}
              className="rounded-xl border border-[#d8c9c0] bg-white px-4 py-2.5 text-sm font-black text-[#4a352a] hover:border-[#e51f32]"
            >
              Download PDF again
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#e51f32] px-5 py-2.5 text-sm font-black text-white shadow-[0_9px_22px_rgba(229,31,50,.22)] hover:bg-[#c91929]"
            >
              Start a new review
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ReviewDetail({ step }) {
  const {
    values,
    files,
    updateValue: updateDraftValue,
    updateFiles,
    saveDraft: saveLocalDraft,
    clearDraft,
  } = useReviewDraft();

  const { submitProjectReview } = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  const [notice, setNotice] = useState(null);
  const [fieldError, setFieldError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const stepIndex = projectReviewSteps.findIndex(
    (item) => item.slug === step.slug,
  );

  const previous = projectReviewSteps[stepIndex - 1];
  const next = projectReviewSteps[stepIndex + 1];

  useEffect(() => {
    const routedError = location.state?.reviewValidationError;
    if (!routedError || routedError.slug !== step.slug) return;

    setFieldError(routedError);
    setNotice({
      type: "error",
      text: routedError.message,
      fieldKey: routedError.key,
    });
    focusReviewField(routedError);

    const timer = window.setTimeout(() => {
      navigate(location.pathname, { replace: true, state: null });
    }, 500);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.state, navigate, step.slug]);

  const showValidationError = (error) => {
    if (!error) return;

    if (error.slug !== step.slug) {
      navigate(`/project-review/${error.slug}`, {
        state: { reviewValidationError: error },
      });
      return;
    }

    setFieldError(error);
    setNotice({ type: "error", text: error.message, fieldKey: error.key });
    focusReviewField(error);
  };

  const updateValue = (key, value) => {
    updateDraftValue(key, value);
    setReceipt(null);
    if (fieldError && reviewFieldsAreRelated(fieldError.key, key)) {
      setFieldError(null);
      setNotice((current) =>
        current?.fieldKey && reviewFieldsAreRelated(current.fieldKey, key)
          ? null
          : current,
      );
    }
  };

  const onFilesChange = (chosen) => {
    setReceipt(null);

    const invalid =
      chosen.length > MAX_PROJECT_REVIEW_FILES ||
      chosen.some((file) => {
        const validSize = file.size <= MAX_PROJECT_REVIEW_FILE_SIZE;

        const validType = PROJECT_REVIEW_FILE_EXTENSIONS.some((ext) =>
          file.name.toLowerCase().endsWith(ext),
        );

        return !validSize || !validType;
      });

    if (invalid) {
      showValidationError({
        slug: "upload-files-timing",
        key: "uploadedFiles",
        label: "Upload available files",
        message:
          "You can upload up to 30 supported files, with a maximum size of 20 MB per file.",
      });

      return;
    }

    updateFiles(chosen);
    if (fieldError?.key === "uploadedFiles") setFieldError(null);
    setNotice(null);
  };

  const onFileSelectionError = (message) => {
    if (!message) {
      if (fieldError?.key === "uploadedFiles") setFieldError(null);
      setNotice((current) =>
        current?.fieldKey === "uploadedFiles" ? null : current,
      );
      return;
    }

    showValidationError({
      slug: "upload-files-timing",
      key: "uploadedFiles",
      label: "Upload available files",
      message,
    });
  };

  const saveDraft = () => {
    try {
      saveLocalDraft();

      setNotice({
        type: "success",
        text: "Your progress has been saved. You may continue this review later.",
      });
    } catch {
      setNotice({
        type: "error",
        text: "We could not save your progress. Please try again.",
      });
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();

    const validationErrors = validateProjectReview(values, files);
    if (validationErrors.length) {
      showValidationError(validationErrors[0]);
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);
    setNotice(null);

    try {
      const submittedValues = { ...values };
      const data = await submitProjectReview(values, files, setUploadProgress);

      const reference = data.referenceNumber || data.reference;
      const date = data.submissionDate
        ? new Date(data.submissionDate).toLocaleString()
        : new Date().toLocaleString();
      const email = submittedValues[fieldKey(step, step.groups[0], "Email")];
      const filename = projectReviewPdfFilename(reference);

      let pdfDownloaded = true;
      try {
        await downloadProjectReviewPdf({
          values: submittedValues,
          referenceNumber: reference,
          submissionDate: date,
          email,
        });
      } catch {
        pdfDownloaded = false;
      }

      clearDraft();
      setReceipt({
        reference,
        date,
        email,
        filename,
        values: submittedValues,
        pdfDownloaded,
      });
    } catch (error) {
      const apiFieldError = error.details
        ?.map(validationErrorFromApi)
        .find(Boolean);

      if (apiFieldError) {
        setUploadProgress(null);
        showValidationError(apiFieldError);
        return;
      }

      const message =
        error.status === 400
          ? "Please review the required fields and your selected files, then try again."
          : error.status === 413
            ? "One or more selected files are too large. Each file must be 20 MB or smaller."
            : error.status === 429
              ? "We have received several requests. Please wait a few minutes and try again."
              : "We could not send your Project Review right now. Please try again.";

      setNotice({
        type: "error",
        text: message,
      });
      setUploadProgress(null);
    } finally {
      setSubmitting(false);
    }
  };

  const closeReceipt = () => {
    setReceipt(null);
    navigate("/project-review/starting-point", { replace: true });
    requestAnimationFrame(scrollPageTop);
  };

  const downloadReceiptAgain = async () => {
    if (!receipt) return;

    try {
      await downloadProjectReviewPdf({
        values: receipt.values,
        referenceNumber: receipt.reference,
        submissionDate: receipt.date,
        email: receipt.email,
      });
      setReceipt((current) =>
        current ? { ...current, pdfDownloaded: true } : current,
      );
    } catch {
      setReceipt((current) =>
        current ? { ...current, pdfDownloaded: false } : current,
      );
    }
  };

  const clearForm = () => {
    if (
      !window.confirm("Clear every Project Review answer and selected file?")
    ) {
      return;
    }

    clearDraft();
    setNotice(null);
    setFieldError(null);
    setUploadProgress(null);
    setReceipt(null);
    navigate("/project-review/starting-point", { replace: true });
    requestAnimationFrame(scrollPageTop);
  };

  return (
    <main className="relative overflow-x-clip bg-[#f5f1ed] text-[#30231c]">
      <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(120deg,#17110f_0%,#39271f_62%,#7e292c_100%)]" />

      <img
        className="pointer-events-none absolute top-16 right-[-5rem] w-[31rem] opacity-[.075]"
        src="/assets/site/header-mark-clean.png"
        alt=""
      />

      <div className="relative mx-auto max-w-7xl px-0 py-10 sm:px-8 lg:px-12 lg:py-14">
        <nav
          className="flex flex-wrap items-center gap-2 px-4 text-xs font-bold text-white/60 sm:px-0"
          aria-label="Breadcrumb"
        >
          <Link
            to="/"
            className="!text-white/75 no-underline hover:!text-white"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-white/75">Project Review</span>
          <span>/</span>
          <span className="text-white">{step.title}</span>
        </nav>

        <div className="mt-7 grid items-start gap-0 sm:gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="relative overflow-hidden border-0 bg-white shadow-[0_28px_80px_rgba(35,20,12,.24)] sm:rounded-[1.75rem] sm:border sm:border-white/30">
            <ContentWatermark repeat />

            <header className="relative z-10 overflow-hidden bg-[linear-gradient(135deg,#fff_0%,#f7f3ef_60%,#eadfd7_100%)] px-6 py-9 sm:px-10 sm:py-12">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-[#e51f32]" />
              <p className="text-xs font-black tracking-[.2em] text-[#d91f31] uppercase">
                Project Review · Step {stepIndex + 1} of{" "}
                {projectReviewSteps.length}
              </p>
              <h1 className="mt-3 max-w-4xl font-serif text-3xl leading-tight font-bold tracking-tight text-[#211914] sm:text-5xl">
                {step.title}
              </h1>
            </header>

            <form
              className="relative z-10 px-6 py-8 sm:px-10 sm:py-10"
              onSubmit={submitReview}
              noValidate
            >
              <div className="space-y-4 text-[17px] leading-8 text-[#4b3a30]">
                {step.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {step.groups.map((group) => (
                <ReviewGroup
                  key={group.heading}
                  step={step}
                  group={group}
                  values={values}
                  files={files}
                  updateValue={updateValue}
                  onFilesChange={onFilesChange}
                  onFileError={onFileSelectionError}
                  fieldError={fieldError}
                />
              ))}

              <div className="mt-7 space-y-4 text-[16px] leading-7 text-[#4b3a30]">
                {step.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {step.slug === "contact-submission" && (
                <>
                  <section className="mt-7 border-t border-[#ded2ca] pt-7">
                    <h2 className="text-lg font-black text-[#2b201a]">
                      Final review
                    </h2>

                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#4b3a30]">
                      {step.finalReview.map((text) => (
                        <li key={text}>{text}</li>
                      ))}
                    </ul>

                    <p className="mt-3 text-sm font-bold text-[#755444]">
                      Required before submission: Name, Email and all four
                      acknowledgements above. Packaging Times updates are
                      optional and off by default.
                    </p>
                  </section>

                  <section className="mt-8 border-t border-[#ded2ca] pt-7">
                    <h2 className="text-lg font-black text-[#2b201a]">
                      Final page actions
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={submitting || Boolean(receipt)}
                        className="bg-[#e51f32] px-3.5 py-2 text-xs font-black text-white hover:bg-[#c91929] disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-lg"
                      >
                        {submitting
                          ? `Uploading ${uploadProgress ?? 0}%`
                          : receipt
                            ? "Submitted"
                            : "Submit Project Review"}
                      </button>

                      {!receipt && (
                        <button
                          type="button"
                          onClick={saveDraft}
                          className="border border-[#d7c9c0] bg-white px-3 py-2 text-xs font-black text-[#4b3529] hover:border-[#e51f32] sm:rounded-lg"
                        >
                          Save and Finish Later
                        </button>
                      )}
                    </div>

                    {submitting && (
                      <div
                        className="mt-4 max-w-xl rounded-xl border border-[#ead6d8] bg-[#fff7f8] p-3"
                        role="progressbar"
                        aria-label="Project Review upload progress"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow={uploadProgress ?? 0}
                      >
                        <div className="flex items-center justify-between gap-3 text-[11px] font-black text-[#7f2430]">
                          <span>
                            {files.length
                              ? `Uploading ${files.length} selected files`
                              : "Sending Project Review"}
                          </span>
                          <span>{uploadProgress ?? 0}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#ead8da]">
                          <div
                            className="h-full rounded-full bg-[#e51f32] transition-[width] duration-200 ease-out"
                            style={{ width: `${uploadProgress ?? 0}%` }}
                          />
                        </div>
                        {(uploadProgress ?? 0) >= 100 && (
                          <p className="mt-2 text-[11px] font-bold text-[#74564a]">
                            Upload complete. Finalizing your submission…
                          </p>
                        )}
                      </div>
                    )}
                  </section>
                </>
              )}

              {notice && (
                <div
                  role="status"
                  className={`mt-7 border p-5 text-sm leading-6 sm:rounded-2xl ${
                    notice.type === "success"
                      ? "border-[#9ecfa9] bg-[#eef9f0] text-[#21552c]"
                      : notice.type === "error"
                        ? "border-[#efb0b8] bg-[#fff1f2] text-[#8f1321]"
                        : "border-[#e6bc95] bg-[#fff7eb] text-[#743f15]"
                  }`}
                >
                  {notice.text}
                </div>
              )}

              <div className="mt-8 grid grid-cols-3 items-center gap-2 border-t border-[#ded2ca] pt-5">
                {previous ? (
                  <Link
                    to={`/project-review/${previous.slug}`}
                    onClick={scrollPageTop}
                    className="min-w-0 justify-self-start border border-[#d7c9c0] bg-white px-2 py-2 text-[10px] leading-tight font-black !text-[#4b3529] no-underline hover:border-[#e51f32] hover:!text-[#c91929] sm:rounded-lg sm:px-3 sm:text-xs"
                  >
                    ← {previous.title}
                  </Link>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  onClick={clearForm}
                  className="min-w-0 justify-self-center border border-[#d8aeb3] bg-white px-2 py-2 text-[10px] leading-tight font-black text-[#a51f2e] transition hover:border-[#e51f32] hover:bg-[#fff1f2] sm:rounded-lg sm:px-3 sm:text-xs"
                >
                  Clear form and start over
                </button>

                {next ? (
                  <Link
                    to={`/project-review/${next.slug}`}
                    onClick={scrollPageTop}
                    className="min-w-0 justify-self-end bg-[#e51f32] px-2 py-2 text-right text-[10px] leading-tight font-black !text-white no-underline shadow-[0_7px_18px_rgba(229,31,50,.2)] hover:bg-[#c91929] sm:rounded-lg sm:px-3.5 sm:text-xs"
                  >
                    Continue to {next.title} →
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            </form>
          </article>

          <aside
            className="self-start border-0 bg-[#1f1713]/95 p-4 text-white shadow-[0_20px_50px_rgba(28,17,11,.22)] backdrop-blur sm:rounded-2xl sm:border sm:border-white/20 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto"
            aria-label="Project Review steps"
          >
            <h2 className="px-3 pt-2 pb-3 text-xs font-black tracking-[.18em] text-[#ef9da6] uppercase">
              Project Review
            </h2>

            <nav className="grid gap-1">
              {projectReviewSteps.map((item, index) => (
                <Link
                  key={item.slug}
                  to={`/project-review/${item.slug}`}
                  onClick={scrollPageTop}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold no-underline transition ${
                    item.slug === step.slug
                      ? "bg-[#e51f32] !text-white"
                      : "!text-white/75 hover:bg-white/10 hover:!text-white"
                  }`}
                >
                  <span className="text-[10px] text-white/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.title}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      </div>

      {receipt && (
        <SubmissionSuccess
          receipt={receipt}
          onClose={closeReceipt}
          onDownload={downloadReceiptAgain}
        />
      )}
    </main>
  );
}

export default function ProjectReviewPage() {
  const { slug } = useParams();
  const step = slug ? projectReviewBySlug[slug] : null;

  if (!step) {
    return <Navigate to="/project-review/starting-point" replace />;
  }

  return (
    <div className="page-shell">
      <HeaderHero compact />
      <ReviewDetail step={step} />
      <Footer />
    </div>
  );
}
