import { validateUKPostcode } from './postcodeHelpers';

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUKPhone(phone) {
  // UK mobile: starts with 07, 11 digits total
  const normalized = phone.replace(/\s/g, '');
  const ukMobileRegex = /^07\d{9}$/;
  return ukMobileRegex.test(normalized);
}

export function validateRequired(value) {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
}

export function validateMinLength(value, minLength) {
  return value && value.length >= minLength;
}

export function validateLessonForm(formData) {
  const errors = {};

  if (!validateRequired(formData.student_id)) {
    errors.student_id = 'Please select a student';
  }

  if (!validateRequired(formData.date)) {
    errors.date = 'Please select a date';
  }

  if (!validateRequired(formData.start_time)) {
    errors.start_time = 'Please select a start time';
  }

  if (!validateRequired(formData.duration_minutes) || formData.duration_minutes < 15) {
    errors.duration_minutes = 'Duration must be at least 15 minutes';
  }

  if (!validateRequired(formData.start_postcode) || !validateUKPostcode(formData.start_postcode)) {
    errors.start_postcode = 'Please enter a valid UK postcode';
  }

  if (formData.end_postcode && !validateUKPostcode(formData.end_postcode)) {
    errors.end_postcode = 'Please enter a valid UK postcode';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStudentForm(formData) {
  const errors = {};

  if (!validateRequired(formData.name) || !validateMinLength(formData.name, 2)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!validateRequired(formData.email) || !validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validateRequired(formData.phone) || !validateUKPhone(formData.phone)) {
    errors.phone = 'Please enter a valid UK mobile number (07...)';
  }

  if (!validateRequired(formData.postcode) || !validateUKPostcode(formData.postcode)) {
    errors.postcode = 'Please enter a valid UK postcode';
  }

  if (formData.emergency_contact?.phone && !validateUKPhone(formData.emergency_contact.phone)) {
    errors.emergency_contact_phone = 'Please enter a valid UK mobile number';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
