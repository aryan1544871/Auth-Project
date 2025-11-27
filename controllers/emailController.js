const transporter = require('../utils/sendMail');

exports.sendEmail = async (req, res) => {
    const { email,subject, body } = req.body;
    try{
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: body
        })
        return res.status(200).json({ success: true, message: 'Email sent successfully' });
    }
    catch(err){
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error', data: err.message });
    }
};