import { clsx, type ClassValue } from 'clsx';
import qs from 'query-string';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === 'ZodError') {
    // Handle Zod error
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );

    return fieldErrors.join('. ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    // Handle Prisma error
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    // Handle other errors
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
}

// Round number to 2 decimal places
export function round2(value: number | string) {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Value is not a number or string');
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
});

// Format currency using the formatter above
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return 'NaN';
  }
}

// Format Number
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

// Shorten UUID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

// Format date and times
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Form the pagination links
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);

  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    {
      skipNull: true,
    }
  );
}

// Profile data formatting utilities

// Format date for profile display (user-friendly format)
export function formatProfileDate(date: Date | string | null | undefined): string {
  if (!date) return 'Not provided';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Invalid date';
  }
}

// Handle null/undefined profile fields gracefully
export function formatProfileField(value: string | null | undefined, fallback: string = 'Not provided'): string {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  return value;
}

// Format boolean preferences for display
export function formatBooleanPreference(value: boolean | null | undefined, type: 'yesNo' | 'enabledDisabled' = 'yesNo'): string {
  if (value === null || value === undefined) {
    return 'Not set';
  }

  if (type === 'enabledDisabled') {
    return value ? 'Enabled' : 'Disabled';
  }

  return value ? 'Yes' : 'No';
}

// Profile section data types
export interface ProfileSection {
  title: string;
  fields: ProfileField[];
}

export interface ProfileField {
  label: string;
  value: string;
  key: string;
}

// Organize profile data into sections
export function organizeProfileData(user: any): ProfileSection[] {
  const sections: ProfileSection[] = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'Full Name', value: formatProfileField(user.name), key: 'name' },
        { label: 'First Name', value: formatProfileField(user.firstName), key: 'firstName' },
        { label: 'Last Name', value: formatProfileField(user.lastName), key: 'lastName' },
        { label: 'Email', value: formatProfileField(user.email), key: 'email' },
        { label: 'Phone', value: formatProfileField(user.phone), key: 'phone' },
        { label: 'Date of Birth', value: formatProfileDate(user.dateOfBirth), key: 'dateOfBirth' },
        { label: 'Gender', value: formatProfileField(user.gender), key: 'gender' },
        { label: 'Bio', value: formatProfileField(user.bio), key: 'bio' }
      ]
    },
    {
      title: 'Location Details',
      fields: [
        { label: 'Country', value: formatProfileField(user.country), key: 'country' },
        { label: 'State', value: formatProfileField(user.state), key: 'state' },
        { label: 'City', value: formatProfileField(user.city), key: 'city' },
        { label: 'Zip Code', value: formatProfileField(user.zipCode), key: 'zipCode' }
      ]
    },
    {
      title: 'Social Media',
      fields: [
        { label: 'Website', value: formatProfileField(user.website), key: 'website' },
        { label: 'LinkedIn', value: formatProfileField(user.linkedIn), key: 'linkedIn' },
        { label: 'Twitter', value: formatProfileField(user.twitter), key: 'twitter' },
        { label: 'Instagram', value: formatProfileField(user.instagram), key: 'instagram' },
        { label: 'Facebook', value: formatProfileField(user.facebook), key: 'facebook' }
      ]
    },
    {
      title: 'Professional',
      fields: [
        { label: 'Occupation', value: formatProfileField(user.occupation), key: 'occupation' },
        { label: 'Company', value: formatProfileField(user.company), key: 'company' }
      ]
    },
    {
      title: 'Preferences',
      fields: [
        { label: 'Newsletter', value: formatBooleanPreference(user.newsletter), key: 'newsletter' },
        { label: 'SMS Updates', value: formatBooleanPreference(user.smsUpdates), key: 'smsUpdates' },
        { label: 'Language', value: formatProfileField(user.language), key: 'language' },
        { label: 'Timezone', value: formatProfileField(user.timezone), key: 'timezone' },
        { label: 'Currency', value: formatProfileField(user.currency), key: 'currency' }
      ]
    },
    {
      title: 'Account Status',
      fields: [
        { label: 'Role', value: formatProfileField(user.role), key: 'role' },
        { label: 'Verified', value: formatBooleanPreference(user.isVerified, 'yesNo'), key: 'isVerified' },
        { label: 'Active', value: formatBooleanPreference(user.isActive, 'yesNo'), key: 'isActive' },
        { label: 'Profile Views', value: formatProfileField(user.profileViews?.toString(), '0'), key: 'profileViews' },
        { label: 'Last Login', value: formatProfileDate(user.lastLoginAt), key: 'lastLoginAt' },
        { label: 'Member Since', value: formatProfileDate(user.createdAt), key: 'createdAt' },
        { label: 'Last Updated', value: formatProfileDate(user.updatedAt), key: 'updatedAt' }
      ]
    }
  ];

  return sections;
}
