import { faker } from "@faker-js/faker";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { DataGrid } from "@/components/data-grid/data-grid";
// import { DataGridKeyboardShortcuts } from "@/components/data-grid/data-grid-keyboard-shortcuts";
import { useDataGrid } from "@/hooks/use-data-grid";
import { useTableCols } from "@/hooks/use-table-cols";
import { useTableData } from "@/hooks/use-table-data";
import { useActiveTableStore } from "@/stores/active-table.store";
import { TableHeader } from "./header/table-header";

interface SkateTrick {
	id: string;
	trickName?: string;
	skaterName?: string;
	difficulty?: "beginner" | "intermediate" | "advanced" | "expert";
	variant?: "flip" | "grind" | "grab" | "transition" | "manual" | "slide";
	landed?: boolean;
	attempts?: number;
	bestScore?: number;
	location?: string;
	dateAttempted?: string;
}

const skateSpots = [
	"Venice Beach Skate Park",
	"Burnside Skate Park",
	"Love Park (Philadelphia)",
	"MACBA (Barcelona)",
	"Southbank (London)",
	"FDR Skate Park",
	"Brooklyn Banks",
	"El Toro High School",
	"Hubba Hideout",
	"Wallenberg High School",
	"EMB (Embarcadero)",
	"Pier 7 (San Francisco)",
] as const;

const skateTricks = {
	flip: [
		"Kickflip",
		"Heelflip",
		"Tre Flip",
		"Hardflip",
		"Inward Heelflip",
		"Frontside Flip",
		"Backside Flip",
		"Varial Flip",
		"Varial Heelflip",
		"Double Flip",
		"Laser Flip",
		"Anti-Casper Flip",
		"Casper Flip",
		"Impossible",
		"360 Flip",
		"Big Spin",
		"Bigspin Flip",
	],
	grind: [
		"50-50 Grind",
		"5-0 Grind",
		"Nosegrind",
		"Crooked Grind",
		"Feeble Grind",
		"Smith Grind",
		"Lipslide",
		"Boardslide",
		"Tailslide",
		"Noseslide",
		"Bluntslide",
		"Nollie Backside Lipslide",
		"Switch Frontside Boardslide",
	],
	grab: [
		"Indy Grab",
		"Melon Grab",
		"Stalefish",
		"Tail Grab",
		"Nose Grab",
		"Method",
		"Mute Grab",
		"Crail Grab",
		"Seatbelt Grab",
		"Roast Beef",
		"Chicken Wing",
		"Tweaked Indy",
		"Japan Air",
	],
	transition: [
		"Frontside Air",
		"Backside Air",
		"McTwist",
		"540",
		"720",
		"900",
		"Frontside 180",
		"Backside 180",
		"Frontside 360",
		"Backside 360",
		"Alley-Oop",
		"Fakie",
		"Revert",
		"Carve",
		"Pump",
		"Drop In",
	],
	manual: [
		"Manual",
		"Nose Manual",
		"Casper",
		"Rail Stand",
		"Pogo",
		"Handstand",
		"One Foot Manual",
		"Spacewalk",
		"Truckstand",
		"Primo",
	],
	slide: [
		"Powerslide",
		"Bert Slide",
		"Coleman Slide",
		"Pendulum Slide",
		"Stand-up Slide",
		"Toeside Slide",
		"Heelside Slide",
	],
} as const;

function generateTrickData(): SkateTrick[] {
	return Array.from({ length: 300 }, () => {
		const variant = faker.helpers.arrayElement(Object.keys(skateTricks) as Array<keyof typeof skateTricks>);
		const trickName = faker.helpers.arrayElement(skateTricks[variant]);
		const skaterName = faker.person.fullName();
		const attempts = faker.number.int({ min: 1, max: 50 });
		const landed = faker.datatype.boolean(0.6);

		const getDifficulty = (trick: string): SkateTrick["difficulty"] => {
			const expertTricks = ["Tre Flip", "900", "McTwist", "Laser Flip", "Impossible"];
			const advancedTricks = ["Hardflip", "720", "540", "Crooked Grind", "Switch Frontside Boardslide"];
			const intermediateTricks = ["Kickflip", "Heelflip", "Frontside 180", "50-50 Grind", "Boardslide"];

			if (expertTricks.some((t) => trick.includes(t))) return "expert";
			if (advancedTricks.some((t) => trick.includes(t))) return "advanced";
			if (intermediateTricks.some((t) => trick.includes(t))) return "intermediate";
			return "beginner";
		};

		const difficulty = getDifficulty(trickName);

		return {
			id: faker.string.nanoid(),
			trickName,
			skaterName,
			difficulty,
			variant,
			landed,
			attempts,
			bestScore: landed ? faker.number.int({ min: 6, max: 10 }) : faker.number.int({ min: 1, max: 5 }),
			location: faker.helpers.arrayElement(skateSpots),
			dateAttempted:
				faker.date
					.between({
						from: new Date(2023, 0, 1),
						to: new Date(),
					})
					.toISOString()
					.split("T")[0] ?? "",
		};
	});
}

const _initialData: SkateTrick[] = generateTrickData();

