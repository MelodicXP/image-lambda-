// Import necessary AWS SDK clients and commands
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client with the region
const s3 = new S3Client({ region: 'us-east-1' });

// Entry point of Lambda Function
export const handler = async (event) => {
  // Log S3 event input
  console.log('HERE IS MY INPUT: ', event.Records[0].s3);
  
  // Extract bucket/folder name and key/file from event
  const bucketName = event.Records[0].s3.bucket.name; // Name of S3 bucket/folder
  const objectKey = event.Records[0].s3.object.key; // Name of key/file of uploaded object
  
  // Log bucket and key details for confirmation
  console.log('This is the bucket/folder: ', bucketName, 'This is the key/file: ', objectKey);
  
  // Define the key/file name for images.json file
  const jsonKey = 'images.json';
  let imagesData = []; // Initialize empty array for image metadata
  
  try {
    // Parameters to get images.json file from S3
    const getObjectParams = {
      Bucket: bucketName,
      Key: jsonKey,
    };
    
    // Create command to get images.json file
    const command = new GetObjectCommand(getObjectParams);
    // Send command to S3
    const response = await s3.send(command);
    // Convert response body stream to a string
    const data = await streamToString(response.Body);
    // Parse JSON data
    imagesData = JSON.parse(data);
    console.log('images.json content: ', imagesData);
  } catch (err) {
    if (err.name === 'NoSuchKey') {
      console.log('images.json does not exist. Creating a new one.');
    } else {
      console.error(err);
      throw err;
    }
  }
  
  // Ensure imagesData is an array
  if (!Array.isArray(imagesData)) {
    imagesData = [];
  }
  
  // Create metadata for new image
  const newImageMetadata = {
    name: objectKey, // Name of image
    size: event.Records[0].s3.object.size, // Size of image
    type: objectKey.split('.').pop(), // File type (extension) of image
  };
  
  // Check if image already exists in the array
  const existingImageIndex = imagesData.findIndex(image => image.name === objectKey);
  
  // Found means 'is not equal to -1', Not found equals -1, 
  if (existingImageIndex !== -1) {
    // If image exists, update metadata
    imagesData[existingImageIndex] = newImageMetadata;
    console.log('Updated existing image metadata');
  } else {
    // If image does not exist, add metadata to array
    imagesData.push(newImageMetadata);
    console.log('Added new image metadata');
  }
  
  try {
    // Paramters to upload the updated images.json file to S3
    const putObjectParams = {
      Bucket: bucketName,
      Key: jsonKey,
      Body: JSON.stringify(imagesData),
      ContentType: 'application/json',
    };

    // Create command to put images.json file in S3
    const putCommand = new PutObjectCommand(putObjectParams);
    // Send command to S3
    await s3.send(putCommand);
    console.log('Successfully uploaded images.json');
  } catch (err) {
    console.error('Error uploading images.json: ', err);
    throw err;
  }

  // Return successful response
  const response = {
    statusCode: 200,
    body: JSON.stringify('Process completed successfully'),
  };
  return response;
};


// Helper function to convert stream to string
const streamToString = (stream) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.on('data', chunk => chunks.push(chunk));
  stream.on('error', reject);
  stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
});