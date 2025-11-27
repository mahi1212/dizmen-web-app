import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import type {
  BulkFileUploadResponse,
  FileUploadResponse,
  IFileUploadService
} from './file-upload.interface'

@Injectable()
export class FileService implements IFileUploadService {
  private readonly s3Client: S3Client
  private readonly bucketName: string
  private readonly bucketUrl: string

  constructor(private readonly configService: ConfigService) {
    const s3Config = this.configService.s3

    // Validate S3 configuration
    if (!s3Config.accessKey || !s3Config.secretKey) {
      throw new Error(
        'S3 credentials are not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.'
      )
    }

    if (!s3Config.bucketName) {
      throw new Error(
        'S3 bucket name is not configured. Please set AWS_S3_BUCKET_NAME environment variable.'
      )
    }

    if (!s3Config.region) {
      throw new Error(
        'S3 region is not configured. Please set AWS_REGION environment variable.'
      )
    }

    const s3ClientConfig: any = {
      region: s3Config.region,
    }

    // Only add credentials if both are provided
    if (s3Config.accessKey && s3Config.secretKey) {
      s3ClientConfig.credentials = {
        accessKeyId: s3Config.accessKey,
        secretAccessKey: s3Config.secretKey,
      }
    }

    this.s3Client = new S3Client(s3ClientConfig)

    this.bucketName = s3Config.bucketName
    this.bucketUrl = s3Config.bucketUrl || `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com`
  }

  async uploadFile(file: Express.Multer.File): Promise<FileUploadResponse> {
    if (!file) {
      throw new BadRequestException('No file provided')
    }

    const timestamp = Date.now()
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')
    const key = `uploads/${timestamp}-${sanitizedFileName}`

    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype
          // ACL: 'public-read'
        }
      })

      await upload.done()

      const url = `${this.bucketUrl}/${key}`

      return {
        url,
        key,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to upload file to S3: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async uploadBulkFiles(
    files: Express.Multer.File[]
  ): Promise<BulkFileUploadResponse> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided')
    }

    const uploadedFiles: FileUploadResponse[] = []
    const errors: string[] = []

    // Upload files in parallel using Promise.allSettled
    const uploadPromises = files.map(async (file, index) => {
      const timestamp = Date.now()
      const sanitizedFileName = file.originalname.replace(
        /[^a-zA-Z0-9.-]/g,
        '_'
      )
      const key = `uploads/${timestamp}-${index}-${sanitizedFileName}`

      try {
        const upload = new Upload({
          client: this.s3Client,
          params: {
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
            // ACL: 'public-read'
          }
        })

        await upload.done()

        const url = `${this.bucketUrl}/${key}`

        return {
          success: true,
          data: {
            url,
            key,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype
          }
        }
      } catch (error) {
        return {
          success: false,
          error: `Failed to upload ${file.originalname}: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      }
    })

    const results = await Promise.allSettled(uploadPromises)

    // Process results
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.success && result.value.data) {
        uploadedFiles.push(result.value.data)
      } else if (result.status === 'fulfilled' && !result.value.success && result.value.error) {
        errors.push(result.value.error)
      } else if (result.status === 'rejected') {
        errors.push(result.reason?.message || 'Unknown error occurred')
      }
    })

    return {
      files: uploadedFiles,
      totalFiles: files.length,
      successfulUploads: uploadedFiles.length,
      failedUploads: errors.length,
      errors: errors.length > 0 ? errors : undefined
    }
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
