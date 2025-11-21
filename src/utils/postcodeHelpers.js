const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;

export function validateUKPostcode(postcode) {
  if (!postcode) return false;
  const normalized = postcode.toUpperCase().replace(/\s/g, '');
  return UK_POSTCODE_REGEX.test(normalized);
}

export function formatPostcode(postcode) {
  if (!postcode) return '';
  const normalized = postcode.toUpperCase().replace(/\s/g, '');
  if (normalized.length <= 5) return normalized;

  // Insert space before last 3 characters
  const outward = normalized.slice(0, -3);
  const inward = normalized.slice(-3);
  return `${outward} ${inward}`;
}

export function getPostcodeArea(postcode) {
  if (!postcode) return '';
  // Returns first 2-4 characters (postcode area)
  const normalized = postcode.toUpperCase().replace(/\s/g, '');
  const match = normalized.match(/^[A-Z]{1,2}\d{1,2}/);
  return match ? match[0] : '';
}

export function postcodesAreSimilar(postcode1, postcode2) {
  const area1 = getPostcodeArea(postcode1);
  const area2 = getPostcodeArea(postcode2);
  return area1 === area2 && area1 !== '';
}
