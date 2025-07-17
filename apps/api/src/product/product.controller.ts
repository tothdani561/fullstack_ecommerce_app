import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from 'src/common/decorators';
import { Admin } from 'src/common/decorators/admin.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Admin()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get("latest-products")
  @Public()
  async getLatestProducts() {
    return this.productService.getLatestProducts();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Get()
  @Public()
  findAll() {
    return this.productService.findAll();
  }

  @Put(':id')
  @Admin()
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Put(':id/toggle-stock')
  @Admin()
  async toggleStock(@Param('id') id: string) {
    return this.productService.toggleStock(Number(id));
  }

  @Delete(':id')
  @Admin()
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Post(':id/upload')
  @Admin()
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
  }))

  @Admin()
  async uploadImages(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    const baseUrl = 'https://drotvarazs.hu';
    const urls = files.map(file => `${baseUrl}/api/uploads/${file.filename}`);
    return this.productService.addImagesToProduct(Number(id), urls);
  }
}
