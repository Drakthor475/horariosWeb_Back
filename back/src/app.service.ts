import { Injectable } from '@nestjs/common';
import { ScrapingService } from './scraping.service';


@Injectable()
export class AppService {
  getHello(): string {
    
    
    return 'Hello World!';

  }


}
