export const validateJobDescription = (value) => {
  if (!value || !value.trim()) {
    return { isValid: false, error: "Job description is required" };
  }
  if (value.trim().length < 50) {
    return {
      isValid: false,
      error: "Job description must be at least 50 characters",
    };
  }
  if (value.trim().length > 5000) {
    return {
      isValid: false,
      error: "Job description is too long (max 5000 characters)",
    };
  }
  return { isValid: true, error: null };
};

export const validateSelfDescription = (value) => {
  if (value && value.trim().length > 3000) {
    return {
      isValid: false,
      error: "Self description is too long (max 3000 characters)",
    };
  }
  return { isValid: true, error: null };
};

export const validateResumeFile = (file) => {
  if (!file) {
    return { isValid: true, error: null }; // Optional field
  }

  // Check file type
  if (file.type !== "application/pdf") {
    return { isValid: false, error: "Only PDF files are allowed" };
  }

  // Check file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: "File size must be less than 5MB" };
  }

  // Check file extension
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return { isValid: false, error: "File must have .pdf extension" };
  }

  return { isValid: true, error: null };
};

export const validateForm = (jobDescription, selfDescription, resumeFile) => {
  const errors = {};

  // Validate job description
  const jobDescriptionValidation = validateJobDescription(jobDescription);
  if (!jobDescriptionValidation.isValid) {
    errors.jobDescription = jobDescriptionValidation.error;
  }

  // Validate self description
  const selfDescriptionValidation = validateSelfDescription(selfDescription);
  if (!selfDescriptionValidation.isValid) {
    errors.selfDescription = selfDescriptionValidation.error;
  }

  // Validate resume file
  const resumeValidation = validateResumeFile(resumeFile);
  if (!resumeValidation.isValid) {
    errors.resumeFile = resumeValidation.error;
  }

  // Check if either resume or self description is provided
  const hasResume = resumeFile;
  const hasSelfDescription =
    selfDescription && selfDescription.trim().length > 0;

  if (!hasResume && !hasSelfDescription) {
    errors.resumeFile = "Either a Resume or Self Description is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const clearFieldError = (field, currentErrors, setErrors) => {
  if (currentErrors[field]) {
    const newErrors = { ...currentErrors };
    delete newErrors[field];
    setErrors(newErrors);
  }
};
