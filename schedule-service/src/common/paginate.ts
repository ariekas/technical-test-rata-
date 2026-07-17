export interface Pagination<data> {
  items: data[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function paginate<data>(
  model: any,
  query: any = {},
  options: { page?: number; limit?: number } = {}
): Promise<Pagination<data>> {

  const page = Math.max(1, options.page ?? 1);
  const limit = Math.max(1, options.limit ?? 10);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    model.findMany({
      ...query,
      skip,
      take: limit,
    }),
    model.count({
      where: query.where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
}
