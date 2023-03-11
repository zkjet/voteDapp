import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('contract-address')
  getContractAddress(): { address: string } {
    return { address: this.appService.getContractAddress() };
  }
}
