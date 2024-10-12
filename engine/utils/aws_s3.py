# File: engine/utils/aws_s3.py

import boto3
import os
import logging
from botocore.exceptions import NoCredentialsError, ClientError
from botocore.client import Config

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_BUCKET_NAME = os.getenv('AWS_BUCKET_NAME')
AWS_REGION = os.getenv('AWS_REGION', 'eu-north-1')

s3 = boto3.client(
    's3',
    region_name=AWS_REGION,
    config=Config(signature_version='s3v4'),
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

def upload_to_s3(directory, track_name, s3_subfolder='stems'):
    try:
        s3_urls = {}
        for root, dirs, files in os.walk(directory):
            for filename in files:
                local_path = os.path.join(root, filename)
                s3_key = f'{s3_subfolder}/{track_name}/{filename}'
                
                extension = filename.split('.').pop().lower()
                content_type = {
                    'mp3': 'audio/mpeg',
                    'wav': 'audio/wav',
                    'flac': 'audio/flac',
                    'ogg': 'audio/ogg',
                    'aac': 'audio/aac',
                    'mid': 'audio/midi',
                    'midi': 'audio/midi'
                }.get(extension, 'application/octet-stream')

                s3.upload_file(
                    local_path,
                    AWS_BUCKET_NAME,
                    s3_key,
                    ExtraArgs={'ContentType': content_type}
                )

                url = s3.generate_presigned_url(
                    ClientMethod='get_object',
                    Params={'Bucket': AWS_BUCKET_NAME, 'Key': s3_key},
                    ExpiresIn=3600
                )
                s3_urls[filename] = url
        return s3_urls

    except NoCredentialsError:
        logging.error("AWS credentials not available.")
        return {}
    except ClientError as e:
        logging.error(f"Failed to upload to S3: {e}")
        return {}
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
        return {}
