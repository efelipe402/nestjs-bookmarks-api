import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import {
  CreateBookmarkDto,
  EditBookmarkDto,
} from './dto';
import { BookmarksService } from './bookmarks.service';
import { ROUTES_API } from '../shared/apiRoutes';
import { ENDPOINTS } from '../shared/endpoints';

@UseGuards(JwtGuard)
@Controller(ROUTES_API.bookmarks)
export class BookmarkController {
  constructor(
    private bookmarkService: BookmarksService,
  ) {}

  @Get()
  getBookmarks(
    @GetUser(`:${ENDPOINTS.id}`) userId: number,
  ) {
    return this.bookmarkService.getBookmarks(
      userId,
    );
  }

  @Get(`:${ENDPOINTS.id}`)
  getBookmarkById(
    @GetUser(ENDPOINTS.id) userId: number,
    @Param(ENDPOINTS.id, ParseIntPipe)
    bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(
      userId,
      bookmarkId,
    );
  }

  @Post()
  createBookmark(
    @GetUser(ENDPOINTS.id) userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(
      userId,
      dto,
    );
  }

  @Patch(`:${ENDPOINTS.id}`)
  editBookmarkById(
    @GetUser(ENDPOINTS.id) userId: number,
    @Param(ENDPOINTS.id, ParseIntPipe)
    bookmarkId: number,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(
      userId,
      bookmarkId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(`:${ENDPOINTS.id}`)
  deleteBookmarkById(
    @GetUser(ENDPOINTS.id) userId: number,
    @Param(ENDPOINTS.id, ParseIntPipe)
    bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(
      userId,
      bookmarkId,
    );
  }
}
