import { Controller, Delete, Get, HttpCode, Param } from '@nestjs/common';
import { Admin } from 'src/common/decorators/admin.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly prismaService: PrismaService, private readonly adminService: AdminService) {}

  @Delete('clear-database')
  @Admin()
  @HttpCode(204)
  async clearDatabase() {
    await this.prismaService.clearDatabase();
  }

  @Get('total-products')
  @Admin()
  async getTotalProducts() {
    return { totalProducts: await this.adminService.getTotalProducts() };
  }

  @Get('total-orders')
  @Admin()
  async getTotalOrders() {
    return { totalOrders: await this.adminService.getTotalOrders() };
  }

  @Get('total-users')
  @Admin()
  async getTotalUsers() {
    return { totalUsers: await this.adminService.getTotalUsers() };
  }

  @Get('total-orders-this-month')
  @Admin()
  async getTotalOrdersThisMonth() {
    return { totalOrdersThisMonth: await this.adminService.getTotalOrdersThisMonth() };
  }

  @Get("sales-data")
  @Admin()
  async getSalesData() {
      return { salesData: await this.adminService.getSalesData() };
  }

  @Get('recent-orders')
  @Admin()
  async getRecentOrders() {
      const recentOrders = await this.adminService.getRecentOrders();
      return { recentOrders };
  }

  @Get('search/:name')
  @Admin()
  async searchByName(@Param('name') name: string) {
      return this.adminService.searchByName(name);
  }

  @Get('list')
  @Admin()
  async getProductList() {
      return this.adminService.getProductList();
  }
}