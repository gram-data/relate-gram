import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Header,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { GramService } from './gram.service';
import { CreateGramDto } from './dto/create-gram.dto';
import { UpdateGramDto } from './dto/update-gram.dto';
import { gramToSvg } from './gram-to-svg';
import { gramToCanvas, svgToCanvas } from './gram-to-canvas';
import { gramToHtml } from './gram-to-html';
import { Request } from 'express';

const fullUrlFromRequest = (req:Request) => `${req.protocol}://${req.headers["x-forwarded-host"] || req.hostname}${req.originalUrl}`;

const smile = (id: string = "smile") => {
  return `<svg xmlns="http://www.w3.org/2000/svg" id="${id}" width="51.102" height="51.102" viewBox="0 0 47.909 47.909"><g transform="translate(229.669 -548.408)" stroke="#000"><circle r="22.954" cy="572.362" cx="-205.714" style="marker:none" color="#000" overflow="visible" fill="#ff0" stroke-width="2"/><g stroke-linecap="round" stroke-linejoin="round"><g fill="none"><path d="M-218.327 575.69s11.498 21 26.102 0" stroke-width="1.9"/><path d="M-221.571 575.188s3.385 2.052 3.972-1.983m24.939-.424s-.454 3.933 3.459 2.785" stroke-width="1.349"/></g><ellipse cx="-210.357" cy="566.056" rx="1.314" ry="5.08" stroke-width="2"/><ellipse ry="5.08" rx="1.314" cy="566.056" cx="-201.233" stroke-width="2"/></g></g></svg>`;
};

@Controller('gram')
export class GramController {
  constructor(private readonly gramService: GramService) {}

  @Post()
  create(@Body() createGramDto: CreateGramDto) {
    return this.gramService.create(createGramDto);
  }

  @Get()
  findAll() {
    return this.gramService.findAll();
  }

  @Get('smile.svg')
  @Header('Content-Type', 'image/svg+xml')
  smileAsSVG(@Param('id') id: string) {
    return smile(id);
  }

  @Get('smile.png')
  @Header('Content-Type', 'image/png')
  async smileAsPNG(
    @Param('id') id: string,
    @Res({passthrough:false}) response
  ) {
    const renderedCanvas = await svgToCanvas(smile(id));
    return renderedCanvas.createPNGStream().pipe(response);
  }

  @Get(':id.html')
  embedHtml(
    @Req() req: Request,
    @Res({passthrough:true}) response,
    @Param('id') id: string,
    @Query('src') src: string,
    @Query('creator') creator: string,
  ) {
    response.set({ 'Content-Type': 'text/html' });
    return gramToHtml(src, fullUrlFromRequest(req), { id, creator });
  }

  @Get(':id.svg')
  renderSvg(
    @Res({passthrough:true}) response,
    @Param('id') id: string,
    @Query('src') src: string,
    @Query('creator') creator: string,
  ) {
      // response.set({ 'Content-Type': 'text/html' });
    response.set({ 'Content-Type': 'image/svg+xml' })
    return gramToSvg(src, { id, creator }).outerHTML;
  }


  @Get(':id.png')
  async renderPng(
    @Res({passthrough:false}) response,
    @Param('id') id: string,
    @Query('src') src: string,
  ) {
    response.set({ 'Content-Type': 'image/png' });
    const renderedCanvas = await gramToCanvas(src, {id});
    return renderedCanvas.createPNGStream().pipe(response);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gramService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGramDto: UpdateGramDto) {
    return this.gramService.update(+id, updateGramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gramService.remove(+id);
  }
}
