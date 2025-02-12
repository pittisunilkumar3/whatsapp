/// <reference types="react" />

declare namespace JSX {
	interface IntrinsicElements {
		div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
		span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
		h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
		h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
		h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
		p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
	}
}

declare module 'lucide-react' {
	import { FC, SVGProps } from 'react';
	export interface IconProps extends SVGProps<SVGSVGElement> {
		size?: number | string;
		className?: string;
	}
	export type Icon = FC<IconProps>;
	export const Download: Icon;
	export const Users: Icon;
	export const Building2: Icon;
	export const MessageSquare: Icon;
	export const Clock: Icon;
	export const TrendingUp: Icon;
	export const Target: Icon;
	export const AlertCircle: Icon;
	export const Filter: Icon;
}