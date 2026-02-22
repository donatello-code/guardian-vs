import { AccountServiceClient } from "@guardian-grpc/account"
import { BrowserServiceClient } from "@guardian-grpc/browser"
import { CheckpointsServiceClient } from "@guardian-grpc/checkpoints"
import { CommandsServiceClient } from "@guardian-grpc/commands"
import { FileServiceClient } from "@guardian-grpc/file"
import { McpServiceClient } from "@guardian-grpc/mcp"
import { ModelsServiceClient } from "@guardian-grpc/models"
import { SlashServiceClient } from "@guardian-grpc/slash"
import { StateServiceClient } from "@guardian-grpc/state"
import { TaskServiceClient } from "@guardian-grpc/task"
import { UiServiceClient } from "@guardian-grpc/ui"
import { WebServiceClient } from "@guardian-grpc/web"
import { credentials } from "@grpc/grpc-js"
import { promisify } from "util"

const serviceRegistry = {
	"guardian.AccountService": AccountServiceClient,
	"guardian.BrowserService": BrowserServiceClient,
	"guardian.CheckpointsService": CheckpointsServiceClient,
	"guardian.CommandsService": CommandsServiceClient,
	"guardian.FileService": FileServiceClient,
	"guardian.McpService": McpServiceClient,
	"guardian.ModelsService": ModelsServiceClient,
	"guardian.SlashService": SlashServiceClient,
	"guardian.StateService": StateServiceClient,
	"guardian.TaskService": TaskServiceClient,
	"guardian.UiService": UiServiceClient,
	"guardian.WebService": WebServiceClient,
} as const

export type ServiceClients = {
	-readonly [K in keyof typeof serviceRegistry]: InstanceType<(typeof serviceRegistry)[K]>
}

export class GrpcAdapter {
	private clients: Partial<ServiceClients> = {}

	constructor(address: string) {
		for (const [name, Client] of Object.entries(serviceRegistry)) {
			this.clients[name as keyof ServiceClients] = new (Client as any)(address, credentials.createInsecure())
		}
	}

	async call(service: keyof ServiceClients, method: string, request: any): Promise<any> {
		const client = this.clients[service]
		if (!client) {
			throw new Error(`No gRPC client registered for service: ${String(service)}`)
		}

		const fn = (client as any)[method]
		if (typeof fn !== "function") {
			throw new Error(`Method ${method} not found on service ${String(service)}`)
		}

		try {
			const fnAsync = promisify(fn).bind(client)
			const response = await fnAsync(request.message)
			return response?.toObject ? response.toObject() : response
		} catch (error) {
			console.error(`[GrpcAdapter] ${service}.${method} failed:`, error)
			throw error
		}
	}

	close(): void {
		for (const client of Object.values(this.clients)) {
			if (client && typeof (client as any).close === "function") {
				;(client as any).close()
			}
		}
	}
}
