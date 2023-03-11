import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateRequestTokensDTO } from './dtos/createRequestTokensDTO';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("token/address")
  getTokenAddress(): {address: string} {
    return {address: this.appService.getTokenAddress()};
  }

  @Get("token/supply")
  async getTokenSupply(): Promise <number> {
    return await this.appService.getTokenSupply();
  }

  @Post("token/approve")
  async giveApproval(@Body() body: CreateRequestTokensDTO): Promise<{ approved: boolean }> {
    return {approved: await this.appService.giveApproval(body.address, body.amount, body.signature) };
  }

  @Get("token/allowance")
  async getTokenAllowance(
    @Query('from') from: string,
    @Query('to') to: string
    ): Promise <number> {
    return await this.appService.getTokenAllowance(from, to);
  }
}