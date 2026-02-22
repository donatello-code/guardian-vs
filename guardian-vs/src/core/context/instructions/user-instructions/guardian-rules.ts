import {
	ActivatedConditionalRule,
	getRemoteRulesTotalContentWithMetadata,
	getRuleFilesTotalContentWithMetadata,
	RULE_SOURCE_PREFIX,
	RuleLoadResultWithInstructions,
	synchronizeRuleToggles,
} from "@core/context/instructions/user-instructions/rule-helpers"
import { formatResponse } from "@core/prompts/responses"
import { ensureRulesDirectoryExists, GlobalFileNames } from "@core/storage/disk"
import { StateManager } from "@core/storage/StateManager"
import { GuardianRulesToggles } from "@shared/guardian-rules"
import { fileExistsAtPath, isDirectory, readDirectory } from "@utils/fs"
import fs from "fs/promises"
import path from "path"
import { Controller } from "@/core/controller"
import { Logger } from "@/shared/services/Logger"
import { parseYamlFrontmatter } from "./frontmatter"
import { evaluateRuleConditionals, type RuleEvaluationContext } from "./rule-conditionals"

export const getGlobalGuardianRules = async (
	globalGuardianRulesFilePath: string,
	toggles: GuardianRulesToggles,
	opts?: { evaluationContext?: RuleEvaluationContext },
): Promise<RuleLoadResultWithInstructions> => {
	let combinedContent = ""
	const activatedConditionalRules: ActivatedConditionalRule[] = []

	// 1. Get file-based rules
	if (await fileExistsAtPath(globalGuardianRulesFilePath)) {
		if (await isDirectory(globalGuardianRulesFilePath)) {
			try {
				const rulesFilePaths = await readDirectory(globalGuardianRulesFilePath)
				// Note: ruleNamePrefix explicitly set to "global" for clarity (matches the default)
				const rulesFilesTotal = await getRuleFilesTotalContentWithMetadata(
					rulesFilePaths,
					globalGuardianRulesFilePath,
					toggles,
					{
						evaluationContext: opts?.evaluationContext,
						ruleNamePrefix: "global",
					},
				)
				if (rulesFilesTotal.content) {
					combinedContent = rulesFilesTotal.content
					activatedConditionalRules.push(...rulesFilesTotal.activatedConditionalRules)
				}
			} catch {
				Logger.error(`Failed to read .guardianrules directory at ${globalGuardianRulesFilePath}`)
			}
		} else {
			Logger.error(`${globalGuardianRulesFilePath} is not a directory`)
		}
	}

	// 2. Append remote config rules
	const stateManager = StateManager.get()
	const remoteConfigSettings = stateManager.getRemoteConfigSettings()
	const remoteRules = remoteConfigSettings.remoteGlobalRules || []
	const remoteToggles = stateManager.getGlobalStateKey("remoteRulesToggles") || {}
	const remoteResult = getRemoteRulesTotalContentWithMetadata(remoteRules, remoteToggles, {
		evaluationContext: opts?.evaluationContext,
	})
	if (remoteResult.content) {
		if (combinedContent) combinedContent += "\n\n"
		combinedContent += remoteResult.content
		activatedConditionalRules.push(...remoteResult.activatedConditionalRules)
	}

	// 3. Return formatted instructions
	if (!combinedContent) {
		return { instructions: undefined, activatedConditionalRules: [] }
	}

	return {
		instructions: formatResponse.guardianRulesGlobalDirectoryInstructions(globalGuardianRulesFilePath, combinedContent),
		activatedConditionalRules,
	}
}

