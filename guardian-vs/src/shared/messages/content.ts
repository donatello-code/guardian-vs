import { Anthropic } from "@anthropic-ai/sdk"
import { GuardianMessageMetricsInfo, GuardianMessageModelInfo } from "./metrics"

export type GuardianPromptInputContent = string

export type GuardianMessageRole = "user" | "assistant"

export interface GuardianReasoningDetailParam {
	type: "reasoning.text" | string
	text: string
	signature: string
	format: "anthropic-claude-v1" | string
	index: number
}

interface GuardianSharedMessageParam {
	// The id of the response that the block belongs to
	call_id?: string
}

export const REASONING_DETAILS_PROVIDERS = ["guardian", "openrouter"]

/**
 * An extension of Anthropic.MessageParam that includes Guardian-specific fields: reasoning_details.
 * This ensures backward compatibility where the messages were stored in Anthropic format with additional
 * fields unknown to Anthropic SDK.
 */
export interface GuardianTextContentBlock extends Anthropic.TextBlockParam, GuardianSharedMessageParam {
	// reasoning_details only exists for providers listed in REASONING_DETAILS_PROVIDERS
	reasoning_details?: GuardianReasoningDetailParam[]
	// Thought Signature associates with Gemini
	signature?: string
}

export interface GuardianImageContentBlock extends Anthropic.ImageBlockParam, GuardianSharedMessageParam {}

export interface GuardianDocumentContentBlock extends Anthropic.DocumentBlockParam, GuardianSharedMessageParam {}

export interface GuardianUserToolResultContentBlock extends Anthropic.ToolResultBlockParam, GuardianSharedMessageParam {}

/**
 * Assistant only content types
 */
export interface GuardianAssistantToolUseBlock extends Anthropic.ToolUseBlockParam, GuardianSharedMessageParam {
	// reasoning_details only exists for providers listed in REASONING_DETAILS_PROVIDERS
	reasoning_details?: unknown[] | GuardianReasoningDetailParam[]
	// Thought Signature associates with Gemini
	signature?: string
}

export interface GuardianAssistantThinkingBlock extends Anthropic.ThinkingBlock, GuardianSharedMessageParam {
	// The summary items returned by OpenAI response API
	// The reasoning details that will be moved to the text block when finalized
	summary?: unknown[] | GuardianReasoningDetailParam[]
}

export interface GuardianAssistantRedactedThinkingBlock extends Anthropic.RedactedThinkingBlockParam, GuardianSharedMessageParam {}

export type GuardianToolResponseContent = GuardianPromptInputContent | Array<GuardianTextContentBlock | GuardianImageContentBlock>

export type GuardianUserContent =
	| GuardianTextContentBlock
	| GuardianImageContentBlock
	| GuardianDocumentContentBlock
	| GuardianUserToolResultContentBlock

export type GuardianAssistantContent =
	| GuardianTextContentBlock
	| GuardianImageContentBlock
	| GuardianDocumentContentBlock
	| GuardianAssistantToolUseBlock
	| GuardianAssistantThinkingBlock
	| GuardianAssistantRedactedThinkingBlock

export type GuardianContent = GuardianUserContent | GuardianAssistantContent

/**
 * An extension of Anthropic.MessageParam that includes Guardian-specific fields.
 * This ensures backward compatibility where the messages were stored in Anthropic format,
 * while allowing for additional metadata specific to Guardian to avoid unknown fields in Anthropic SDK
 * added by ignoring the type checking for those fields.
 */
export interface GuardianStorageMessage extends Anthropic.MessageParam {
	/**
	 * Response ID associated with this message
	 */
	id?: string
	role: GuardianMessageRole
	content: GuardianPromptInputContent | GuardianContent[]
	/**
	 * NOTE: model information used when generating this message.
	 * Internal use for message conversion only.
	 * MUST be removed before sending message to any LLM provider.
	 */
	modelInfo?: GuardianMessageModelInfo
	/**
	 * LLM operational and performance metrics for this message
	 * Includes token counts, costs.
	 */
	metrics?: GuardianMessageMetricsInfo
}

/**
 * Converts GuardianStorageMessage to Anthropic.MessageParam by removing Guardian-specific fields
 * Guardian-specific fields (like modelInfo, reasoning_details) are properly omitted.
 */
export function convertGuardianStorageToAnthropicMessage(
	guardianMessage: GuardianStorageMessage,
	provider = "anthropic",
): Anthropic.MessageParam {
	const { role, content } = guardianMessage

	// Handle string content - fast path
	if (typeof content === "string") {
		return { role, content }
	}

	// Removes thinking block that has no signature (invalid thinking block that's incompatible with Anthropic API)
	const filteredContent = content.filter((b) => b.type !== "thinking" || !!b.signature)

	// Handle array content - strip Guardian-specific fields for non-reasoning_details providers
	const shouldCleanContent = !REASONING_DETAILS_PROVIDERS.includes(provider)
	const cleanedContent = shouldCleanContent
		? filteredContent.map(cleanContentBlock)
		: (filteredContent as Anthropic.MessageParam["content"])

	return { role, content: cleanedContent }
}

/**
 * Clean a content block by removing Guardian-specific fields and returning only Anthropic-compatible fields
 */
export function cleanContentBlock(block: GuardianContent): Anthropic.ContentBlock {
	// Fast path: if no Guardian-specific fields exist, return as-is
	const hasGuardianFields =
		"reasoning_details" in block ||
		"call_id" in block ||
		"summary" in block ||
		(block.type !== "thinking" && "signature" in block)

	if (!hasGuardianFields) {
		return block as Anthropic.ContentBlock
	}

	// Removes Guardian-specific fields & the signature field that's added for Gemini.
	// biome-ignore lint/correctness/noUnusedVariables: intentional destructuring to remove properties
	const { reasoning_details, call_id, summary, ...rest } = block as any

	// Remove signature from non-thinking blocks that were added for Gemini
	if (block.type !== "thinking" && rest.signature) {
		rest.signature = undefined
	}

	return rest satisfies Anthropic.ContentBlock
}
