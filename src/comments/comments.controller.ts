import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequireLogin, UserInfo } from '@/custom.decorator';
import { CommentsService } from '@/comments/comments.service';
import { CreateCommentDto } from '@/comments/dto/create-comment.dto';
import { CommentListVo } from '@/comments/vo/comment.list.vo';

@ApiTags('留言回复管理模块')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: '新增成功/失败',
    type: String
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiParam({
    name: 'articleId',
    description: '文章Id',
    type: Number
  })
  @Post('add/:articleId')
  @HttpCode(HttpStatus.OK)
  @RequireLogin()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @UserInfo('userId') userId: number,
    @Param('articleId') articleId: number
  ) {
    return this.commentsService.create(createCommentDto, userId, articleId);
  }

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
  @Get('list/:articleId')
  findAll(@Param('articleId') articleId: number) {
    return this.commentsService.findAll(articleId);
  }

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
  @Delete(':commentId')
  remove(@Param('commentId') id: number) {
    return this.commentsService.remove(id);
  }
}
