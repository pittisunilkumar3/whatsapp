import React from 'react';
import { motion } from 'framer-motion';
import { 
	ChevronDown,
	ChevronUp,
	ChevronLeft,
	ChevronRight,
	ArrowUpDown,
	Search
} from 'lucide-react';
import { Input } from './Input';

interface Column<T> {
	key: keyof T;
	title: string;
	render?: (value: any, row: T) => React.ReactNode;
	sortable?: boolean;
	filterable?: boolean;
}

interface DataTableProps<T> {
	columns: Column<T>[];
	data: T[];
	pageSize?: number;
	onRowClick?: (row: T) => void;
	className?: string;
}

export function DataTable<T>({
	columns,
	data,
	pageSize = 10,
	onRowClick,
	className = '',
}: DataTableProps<T>) {
	const [currentPage, setCurrentPage] = React.useState(1);
	const [sortConfig, setSortConfig] = React.useState<{
		key: keyof T;
		direction: 'asc' | 'desc';
	} | null>(null);
	const [filters, setFilters] = React.useState<Partial<Record<keyof T, string>>>({});

	// Filter data
	const filteredData = React.useMemo(() => {
		return data.filter(row => {
			return Object.entries(filters).every(([key, value]) => {
				if (!value) return true;
				const cellValue = String(row[key as keyof T]).toLowerCase();
				return cellValue.includes(value.toLowerCase());
			});
		});
	}, [data, filters]);

	// Sort data
	const sortedData = React.useMemo(() => {
		if (!sortConfig) return filteredData;

		return [...filteredData].sort((a, b) => {
			const aValue = a[sortConfig.key];
			const bValue = b[sortConfig.key];

			if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
			if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
			return 0;
		});
	}, [filteredData, sortConfig]);

	// Paginate data
	const totalPages = Math.ceil(sortedData.length / pageSize);
	const paginatedData = sortedData.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	const handleSort = (key: keyof T) => {
		setSortConfig(current => ({
			key,
			direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
		}));
	};

	return (
		<div className={className}>
			{/* Filters */}
			<div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{columns
					.filter(column => column.filterable)
					.map(column => (
						<Input
							key={String(column.key)}
							placeholder={`Search ${column.title}...`}
							value={filters[column.key] || ''}
							onChange={e => setFilters(prev => ({
								...prev,
								[column.key]: e.target.value,
							}))}
						/>
					))}
			</div>

			{/* Table */}
			<div className="overflow-x-auto rounded-lg border border-gray-200">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							{columns.map(column => (
								<th
									key={String(column.key)}
									className="px-6 py-3 text-left text-xs font-medium text-secondary-text uppercase tracking-wider"
								>
									<div className="flex items-center space-x-1">
										<span>{column.title}</span>
										{column.sortable && (
											<button
												onClick={() => handleSort(column.key)}
												className="p-1 hover:bg-gray-100 rounded"
											>
												{sortConfig?.key === column.key ? (
													sortConfig.direction === 'asc' ? (
														<ChevronUp className="w-4 h-4" />
													) : (
														<ChevronDown className="w-4 h-4" />
													)
												) : (
													<ArrowUpDown className="w-4 h-4" />
												)}
											</button>
										)}
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{paginatedData.map((row, index) => (
							<motion.tr
								key={index}
								onClick={() => onRowClick?.(row)}
								className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
								whileHover={onRowClick ? { backgroundColor: 'rgba(0,0,0,0.025)' } : {}}
							>
								{columns.map(column => (
									<td
										key={String(column.key)}
										className="px-6 py-4 whitespace-nowrap text-sm text-primary-text"
									>
										{column.render
											? column.render(row[column.key], row)
											: String(row[column.key])
										}
									</td>
								))}
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="mt-4 flex items-center justify-between">
					<div className="text-sm text-secondary-text">
						Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
					</div>
					<div className="flex items-center space-x-2">
						<button
							onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
							disabled={currentPage === 1}
							className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<ChevronLeft className="w-5 h-5" />
						</button>
						<span className="text-sm text-secondary-text">
							Page {currentPage} of {totalPages}
						</span>
						<button
							onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
							className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<ChevronRight className="w-5 h-5" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}