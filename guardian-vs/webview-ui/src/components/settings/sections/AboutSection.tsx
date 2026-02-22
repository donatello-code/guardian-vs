import { VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import Section from "../Section"

interface AboutSectionProps {
	version: string
	renderSectionHeader: (tabId: string) => JSX.Element | null
}
const AboutSection = ({ version, renderSectionHeader }: AboutSectionProps) => {
	return (
		<div>
			{renderSectionHeader("about")}
			<Section>
				<div className="flex px-4 flex-col gap-2">
					<h2 className="text-lg font-semibold">Guardian v{version}</h2>
					<p>
						An AI assistant that can use your CLI and Editor. Guardian can handle complex software development tasks
						step-by-step with tools that let him create & edit files, explore large projects, use the browser, and
						execute terminal commands (after you grant permission).
					</p>

					<h3 className="text-md font-semibold">Community & Support</h3>
					<p>
						<VSCodeLink href="https://x.com/guardian">X</VSCodeLink>
						{" • "}
						<VSCodeLink href="https://discord.gg/guardian">Discord</VSCodeLink>
						{" • "}
						<VSCodeLink href="https://www.reddit.com/r/guardian/"> r/guardian</VSCodeLink>
					</p>

					<h3 className="text-md font-semibold">Development</h3>
					<p>
						<VSCodeLink href="https://github.com/guardian/guardian">GitHub</VSCodeLink>
						{" • "}
						<VSCodeLink href="https://github.com/guardian/guardian/issues"> Issues</VSCodeLink>
						{" • "}
						<VSCodeLink href="https://github.com/guardian/guardian/discussions/categories/feature-requests?discussions_q=is%3Aopen+category%3A%22Feature+Requests%22+sort%3Atop">
							{" "}
							Feature Requests
						</VSCodeLink>
					</p>

					<h3 className="text-md font-semibold">Resources</h3>
					<p>
						<VSCodeLink href="https://docs.guardian.bot/">Documentation</VSCodeLink>
						{" • "}
						<VSCodeLink href="https://guardian.bot/">https://guardian.bot</VSCodeLink>
					</p>
				</div>
			</Section>
		</div>
	)
}

export default AboutSection
