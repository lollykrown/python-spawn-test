const express = require('express')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const { spawn } = require('child_process')
const debug = require('debug')('app: py-node')
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
      let outside = [];
      let pathName = directoryPath

      let str
      let pyth = {}
      let py;
      for (let file of files) {
         try {
            //console.log(path.extname(file))
            if (path.extname(file) === '.py') {
               //console.log(path.basename(file))
               //console.log(`it's a py file, ${file}`)
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
               const res = str.split(" ");
               console.log(res[4], res[5])
               dat.push({
                  file: path.basename(file, '.py'),
                  output: str,
                  name: `${res[4]} ${res[5]}`,
                  id: `${res[9]}`,
                  language: `${res[11]}`,
                  status: 'undetermined'
               })
            });
            py.stderr.on('data', (code) => {
               console.log(`child process have an error with code ${code}`);
               //console.log(dataToSend)
               // send data to browser
               //res.send(`<h3>${dataToSend}</h3>`)
            })
            py.on('exit', () => {
               //console.log('foobar exiting: ', dat)               
            })
            // } else if (path.extname(file) === '.js') {
            //    //console.log(path.basename(file))
            //    //console.log(`it's a js file, ${file}`)
            //    const js = spawn('node', [path.join(__dirname, 'scripts', file)]);
            //    js.stdout.on('data', function (data) {
            //       //console.log('Pipe data from javascript file ...');
            //       str = data.toString('utf8');
            //       dat.push({
            //          msg: str,
            //          fileName: path.basename(file, '.js')
            //       })
            //    });
            //    js.stderr.on('data', (code) => {
            //       console.log(`child process have an error with code ${code}`);
            //       //console.log(dataToSend)
            //       // send data to browser
            //       //res.send(`<h3>${dataToSend}</h3>`)
            //    })
            // }
         } catch (err) {
            console.log(`${err}`)
         }
      }
      //res.send(`<h3>${dat}</h3>`)
      //})
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

// files.forEach(file => {
//    if (path.extname(file) === '.py') {
//       const subprocess = runScript(file)
//       // print output of script
//       subprocess.stdout.on('data', (data) => {
//          //console.log(`data:${data}`);
//          str = data.toString()
//          pyth.msg = str
//          dat.push(pyth)
//       });
//       subprocess.stderr.on('data', (data) => {
//          console.log(`error:${data}`);
//       });
//       subprocess.stderr.on('close', (data) => {
//          console.log("Closed", data);
//       });


//    } else if (path.extname(file) === '.js') {
//       console.log(path.basename(file))
//       console.log(`it's a js file, ${file}`)
//       const js = spawn('node', [path.join(__dirname, 'scripts', file)]);
//       js.stdout.on('data', function (data) {
//          console.log('Pipe data from javascript file ...');
//          str = data.toString();
//          pyth.msg = str
//          dat.push(pyth)
//       });
//       js.stderr.on('data', (code) => {
//          console.log(`child process have an error with code ${code}`);
//          //console.log(dataToSend)
//          // send data to browser
//          //res.send(`<h3>${dataToSend}</h3>`)
//       })

//     } else {
//       console.log(path.extname(file))
//     }         
// });

//       // (async function () {
      //       //    try {
      //       //       console.log(path.basename(file))
      //       //       console.log(`it's a .py file, ${file}`)
      //       //       const py = await spawn('python', [path.join(__dirname, 'scripts', file)]);
      //       //       py.stdout.on('data', function (data) {
      //       //          console.log('Pipe data from python file ...');

      //       //          str = data.toString();
      //       //          console.log(str)
      //       //          console.log('op', path.basename(file, '.py'))
      //       //          //{`${path.basename(file)}: hoe`}
      //       //          pyth.message = str
      //       //          console.log(pyth)
      //       //          dat.push(pyth)
      //       //          console.log(dat)
      //       //          res.json(dat)

      //       //       });
      //       //       py.stderr.on('data', (code) => {
      //       //          console.log(`child process have an error with code ${code}`);
      //       //          //console.log(dataToSend)
      //       //          // send data to browser
      //       //       })
      //       //    } catch (error) {
      //       //       console.log(error)
      //       //    }
      //       // })();
      //    } 



// app.get('/', (req, res) => {

//    const directoryPath = path.join(__dirname, 'scripts');

//    fs.readdir(directoryPath, (err, files) => {
//       if (err) {
//          return console.log('Unable to scan directory: ' + err);
//       }
//       let dat = []
//       let str
//       let pyth = {}

//       files.forEach(file => {
//          if (path.extname(file) === '.js') {
//             console.log(path.basename(file))
//             console.log(`it\'s a js file, ${file}`)
//             const js = spawn('node', [path.join(__dirname, 'scripts', file)]);
//             js.stdout.on('data', function (data) {
//                console.log('Pipe data from javascript file ...');
//                let kayode = {}
//                const str = data.toString();
//                kayode.message = str
//                dat.push(kayode)
//             });
//             js.stderr.on('data', (code) => {
//                console.log(`child process have an error with code ${code}`);
//                //console.log(dataToSend)
//                // send data to browser
//                //res.send(`<h3>${dataToSend}</h3>`)
//             })

//           } else if (path.extname(file) === '.py') {

//             (async function () {
//                try {
//                   console.log(path.basename(file))
//                   console.log(`it's a .py file, ${file}`)
//                   const py = await spawn('python', [path.join(__dirname, 'scripts', file)]);
//                   py.stdout.on('data', function (data) {
//                      console.log('Pipe data from python file ...');

//                      str = data.toString();
//                      console.log(str)
//                      console.log('op', path.basename(file, '.py'))
//                      //{`${path.basename(file)}: hoe`}
//                      pyth.message = str
//                      console.log(pyth)
//                      dat.push(pyth)
//                      console.log(dat)
//                      res.json(dat)

//                   });
//                   py.stderr.on('data', (code) => {
//                      console.log(`child process have an error with code ${code}`);
//                      //console.log(dataToSend)
//                      // send data to browser
//                   })
//                } catch (error) {
//                   console.log(error)
//                }
//             })();
//          } else {
//             console.log(path.extname(file))
//          }
//       });
//       console.log(dat)
//       //res.send(`<h3>${dat}</h3>`)


//    })

//    // let dataToSend;

//    // const python = spawn('python', ['scripts/script1.py']);
//    // // collect data from script
//    // python.stdout.on('data', function (data) {
//    //    console.log('Pipe data from python script ...');
//    //    dataToSend = data.toString();
//    //    console.log(dataToSend)
//    // });
//    // // in close event we are sure that stream from child process is closed
//    // python.on('close', (code) => {
//    //    console.log(`child process close all stdio with code ${code}`);
//    //    console.log(dataToSend)
//    //    // send data to browser
//    //    res.send(`<h3>${dataToSend}</h3>`)
//    // })
//    // python.on('exit', (code, signal) => {
//    //    console.log(`child process exits all stdio with code ${code} and ${signal}`);
//    //    console.log(dataToSend)
//    //    // send data to browser
//    //    //res.send(`<h3>${dataToSend}</h3>`)
//    // })
//    // python.on('error', (code) => {
//    //    console.log(`child process have an error with code ${code}`);
//    //    console.log(dataToSend)
//    //    // send data to browser
//    //    //res.send(`<h3>${dataToSend}</h3>`)
//    // })
// });

app.listen(port, () => console.log(`App listening on port ${port}!`))