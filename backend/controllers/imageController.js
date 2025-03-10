const imageService = require('../services/imageService');

const supabaseUrl = process.env.SUPABASE_URL;

const imageController = {
  async uploadFile(req, res) {
    try {
      const { folderName, fileBase64, isImage } = req.body;
      
      if (!folderName || !fileBase64) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required fields: folderName and fileBase64" 
        });
      }
      
      const result = await imageService.uploadFile(folderName, fileBase64, isImage);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: error.message || "Could not upload file" 
      });
    }
  },
  
  getFileUrl(req, res) {
    try {
      const { filePath } = req.params;
      
      if (!filePath) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required field: filePath" 
        });
      }
      
      const url = `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`;
      console.log("URL", url);
      
      return res.status(200).json({ 
        success: true, 
        data: { url } 
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: error.message || "Could not get file URL" 
      });
    }
  }
};

module.exports = imageController;