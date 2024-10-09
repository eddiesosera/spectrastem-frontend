import boto3
import os
import logging
from botocore.exceptions import NoCredentialsError, ClientError
from botocore.client import Config

# Load AWS credentials and configuration from environment variables
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_BUCKET_NAME = os.getenv('AWS_BUCKET_NAME')  # Ensure this is globally defined and accessible
AWS_REGION = os.getenv('AWS_REGION', 'eu-north-1')  # Default to 'us-east-1' if not set

# Initialize the S3 client with the credentials and region
s3 = boto3.client(
    's3',
    region_name='eu-north-1',
    config=Config(signature_version='s3v4'),
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

# Function to upload files to S3 and return presigned URLs
def upload_to_s3(directory, track_name):
    try:
        s3_urls = {}
        for root, dirs, files in os.walk(directory):
            for filename in files:
                local_path = os.path.join(root, filename)
                s3_key = f'stems/{track_name}/{filename}'
                try:
                    # Determine the correct Content-Type
                    extension = filename.split('.').pop().lower()
                    if extension == 'mp3':
                        content_type = 'audio/mpeg'
                    elif extension == 'wav':
                        content_type = 'audio/wav'
                    elif extension == 'flac':
                        content_type = 'audio/flac'
                    elif extension == 'ogg':
                        content_type = 'audio/ogg'
                    elif extension == 'aac':
                        content_type = 'audio/aac'
                    else:
                        content_type = 'application/octet-stream'

                    s3.upload_file(
                        local_path,
                        AWS_BUCKET_NAME,
                        s3_key,
                        ExtraArgs={'ContentType': content_type}
                    )
                    logging.info(f"Uploaded {local_path} to s3://{AWS_BUCKET_NAME}/{s3_key}")

                    # Generate a pre-signed URL with an expiration time
                    url = s3.generate_presigned_url(
                        ClientMethod='get_object',
                        Params={
                            'Bucket': AWS_BUCKET_NAME,
                            'Key': s3_key
                        },
                        ExpiresIn=3600
                    )
                    s3_urls[filename] = url
                except Exception as e:
                    logging.error(f"Failed to upload {local_path} to S3: {e}")
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
