import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarkController } from './bookmarks.controller';

@Module({
  providers: [BookmarksService],
  controllers: [BookmarkController],
})
export class BookmarksModule {}
