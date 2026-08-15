export interface DeleteDashboardItemRepository {
  delete(input: string): Promise<void>
}
