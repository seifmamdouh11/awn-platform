export const formatDate = (dateString: string | undefined, isArabic: boolean) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const getLocalizedText = (
  arText: string | null | undefined,
  enText: string | null | undefined,
  fallbackText: string | null | undefined,
  isArabic: boolean,
  defaultString: string
) => {
  if (isArabic) {
    return arText || fallbackText || defaultString;
  }
  return enText || fallbackText || defaultString;
};