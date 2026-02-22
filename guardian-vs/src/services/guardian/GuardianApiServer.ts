import * as http from "http"
import * as https from "https"
import { URL } from "url"
import { Logger } from "@/shared/services/Logger"

/**
 * Guardian API Server that exposes chat endpoints
 * This server provides a simple HTTP API for frontend applications to call
 * Guardian's models through the Guardian API service
 */
export class GuardianApiServer {
	private server: http.Server | https.Server | undefined
	private port: number
	private guardianBaseUrl: string

	constructor(port: number = 3000, guardianBaseUrl: string = "https://api.guardian.bot") {
		this.port = port
		this.guardianBaseUrl = guardianBaseUrl
	}

	/**
	 * Start the Guardian API server
	 */
	public start(): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				this.server = http.createServer(this.handleRequest.bind(this))

				this.server.listen(this.port, () => {
					Logger.log(`Guardian API Server listening on port ${this.port}`)
					Logger.log(`Available endpoints:`)
					Logger.log(`  POST /api/chat - Chat with Guardian model`)
					Logger.log(`  POST /api/test - Test endpoint`)
					Logger.log(`  GET  /api/health - Health check endpoint`)
					resolve()
				})

				this.server.on("error", (error) => {
					Logger.log(`Guardian API Server error: ${error}`)
					reject(error)
				})
			} catch (error) {
				reject(error)
			}
		})
	}

	/**
	 * Stop the Guardian API server
	 */
	public stop(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.server) {
				resolve()
				return
			}

			this.server.close((error) => {
				if (error) {
					Logger.log(`Error stopping Guardian API Server: ${error}`)
					reject(error)
				} else {
					Logger.log("Guardian API Server stopped")
					this.server = undefined
					resolve()
				}
			})
		})
	}

	/**
	 * Handle incoming HTTP requests
	 */
	private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
		// Set CORS headers
		res.setHeader("Access-Control-Allow-Origin", "*")
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if (req.method === "OPTIONS") {
			res.writeHead(204)
			res.end()
			return
		}

		// Parse URL
		const url = new URL(req.url || "/", `http://${req.headers.host}`)
		const pathname = url.pathname

		try {
			// Route requests
			if (req.method === "POST" && pathname === "/api/chat") {
				await this.handleChat(req, res)
			} else if (req.method === "POST" && pathname === "/api/test") {
				await this.handleTest(req, res)
			} else if (req.method === "GET" && pathname === "/api/health") {
				await this.handleHealthCheck(req, res)
			} else {
				res.writeHead(404, { "Content-Type": "application/json" })
				res.end(JSON.stringify({ error: "Not found" }))
			}
		} catch (error) {
			Logger.log(`Error handling request to ${pathname}: ${error}`)
			res.writeHead(500, { "Content-Type": "application/json" })
			res.end(JSON.stringify({ error: "Internal server error" }))
		}
	}

	/**
	 * Handle chat endpoint
	 */
	private async handleChat(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
		try {
			// Parse request body
			const body = await this.parseRequestBody(req)
			const { messages, model = "guardian-chat", temperature = 0.7, max_tokens = 2000 } = body

			if (!messages || !Array.isArray(messages)) {
				res.writeHead(400, { "Content-Type": "application/json" })
				res.end(JSON.stringify({ error: "Missing or invalid messages array" }))
				return
			}

			// Forward request to Guardian API
			const guardianResponse = await this.forwardToGuardianApi({
				messages,
				model,
				temperature,
				max_tokens,
				stream: false,
			})

			// Return response
			res.writeHead(200, { "Content-Type": "application/json" })
			res.end(JSON.stringify(guardianResponse))
		} catch (error) {
			Logger.log(`Error in /api/chat: ${error}`)
			res.writeHead(500, { "Content-Type": "application/json" })
			res.end(JSON.stringify({ error: "Failed to process chat request" }))
		}
	}

	/**
	 * Handle test endpoint
	 */
	private async handleTest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
		try {
			// Parse request body
			const body = await this.parseRequestBody(req)
			const { prompt, model = "guardian-chat" } = body

			if (!prompt) {
				res.writeHead(400, { "Content-Type": "application/json" })
				res.end(JSON.stringify({ error: "Missing prompt" }))
				return
			}

			// Create a simple test conversation
			const messages = [
				{
					role: "system",
					content: "You are a helpful AI assistant. Respond concisely.",
				},
				{
					role: "user",
					content: prompt,
				},
			]

			// Forward request to Guardian API
			const guardianResponse = await this.forwardToGuardianApi({
				messages,
				model,
				temperature: 0.7,
				max_tokens: 500,
				stream: false,
			})

			// Return response
			res.writeHead(200, { "Content-Type": "application/json" })
			res.end(
				JSON.stringify({
					success: true,
					model,
					response: guardianResponse.choices?.[0]?.message?.content || "No response",
					timestamp: new Date().toISOString(),
				}),
			)
		} catch (error) {
			Logger.log(`Error in /api/test: ${error}`)
			res.writeHead(500, { "Content-Type": "application/json" })
			res.end(JSON.stringify({ error: "Failed to process test request" }))
		}
	}

	/**
	 * Handle health check endpoint
	 */
	private async handleHealthCheck(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
		res.writeHead(200, { "Content-Type": "application/json" })
		res.end(
			JSON.stringify({
				status: "healthy",
				service: "Guardian API Server",
				version: "1.0.0",
				timestamp: new Date().toISOString(),
				endpoints: [
					{
						method: "POST",
						path: "/api/chat",
						description: "Chat with Guardian model",
					},
					{
						method: "POST",
						path: "/api/test",
						description: "Test endpoint",
					},
				],
			}),
		)
	}

	/**
	 * Parse request body
	 */
	private parseRequestBody(req: http.IncomingMessage): Promise<any> {
		return new Promise((resolve, reject) => {
			let body = ""
			req.on("data", (chunk) => {
				body += chunk.toString()
			})
			req.on("end", () => {
				try {
					if (!body) {
						resolve({})
					} else {
						resolve(JSON.parse(body))
					}
				} catch (error) {
					reject(new Error("Invalid JSON"))
				}
			})
			req.on("error", reject)
		})
	}

	/**
	 * Forward request to Guardian API
	 */
	private async forwardToGuardianApi(requestData: any): Promise<any> {
		// In a real implementation, this would forward to the actual Guardian API
		// For now, we'll simulate a response
		return new Promise((resolve) => {
			// Simulate API call delay
			setTimeout(() => {
				resolve({
					id: `chatcmpl-${Date.now()}`,
					object: "chat.completion",
					created: Math.floor(Date.now() / 1000),
					model: requestData.model,
					choices: [
						{
							index: 0,
							message: {
								role: "assistant",
								content: `This is a simulated response from ${requestData.model}. In production, this would be forwarded to the Guardian API at ${this.guardianBaseUrl}.`,
							},
							finish_reason: "stop",
						},
					],
					usage: {
						prompt_tokens: 100,
						completion_tokens: 50,
						total_tokens: 150,
					},
				})
			}, 100)
		})
	}
}

/**
 * Create and start a Guardian API Server
 * @param port Port to listen on (default: 3000)
 * @param guardianBaseUrl Base URL for Guardian API (default: https://api.guardian.bot)
 */
export async function createGuardianApiServer(
	port: number = 3000,
	guardianBaseUrl: string = "https://api.guardian.bot",
): Promise<GuardianApiServer> {
	const server = new GuardianApiServer(port, guardianBaseUrl)
	await server.start()
	return server
}