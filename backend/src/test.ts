import axios from 'axios';
import { File } from "buffer";
import FormData from "form-data";
import fs from 'fs';
const JWT = `${process.env.PINATA_JWT}`;

app.post('/asset/add', verifyToken, upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'receipt', maxCount: 10 }
]), async (req: CustomRequest, res: Response) => {
  try {
    const { body, user } = req
    const { address } = user

    //@ts-expect-error
    const files = (req as Request & { files?: { [fieldname: string]: Express.Multer.File[] } }).files;

    if (!files || !files['images'] || files['images'].length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const imageLink = files['images'][0].filename;
    const filePath = path.join(__dirname, '..', '..', 'uploads', imageLink);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await axios.post(
      "https://uploads.pinata.cloud/v3/files",
      form,
      {
        headers: {
          Authorization: `Bearer ${JWT}`, 
          'pinata_api_key': `${process.env.PINATA_API_KEY}`,
          'pinata_secret_api_key':`${process.env.PINATA_SECRET}`
        },
      }
    );

    console.log();
    const { data } = response.data
    console.log(data)
    
    return res.status(201).json({ message: 'Asset created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(422).json({ message: 'Error creating asset' });
  }
});