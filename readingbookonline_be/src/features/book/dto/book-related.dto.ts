import {
  BookTrendingResponseDto,
  GetTrendingBooksDto,
} from './book-trending.dto';

export class GetRelatedBooksDto extends GetTrendingBooksDto {}

export class BookRelatedResponseDto extends BookTrendingResponseDto {}
