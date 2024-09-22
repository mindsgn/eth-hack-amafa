import crypto from "crypto";
import { ethers } from "ethers";
import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './db';
import assetSchema from "./models/assets";
import AuthSchema from "./models/auth"
import UserSchema from './models/user';
import { TagSchema } from "./models/tags";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Resend } from 'resend';
import { Request, Response, NextFunction } from 'express';
import { CategorySchema } from "./models/categories";
import { PinataSDK } from "pinata";
import abi from "./abi";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: "example-gateway.mypinata.cloud",
});

const nftContractAddress = '0x63055399656fFAbD76c2B85D343020f0c4eE4DBE';

const resend = new Resend(`${process.env.RESEND_API}`);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const provider = new ethers.JsonRpcProvider("https://rpc.gnosischain.com");
const signer = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);
const nftContract = new ethers.Contract(nftContractAddress, abi, signer);

interface CustomRequest extends Request {
  user?: JwtPayload;
}

dotenv.config();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', '..', 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

const uploadsPath = path.join(__dirname, '..', '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

app.get('/', verifyToken, (req, res) => {
  try{
    return res.status(200).send();
  }catch(error){
    return res.status(422).send();
  }
});


/*
* Auth
*/
app.post("/auth/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: "Invalid email provided" });
    }

    const code = crypto.randomBytes(3).toString('hex').toLowerCase();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    const wallet = ethers.Wallet.createRandom();
    const { mnemonic, privateKey } = wallet;

    const user = await UserSchema.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $setOnInsert: { 
          email: email.toLowerCase(), 
          mnemonic: mnemonic?.phrase,
          privateKey,
          address: wallet.address
        }
      },
      { upsert: true, new: true }
    );

    await AuthSchema.findOneAndUpdate(
      { uuid: user._id, email: email.toLowerCase() },
      { code, expires },
      { upsert: true, new: true }
    );
    
    const { error } = await resend.emails.send({
      from: 'Amafa <no-reply@amafa.xyz>',
      to: [email],
      subject: 'Amafa: Auth',
      html: `<h1>Verification: ${code}</h1>`,
    });
      
    if (error) {
      console.error('Email sending error:', error);
      return res.status(500).json({ message: "Error sending verification email" });
    }

    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/auth/verify', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code || typeof email !== 'string' || typeof code !== 'string') {
      return res.status(400).json({ message: 'Invalid email or code provided' });
    }
    
    const auth = await AuthSchema.findOne({ email: email.toLowerCase() });

    if (!auth || auth.code !== code.toLowerCase() || auth.expires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    const user = await UserSchema.findOne({ email: email.toLowerCase() });

    const token = jwt.sign({ email: email.toLowerCase(), uuid: user?._id, address: user?.address, privateKeys: user?.privateKey }, JWT_SECRET, { expiresIn: '365d' });
    
    await AuthSchema.deleteOne({ email });
    res.status(200).json({token});
  } catch (error) {
    console.error(error);
    res.status(500).json({token: null});
  }
});

app.delete('/auth/logout', async (req, res) =>{
  try{
    res.status(200).send();
  }catch(error){
    res.status(500).json({token: null});
  }
})


/*
 * Assets 
 */
app.get('/assets', verifyToken,  async (req: CustomRequest, res: Response) => {
  const { user } = req
  const { address } = user

  // Pagination parameters
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const aggregationResult = await assetSchema.aggregate([
      { $match: {  owner: address, } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalValue: { $sum: '$value' }
        }
      }
    ]);

    // Get total count of assets for this user
    const totalAssets = await assetSchema.countDocuments({ owner: address });
    const totalValue = aggregationResult[0]?.totalValue || 0;

    // Fetch paginated assets
    const assets = await assetSchema.find({  owner: address })
      .populate('locations')
      .skip(skip)
      .limit(limit)
      .lean();

    // Calculate total pages
    const totalPages = Math.ceil(totalAssets / limit);

    return res.status(200).json({
      assets,
      totalAssets,
      totalValue,
      pagination: {
        currentPage: page,
        totalPages,
        assetsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return res.status(500).json({ message: 'Error fetching assets' });
  }
});

app.get('/assets/:id', verifyToken,  (req, res) => {
  try{
    return res.status(200).send();
  }catch(error){
    return res.status(422).send();
  }
});

app.post('/asset/add', verifyToken, upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'receipt', maxCount: 10 }
]), async (req: CustomRequest, res: Response) => {
  try {
    const { body, user } = req
    const { address } = user
    const { data } = body
    const parsedData =  JSON.parse(data);
    
    const { 
      name, 
      value, 
      currency = "ZAR", 
      category = { 
        name: "Other", 
        color: "", 
        description: null 
      } } = parsedData
    
    //@ts-expect-error
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!name ) {
      console.error("");
      return res.status(422).json({ message: 'The fields title and locations are required' });
    }

    const imageLinks = files['images']?.map(file => `${file.filename}`) || [];
    
    const newAsset = new assetSchema({
      name,
      owner: address,
      currency,
      custodian: address,
      images: imageLinks,
      category:{
        ...category,
        owner: address
      },
      value,
    });

    
    await newAsset.save();
    
    return res.status(201).json({ message: 'Asset created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(422).json({ message: 'Error creating asset' });
  }
});

