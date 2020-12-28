const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');

exports.subirArchivo = async (req, res, next) => {

    const configuracionMulter = {
        limits : { fileSize : req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            destination: ( req, file, cb) => {
              cb(null,__dirname+'/../uploads')
            },
            filename: (req, file, cb) => {
              const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
              cb(null, `${shortid.generate()}${extension}`)
            }
            //limitar tipo de archivos si es necesario
            // fileFilter: (req, file, cb) => {
            //   if( file.mimetype === "application/pdf") {
            //       return cb(null,true);
            //   }
            // },
        })
    }
    
    const upload = multer(configuracionMulter).single('archivo');
    
    upload(req, res, async (error) => {
        console.log(req.file);

        if(!error) {
            res.json({archivos: req.file.filename });
        } else {
            console.log(error);
            return next();
        }

    });
   
};

exports.eliminarArchivo = async(req, res) => {
    console.log(req.archivo)

    try {
        fs.unlinkSync(__dirname + `/../uploads${req.archivo}`);
        console.log('archivo eliminado');
    } catch (error) {
        console.log(error)
    }
};

//Descarga un archivo

exports.descargar = async (req, res, next) => {

    // Obtener el Enlace
    const { archivo } = req.params
    const enlace = await Enlaces.findOne({ nombre: archivo })


    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga);

    //eliminar el archivo y la entrada de la base de datos
     //si las descargas son igulaes a 1 - Borrar la entra y borrar el archivo
     const { descargas, nombre } = enlace;
     
     if(descargas === 1){
        
       //elimiar el archivo
        req.archivo = nombre;

       //eliminar la entrada de la bd
       await Enlaces.findOneAndRemove(enlace.id);
       next();
     } else {
       //si las descargas son > a 1 -restar 1
       enlace.descargas--;
       await enlace.save();
       console.log('Aun hay descargas')
     }
}