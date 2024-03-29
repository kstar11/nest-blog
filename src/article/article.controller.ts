import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  DefaultValuePipe,
  HttpCode
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ArticleService } from '@/article/article.service';
import { CreateArticleDto } from '@/article/dto/create-article.dto';
import { UpdateArticleDto } from '@/article/dto/update-article.dto';
import { ArticleListVo, Article } from '@/article/vo/article.vo';
import { generateParseIntPipe } from '@/utils';
import { RequireLogin, UserInfo } from '@/custom.decorator';

@ApiTags('文章管理模块')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({
    summary: '新增文章',
    description: '新增文章',
    tags: ['文章管理模块']
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: '新增成功/失败',
    type: String
  })
  @ApiBody({ type: CreateArticleDto })
  @RequireLogin()
  @Post('create')
  create(@Body() createArticleDto: CreateArticleDto, @UserInfo('userId') userId: number) {
    return this.articleService.create(createArticleDto, userId);
  }

  @ApiOperation({
    summary: '获取文章列表',
    description: '获取文章列表',
    tags: ['文章管理模块']
  })
  @ApiQuery({
    name: 'pageNo',
    description: '第几页',
    required: false,
    type: Number
  })
  @ApiQuery({
    name: 'pageSize',
    description: '每页多少条',
    required: false,
    type: Number
  })
  @ApiQuery({
    name: 'title',
    description: '文章标题',
    required: false,
    type: String
  })
  @ApiQuery({
    name: 'category',
    description: '文章类型',
    required: false,
    type: Number
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '文章列表',
    type: ArticleListVo
  })
  @RequireLogin()
  @Get('list')
  findAll(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo')) pageNo: number,
    @Query('pageSize', new DefaultValuePipe(5), generateParseIntPipe('pageSize')) pageSize: number,
    @Query('title') title: string,
    @Query('category') category: number
  ) {
    return this.articleService.findAll(pageNo, pageSize, title, category);
  }

  @ApiOperation({
    summary: '获取文章详情',
    description: '获取文章详情',
    tags: ['文章管理模块']
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '文章详情',
    type: Article
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '文章不存在',
    type: String
  })
  @ApiParam({
    name: 'id',
    description: '文章Id',
    type: Number
  })
  @RequireLogin()
  @Get('detail/:id')
  findOne(@Param('id') id: number) {
    return this.articleService.findOne(id);
  }

  @ApiOperation({
    summary: '点赞文章',
    description: '点赞文章',
    tags: ['文章管理模块']
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '点赞成功/失败',
    type: String
  })
  @ApiParam({
    name: 'id',
    description: '文章Id',
    type: Number
  })
  @Get('favor/:id')
  favoriteArticle(@Param('id') id: number) {
    return this.articleService.favoriteArticle(id);
  }

  @ApiOperation({
    summary: '更新文章',
    description: '更新文章',
    tags: ['文章管理模块']
  })
  @ApiBody({ type: UpdateArticleDto })
  @ApiResponse({
    description: '更新成功/失败',
    type: String
  })
  @ApiParam({
    name: 'id',
    description: '文章Id',
    type: Number
  })
  @RequireLogin()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @ApiOperation({
    summary: '删除文章',
    description: '删除文章',
    tags: ['文章管理模块']
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '删除成功/失败',
    type: String
  })
  @ApiParam({
    name: 'id',
    description: '文章Id',
    type: Number
  })
  @RequireLogin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
