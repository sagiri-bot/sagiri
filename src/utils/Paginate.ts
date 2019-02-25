export default function paginate(items: any[], page: number = 1, pageLength: number = 10) {
	const maxPage = Math.ceil(items.length / pageLength);
	if (page < 1) page = 1;
	if (page > maxPage) page = maxPage;
	const startIndex = (page - 1) * pageLength;

	return {
		items: items.length > pageLength ? items.slice(startIndex, startIndex + pageLength) : items,
		page,
		maxPage,
		pageLength
	};
}
