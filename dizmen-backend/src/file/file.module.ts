import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ConfigModule } from '../config/config.module';

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [ConfigModule],
})
export class FileModule {}
