import { Button } from "@/components/ui/button";

export const FormActions = ({ onCancel }: { onCancel: () => void }) => {
	return (
		<div className="flex justify-end gap-2">
			<Button type="button" variant="outline" onClick={onCancel}>
				Cancel
			</Button>

			<Button type="submit" variant="default">
				Save
			</Button>
		</div>
	);
};
