import { Controller } from "@core/controller"
import { Empty } from "@shared/proto/guardian/common"

/**
 * Handler for clearing the queue
 */
export async function clearQueue(controller: Controller, request: Empty): Promise<Empty> {
	await controller.clearQueue()
	return Empty.create({})
}
