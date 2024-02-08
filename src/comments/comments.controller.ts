import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequireLogin, UserInfo } from '@/custom.decorator';
import { CommentsService } from '@/comments/comments.service';
import { CreateCommentDto } from '@/comments/dto/create-comment.dto';
import { CommentListVo } from '@/comments/vo/comment.list.vo';

@ApiTags('留言回复管理模块')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @ApiOperation({
    summary: '新增留言回复',
    description: '新增留言回复',
    tags: ['留言回复管理模块']
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'articleId',
    description: '文章Id',
    type: Number
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '新增成功/失败',
    type: String
  })
  @ApiBody({ type: CreateCommentDto })
  @RequireLogin()
  @Post('add/:articleId')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @UserInfo('userId') userId: number,
    @Param('articleId') articleId: number
  ) {
    return this.commentsService.create(createCommentDto, userId, articleId);
  }

  @ApiOperation({
    summary: '获取文章留言列表',
    description: '获取文章留言列表',
    tags: ['留言回复管理模块']
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '文章不存在',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '文章留言列表',
    type: CommentListVo
  })
  @ApiParam({
    name: 'articleId',
    description: '文章Id',
    type: Number
  })
  @RequireLogin()
  @Get('list/:articleId')
  findAll(@Param('articleId') articleId: number) {
    return this.commentsService.findAll(articleId);
  }

  @ApiOperation({
    summary: '点赞留言',
    description: '点赞留言',
    tags: ['留言回复管理模块']
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '点赞成功/失败',
    type: String
  })
  @ApiParam({
    name: 'commentId',
    description: '留言Id',
    type: Number
  })
  @Patch('favor/:commentId')
  update(@Param('commentId') id: number) {
    return this.commentsService.update(id);
  }

  @ApiOperation({
    summary: '删除留言',
    description: '删除留言',
    tags: ['留言回复管理模块']
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '删除成功/失败',
    type: String
  })
  @ApiParam({
    name: 'commentId',
    description: '留言Id',
    type: Number
  })
  @RequireLogin()
  @Delete(':commentId')
  remove(@Param('commentId') id: number) {
    return this.commentsService.remove(id);
  }
}
