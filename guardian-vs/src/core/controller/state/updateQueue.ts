import { Controller } from "@core/controller"
import { UpdateQueueRequest, Empty } from "@shared/proto/cline/state"

/**
 * Handler for updating the entire queue
 */
export async function updateQueue(controller: Controller, request: UpdateQueueRequest): Promise<Empty> {
	const items = request.items || []
	
	// Convert QueueItem objects back to string prompts
	const queuedPrompts = items.map(item => item.prompt)
	
	controller.stateManager.setGlobalState("queuedPrompts", queuedPrompts)
	await controller.postStateToWebview()
	
	return Empty.create({})
}