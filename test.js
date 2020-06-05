const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const logOutput = (name) => (data) => console.log(`[${name}] ${data}`)

const readdir = promisify(fs.readdir);

function run(file) {
  return new Promise((resolve, reject) => {
    let process;
    if (path.extname(file) === '.py') {
      process = spawn('python', [path.join(__dirname, 'scripts',file), 'my', 'args']);
      } else if (path.extname(file) === '.js') {
         process = spawn('node', [path.join(__dirname, 'scripts',file)]);
      }
    //const process = spawn('python', [path.join(__dirname, 'scripts',file), 'my', 'args']);
    const out = []
    process.stdout.on(
      'data',
      (data) => {
        out.push(data.toString());
        logOutput('stdout')(data);
      }
    );
    const err = []
    process.stderr.on(
      'data',
      (data) => {
        err.push(data.toString());
        logOutput('stderr')(data);
      }
    );
    process.on('exit', (code, signal) => {
      logOutput('exit')(`${code} (${signal})`)
      resolve(out);
    });
  });
}
(async () => {
  const directoryPath = path.join(__dirname+ '/'+'scripts');

  try {
    const files = await readdir(directoryPath)
    for (let file of files) {
    const output = await run(file)
    logOutput('main')(output)
    process.exit(0)
    }
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
})();

