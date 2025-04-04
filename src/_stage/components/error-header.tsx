// src/_stage/components/error-header.tsx
export const ErrorHeader = () => (
	<>
		{/* Header: Cond8 logo + VHX */}
		<div className="relative inline-block w-full">
			<div className="flex justify-between items-center">
				<h1
					className="
            font-logo uppercase tracking-tight leading-none
            text-[10vw] lg:text-[12rem]
            [text-shadow:4px_4px_2px_black]
          "
				>
					Cond8
				</h1>
				<img src="/VHX-logo.svg" alt="VHX Logo" width="140" className="transform -translate-x-[20px] translate-y-[16px]" />
			</div>
			<div className="h-2 bg-red-600 mt-2" style={{ boxShadow: '3px 10px 0 black', transform: 'rotate(-0.2deg)' }} />
		</div>

		{/* Subtitle */}
		<h2
			className="
        w-full text-center font-subtitle uppercase
        text-md lg:text-2xl
        tracking-widest text-foreground/80
        mt-6 mb-10
      "
		>
			Something Went Procedurally Wrong
		</h2>
	</>
);