app.delete('/asset/delete/:id', verifyToken, async(req, res) => {
  try {
    const { id } = req.params;
    const deletedAsset = await assetSchema.findByIdAndDelete(id);

    if (!deletedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    return res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Error deleting asset' });
  }
});

app.put('/asset/update/:id', verifyToken, (req, res) => {
  try{
    return res.json({});
  }catch(error){
    return res.json({});
  }
});


/*
app.get('/tags', verifyToken,  async (req: CustomRequest, res: Response) => {
  const { user = { uuid:  "DEBUG" } } = req
  const { uuid } = user

  // Pagination parameters
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalTags = await TagSchema.countDocuments({ owner: uuid });

    const tags = await TagSchema.find({ owner: uuid })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(totalTags / limit);

    return res.status(200).json({
      tags,
      totalTags,
      pagination: {
        currentPage: page,
        totalPages,
        assetsPerPage: limit
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching assets' });
  }
});

app.get('/tags/:id', verifyToken,  (req, res) => {
  try{
    return res.status(200).send();
  }catch(error){
    return res.status(422).send();
  }
});

app.post('/tags/add', verifyToken, async (req: CustomRequest, res: Response) => {
  try {
    const { body, user = { uuid: "DEBUG"} } = req
    const { name, description, color } = body
    const { uuid } = user

    if(!name || !color){
      return res.status(422).send()
    }

    const tagExist = await TagSchema.find({ owner: uuid, name  })

    if(tagExist.length != 0){
      return res.status(422).send()
    }

    const newAsset = new TagSchema({
      name,
      description,
      color,
      owner: uuid
    });

    await newAsset.save();

    return res.status(201).send()
  } catch (error) {
    return res.status(422).send()
  }
});

app.delete('/tags/delete/:id', verifyToken, async(req, res) => {
  try {
    const { id } = req.params;
    const deletedAsset = await TagSchema.findByIdAndDelete(id);

    if (!deletedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    return res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Error deleting asset' });
  }
});

app.put('/tags/update/:id', verifyToken, (req, res) => {
  try{
    return res.json({});
  }catch(error){
    return res.json({});
  }
});


app.get('/category', verifyToken,  async (req: CustomRequest, res: Response) => {
  const { user = { uuid:  "DEBUG" } } = req
  const { uuid } = user

  // Pagination parameters
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalAssets = await CategorySchema.countDocuments({ owner: uuid });
    
    // Fetch paginated assets
    const category = await CategorySchema.find({ owner: uuid })
      .skip(skip)
      .limit(limit)
      .lean();

    // Calculate total pages
    const totalPages = Math.ceil(totalAssets / limit);

    return res.status(200).json({
      category,
      totalAssets,
      pagination: {
        currentPage: page,
        totalPages,
        assetsPerPage: limit
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching assets' });
  }
});

app.get('/category/:id', verifyToken,  (req, res) => {
  try{
    return res.status(200).send();
  }catch(error){
    return res.status(422).send();
  }
});

app.post('/category/add', verifyToken, async (req: CustomRequest, res: Response) => {
  try {
    const {body, user = { uuid: "DEBUG"} } = req
    const { name, description, color } = body
    const { uuid } = user

    if(!name || !color){
      return res.status(422).send()
    }

    const categoryExist = await CategorySchema.find({ owner: uuid, name  })

    if(categoryExist.length != 0){
      return res.status(422).send()
    }

    const newAsset = new CategorySchema({
      name,
      description,
      color,
      owner: uuid
    });

    await newAsset.save();

    return res.status(201).send()
  } catch (error) {
    console.error(error);
    return res.status(422).json({ message: 'Error creating asset' });
  }
});

app.delete('/category/delete/:id', verifyToken, async(req, res) => {
  try {
    console.log(req.params)
    const { id } = req.params;
    const deletedAsset = await CategorySchema.findByIdAndDelete(id);

    if (!deletedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    return res.status(200).json({ message: 'Asset deleted successfully', asset: deletedAsset });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Error deleting asset' });
  }
});

app.put('/category/update/:id', verifyToken, (req, res) => {
  try{
    return res.json({});
  }catch(error){
    return res.json({});
  }
});

app.get('/user/:id', verifyToken, async (req, res) => {
  try {
    return res.status(200).json({  });
  } catch (error) {
    return res.status(422).json({  });
  }
});
*/


app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
 