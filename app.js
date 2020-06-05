const express = require('express')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const { spawn } = require('child_process')
const debug = require('debug')('app: py-node')
const cacheMiddleware = require('./cacheMiddleware')

const app = express()

const port = 4000

function runScript(file) {
   return spawn('python', [
      "-u",
      path.join(__dirname, 'scripts', file),
      "--foo", "some value for foo",
   ]);
}
const readdir = promisify(fs.readdir);


const directoryPath = path.join(__dirname + '/' + 'scripts');

app.get('/', (req, res) => {
   async function doStuff(dir) {
      const files = await readdir(dir)
      let dat = [];
      let str, py;
      for (let file of files) {
         try {
            if (path.extname(file) === '.py') {
               py = spawn(
                  'python',
                  ['-u', path.join(__dirname, 'scripts', file),
                     '--foo', 'some value']);
            } else if (path.extname(file) === '.js') {
               py = spawn('node', [path.join(__dirname, 'scripts', file)]);
            // } else if (path.extname(file) === '.php') {
            //    py = spawn('php', [path.join(__dirname, 'scripts', file)]);
            } else {
               console.log(`File type not yet supported ${path.extname(file)}`)
            }
            py.stdout.on('data', function (data) {
               //console.log('Pipe data from python file ...');
               str = data.toString('utf8');
               const res = str.split(' ');
               const language = `${res[14]}`
               let status;
               if (language == 'javascript'|| language == 'Javascript' || language == 'python'|| language == 'Python'
                || language == 'php' || language == 'PHP' || language == 'nodejs' || language == 'NodeJs') {
                  status = 'pass'
               } else {
                  status = 'fail'
               }
               dat.push({
                  file: path.basename(file),
                  output: str,
                  name: `${res[4]} ${res[5]}`,
                  id: `${res[9]}`,
                  email: `${res[12]}`,
                  language: `${res[14]}`,
                  status: status
               })
            });
            py.stderr.on('data', (code) => {
               console.log(`child process have an error with code ${code}`);
               //console.log(dataToSend)
            })
            py.on('exit', () => {
               //console.log('foobar exiting: ', dat)               
            })
         } catch (err) {
            console.log(`${err}`)
         }
      }
      py.stdout.on('end', () => {
         //console.log('foobar ending: ', dat)
         outside = dat
         res.json(dat)
         //return outside
      })
   }
   doStuff(directoryPath)
});
// .then(data => {
//    console.log('data', data)
// })

app.listen(port, () => console.log(`App listening on port ${port}!`))