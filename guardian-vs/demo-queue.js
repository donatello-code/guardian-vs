/**
 * Simple demonstration of the queue system
 * This shows how the queue system works conceptually
 */

console.log("=== Queue System Demo ===\n")

// Simulated state
let state = {
	queuedPrompts: []
}

// Simulated controller methods
const controller = {
	addToQueue: async (prompt) => {
		console.log(`Adding to queue: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`)
		state.queuedPrompts.push(prompt)
		console.log(`Queue now has ${state.queuedPrompts.length} item(s)`)
	},
	
	clearQueue: async () => {
		console.log("Clearing queue...")
		state.queuedPrompts = []
		console.log("Queue cleared")
	},
	
	removeFromQueue: async (index) => {
		if (index >= 0 && index < state.queuedPrompts.length) {
			const removed = state.queuedPrompts.splice(index, 1)
			console.log(`Removed from queue: "${removed[0].substring(0, 50)}${removed[0].length > 50 ? '...' : ''}"`)
			console.log(`Queue now has ${state.queuedPrompts.length} item(s)`)
		}
	},
	
	getQueue: () => {
		return state.queuedPrompts
	}
}

// Demo the queue system
async function demoQueueSystem() {
	console.log("1. Adding multiple prompts to queue:")
	await controller.addToQueue("Create a new React component for user profile")
	await controller.addToQueue("Write tests for the authentication module")
	await controller.addToQueue("Refactor the data fetching logic to use hooks")
	
	console.log("\n2. Current queue contents:")
	state.queuedPrompts.forEach((prompt, index) => {
		console.log(`  ${index + 1}. "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`)
	})
	
	console.log("\n3. Removing second item from queue:")
	await controller.removeFromQueue(1)
	
	console.log("\n4. Updated queue contents:")
	state.queuedPrompts.forEach((prompt, index) => {
		console.log(`  ${index + 1}. "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`)
	})
	
	console.log("\n5. Clearing queue:")
	await controller.clearQueue()
	
	console.log("\n6. Final queue state:")
	console.log(`  Queue has ${state.queuedPrompts.length} item(s)`)
	
	console.log("\n=== Queue System Demo Complete ===")
	console.log("\nIn the actual Guardian VS extension:")
	console.log("- Click 'Queue' button to add current prompt to queue")
	console.log("- Queue display shows above input area")
	console.log("- Tasks execute sequentially when current task completes")
	console.log("- Queue items can be reordered, edited, or removed")
}

// Run the demo
demoQueueSystem().catch(console.error)