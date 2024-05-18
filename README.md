# 401 - Class 17 - S3 & Lambda

## Project:  S3 upload triggers Lambda function

### Author: Melo

### Problem Domain

Use Lambda  to automatically run some processing on image files after they’re uploaded to an S3 Bucket.

### Objective  

- Create an S3 Bucket with “open” read permissions, so that anyone can see the images/files in their browser.
- A user should be able to upload an image at any size, and update a dictionary of all images that have been uploaded so far.
- When an image is uploaded to your S3 bucket, it should trigger a Lambda function which must:
  - Download a file called “images.json” from the S3 Bucket if it exists.
  - The images.json should be an array of objects, each representing an image. Create an empty array if this file is not present.
  - Create a metadata object describing the image.
    - Name, Size, Type, etc.
  - Append the data for this image to the array.
    - Note: If the image is a duplicate name, update the object in the array, don’t just add it.
  - Upload the images.json file back to the S3 bucket.

### Description of how to use Lambda

This AWS Lambda function is triggered by an image upload to an S3 bucket. When an image is uploaded, the function:

1. Retrieves the existing images.json file from the S3 bucket, if it exists.
2. Parses the JSON content to update or create an array of image metadata.
3. Adds or updates the metadata for the new image in the array.
4. Uploads the updated images.json file back to the S3 bucket.

**Requirements**  

- AWS account with S3 and Lambda services.
- An S3 bucket to store images and the images.json file.
- AWS SDK for JavaScript (v3).

### Description of any issues you encountered during deployment of this lambda

Issues encountered revolved around gaining familiarity of AWS clients and commands, and conceptualizing the interaction between S3 and Lambda.  

### Link to your images.json file ---> [images.json](https://401-lab17.s3.amazonaws.com/images.json)