export const getLocalGuardianRules = async (
	cwd: string,
	toggles: GuardianRulesToggles,
	opts?: { evaluationContext?: RuleEvaluationContext },
): Promise<RuleLoadResultWithInstructions> => {
	const guardianRulesFilePath = path.resolve(cwd, GlobalFileNames.guardianRules)

	let instructions: string | undefined
	const activatedConditionalRules: ActivatedConditionalRule[] = []

	if (await fileExistsAtPath(guardianRulesFilePath)) {
		if (await isDirectory(guardianRulesFilePath)) {
			try {
				const rulesFilePaths = await readDirectory(guardianRulesFilePath, [
					[".guardianrules", "workflows"],
					[".guardianrules", "hooks"],
					[".guardianrules", "skills"],
				])

				const rulesFilesTotal = await getRuleFilesTotalContentWithMetadata(rulesFilePaths, cwd, toggles, {
					evaluationContext: opts?.evaluationContext,
					ruleNamePrefix: "workspace",
				})
				if (rulesFilesTotal.content) {
					instructions = formatResponse.guardianRulesLocalDirectoryInstructions(cwd, rulesFilesTotal.content)
					activatedConditionalRules.push(...rulesFilesTotal.activatedConditionalRules)
				}
			} catch {
				Logger.error(`Failed to read .guardianrules directory at ${guardianRulesFilePath}`)
			}
		} else {
			try {
				if (guardianRulesFilePath in toggles && toggles[guardianRulesFilePath] !== false) {
					const raw = (await fs.readFile(guardianRulesFilePath, "utf8")).trim()
					if (raw) {
						// Keep single-file .guardianrules behavior consistent with directory/remote rules:
						// - Parse YAML frontmatter (fail-open on parse errors)
						// - Evaluate conditionals against the request's evaluation context
						const parsed = parseYamlFrontmatter(raw)
						if (parsed.hadFrontmatter && parsed.parseError) {
							// Fail-open: preserve the raw contents so the LLM can still see the author's intent.
							instructions = formatResponse.guardianRulesLocalFileInstructions(cwd, raw)
						} else {
							const { passed, matchedConditions } = evaluateRuleConditionals(
								parsed.data,
								opts?.evaluationContext ?? {},
							)
							if (passed) {
								instructions = formatResponse.guardianRulesLocalFileInstructions(cwd, parsed.body.trim())
								if (parsed.hadFrontmatter && Object.keys(matchedConditions).length > 0) {
									activatedConditionalRules.push({
										name: `${RULE_SOURCE_PREFIX.workspace}:${GlobalFileNames.guardianRules}`,
										matchedConditions,
									})
								}
							}
						}
					}
				}
			} catch {
				Logger.error(`Failed to read .guardianrules file at ${guardianRulesFilePath}`)
			}
		}
	}

	return { instructions, activatedConditionalRules }
}

export async function refreshGuardianRulesToggles(
	controller: Controller,
	workingDirectory: string,
): Promise<{
	globalToggles: GuardianRulesToggles
	localToggles: GuardianRulesToggles
}> {
	// Global toggles
	const globalGuardianRulesToggles = controller.stateManager.getGlobalSettingsKey("globalGuardianRulesToggles")
	const globalGuardianRulesFilePath = await ensureRulesDirectoryExists()
	const updatedGlobalToggles = await synchronizeRuleToggles(globalGuardianRulesFilePath, globalGuardianRulesToggles)
	controller.stateManager.setGlobalState("globalGuardianRulesToggles", updatedGlobalToggles)

	// Local toggles
	const localGuardianRulesToggles = controller.stateManager.getWorkspaceStateKey("localGuardianRulesToggles")
	const localGuardianRulesFilePath = path.resolve(workingDirectory, GlobalFileNames.guardianRules)
	const updatedLocalToggles = await synchronizeRuleToggles(localGuardianRulesFilePath, localGuardianRulesToggles, "", [
		[".guardianrules", "workflows"],
		[".guardianrules", "hooks"],
		[".guardianrules", "skills"],
	])
	controller.stateManager.setWorkspaceState("localGuardianRulesToggles", updatedLocalToggles)

	return {
		globalToggles: updatedGlobalToggles,
		localToggles: updatedLocalToggles,
	}
}
