const EXAMPLE_REQUESTS = [
	// Offline tasks
	'Create a workflow to process uploaded CSV files and return a summary of valid rows only',
	'I want a workflow that takes a list of image URLs and returns a compressed preview gallery',
	'Build a workflow that converts raw sensor logs into a daily performance report',
	'I need a workflow that parses and scores form submissions based on completeness and input quality',
	'Create a workflow to validate and summarize expenses from uploaded receipts',
	'I want a workflow that transforms an XML feed into a usable dashboard-ready JSON format',
	'Design a workflow that verifies coupon codes and filters valid ones based on expiration and usage',
	'I need a workflow that fetches product data, applies tax rules, and returns a checkout-ready cart',
	'Build a workflow that takes Git commit messages and returns categorized change summaries',
	'Create a workflow that processes uploaded CSVs, flags duplicates, and returns a clean dataset',
	'I want a workflow that takes an email list, checks for syntax errors, deduplicates, and outputs a clean list',
	'Design a workflow to process server logs and highlight unusual patterns or high-traffic periods',

	// AI-required tasks
	'I want a workflow that reviews customer feedback and returns the top concerns in bullet points',
	'Create a workflow that reads job applications and flags the most relevant candidates for a role',
	'I need a workflow that takes vague bug reports and groups them by likely root cause',
	'Build a workflow that rewrites unclear instructions into consistent user-friendly text',
	'I want a workflow that reads support chat logs and summarizes sentiment trends per product',
	'Create a workflow to process survey responses and identify recurring themes or issues',
	'Design a workflow that audits internal documentation and suggests areas for improvement',
	'I need a workflow that turns meeting transcripts into clear, actionable summaries',
	'Build a workflow to detect potentially biased language in marketing copy and suggest revisions',
	'I want a workflow that scans user bios and suggests role-specific profile improvements',
	'Create a workflow that interprets free-text feature requests and classifies them by urgency and type',
	'Design a workflow that analyzes tone in outreach emails and recommends adjustments for better engagement',
];

export const getRandomPrompt = () => EXAMPLE_REQUESTS[Math.floor(Math.random() * EXAMPLE_REQUESTS.length)];
