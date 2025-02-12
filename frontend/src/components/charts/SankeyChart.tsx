import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

interface SankeyData {
	from: string;
	to: string;
	value: number;
}

interface SankeyChartProps {
	data: SankeyData[];
	width?: number;
	height?: number;
}

export const SankeyChart: React.FC<SankeyChartProps> = ({ 
	data,
	width = 600,
	height = 400
}) => {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (!svgRef.current || !data.length) return;

		const nodes = Array.from(
			new Set(data.flatMap(d => [d.from, d.to]))
		).map(name => ({ name }));

		const links = data.map(d => ({
			source: nodes.findIndex(n => n.name === d.from),
			target: nodes.findIndex(n => n.name === d.to),
			value: d.value
		}));

		const sankeyLayout = sankey()
			.nodeWidth(15)
			.nodePadding(10)
			.extent([[1, 1], [width - 1, height - 1]]);

		const { nodes: sankeyNodes, links: sankeyLinks } = sankeyLayout({
			nodes: nodes.map(d => ({ ...d })),
			links: links.map(d => ({ ...d }))
		});

		const svg = d3.select(svgRef.current);
		svg.selectAll('*').remove();

		svg.append('g')
			.selectAll('rect')
			.data(sankeyNodes)
			.join('rect')
			.attr('x', d => d.x0)
			.attr('y', d => d.y0)
			.attr('height', d => d.y1 - d.y0)
			.attr('width', d => d.x1 - d.x0)
			.attr('fill', '#34D399')
			.attr('opacity', 0.8);

		svg.append('g')
			.selectAll('path')
			.data(sankeyLinks)
			.join('path')
			.attr('d', sankeyLinkHorizontal())
			.attr('stroke', '#34D399')
			.attr('stroke-width', d => Math.max(1, d.width))
			.attr('fill', 'none')
			.attr('opacity', 0.3);

	}, [data, width, height]);

	return (
		<svg ref={svgRef} width={width} height={height} />
	);
};