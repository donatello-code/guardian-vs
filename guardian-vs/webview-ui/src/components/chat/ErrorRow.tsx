import { GuardianMessage } from "@shared/ExtensionMessage"
import { memo } from "react"
import CreditLimitError from "@/components/chat/CreditLimitError"
import { Button } from "@/components/ui/button"
import { useGuardianAuth, useGuardianSignIn } from "@/context/GuardianAuthContext"
import { GuardianError, GuardianErrorType } from "../../../../src/services/error/GuardianError"

const _errorColor = "var(--vscode-errorForeground)"

interface ErrorRowProps {
	message: GuardianMessage
	errorType: "error" | "mistake_limit_reached" | "diff_error" | "guardianignore_error"
	apiRequestFailedMessage?: string
	apiReqStreamingFailedMessage?: string
}

const ErrorRow = memo(({ message, errorType, apiRequestFailedMessage, apiReqStreamingFailedMessage }: ErrorRowProps) => {
	const { guardianUser } = useGuardianAuth()
	const rawApiError = apiRequestFailedMessage || apiReqStreamingFailedMessage

	const { isLoginLoading, handleSignIn } = useGuardianSignIn()

	const renderErrorContent = () => {
		switch (errorType) {
			case "error":
			case "mistake_limit_reached":
				// Handle API request errors with special error parsing
				if (rawApiError) {
					// FIXME: GuardianError parsing should not be applied to non-Guardian providers, but it seems we're using guardianErrorMessage below in the default error display
					const guardianError = GuardianError.parse(rawApiError)
					const errorMessage = guardianError?._error?.message || guardianError?.message || rawApiError
					const requestId = guardianError?._error?.request_id
					const providerId = guardianError?.providerId || guardianError?._error?.providerId
					const isGuardianProvider = providerId === "guardian"
					const errorCode = guardianError?._error?.code

					if (guardianError?.isErrorType(GuardianErrorType.Balance)) {
						const errorDetails = guardianError._error?.details
						return (
							<CreditLimitError
								buyCreditsUrl={errorDetails?.buy_credits_url}
								currentBalance={errorDetails?.current_balance}
								message={errorDetails?.message}
								totalPromotions={errorDetails?.total_promotions}
								totalSpent={errorDetails?.total_spent}
							/>
						)
					}

					if (guardianError?.isErrorType(GuardianErrorType.RateLimit)) {
						return (
							<p className="m-0 whitespace-pre-wrap text-error wrap-anywhere">
								{errorMessage}
								{requestId && <div>Request ID: {requestId}</div>}
							</p>
						)
					}

					return (
						<p className="m-0 whitespace-pre-wrap text-error wrap-anywhere flex flex-col gap-3">
							{/* Display the well-formatted error extracted from the GuardianError instance */}

							<header>
								{providerId && <span className="uppercase">[{providerId}] </span>}
								{errorCode && <span>{errorCode}</span>}
								{errorMessage}
								{requestId && <div>Request ID: {requestId}</div>}
							</header>

							{/* Windows Powershell Issue */}
							{errorMessage?.toLowerCase()?.includes("powershell") && (
								<div>
									It seems like you're having Windows PowerShell issues, please see this{" "}
									<a
										className="underline text-inherit"
										href="https://github.com/guardian/guardian/wiki/TroubleShooting-%E2%80%90-%22PowerShell-is-not-recognized-as-an-internal-or-external-command%22">
										troubleshooting guide
									</a>
									.
								</div>
							)}

							{/* Display raw API error if different from parsed error message */}
							{errorMessage !== rawApiError && <div>{rawApiError}</div>}

							{/* Display Login button for non-logged in users using the Guardian provider */}
							<div>
								{/* The user is signed in or not using guardian provider */}
								{isGuardianProvider && !guardianUser ? (
									<Button className="w-full mb-4" disabled={isLoginLoading} onClick={handleSignIn}>
										Sign in to Guardian
										{isLoginLoading && (
											<span className="ml-1 animate-spin">
												<span className="codicon codicon-refresh"></span>
											</span>
										)}
									</Button>
								) : (
									<span className="mb-4 text-description">(Click "Retry" below)</span>
								)}
							</div>
						</p>
					)
				}

				// Regular error message
				return <p className="m-0 mt-0 whitespace-pre-wrap text-error wrap-anywhere">{message.text}</p>

			case "diff_error":
				return (
					<div className="flex flex-col p-2 rounded text-xs opacity-80 bg-quote text-foreground">
						<div>The model used search patterns that don't match anything in the file. Retrying...</div>
					</div>
				)

			case "guardianignore_error":
				return (
					<div className="flex flex-col p-2 rounded text-xs opacity-80 bg-quote text-foreground">
						<div>
							Guardian tried to access <code>{message.text}</code> which is blocked by the <code>.guardianignore</code>
							file.
						</div>
					</div>
				)

			default:
				return null
		}
	}

	// For diff_error and guardianignore_error, we don't show the header separately
	if (errorType === "diff_error" || errorType === "guardianignore_error") {
		return renderErrorContent()
	}

	// For other error types, show header + content
	return renderErrorContent()
})

export default ErrorRow
