// src/modules/dashboards/dashboard.controller.ts
import { Controller, Get, UseGuards, Query, Req } from '@nestjs/common';
import { RecordsService } from '../records/record.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly recordsService: RecordsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('Admin', 'Analyst', 'Viewer')
  @Permissions('view_dashboard')
  @Get('summary')
async summary(@Req() req: any, @Query('period') period?: string) {
  const userId = req.user.userId;
  let startDate: Date;
  const today = new Date();

  if (period === 'weekly') {
    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  } else if (period === 'monthly') {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  } else {
    startDate = new Date(0); 
  }
console.log('UserId type:', typeof userId, 'value:', userId);
const records = await this.recordsService.findAll({
  createdBy: userId,
  date: { $gte: startDate || new Date(0) },
});
  const totalIncome = records
    .filter(r => r.type?.toLowerCase() === 'income')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpenses = records
    .filter(r => r.type?.toLowerCase() === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const categoryTotals: Record<string, number> = {};
  records.forEach(r => {
    if (!r.category) return;
    categoryTotals[r.category] = (categoryTotals[r.category] || 0) + r.amount;
  });

  const recentActivity = records
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    categoryTotals,
    recentActivity,
  };
}}