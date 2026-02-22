import { HeroUIProvider } from "@heroui/react"
import { type ReactNode } from "react"
import { CustomPostHogProvider } from "./CustomPostHogProvider"
import { GuardianAuthProvider } from "./context/GuardianAuthContext"
import { ExtensionStateContextProvider } from "./context/ExtensionStateContext"
import { PlatformProvider } from "./context/PlatformContext"

export function Providers({ children }: { children: ReactNode }) {
	return (
		<PlatformProvider>
			<ExtensionStateContextProvider>
				<CustomPostHogProvider>
					<GuardianAuthProvider>
						<HeroUIProvider>{children}</HeroUIProvider>
					</GuardianAuthProvider>
				</CustomPostHogProvider>
			</ExtensionStateContextProvider>
		</PlatformProvider>
	)
}
