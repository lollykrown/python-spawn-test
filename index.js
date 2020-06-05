//if (path.extname(file) === '.js') {
  // console.log(path.basename(file))
  // console.log(`it's a js file, ${file}`)

  const { spawn } = require('child_process')
  const path = require('path')
  let str
  let pyth = {}
  let dat = []

  let js;

  if (path.extname(file) === '.py') {
   js = spawn('python', [path.join(__dirname, 'scripts','script1.py')]);
  } else if (path.extname(file) === '.js') {
   js = spawn('python', [path.join(__dirname, 'scripts','script1.py')]);
  }

  js.stdout.on('data', function (data) {
     console.log('Pipe data from javascript file ...');
     let kayode = {}
     str = data.toString();
     pyth.msg = str
     dat.push(pyth)

  });
  js.stderr.on('data', (code) => {
     console.log(`child process have an error with code ${code}`);
     //console.log(dataToSend)
     // send data to browser
     //res.send(`<h3>${dataToSend}</h3>`)
  })
  js.on('exit', (code, signal) => {
   console.log(`child process have an error with code ${code}`);
   console.log(dat)
   //console.log(dataToSend)
   // send data to browser
   //res.send(`<h3>${dataToSend}</h3>`)
})
