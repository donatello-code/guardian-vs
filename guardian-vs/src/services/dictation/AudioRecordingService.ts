// Audio Recording Service - Stubbed out for production release
// All functionality has been removed to eliminate voice input dependencies

export class AudioRecordingService {
	constructor() {}

	async startRecording(): Promise<{ success: boolean; error?: string }> {
		return { success: false, error: "Audio recording service is not available in this release" }
	}

	async stopRecording(): Promise<{ success: boolean; audioBase64?: string; error?: string }> {
		return { success: false, error: "Audio recording service is not available in this release" }
	}

	async cancelRecording(): Promise<{ success: boolean; error?: string }> {
		return { success: false, error: "Audio recording service is not available in this release" }
	}

	getRecordingStatus(): { isRecording: boolean; durationSeconds: number; error?: string } {
		return {
			isRecording: false,
			durationSeconds: 0,
			error: "Audio recording service is not available in this release"
		}
	}

	cleanup(): void {
		// No-op
	}
}

export const audioRecordingService = new AudioRecordingService()