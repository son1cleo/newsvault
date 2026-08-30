const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

const BN_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

const BN_WEEKDAYS = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];

const EN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function toBanglaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/** "৩১ জুলাই ২০২৬" / "July 31, 2026" — the standard short dateline. */
export function formatDateline(date: Date, locale: string): string {
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  if (locale === "bn") {
    return `${toBanglaDigits(day)} ${BN_MONTHS[month]} ${toBanglaDigits(year)}`;
  }
  return `${EN_MONTHS[month]} ${day}, ${year}`;
}

/** "সোমবার, ৩১ আগস্ট ২০২৬" / "Monday, August 31, 2026" — header masthead date. */
export function formatFullDate(date: Date, locale: string): string {
  const weekday = date.getUTCDay();
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  if (locale === "bn") {
    return `${BN_WEEKDAYS[weekday]}, ${toBanglaDigits(day)} ${BN_MONTHS[month]} ${toBanglaDigits(year)}`;
  }
  const weekdayEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][weekday];
  return `${weekdayEn}, ${EN_MONTHS[month]} ${day}, ${year}`;
}

export function localizedNumber(value: number, locale: string): string {
  return locale === "bn" ? toBanglaDigits(value) : String(value);
}

export function monthNameLocalized(month: number, locale: string): string {
  return locale === "bn" ? BN_MONTHS[month - 1] : EN_MONTHS[month - 1];
}
