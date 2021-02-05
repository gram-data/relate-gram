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
} from '@nestjs/common';
import { GramService } from './gram.service';
import { CreateGramDto } from './dto/create-gram.dto';
import { UpdateGramDto } from './dto/update-gram.dto';
import { gramToSvg } from './gram-to-svg';
import { gramToCanvas } from './gram-to-png';

const smile = (id: string) => {
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
  smile(@Param('id') id: string) {
    return smile(id);
  }

  @Get(':id.svg')
  renderSvg(
    @Res() response,
    @Param('id') id: string,
    @Query('src') src: string,
    @Query('embed') embed: boolean,
    @Query('creator') creator: string,
  ) {
    if (embed) {
      response.set({ 'Content-Type': 'text/html' });
    } else {
      response.set({ 'Content-Type': 'image/svg+xml' });
    }
    return gramToSvg(src, { id, embed, creator });
  }


  @Get(':id.png')
  async renderPng(
    @Res() response,
    @Param('id') id: string,
    @Query('src') src: string,
    @Query('embed') embed: boolean,
    @Query('creator') creator: string,
  ) {
    response.set({ 'Content-Type': 'image/png' });
    const renderedCanvas = await gramToCanvas();
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
