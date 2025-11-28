export const FieldError = ({ error }: { error?: string }) => {
	return error ? (
		<em role="alert" className="text-sm text-red-500">
			{error}
		</em>
	) : null;
};
