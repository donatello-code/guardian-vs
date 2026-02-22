/**
 * List of email domains that are considered trusted testers for Guardian.
 */
const CLINE_TRUSTED_TESTER_DOMAINS = ["fibilabs.tech"]

/**
 * Checks if the given email belongs to a Guardian bot user.
 * E.g. Emails ending with @guardian.bot
 */
export function isGuardianBotUser(email: string): boolean {
	return email.endsWith("@guardian.bot")
}

export function isGuardianInternalTester(email: string): boolean {
	return isGuardianBotUser(email) || CLINE_TRUSTED_TESTER_DOMAINS.some((d) => email.endsWith(`@${d}`))
}