export function TableView() {
	const { activeTable } = useActiveTableStore();
	const { tableCols, isLoadingTableCols } = useTableCols(activeTable);
	const { tableData, isLoadingTableData } = useTableData(activeTable);

	// const [data] = useState<Record<string, unknown>[]>(() => initialData.map((item) => ({
	// 	id: item.id,
	// 	trickName: item.trickName,
	// 	skaterName: item.skaterName,
	// 	difficulty: item.difficulty,
	// 	variant: item.variant,
	// 	landed: item.landed,
	// }))) ?? []);

	const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
		return (
			tableCols?.map((col) => ({
				id: col.columnName,
				accessorKey: col.columnName,
				header: col.columnName,
				meta: {
					cell: {
						variant: "short-text",
					},
				},
				minSize: 150,
			})) ?? []
		);
	}, [tableCols]);

	// const columns = useMemo<ColumnDef<SkateTrick>[]>(
	// 	() => [
	// 		{
	// 			id: "trickName",
	// 			accessorKey: "trickName",
	// 			header: "Trick name",
	// 			meta: {
	// 				cell: {
	// 					variant: "short-text",
	// 				},
	// 			},
	// 			minSize: 180,
	// 		},
	// 		{
	// 			id: "skaterName",
	// 			accessorKey: "skaterName",
	// 			header: "Skater",
	// 			meta: {
	// 				cell: {
	// 					variant: "short-text",
	// 				},
	// 			},
	// 			minSize: 150,
	// 		},
	// 		{
	// 			id: "difficulty",
	// 			accessorKey: "difficulty",
	// 			header: "Difficulty",
	// 			meta: {
	// 				cell: {
	// 					variant: "select",
	// 					options: [
	// 						{ label: "Beginner", value: "beginner" },
	// 						{ label: "Intermediate", value: "intermediate" },
	// 						{ label: "Advanced", value: "advanced" },
	// 						{ label: "Expert", value: "expert" },
	// 					],
	// 				},
	// 			},
	// 			minSize: 120,
	// 		},
	// 		{
	// 			id: "variant",
	// 			accessorKey: "variant",
	// 			header: "Category",
	// 			meta: {
	// 				cell: {
	// 					variant: "select",
	// 					options: [
	// 						{ label: "Flip", value: "flip" },
	// 						{ label: "Grind", value: "grind" },
	// 						{ label: "Grab", value: "grab" },
	// 						{ label: "Transition", value: "transition" },
	// 						{ label: "Manual", value: "manual" },
	// 						{ label: "Slide", value: "slide" },
	// 					],
	// 				},
	// 			},
	// 			minSize: 120,
	// 		},
	// 		{
	// 			id: "landed",
	// 			accessorKey: "landed",
	// 			header: "Landed",
	// 			meta: {
	// 				cell: {
	// 					variant: "boolean",
	// 				},
	// 			},
	// 			minSize: 100,
	// 		},
	// 		{
	// 			id: "attempts",
	// 			accessorKey: "attempts",
	// 			header: "Attempts",
	// 			meta: {
	// 				cell: {
	// 					variant: "number",
	// 					min: 1,
	// 					max: 100,
	// 				},
	// 			},
	// 			minSize: 100,
	// 		},
	// 		{
	// 			id: "bestScore",
	// 			accessorKey: "bestScore",
	// 			header: "Score",
	// 			meta: {
	// 				cell: {
	// 					variant: "number",
	// 					min: 1,
	// 					max: 10,
	// 				},
	// 			},
	// 			minSize: 110,
	// 		},
	// 		{
	// 			id: "location",
	// 			accessorKey: "location",
	// 			header: "Location",
	// 			meta: {
	// 				cell: {
	// 					variant: "select",
	// 					options: skateSpots.map((spot) => ({ label: spot, value: spot })),
	// 				},
	// 			},
	// 			minSize: 180,
	// 		},
	// 		{
	// 			id: "dateAttempted",
	// 			accessorKey: "dateAttempted",
	// 			header: "Attempted at",
	// 			meta: {
	// 				cell: {
	// 					variant: "long-text",
	// 				},
	// 			},
	// 			minSize: 130,
	// 		},
	// 	],
	// 	[],
	// );

	// const onRowAdd = useCallback(() => {
	// 	setData((prev) => [...prev, { id: faker.string.nanoid() }]);

	// 	return {
	// 		rowIndex: data.length,
	// 		columnId: "trickName",
	// 	};
	// }, [data.length]);

	const { table, ...dataGridProps } = useDataGrid({
		columns,
		data: tableData?.data ?? [],
		// onDataChange: setData,
		// onRowAdd,
		enableSearch: true,
	});

	if (!activeTable) {
		return <main className="flex-1 flex items-center justify-center">Select a table to view</main>;
	}

	if (isLoadingTableCols || isLoadingTableData) {
		return <main className="flex-1 flex items-center justify-center">Loading...</main>;
	}

	// Check if table has no data
	const hasNoData = !tableData?.data || tableData.data.length === 0;

	if (hasNoData) {
		return (
			<div className="flex flex-col flex-1 h-full overflow-hidden">
				<TableHeader />
				<div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="48"
						height="48"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="opacity-50"
					>
						<title>No data</title>
						<rect width="18" height="18" x="3" y="3" rx="2" />
						<path d="M3 9h18" />
						<path d="M9 21V9" />
					</svg>
					<div className="text-center">
						<p className="text-sm font-medium">No data in this table</p>
						<p className="text-xs text-zinc-500 mt-1">This table exists but contains no rows</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col flex-1 h-full overflow-hidden">
			<TableHeader
			// onRowAdd={onRowAdd}
			/>
			{/* <DataGridKeyboardShortcuts enableSearch={!!dataGridProps.searchState} /> */}
			<DataGrid {...dataGridProps} table={table} className="h-full" />
		</div>
	);
}
