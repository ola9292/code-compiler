import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs"
import fsPromises from 'fs/promises';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirCodes = path.join(__dirname, "..", "codes");

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes, {recursive: true})
}

export async function compile(req, res){
    const { language, code } = req.body

    if(language == 'undefined' || code == 'undefined'){
        return res.status(400).json({message: "enter code and language"})
    }

    let filePath;
    try{
        filePath = await generateFile(language, code)
        
        let output;
        if(language == 'js'){
            output = await executeJs(filePath);
        }else if(language == 'php'){
            output = await executePhp(filePath);
        }else{
            output = await executePython(filePath);
        }
        
        return res.status(200).json({data: output})
    }catch(err){
        if (err.isCodeError) {
            const message = cleanError(err.stderr, filePath)
            console.log(message);
            return res.status(400).json({ error: message });
        }
        
        return res.status(500).json({ error: "Internal server error" });
    }finally{
        if (filePath) {
            await fsPromises.unlink(filePath).catch((err) => {
                console.error("Failed to delete temp file:", err);
            });
        }
    }
   
}

async function generateFile(format, code){
    const jobId = uuidv4()
    const filename = `${jobId}.${format}`
    const filePath = path.join(dirCodes, filename)
    await fs.writeFileSync(filePath, code)
    return filePath
}

function executeJs(filePath) {
    return new Promise((resolve, reject) => {
        exec(`node ${filePath}`, { timeout: 5000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
            if (error) {
                return reject({ isCodeError: true, stderr: stderr || error.message });
            }
            resolve(stdout + (stderr ? `\n${stderr}` : ""));
        });
    });
}

function executePhp(filePath) {
    return new Promise((resolve, reject) => {      
        exec(`php ${filePath}`, { timeout: 5000 }, (error, stdout, stderr) => {
             if (error) {
                return reject({ isCodeError: true, stderr: stderr || error.message });
            }
            resolve(stdout + (stderr ? `\n${stderr}` : ""));
        });
    });
}
function executePython(filePath) {
    return new Promise((resolve, reject) => {
        exec(`python3 ${filePath}`, { timeout: 5000 }, (error, stdout, stderr) => {
            if (error) {
                return reject({ isCodeError: true, stderr: stderr || error.message });
            }
            resolve(stdout + (stderr ? `\n${stderr}` : ""));
        });
    });
}
function cleanError(stderr, filePath) {
  return stderr
    .replaceAll(`file://${filePath}`, "main")
    .replaceAll(filePath, "main")
    .split("\n    at ")[0]   // drop Node's internal stack frames
    .trim();
}