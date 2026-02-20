import { Controller } from "@core/controller"
import { AddToQueueRequest } from "@shared/proto/cline/state"
import { Empty } from "@shared/proto/cline/common"

/**
 * Handler for adding a prompt to the queue
 */
export async function addToQueue(controller: Controller, request: AddToQueueRequest): Promise<Empty> {
	const prompt = request.prompt
	if (!prompt || prompt.trim() === "") {
		throw new Error("Prompt cannot be empty")
	}

	// For now, just add the prompt text to queue
	// In the future, we might want to store images and files as well
	await controller.addToQueue(prompt)
	return Empty.create({})
}
