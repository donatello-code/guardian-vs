// Voice Transcription Service - Stubbed out for production release
// All functionality has been removed to eliminate voice input dependencies

export class VoiceTranscriptionService {
	constructor() {}

	async transcribeAudio(_audioBase64: string, _language?: string): Promise<{ text?: string; error?: string }> {
		return { error: "Voice transcription service is not available in this release" }
	}
}

// Lazily construct the service to avoid circular import initialization issues
let _voiceTranscriptionServiceInstance: VoiceTranscriptionService | null = null
export function getVoiceTranscriptionService(): VoiceTranscriptionService {
	if (!_voiceTranscriptionServiceInstance) {
		_voiceTranscriptionServiceInstance = new VoiceTranscriptionService()
	}
	return _voiceTranscriptionServiceInstance
}