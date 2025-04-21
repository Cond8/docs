import { JSX } from 'preact';
import { cn } from '../utils/clsx.js';
import { getRandomPrompt } from '../utils/random-prompt.js';
import { Button } from './ui/button.js';
import { TextArea } from './ui/textarea.js';

export interface BootstrapAppProps {
	className?: string;
}

export function AppTextArea({ value }: { value: string }) {
	return (
		<TextArea
			name="prompt"
			required
			rows={2}
			defaultValue={value}
			placeholder="Describe the workflow you want to generate..."
			className={cn(
				'w-full text-base',
				'bg-background border-2 border-primary shadow-lg',
				'focus:outline-none focus:ring-2 focus:ring-primary/50',
				'transition-all duration-150 resize-none',
			)}
			hx-get="/api/random-prompt"
			hx-swap="outerHTML"
			hx-trigger="click from:#random-prompt-btn"
		/>
	);
}

export function BootstrapApp({ className }: BootstrapAppProps): JSX.Element {
	const baseContainer = `
    my-8
    transition-all duration-200
    hover:scale-[1.015] hover:shadow-lg
    flex flex-col gap-4 items-start w-full
  `;

	return (
		<div className={cn(baseContainer, className)}>
			<form method="GET" action="https://app.cond8.dev" className="w-full flex flex-col items-stretch gap-4">
				<div className="border border-border p-4 shadow-md w-full transition-all">
					<label className="block text-base font-medium mb-1 text-primary/90 tracking-tight">Workflow Prompt</label>
					<div className="flex flex-row w-full items-start gap-4">
						<div className="flex-1">
							<AppTextArea value={getRandomPrompt()} />
						</div>
						<div className="flex flex-col gap-1 min-w-[120px]">
							<Button
								variant="brutalist"
								size="sm"
								type="submit"
								className="w-full px-3 py-1.5 text-sm font-semibold shadow-sm hover:shadow-md transition-all"
							>
								Generate
							</Button>
							<Button
								id="random-prompt-btn"
								variant="brutalist"
								size="sm"
								type="button"
								className="w-full px-3 py-1.5 text-sm font-semibold shadow-sm hover:shadow-md transition-all"
							>
								Random
							</Button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
