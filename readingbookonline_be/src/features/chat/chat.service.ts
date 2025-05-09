import { CacheService } from '@core/cache/cache.service';
import { openAIConfig } from '@core/config/global';
import { LoggerService } from '@core/logger/logger.service';
import { BookCategoryRelation } from '@features/book/entities/book-category-relation.entity';
import { BookCategory } from '@features/book/entities/book-category.entity';
import { Book } from '@features/book/entities/book.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  private readonly openai: OpenAI;
  private readonly DEFAULT_SYSTEM_MESSAGE = 'Bạn là trợ lý AI';
  private readonly CACHE_TTL = 3600;
  private readonly MODEL_NAME = 'gpt-3.5-turbo';

  constructor(
    private readonly logger: LoggerService,
    private readonly cacheService: CacheService,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookCategory)
    private readonly bookCategoryRepository: Repository<BookCategory>,
    @InjectRepository(BookCategoryRelation)
    private readonly bookCategoryRelationRepository: Repository<BookCategoryRelation>,
  ) {
    this.openai = new OpenAI({
      apiKey: openAIConfig.openAIKey,
    });
  }

  private async getConversationHistory(
    sessionId: string,
  ): Promise<ChatCompletionMessageParam[]> {
    try {
      const cachedMessages = await this.cacheService.get(`chat:${sessionId}`);
      return cachedMessages
        ? JSON.parse(cachedMessages)
        : [{ role: 'system', content: this.DEFAULT_SYSTEM_MESSAGE }];
    } catch (error) {
      this.logger.err(error.message, 'ChatService.getConversationHistory');
      throw error;
    }
  }

  private async getAIResponse(
    messages: ChatCompletionMessageParam[],
  ): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.MODEL_NAME,
        messages,
        temperature: 0.7,
      });

      if (!response.choices?.[0]?.message?.content) {
        throw new Error('No response content from AI');
      }

      return response.choices[0].message.content;
    } catch (error) {
      this.logger.err(error.message, 'ChatService.getAIResponse');
      throw error;
    }
  }

  private async updateConversationHistory(
    sessionId: string,
    messages: ChatCompletionMessageParam[],
    aiResponse: string,
  ): Promise<void> {
    try {
      const updatedMessages = [
        ...messages,
        {
          role: 'assistant',
          content: aiResponse,
        } as ChatCompletionMessageParam,
      ];

      await this.cacheService.set(
        `chat:${sessionId}`,
        JSON.stringify(updatedMessages),
        this.CACHE_TTL,
      );
    } catch (error) {
      this.logger.err(error.message, 'ChatService.updateConversationHistory');
      throw error;
    }
  }

  async getBooksWithCategories(): Promise<string[]> {
    try {
      const books = await this.bookRepository.find({
        where: { accessStatus: { id: 1 } },
        relations: [
          'author',
          'bookCategoryRelations',
          'bookCategoryRelations.category',
        ],
      });

      return books.map((book) => {
        const categories = book.bookCategoryRelations
          .map((relation) => relation.category?.name)
          .filter((name) => !!name)
          .join(', ');
        const authorName = book.author?.name || 'Unknown Author';

        return `(Name: ${book.title}, Author: ${authorName}, Categories: ${categories}, BookId: ${book.id})`;
      });
    } catch (error) {
      this.logger.err(error.message, 'ChatService.getBooksWithCategories');
      throw error;
    }
  }

  async chatCompletion(
    sessionId: string,
    userMessage: string,
  ): Promise<string> {
    console.time('getBooksWithCategories');
    try {
      if (!sessionId || !userMessage?.trim()) {
        throw new BadRequestException(
          'Session ID and message content are required',
        );
      }

      let messages: ChatCompletionMessageParam[] =
        await this.getConversationHistory(sessionId);

      if (messages.length === 1 && messages[0].role === 'system') {
        const booksData = await this.getBooksWithCategories();
        messages.push({
          role: 'system',
          content: `
          Giả sử bạn là chuyên gia tư vấn sách với hơn 10 năm kinh nghiệm trong việc lựa chọn và đề xuất các cuốn sách phù hợp với nhu cầu đọc của người dùng. 
          Với khả năng hiểu sâu về các thể loại và sở thích của người đọc, bạn cam kết cung cấp những đề xuất chính xác và giá trị cho người dùng.
          Dưới đây là danh sách các sách hiện có trong hệ thống (available books): ${booksData.join('\n')}
          Lưu ý bắt buộc:
          - Chỉ trả lời dựa trên danh sách này. Không được bịa thêm sách khác.
          - Đảm bảo trình bày đúng định dạng: "Tên sách (Tên tác giả) ::: (ID)", mỗi sách trên một dòng.
          - Khi phản hồi người dùng, hãy viết một câu đầy đủ, có chủ ngữ và vị ngữ, thể hiện sự chuyên nghiệp.
          - Ví dụ:
            "Cuốn sách bạn đang tìm là (hoặc câu tương tự):
            Lord of the Rings (JRR Tolkien) ::: (456)".
            The Hobbit (JRR Tolkien) ::: (457)".
          Về ngôn ngữ:
          - Người dùng có thể hỏi bằng tiếng Việt hoặc tiếng Anh.
          - Trả lời bằng tiếng Việt nếu người dùng hỏi câu hiện tại bằng tiếng Việt.
          - Trả lời bằng tiếng Anh nếu người dùng hỏi câu hiện tại bằng tiếng Anh.
          - Không trộn lẫn cả hai ngôn ngữ.
          `,
        });
      }

      messages.push({ role: 'user', content: userMessage });

      const aiResponse = await this.getAIResponse(messages);

      await this.updateConversationHistory(sessionId, messages, aiResponse);

      return aiResponse;
    } catch (error) {
      this.logger.err('Chat completion failed', error.stack);
      throw error;
    } finally {
      console.timeEnd('getBooksWithCategories');
    }
  }
}
