import { projectReviewSteps } from "../data/projectReview";

function fieldKey(step, group, label) {
  return `${step.slug}:${group.name || group.heading}:${label}`;
}

function groupResponses(step, group, values) {
  if (group.type === "radio") {
    return values[group.name] ? [String(values[group.name])] : ["Not answered"];
  }

  if (group.type === "checkbox") {
    const selected = group.options.filter(
      (option) => Boolean(values[fieldKey(step, group, option)]),
    );
    return selected.length ? selected : ["None selected"];
  }

  if (group.type === "file") {
    return values.uploadedFiles?.length
      ? values.uploadedFiles.map(String)
      : ["No files selected"];
  }

  const responses = [];
  (group.fields || []).forEach((label) => {
    const answer = String(values[fieldKey(step, group, label)] || "").trim();
    responses.push(`${label}: ${answer || "Not answered"}`);

    if (group.embeddedRadio?.afterField === label) {
      const field = group.embeddedRadio;
      const selected = String(values[field.name] || "").trim();
      responses.push(`${field.label}: ${selected || "Not answered"}`);

      if (selected === field.otherField?.trigger) {
        const specified = String(values[field.otherField.name] || "").trim();
        responses.push(
          `${field.otherField.label}: ${specified || "Not answered"}`,
        );
      }
    }
  });

  return responses.length ? responses : ["Not answered"];
}

export function projectReviewPdfFilename(referenceNumber) {
  const safeReference = String(referenceNumber || "ProjectReview")
    .replace(/[^a-z0-9_-]/gi, "-")
    .replace(/-+/g, "-");

  return `packagingTimes_${safeReference}.pdf`;
}

export async function downloadProjectReviewPdf({
  values,
  referenceNumber,
  submissionDate,
  email,
}) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = 48;

  const addPageHeader = () => {
    pdf.setFillColor(229, 31, 50);
    pdf.rect(0, 0, pageWidth, 7, "F");
    pdf.setTextColor(45, 32, 25);
  };

  const ensureSpace = (height = 28) => {
    if (y + height <= pageHeight - 44) return;
    pdf.addPage();
    addPageHeader();
    y = 40;
  };

  const writeWrapped = (text, options = {}) => {
    const {
      size = 10,
      style = "normal",
      color = [64, 49, 41],
      indent = 0,
      gap = 7,
    } = options;
    const width = contentWidth - indent;
    pdf.setFont("helvetica", style);
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    const lines = pdf.splitTextToSize(String(text), width);
    const lineHeight = size * 1.4;
    ensureSpace(lines.length * lineHeight + gap);
    pdf.text(lines, margin + indent, y);
    y += lines.length * lineHeight + gap;
  };

  addPageHeader();
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.setTextColor(229, 31, 50);
  pdf.text("Packaging Consultants USA", margin, y);
  y += 29;

  pdf.setFontSize(16);
  pdf.setTextColor(35, 25, 20);
  pdf.text("Project Review Submission", margin, y);
  y += 25;

  writeWrapped(`Reference number: ${referenceNumber}`, {
    size: 10,
    style: "bold",
    gap: 3,
  });
  writeWrapped(`Submission date: ${submissionDate}`, { size: 10, gap: 3 });
  writeWrapped(`Contact email: ${email || "Not provided"}`, {
    size: 10,
    gap: 14,
  });

  pdf.setDrawColor(220, 207, 198);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 20;

  projectReviewSteps.forEach((step, stepIndex) => {
    ensureSpace(46);
    writeWrapped(`${stepIndex + 1}. ${step.title}`, {
      size: 14,
      style: "bold",
      color: [35, 25, 20],
      gap: 10,
    });

    step.groups.forEach((group) => {
      writeWrapped(group.heading, {
        size: 10,
        style: "bold",
        color: [126, 41, 44],
        gap: 5,
      });

      groupResponses(step, group, values).forEach((response) => {
        writeWrapped(`- ${response}`, {
          size: 9,
          indent: 10,
          gap: 4,
        });
      });

      y += 4;
    });

    y += 8;
  });

  const pages = pdf.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    pdf.setPage(page);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(120, 105, 96);
    pdf.text(
      `Packaging Consultants USA | ${referenceNumber} | Page ${page} of ${pages}`,
      margin,
      pageHeight - 22,
    );
  }

  const filename = projectReviewPdfFilename(referenceNumber);
  pdf.save(filename);
  return filename;
}
