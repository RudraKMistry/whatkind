export const DEFAULT_TC_VERSION = "1.0.0";

export const DEFAULT_TERMS_AND_CONDITIONS = `
# Rules & Privacy Notice
**Start Date:** November 15, 2026
**Version:** 1.0.0

## 1. What This Site Is and Why We Ask Questions
This site runs surveys and personality or thinking tests to learn about people's backgrounds, opinions, and habits. Taking part is completely your choice. Anything you type or pick is shared freely by you.

## 2. How We Use Your Answers
We only use your answers to look at group totals, do research, and make our surveys better.

- **No Secret Tracking:** We never record background audio, video, or hidden device data from your phone or computer.
- **Only What You Share:** We save your profile details (name, email, birth date, gender, and any extra notes you add) and the exact answers you pick in each quiz, only for the site admin to view.
- **No Selling to Ad Companies:** Your profile and answers stay locked in our own database and are never sold to ad networks or shared with other quiz-takers.

## 3. Proof That You Agreed
To keep a clear and honest record of your permission:
- We save a unique digital check code (SHA-256) of these exact rules together with your answers.
- We save a scrambled, one-way version of your internet address and browser name in our locked record book to prove you agreed on purpose.
- Your submission is stamped with the exact UTC date and time.

## 4. How We Keep Data Safe and Your Rights
All answers are stored in locked, encrypted storage that only approved team members can open. You can message the survey manager with your reference ID if you want to ask about your saved entry.

## 5. Your Final Agreement
By checking the required box and clicking the submit button, you confirm that you are at least 18 years old, have read these rules all the way through, and freely agree to let us save and use your answers as described here.
`.trim();

/**
 * Precomputed canonical SHA-256 checksum for the default terms and conditions.
 * Client-safe with zero Node.js 'crypto' dependencies.
 */
export const CANONICAL_TC_CHECKSUM = "c9b2e64bf1ea0e84f175d2733ae1485446d6c377c2740535933718fa22bcff51";
