import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '@/category/category.service';
import { CreateCategoryDto } from '@/category/dto/create-category.dto';
import { UpdateCategoryDto } from '@/category/dto/update-category.dto';
import { RequireLogin } from '@/custom.decorator';

@ApiTags('分类标签管理模块')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: '创建分类',
    description: '创建分类',
    tags: ['分类/标签管理模块']
  })
  @RequireLogin()
  @Post('create-category')
  addCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }
  @ApiOperation({
    summary: '创建标签',
    description: '创建标签',
    tags: ['分类/标签管理模块']
  })
  @RequireLogin()
  @Post('create-tag')
  addTags(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createTag(createCategoryDto);
  }

  @ApiOperation({
    summary: '查询分类',
    description: '查询分类',
    tags: ['分类/标签管理模块']
  })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({
    summary: '查询标签详情',
    description: '查询标签详情',
    tags: ['分类/标签管理模块']
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @ApiOperation({
    summary: '更新分类',
    description: '更新分类',
    tags: ['分类/标签管理模块']
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @ApiOperation({
    summary: '删除分类',
    description: '删除分类',
    tags: ['分类/标签管理模块']
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
