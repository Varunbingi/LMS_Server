import Contact from "../Model/contactModel.js";

const messages = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        
        const contact = await Contact.create({
            name,
            email,
            message
        });
        
        await contact.save();

        
        res.status(200).json({
            success: true,
            message: 'Contact Page details saved successfully',
        });
    } catch (error) {
    
        console.error('Error in processing contact form:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing the contact form',
        });
    }
};

export default messages;
