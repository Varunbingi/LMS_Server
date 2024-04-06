import express from 'express'

import messages from "../Controllers/contactController.js";

const contactRouter=express.Router();

contactRouter.post('/',messages);


export default contactRouter;