import { projectReviewSteps } from "../data/projectReview.js";

export const LEGACY_PRODUCT_FORM_KEY =
  "product-marketplace:Product to Package:Product form: dry, liquid, powder, solid, refrigerated, frozen or other";

export function reviewFieldKey(step, group, label) {
  return `${step.slug}:${group.name || group.heading}:${label}`;
}

export function reviewFieldId(key) {
  return `review-field-${String(key).replace(/[^a-z0-9_-]/gi, (character) => `-${character.codePointAt(0).toString(16)}-`)}`;
}

export function serializeProjectReviewForApi(values) {
  return { ...values };
}

export function readProductFormAnswers(answers = {}) {
  if (answers.productForm) {
    return {
      productForm: answers.productForm,
      productFormOther: answers.productFormOther || "",
    };
  }

  const legacy = String(answers[LEGACY_PRODUCT_FORM_KEY] || "").trim();
  const other = legacy.match(/^Other:\s*(.+)$/i);

  return {
    productForm: other ? "Other" : legacy,
    productFormOther: other?.[1]?.trim() || "",
  };
}

export function reviewFieldsAreRelated(firstKey, secondKey) {
  if (firstKey === secondKey) return true;

  return projectReviewSteps.some((step) =>
    step.groups.some((group) => {
      const field = group.embeddedRadio;
      if (!field?.otherField) return false;
      const related = new Set([field.name, field.otherField.name]);
      return related.has(firstKey) && related.has(secondKey);
    }),
  );
}

export function locateReviewField(rawKey) {
  const key = String(rawKey || "").replace(/^review\./, "");

  if (key === LEGACY_PRODUCT_FORM_KEY) {
    return {
      slug: "product-marketplace",
      key: "productForm",
      label: "Product form",
    };
  }

  for (const step of projectReviewSteps) {
    for (const group of step.groups) {
      if (group.type === "radio" && group.name === key) {
        return { slug: step.slug, key, label: group.heading };
      }

      if (group.type === "checkbox") {
        const option = group.options.find(
          (item) => reviewFieldKey(step, group, item) === key,
        );
        if (option) return { slug: step.slug, key, label: option };
      }

      if (group.type === "text" || group.type === "contact") {
        const label = group.fields.find(
          (item) => reviewFieldKey(step, group, item) === key,
        );
        if (label) return { slug: step.slug, key, label };

        const embedded = group.embeddedRadio;
        if (embedded?.name === key) {
          return { slug: step.slug, key, label: embedded.label };
        }
        if (embedded?.otherField?.name === key) {
          return {
            slug: step.slug,
            key,
            label: embedded.otherField.label,
          };
        }
      }

      if (group.type === "file" && key === "uploadedFiles") {
        return { slug: step.slug, key, label: group.heading };
      }
    }
  }

  return null;
}

export function validateProjectReview(values, files) {
  const errors = [];
  const contactStep = projectReviewSteps.find(
    (step) => step.slug === "contact-submission",
  );
  const contactGroup = contactStep.groups.find(
    (group) => group.type === "contact",
  );
  const acknowledgements = contactStep.groups.find(
    (group) => group.name === "acknowledgements",
  );

  const nameKey = reviewFieldKey(contactStep, contactGroup, "Name");
  const emailKey = reviewFieldKey(contactStep, contactGroup, "Email");
  const name = String(values[nameKey] || "").trim();
  const email = String(values[emailKey] || "").trim();

  if (name.length < 2) {
    errors.push({
      slug: contactStep.slug,
      key: nameKey,
      label: "Name",
      message: "Please enter your name using at least 2 characters.",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({
      slug: contactStep.slug,
      key: emailKey,
      label: "Email",
      message: "Please enter a valid contact email address.",
    });
  }

  acknowledgements.options.forEach((option) => {
    const key = reviewFieldKey(contactStep, acknowledgements, option);
    if (values[key] !== true) {
      errors.push({
        slug: contactStep.slug,
        key,
        label: "Required acknowledgement",
        message: `Please confirm: “${option}”`,
      });
    }
  });

  projectReviewSteps.forEach((step) => {
    step.groups.forEach((group) => {
      const field = group.embeddedRadio;
      if (
        field?.otherField &&
        values[field.name] === field.otherField.trigger &&
        !String(values[field.otherField.name] || "").trim()
      ) {
        errors.push({
          slug: step.slug,
          key: field.otherField.name,
          label: field.otherField.label,
          message: "Please specify the product form before continuing.",
        });
      }
    });
  });

  if (values.uploadedFiles?.length > 0 && files.length === 0) {
    const upload = locateReviewField("uploadedFiles");
    errors.push({
      ...upload,
      message:
        "Please reselect the listed files, or remove them before submitting.",
    });
  }

  return errors;
}

export function validationErrorFromApi(detail) {
  const target = locateReviewField(detail?.field);
  if (!target) return null;

  const message = detail?.message || "Please review this field.";
  let friendlyMessage = `Please review ${target.label}.`;

  if (message.includes("valid email")) {
    friendlyMessage = "Please enter a valid contact email address.";
  } else if (message.includes("required") || message.includes("must be [true]")) {
    friendlyMessage = `Please complete the required field: ${target.label}.`;
  } else if (message.includes("length must be at least")) {
    friendlyMessage = `${target.label} is too short.`;
  }

  return { ...target, message: friendlyMessage };
}
