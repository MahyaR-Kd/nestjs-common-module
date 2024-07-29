export function applySelectedItems(query: any, selectedItems: number[]) {
  let result = query;
  if (selectedItems[0] !== 0) {
    result = result['andWhere'](`${query.alias}.id IN (:...selectedItems)`, {
      selectedItems,
    });
  }
  return result;
}
