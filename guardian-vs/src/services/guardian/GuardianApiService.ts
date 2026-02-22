/**
 * Service for managing the Guardian API Server
 * This provides a centralized way to start/stop the Guardian API Server
 * and integrate it with the extension lifecycle
 */

import { Logger } from "@/shared/services/Logger"
import { GuardianApiServer, createGuardianApiServer } from "./GuardianApiServer"

// State variable
let guardianApiServer: GuardianApiServer | undefined

/**
 * Start the Guardian API Server
 * @param port Port to listen on (default: 3000)
 * @param guardianBaseUrl Base URL for Guardian API (default: https://api.guardian.bot)
 */
export async function startGuardianApiServer(
	port: number = 3000,
	guardianBaseUrl: string = "https://api.guardian.bot",
): Promise<void> {
	try {
		if (guardianApiServer) {
			Logger.log("Guardian API Server is already running")
			return
		}

		Logger.log(`Starting Guardian API Server on port ${port}...`)
		guardianApiServer = await createGuardianApiServer(port, guardianBaseUrl)
		Logger.log("Guardian API Server started successfully")
	} catch (error) {
		Logger.log(`Failed to start Guardian API Server: ${error}`)
		throw error
	}
}

/**
 * Stop the Guardian API Server
 */
export async function stopGuardianApiServer(): Promise<void> {
	try {
		if (!guardianApiServer) {
			Logger.log("Guardian API Server is not running")
			return
		}

		Logger.log("Stopping Guardian API Server...")
		await guardianApiServer.stop()
		guardianApiServer = undefined
		Logger.log("Guardian API Server stopped successfully")
	} catch (error) {
		Logger.log(`Error stopping Guardian API Server: ${error}`)
		throw error
	}
}

/**
 * Check if the Guardian API Server is running
 * @returns True if running, false otherwise
 */
export function isGuardianApiServerRunning(): boolean {
	return guardianApiServer !== undefined
}

/**
 * Get the current Guardian API Server instance
 * @returns The server instance or undefined if not running
 */
export function getGuardianApiServer(): GuardianApiServer | undefined {
	return guardianApiServer
}

/**
 * Initialize Guardian API Server based on configuration
 * This can be called from the extension activation
 */
export async function initializeGuardianApiServer(): Promise<void> {
	// Check if we should start the server
	// For now, we'll start it by default on port 3001 to avoid conflicts
	// In the future, this could be configurable via settings
	const shouldStart = true // Could be based on configuration
	const port = 3001 // Use 3001 to avoid conflicts with other services

	if (shouldStart) {
		try {
			await startGuardianApiServer(port)
		} catch (error) {
			Logger.log(`Guardian API Server initialization failed: ${error}`)
			// Don't throw - allow extension to continue without API server
		}
	}
}

/**
 * Clean up Guardian API Server resources
 * This should be called from extension deactivation
 */
export async function cleanupGuardianApiServer(): Promise<void> {
	if (isGuardianApiServerRunning()) {
		await stopGuardianApiServer()
	}
}