import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateRequestTokensDTO } from './dtos/createRequestTokensDTO';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("token/address")
  getTokentAddress(): {address: string} {
    return {address: this.appService.getTokenAddress()};
  }

  @Get("token/supply")
  async getTotalSupply(): Promise <number> {
    return await this.appService.getTotalSupply();
  }

  @Post("token/approve")
  async giveApproval(@Body() body: CreateRequestTokensDTO): Promise <boolean> {
    return await this.appService.giveApproval(body.address, body.amount, body.signature);
  }

  @Get("token/allowance")
  async getAllowance(
    @Query('from') from: string,
    @Query('to') to: string
    ): Promise <number> {
    return await this.appService.getAllowance(from, to);
  }
}