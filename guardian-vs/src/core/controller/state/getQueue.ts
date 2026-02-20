import { Controller } from "@core/controller"
import { Empty, QueueResponse, QueueItem } from "@shared/proto/cline/state"

/**
 * Handler for getting the current queue
 */
export async function getQueue(controller: Controller, request: Empty): Promise<QueueResponse> {
	const queuedPrompts = controller.stateManager.getGlobalStateKey("queuedPrompts") || []
	
	// Convert string prompts to QueueItem objects
	const items: QueueItem[] = queuedPrompts.map((prompt: string, index: number) => {
		return QueueItem.create({
			id: `queue-item-${index}`,
			prompt,
			timestamp: Date.now(),
		})
	})
	
	return QueueResponse.create({ items })
}