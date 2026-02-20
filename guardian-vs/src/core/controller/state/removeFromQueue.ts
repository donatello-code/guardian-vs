import { Controller } from "@core/controller"
import { RemoveFromQueueRequest, Empty } from "@shared/proto/cline/state"

/**
 * Handler for removing an item from the queue by index
 */
export async function removeFromQueue(controller: Controller, request: RemoveFromQueueRequest): Promise<Empty> {
	const id = request.id
	if (!id) {
		throw new Error("Item ID is required")
	}
	
	// Parse index from ID (e.g., "queue-item-0" -> 0)
	const match = id.match(/queue-item-(\d+)/)
	if (!match) {
		throw new Error("Invalid item ID format")
	}
	
	const index = parseInt(match[1], 10)
	await controller.removeFromQueue(index)
	
	return Empty.create({})
}