import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const sourceMapPath = path.join(repoRoot, "shared/course/bootcampSourceMap.ts");
const sourceMap = readFileSync(sourceMapPath, "utf8");
const outputRoot = path.join(repoRoot, "client/public/course-assets");

const driveAssetIdsByFilename = {
  "Ophthalmic_Tech_Foundations.mp4": "14Y-TfuF5TEgmUaJy6_XmCKqqfxgJ6gPr",
  "Intro-Demystifying_the_Eye_Exam.mp4": "1xQs-q7zdmpGQGHMSdwwwszblhySHXS98",
  "The_Biological_Camera.pdf": "1eOjJtoMa6OjBVU2tV6lyziyIqNob-rVd",
  "Dutie overview infographic.png": "1vvE8GonNYrjIFnCUvypEgY2m2KlO_WpL",
  "Mod_2_Video_Overiew_Anatomy.mp4": "1ioMTQG1VCXtOlZhjyoh2CubdwjfZ--4R",
  "Mod_1_audio_overview.m4a": "1bb4Y-wvKriX5exuL4xnzbXJxiZP-28OW",
  "Ophthalmic_Technician_Blueprint.pdf": "16jsqgMRaPwn5GS6r6aFfHMcY35UPFzsl",
  "Day_3-_Diagnostics.mp4": "1sNIlCT9jm8CQ-0-ID0Q9reoJuhReTb8c",
  "Day_3-Diagnostic_slide_deck_(2).pdf": "1MQb8WaF-X_jeFvBaw4jdJR0RdU9863AD",
  "Mastering_Ophthalmic_Diagnostics_(2).pdf":
    "1pGaICipwBsBzgZuhZ1HklKxr4jxCQMGO",
  "Advanced_Ocular_Diagnostic_Masterclass.pdf":
    "1LgDnbIWf08gdPMHTAA6FDU1zBzsaabKq",
  "Diagnostics infographic.png": "1E8nQkUobIj8yZSF3LClNqJoAJisnTFsu",
  "Day_4-Common_Eye_Diseases.mp4": "1YeZ21NeTEoaslUZrOaruOZP-JbWub-O0",
  "Clinical Pattern Recognition & HPI Cheat Sheet.pdf":
    "1z8WK7J8tWCZMphR7rAU0IIFf6676OiPI",
  "Keratoconus image Jeff.png": "1sf7Er-VydQoOuquKEtnWS6xNwR8vigh1",
  "Lensometry__A_Practical_Guide.mp4": "1qSqRYXOq8fW0_ZcijX19vFULezKvoBE9",
  "Mastering_Manual_Lensometry.pdf": "1ti9jf0wxmY894VVXJwwS4MQzyV4aGo9p",
  "Lensometry_Blueprint_(3).pdf": "1VkavmW_6F3aJ_jCvZ3bYFk9CKjsdkGYj",
  "Clinical Guide_ Manual Lensometry Standards and Procedures.pdf":
    "1mbyhMQlhD6aU1rVagpNE7XLgVNd1FfF_",
  "Precision_Lens_Topography.pdf": "1ZPMCeUtJsOrRumrJBvxXzyZC0FqSJmlu",
  "Mastering_Tonometry.mp4": "1O2zLy0mrA2lsq-Wzwl0ojkM2aqfVqjIb",
  "Guide to Tonometry Infographic.png": "1yunBZUEjPZQmuSI2LgRGTMfMEbvY3UFn",
  "Goldmann jeff.png": "1tzPmtpQ18mEnyZ1UVwASxWAQ6UMAqioI",
  "Refraction_Troubleshooting.mp4": "1TVeyDDm_tRkcsWiCSGnXkE-2HtabM8dH",
  "Ocular_Diagnostic_Mapping.pdf": "1Sx_3bs1maOg0mxlfuGcSR7FQyj7MFiXn",
  "Day_5-Exam_Room_Skills_&_Pharma.mp4": "12LLtfU7FWeRZ2u6ta0i4h6GpDPyDe96y",
  "Clinical Guide_ Soft Skills and Patient Care for Ophthalmic Professionals.pdf":
    "1mORkc-KtbikRBdbxcuFHcjmZ-3z83Kjx",
  "Day_6-Professional_Skills_&_EMR.mp4": "1d1dSPBVRx_cMvoxEwzaG2HtQn3wmuQ9d",
  "Clinical_Simulation_Capstone_(2).pdf": "15MoE6g3JPcaZzOj11JybxsbPbT_r9cin",
  "COA_Certification_Guide.mp4": "16z4WLmIV3HMZzfDmqV58RhxS15GJbFBa",
  "COA_Certification_Roadmap.mp4": "1iVFwJo0AS_B72ulcjUddermBpJxkVjyE",
  "Career paths infographic.png": "1VsqsOIQa5FFQAIbnJzs72jvlMnYuvqT3",
};

const assetEntries = Array.from(
  sourceMap.matchAll(
    /sourceFilename:\s*"([^"]+)",\s*\n\s*storageKey:\s*"([^"]+)"/g
  )
).map(match => ({
  filename: match[1],
  storageKey: match[2],
}));

const storageByFilename = new Map(
  assetEntries.map(entry => [entry.filename, entry.storageKey])
);
const pending = [];
const imported = [];

for (const [filename, driveId] of Object.entries(driveAssetIdsByFilename)) {
  const storageKey = storageByFilename.get(filename);

  if (!storageKey || !driveId) {
    pending.push(filename);
    continue;
  }

  const outputPath = path.join(outputRoot, storageKey);
  mkdirSync(path.dirname(outputPath), { recursive: true });

  if (statExists(outputPath)) {
    imported.push({ filename, outputPath, skipped: true });
    continue;
  }

  execFileSync(
    "curl.exe",
    [
      "-L",
      `https://drive.google.com/uc?export=download&id=${driveId}`,
      "-o",
      outputPath,
    ],
    { stdio: "inherit" }
  );

  const size = statSync(outputPath).size;
  if (size < 1024) {
    throw new Error(`Downloaded file is unexpectedly small: ${outputPath}`);
  }

  imported.push({ filename, outputPath, skipped: false });
}

function statExists(filePath) {
  try {
    return statSync(filePath).isFile() && statSync(filePath).size > 1024;
  } catch {
    return false;
  }
}

console.log(
  JSON.stringify(
    {
      importedCount: imported.length,
      downloadedCount: imported.filter(item => !item.skipped).length,
      skippedExistingCount: imported.filter(item => item.skipped).length,
      pending,
    },
    null,
    2
  )
);
