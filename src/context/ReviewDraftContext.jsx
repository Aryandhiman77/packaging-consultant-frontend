import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { projectReviewSteps } from "../data/projectReview";

const STORAGE_KEY = "packaging-consultants-project-review";

const ReviewDraftContext = createContext(null);

const newsletterLabel = "Send me Packaging Times news and updates.";
const legacyNewsletterKey = `contact-submission:acknowledgements:${newsletterLabel}`;
const newsletterKey = `contact-submission:marketingOptIn:${newsletterLabel}`;

const allowedKeys = new Set(
  projectReviewSteps.flatMap((step) =>
    step.groups.flatMap((group) => {
      if (group.type === "radio") return [group.name];
      if (group.type === "checkbox") {
        return group.options.map(
          (option) => `${step.slug}:${group.name}:${option}`,
        );
      }
      if (group.type === "text" || group.type === "contact") {
        const keys = group.fields.map(
          (label) => `${step.slug}:${group.heading}:${label}`,
        );
        if (group.embeddedRadio) {
          keys.push(group.embeddedRadio.name);
          if (group.embeddedRadio.otherField) {
            keys.push(group.embeddedRadio.otherField.name);
          }
        }
        return keys;
      }
      return [];
    }),
  ),
);

export function sanitizeReviewValues(value) {
  const source = value && typeof value === "object" && !Array.isArray(value)
    ? { ...value }
    : {};

  if (source[legacyNewsletterKey] !== undefined && source[newsletterKey] === undefined) {
    source[newsletterKey] = Boolean(source[legacyNewsletterKey]);
  }
  delete source[legacyNewsletterKey];

  const sanitized = {};
  allowedKeys.forEach((key) => {
    if (source[key] !== undefined) sanitized[key] = source[key];
  });

  projectReviewSteps.forEach((step) => {
    step.groups.forEach((group) => {
      const field = group.embeddedRadio;
      if (
        field?.otherField &&
        sanitized[field.name] !== field.otherField.trigger
      ) {
        delete sanitized[field.otherField.name];
      }
    });
  });

  if (Array.isArray(source.uploadedFiles)) {
    sanitized.uploadedFiles = source.uploadedFiles
      .filter((name) => typeof name === "string")
      .slice(0, 30);
  }

  return sanitized;
}

function getSavedValues() {
  try {
    const saved =
      sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);

    if (!saved) return {};

    const parsed = JSON.parse(saved);

    return sanitizeReviewValues(parsed);
  } catch {
    return {};
  }
}

export function ReviewDraftProvider({ children }) {
  const [values, setValues] = useState(getSavedValues);
  const [files, setFiles] = useState([]);
  const skipNextPersistence = useRef(false);

  useEffect(() => {
    if (skipNextPersistence.current) {
      skipNextPersistence.current = false;
      return;
    }

    try {
      const serialized = JSON.stringify(sanitizeReviewValues(values));
      localStorage.setItem(STORAGE_KEY, serialized);
      sessionStorage.setItem(STORAGE_KEY, serialized);
    } catch {
      // Browser storage may be blocked
    }
  }, [values]);

  const updateValue = (key, value) => {
    if (!allowedKeys.has(key)) return;

    setValues((current) => ({
      ...current,
      [key]: value,
    }));

  };

  const updateFiles = (chosen) => {
    setFiles(chosen);

    setValues((current) => ({
      ...current,
      uploadedFiles: chosen.map((file) => file.name),
    }));

  };

  const saveDraft = () => {
    const serialized = JSON.stringify(sanitizeReviewValues(values));
    localStorage.setItem(STORAGE_KEY, serialized);
    sessionStorage.setItem(STORAGE_KEY, serialized);
  };

  const clearDraft = () => {
    skipNextPersistence.current = true;
    setValues({});
    setFiles([]);

    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors
    }
  };

  const contextValue = useMemo(
    () => ({
      values,
      files,
      updateValue,
      updateFiles,
      saveDraft,
      clearDraft,
    }),
    [values, files],
  );

  return (
    <ReviewDraftContext.Provider value={contextValue}>
      {children}
    </ReviewDraftContext.Provider>
  );
}

export function useReviewDraft() {
  const context = useContext(ReviewDraftContext);

  if (!context) {
    throw new Error("ReviewDraftProvider is missing");
  }

  return context;
}
