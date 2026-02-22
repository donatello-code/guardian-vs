import { getWorkspaceBasename } from "@core/workspace"
import type { ToggleGuardianRuleRequest } from "@shared/proto/guardian/file"
import { RuleScope, ToggleGuardianRules } from "@shared/proto/guardian/file"
import { telemetryService } from "@/services/telemetry"
import { Logger } from "@/shared/services/Logger"
import type { Controller } from "../index"

/**
 * Toggles a Guardian rule (enable or disable)
 * @param controller The controller instance
 * @param request The toggle request
 * @returns The updated Guardian rule toggles
 */
export async function toggleGuardianRule(
	controller: Controller,
	request: ToggleGuardianRuleRequest,
): Promise<ToggleGuardianRules> {
	const { scope, rulePath, enabled } = request

	if (!rulePath || typeof enabled !== "boolean" || scope === undefined) {
		Logger.error("toggleGuardianRule: Missing or invalid parameters", {
			rulePath,
			scope,
			enabled: typeof enabled === "boolean" ? enabled : `Invalid: ${typeof enabled}`,
		})
		throw new Error("Missing or invalid parameters for toggleGuardianRule")
	}

	// Handle the three different scopes
	switch (scope) {
		case RuleScope.GLOBAL: {
			const toggles = controller.stateManager.getGlobalSettingsKey("globalGuardianRulesToggles")
			toggles[rulePath] = enabled
			controller.stateManager.setGlobalState("globalGuardianRulesToggles", toggles)
			break
		}
		case RuleScope.LOCAL: {
			const toggles = controller.stateManager.getWorkspaceStateKey("localGuardianRulesToggles")
			toggles[rulePath] = enabled
			controller.stateManager.setWorkspaceState("localGuardianRulesToggles", toggles)
			break
		}
		case RuleScope.REMOTE: {
			const toggles = controller.stateManager.getGlobalStateKey("remoteRulesToggles")
			toggles[rulePath] = enabled
			controller.stateManager.setGlobalState("remoteRulesToggles", toggles)
			break
		}
		default:
			throw new Error(`Invalid scope: ${scope}`)
	}

	// Track rule toggle telemetry with current task context
	if (controller.task?.ulid) {
		// Extract just the filename for privacy (no full paths)
		const ruleFileName = getWorkspaceBasename(rulePath, "Controller.toggleGuardianRule")
		const isGlobal = scope === RuleScope.GLOBAL
		telemetryService.captureGuardianRuleToggled(controller.task.ulid, ruleFileName, enabled, isGlobal)
	}

	// Get the current state to return in the response
	const globalToggles = controller.stateManager.getGlobalSettingsKey("globalGuardianRulesToggles")
	const localToggles = controller.stateManager.getWorkspaceStateKey("localGuardianRulesToggles")
	const remoteToggles = controller.stateManager.getGlobalStateKey("remoteRulesToggles")

	return ToggleGuardianRules.create({
		globalGuardianRulesToggles: { toggles: globalToggles },
		localGuardianRulesToggles: { toggles: localToggles },
		remoteRulesToggles: { toggles: remoteToggles },
	})
}
